import {
  window,
  workspace,
  DiagnosticSeverity,
  TextDocument,
  Uri,
  EventEmitter
} from "vscode";
import { ExecutorParser, ICheckResult, ExecutorHelper } from "./execHelper";
import { ExtensionState } from "./extension";
import { VlinkBuildProperties, VLINKLinker } from "./vlink";
import { AsmONE } from "./asmONE";
import * as path from "path";
import * as winston from 'winston';
import { FileProxy } from "./fsProxy";
import { ConfigurationHelper } from "./configurationHelper";

/**
 * Definition of the vasm build properties
 */
export interface VasmBuildProperties {
  enabled: boolean;
  command: string;
  args: Array<string>;
}

/**
 * Class to manage the VASM compiler
 */
export class VASMCompiler {
  static readonly CONFIGURE_VASM_ERROR = new Error(
    "Please configure VASM compiler in the Workspace"
  );
  static readonly DEFAULT_BUILD_CONFIGURATION = <VasmBuildProperties>{
    enabled: true,
    command: "${config:amiga-assembly.binDir}/vasmm68k_mot",
    args: [
      "-m68000",
      "-Fhunk",
      "-linedebug"
    ]
  };
  executor: ExecutorHelper;
  parser: VASMParser;
  linker: VLINKLinker;
  asmONE: AsmONE;

  constructor() {
    this.executor = new ExecutorHelper();
    this.parser = new VASMParser();
    this.linker = new VLINKLinker();
    this.asmONE = new AsmONE();
  }

  /**
   * Builds the file in the current editor
   * @param conf Configuration
   * @param logEmitter Emitter listening to the logs
   */
  public async buildCurrentEditorFile(vasmConf?: VasmBuildProperties, logEmitter?: EventEmitter<string>): Promise<void> {
    const editor = window.activeTextEditor;
    if (editor) {
      const conf = this.getConfiguration("vasm", vasmConf);
      if (this.mayCompile(conf)) {
        await this.buildDocument({ ...conf }, editor.document, true, logEmitter);
      } else {
        throw new Error("VASM compilation is disabled in the configuration");
      }
    } else {
      throw new Error("There is no active editor");
    }
  }

  /**
   * Build the selected document
   * @param conf Configuration
   * @param document The document to build
   * @param temporaryBuild If true the build will be done in the tmp dir
   * @param logEmitter Emitter listening to the logs
   */
  public async buildDocument(conf: VasmBuildProperties, document: TextDocument, temporaryBuild: boolean, logEmitter?: EventEmitter<string>): Promise<ICheckResult[]> {
    const [, errors] = await this.buildFile(conf, document.uri, temporaryBuild, logEmitter);
    this.processGlobalErrors(document, errors);
    this.executor.handleDiagnosticErrors(document, errors, DiagnosticSeverity.Error);
    if (errors) {
      return errors;
    } else {
      return new Array<ICheckResult>();
    }
  }

  /**
   * Find lines for the global errors
   * @param document Test document
   * @param errors Errors
   */
  public processGlobalErrors(document: TextDocument, errors: ICheckResult[]): void {
    for (let i = 0; i < errors.length; i += 1) {
      const error = errors[i];
      if (error.line <= 0) {
        // match include errors
        const match = /.*[<](.+)[>]/.exec(error.msg);
        if (match) {
          const regexp = new RegExp(
            '^[\\s]+include[\\s]+"' +
            match[1].replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&"),
            "i"
          );
          for (let k = 0; k < document.lineCount; k += 1) {
            const line = document.lineAt(k).text;
            if (line.match(regexp)) {
              error.line = k + 1;
              break;
            }
          }
        }
      }
      if (error.file.length <= 0) {
        error.file = document.fileName;
      }
    }
  }

  private getConfiguration(key: string, properties?: any): any {
    if (properties) {
      return properties;
    } else if (key === "vasm") {
      return { ...VASMCompiler.DEFAULT_BUILD_CONFIGURATION };
    } else if (key === "vlink") {
      return { ...VLINKLinker.DEFAULT_BUILD_CONFIGURATION };
    }
    return properties;
  }

  public async buildWorkspace(logEmitter?: EventEmitter<string>, vasmBuildProperties?: VasmBuildProperties, vlinkBuildProperties?: VlinkBuildProperties): Promise<void> {
    const state = ExtensionState.getCurrent();
    const warningDiagnosticCollection = state.getWarningDiagnosticCollection();
    const errorDiagnosticCollection = state.getErrorDiagnosticCollection();
    errorDiagnosticCollection.clear();
    warningDiagnosticCollection.clear();
    const conf: any = this.getConfiguration("vasm", vasmBuildProperties);
    if (this.mayCompile(conf)) {
      const confVLINK: any = this.getConfiguration("vlink", vlinkBuildProperties);
      if (confVLINK) {
        await this.buildWorkspaceInner(conf, confVLINK, logEmitter);
      } else {
        const message = "Please configure VLINK compiler files selection";
        if (logEmitter) {
          logEmitter.fire(message);
        }
        throw new Error(message);
      }
    } else if (!this.disabledInConf(conf)) {
      throw VASMCompiler.CONFIGURE_VASM_ERROR;
    }
  }

  /**
   * Clean the workspace
   */
  public async cleanWorkspace(): Promise<void> {
    const state = ExtensionState.getCurrent();
    const warningDiagnosticCollection = state.getWarningDiagnosticCollection();
    const errorDiagnosticCollection = state.getErrorDiagnosticCollection();
    winston.info("Cleaning workspace");
    errorDiagnosticCollection.clear();
    warningDiagnosticCollection.clear();
    const buildDir = this.getBuildDir();
    const filesProxies = await buildDir.findFiles("**/*.o", "");
    for (let i = 0; i < filesProxies.length; i++) {
      const fileUri = filesProxies[i];
      winston.info(
        `Deleting ${fileUri.getPath()}`
      );
      fileUri.delete();
    }
  }

  /**
   * Returns the build directory
   * Useful for tests
   */
  public getBuildDir(): FileProxy {
    return ExtensionState.getCurrent().getBuildDir();
  }

  /**
   * Returns the temp directory
   * Useful for tests
   */
  public getTmpDir(): FileProxy {
    return ExtensionState.getCurrent().getTmpDir();
  }

  /**
   * Returns the workspace root directory
   * Useful for tests
   */
  public getWorkspaceRootDir(): Uri | null {
    return ExtensionState.getCurrent().getWorkspaceRootDir();
  }

  /**
   * List all the files to build
   * @param workspaceRootDir Workspace root dir
   * @param vlinkConf Vlink configuration
   * @returns List of Uri to build
   */
  public async listFilesToBuild(workspaceRootDir: Uri | null, vlinkConf: VlinkBuildProperties): Promise<Uri[]> {
    if (workspaceRootDir) {
      const fp = new FileProxy(workspaceRootDir);
      const filesURI = new Array<Uri>();
      if (vlinkConf.includes) {
        const files = await fp.findFiles(vlinkConf.includes, vlinkConf.excludes);
        for (const f of files) {
          const fileUri = f.getUri();
          filesURI.push(fileUri);
        }
      } else if (vlinkConf.exefilename) {
        // Is there an Asm file opened
        const editor = window.activeTextEditor;
        if (editor) {
          filesURI.push(editor.document.uri);
        }
      }
      return filesURI;
    } else {
      let files = await workspace.findFiles(vlinkConf.includes, vlinkConf.excludes);
      if (!files) {
        files = new Array<Uri>();
      }
      return files;
    }
  }

  /**
   * Build the workspace
   * @param conf  Vasm configuration
   * @param vlinkConf Vlink configuration
   * @param logEmitter Log emitter
   */
  private async buildWorkspaceInner(conf: VasmBuildProperties, vlinkConf: VlinkBuildProperties, logEmitter?: EventEmitter<string>): Promise<void> {
    const workspaceRootDir = this.getWorkspaceRootDir();
    const buildDir = this.getBuildDir();
    const ASMOneEnabled = this.isASMOneEnabled();
    try {
      if (workspaceRootDir && buildDir) {
        const filesURI = await this.listFilesToBuild(workspaceRootDir, vlinkConf);
        const promises: Thenable<ICheckResult[]>[] = [];
        for (const f of filesURI) {
          promises.push(
            workspace.openTextDocument(f).then(document => {
              return this.buildDocument(conf, document, false, logEmitter);
            })
          );
        }
        if (logEmitter) {
          logEmitter.fire("Compiling_________________________________________\r\n");
        }
        const errorsArray = await Promise.all(promises);
        for (let i = 0; i < errorsArray.length; i += 1) {
          let errors: ICheckResult[] = errorsArray[i];
          if (ASMOneEnabled) {
            errors = this.asmONE.filterErrors(errors);
          }
          if (errors && errors.length > 0) {
            throw new Error("Build Error");
          }
        }
        // Call the linker
        if (vlinkConf.enabled) {
          if (logEmitter) {
            logEmitter.fire("Linking_________________________________________\r\n");
          }
          // check if the directory for the executable exists
          const exeFile = buildDir.getRelativeFile(vlinkConf.exefilename);
          const exeParentDir = exeFile.getParent();
          if (vlinkConf.createExeFileParentDir) {
            if (!await exeParentDir.exists()) {
              if (logEmitter) {
                logEmitter.fire(`Creating parent exe directory: ${exeParentDir.getPath()}`);
              }
              await exeParentDir.mkdir();
            }
          }
          // check if the startup-sequence must be created
          if (vlinkConf.createStartupSequence) {
            // create the s directory
            const sDir = exeParentDir.getRelativeFile("s");
            sDir.mkdir();
            const startupSequenceFile = sDir.getRelativeFile("startup-sequence");
            if (!startupSequenceFile.exists()) {
              if (logEmitter) {
                logEmitter.fire(`Creating startup-sequence file: ${startupSequenceFile.getPath()}`);
              }
              const writtenContents = `sys:${exeFile.getName()}`;
              const buf = Buffer.from(writtenContents);
              startupSequenceFile.writeFile(buf);
            }
          }
          const errors = await this.linker.linkFiles(vlinkConf, filesURI, vlinkConf.exefilename, vlinkConf.entrypoint, workspaceRootDir, buildDir.getUri(), logEmitter);
          if (errors && errors.length > 0) {
            throw new Error(`Linker error: ${errors[0].msg}`);
          } else if (ASMOneEnabled) {
            this.asmONE.Auto(filesURI, buildDir.getRelativeFile(vlinkConf.exefilename).getUri());
          }
        } else {
          // The linker is not mandatory
          // show a warning in the output
          const message = "Warning : the linker vlink is not configured";
          if (logEmitter) {
            logEmitter.fire(`\u001b[33m${message}\u001b[0m`);
          }
          winston.warn(message);
        }
      } else {
        throw new Error("Root workspace or build path not found");
      }
      if (logEmitter) {
        logEmitter.fire("\u001b[32mBuild Success\u001b[0m\r\n");
      }
    } catch (e) {
      if (logEmitter) {
        logEmitter.fire(`\u001b[31m${e.message}\u001b[0m\r\n`);
      }
      throw e;
    }
  }

  /**
   * Build the selected file
   * @param conf Vasm configurations
   * @param filepathname Path of the file to build
   * @param temporaryBuild If true the ile will go to the temp folder
   * @param logEmitter Emitter for logging
   */
  public async buildFile(conf: VasmBuildProperties, fileUri: Uri, temporaryBuild: boolean, logEmitter?: EventEmitter<string>): Promise<[string | null, ICheckResult[]]> {
    const workspaceRootDir = this.getWorkspaceRootDir();
    let buildDir: FileProxy;
    if (temporaryBuild) {
      buildDir = this.getTmpDir();
    } else {
      buildDir = this.getBuildDir();
    }
    if (workspaceRootDir && buildDir) {
      const filename = path.basename(fileUri.fsPath);
      if (this.mayCompile(conf)) {
        if (!await buildDir.exists()) {
          try {
            if (logEmitter) {
              logEmitter.fire(`Creating directory ${buildDir.getName()}\r\n`);
            }
            await buildDir.mkdir();
          } catch (err) {
            const message = `Error creating the build dir "${buildDir.getName()}": ${err.toString()}`;
            if (logEmitter) {
              logEmitter.fire(message);
            }
            throw new Error(message);
          }
        }
        const state = ExtensionState.getCurrent();
        const warningDiagnosticCollection = state.getWarningDiagnosticCollection();
        const errorDiagnosticCollection = state.getErrorDiagnosticCollection();
        const vasmExecutableName: string = ConfigurationHelper.replaceBinDirVariable(conf.command);
        const extSep = filename.indexOf(".");
        let objFilename: string;
        if (extSep > 0) {
          objFilename = path.join(
            buildDir.getPath(),
            filename.substr(0, filename.lastIndexOf(".")) + ".o"
          );
        } else {
          objFilename = path.join(buildDir.getPath(), filename + ".o");
        }
        let confArgs = new Array<string>();
        if (conf.args && (conf.args.length > 0)) {
          confArgs = conf.args;
        }
        const args: Array<string> = confArgs.concat(["-o", objFilename, fileUri.fsPath]);
        errorDiagnosticCollection.delete(fileUri);
        warningDiagnosticCollection.delete(fileUri);
        if (logEmitter) {
          logEmitter.fire(`building ${objFilename}\r\n`);
        }
        const results = await this.executor.runTool(args, workspaceRootDir.fsPath, "warning", true, vasmExecutableName, null, true, this.parser, undefined, logEmitter);
        return [objFilename, results];
      } else if (!this.disabledInConf(conf)) {
        throw VASMCompiler.CONFIGURE_VASM_ERROR;
      } else {
        return ["", new Array<ICheckResult>()];
      }
    } else {
      throw new Error("Root workspace path not found");
    }
  }

  /**
   * Function to check if it is possible to compile.
   * Useful for mocking
   * @param conf Configuration
   */
  mayCompile(conf: any): boolean {
    return conf && conf.enabled;
  }

  /**
   * Function to check if it is explicitly disabled
   * @param conf Configuration
   */
  disabledInConf(conf: any): boolean {
    return conf && !conf.enabled;
  }

  /**
   * Checks if ASMOne compatibility is enabled.
   */
  isASMOneEnabled(): boolean {
    const conf = ConfigurationHelper.getDefaultConfiguration(null);
    if (conf) {
      return conf.ASMOneCompatibilityEnabled === true;
    }
    return false;
  }
}

export class VASMParser implements ExecutorParser {
  parse(text: string): ICheckResult[] {
    const errors: ICheckResult[] = [];
    const lines = text.split(/\r\n|\r|\n/g);
    let error: ICheckResult | undefined = undefined;
    let lastHeaderLine = "";
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      if (line.length > 1) {
        if (!line.startsWith(">")) {
          let match = /(error|warning|message)\s([\d]+)\sin\sline\s([\d]+)\sof\s["](.+)["]:\s*(.*)/.exec(
            line
          );
          if (match) {
            if (error !== undefined) {
              errors.push(error);
            }
            error = new ICheckResult();
            lastHeaderLine = line;
            error.file = match[4];
            error.line = parseInt(match[3]);
            error.msg = match[1] + " " + match[2] + ": " + match[5];
            error.msgData = this.collectErrorData(lines, lineIndex + 1);
            error.severity = match[1];
          } else {
            match = /.*error\s([\d]+)\s*:\s*(.*)/.exec(line);
            if (match) {
              if (error !== undefined) {
                errors.push(error);
              }
              error = new ICheckResult();
              lastHeaderLine = line;
              error.severity = "error";
              error.msg = line;
            } else if (error !== undefined) {
              // Errors details parse
              match = /\s*called from line\s([\d]+)\sof\s["](.+)["]/.exec(
                line
              );
              if (match) {
                error.file = match[2];
                error.line = parseInt(match[1]);
                error.msg = lastHeaderLine;
              } else {
                match = /\s*included from line\s([\d]+)\sof\s["](.+)["]/.exec(
                  line
                );
                if (match) {
                  // It's an included file
                  error.parentFile = match[2];
                  error.parentFileLine = parseInt(match[1]);
                }
              }
            }
          }
        }
      }
    }
    // Pushes the last error
    if (error !== undefined) {
      errors.push(error);
    }
    return errors;
  }

  /**
   * Collects error data from lines below detected error
   * @param lines output error lines
   * @param idx index of line to start collecting data, should be after error
   */
  private collectErrorData(lines: string[], idx: number): string {
    let errData = "";
    if (idx >= lines.length) {
      return errData;
    }
    while (idx < lines.length && lines[idx].startsWith(">")) {
      errData += lines[idx++] + "\n";
    }
    return errData;
  }
}
