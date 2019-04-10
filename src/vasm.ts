import { window, workspace, Disposable, DiagnosticSeverity, TextDocument, Uri } from "vscode";
import { ExecutorParser, ICheckResult, ExecutorHelper } from "./execHelper";
import { ExtensionState } from './extension';
import { VLINKLinker } from './vlink';
import * as fs from "fs";
import * as path from "path";

/**
 * Class to manage the VASM compiler
 */
export class VASMCompiler {
    executor: ExecutorHelper;
    parser: VASMParser;
    linker: VLINKLinker;

    constructor() {
        this.executor = new ExecutorHelper();
        this.parser = new VASMParser();
        this.linker = new VLINKLinker();
    }

    /**
     * Builds the file in the current editor
     */
    public buildCurrentEditorFile(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const editor = window.activeTextEditor;
            if (editor) {
                let conf = workspace.getConfiguration('amiga-assembly.vasm');
                if (this.mayCompile(conf)) {
                    await this.buildDocument(editor.document).then(() => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    reject(new Error("VASM compilation is disabled in the configuration"));
                }
            } else {
                reject(new Error("There is no active editor"));
            }
        });
    }

    /**
     * Build the selected document
     * @param document The document to build
     */
    public buildDocument(document: TextDocument): Promise<ICheckResult[]> {
        return new Promise((resolve, reject) => {
            this.buildFile(document.uri, false).then(errors => {
                this.processGlobalErrors(document, errors);
                this.executor.handleDiagnosticErrors(document, errors, DiagnosticSeverity.Error);
                if (errors) {
                    resolve(errors);
                } else {
                    resolve([]);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Find lines for the global errors
     * @param document Test document
     * @param errors Errors
     */
    public processGlobalErrors(document: TextDocument, errors: ICheckResult[]) {
        for (let i = 0; i < errors.length; i += 1) {
            let error = errors[i];
            if (error.line <= 0) {
                // match include errors
                let match = /.*[<](.*)+[>]/.exec(error.msg);
                if (match) {
                    let regexp = new RegExp("^[\\s]+include[\\s]+\"" + match[1].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "i");
                    for (let i = 0; i < document.lineCount; i += 1) {
                        let line = document.lineAt(i).text;
                        if (line.match(regexp)) {
                            error.line = i + 1;
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

    public buildWorkspace(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let state = ExtensionState.getCurrent();
            let warningDiagnosticCollection = state.getWarningDiagnosticCollection();
            let errorDiagnosticCollection = state.getErrorDiagnosticCollection();
            errorDiagnosticCollection.clear();
            warningDiagnosticCollection.clear();
            let configuration = workspace.getConfiguration('amiga-assembly');
            let conf: any = configuration.get('vasm');
            if (this.mayCompile(conf)) {
                let confVLINK: any = configuration.get('vlink');
                if (confVLINK) {
                    let includes = confVLINK.includes;
                    let excludes = confVLINK.excludes;
                    let exefilename = confVLINK.exefilename;
                    await this.buildWorkspaceInner(includes, excludes, exefilename).then(() => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    reject(new Error("Please configure VLINK compiler files selection"));
                }
            } else {
                reject(new Error("Please configure VASM compiler in the workspace"));
            }
        });
    }

    /**
     * CLeans the workspace
     */
    public cleanWorkspace(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let state = ExtensionState.getCurrent();
            let warningDiagnosticCollection = state.getWarningDiagnosticCollection();
            let errorDiagnosticCollection = state.getErrorDiagnosticCollection();
            let statusManager = state.getStatusManager();
            statusManager.outputChannel.appendLine('Cleaning workspace');
            errorDiagnosticCollection.clear();
            warningDiagnosticCollection.clear();
            let configuration = workspace.getConfiguration('amiga-assembly');
            let conf: any = configuration.get('vasm');
            if (this.mayCompile(conf)) {
                const workspaceRootDir = this.getWorkspaceRootDir();
                if (workspaceRootDir) {
                    await workspace.findFiles('build/**/*.o').then(filesURI => {
                        for (let i = 0; i < filesURI.length; i++) {
                            const fileUri = filesURI[i];
                            statusManager.outputChannel.appendLine(`Deleting ${fileUri.fsPath}`);
                            this.unlink(fileUri);
                        }
                        resolve();
                    });
                } else {
                    reject(new Error("Root workspace not found"));
                }
            } else {
                reject(new Error("Please configure VASM compiler in the Workspace"));
            }
        });
    }

    private buildWorkspaceInner(includes: string, excludes: string, exefilename: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const workspaceRootDir = this.getWorkspaceRootDir();
            const buildDir = this.getBuildDir();
            const configuration = workspace.getConfiguration('amiga-assembly');
            const confVLINK: any = configuration.get('vlink');
            if (workspaceRootDir && buildDir) {
                await workspace.findFiles(includes, excludes).then(async filesURI => {
                    let promises: Thenable<ICheckResult[]>[] = [];
                    for (let i = 0; i < filesURI.length; i++) {
                        const fileUri = filesURI[i];
                        promises.push(workspace.openTextDocument(fileUri).then((document) => {
                            return this.buildDocument(document);
                        }));
                    }
                    await Promise.all(promises).then(async (errorsArray) => {
                        for (let i = 0; i < errorsArray.length; i += 1) {
                            let errors: ICheckResult[] = errorsArray[i];
                            if (errors && (errors.length > 0)) {
                                reject(new Error("Build aborted: there are compile errors"));
                            }
                        }
                        // Call the linker
                        if (this.linker.mayLink(confVLINK)) {
                            await this.linker.linkFiles(filesURI, exefilename, workspaceRootDir, buildDir).then(errors => {
                                if (errors && errors.length > 0) {
                                    reject(new Error(`Linker error: ${errors[0].msg}`));
                                } else {
                                    resolve();
                                }
                            }).catch(err => {
                                reject(err);
                            });
                        } else {
                            // The linker is not mandatory
                            // show a warning in the output
                            ExtensionState.getCurrent().getStatusManager().outputChannel.append("Warning : the linker vlink is not configured");
                            resolve();
                        }
                    }).catch(err => {
                        reject(err);
                    });
                });
            } else {
                reject(new Error("Root workspace or build path not found"));
            }
        });
    }

    /**
     * Build the selected file
     * @param filepathname Path of the file to build
     * @param debug If true debug symbols are added
     */
    public buildFile(fileUri: Uri, debug: boolean): Promise<ICheckResult[]> {
        return new Promise(async (resolve, reject) => {
            const workspaceRootDir = this.getWorkspaceRootDir();
            const buildDir = this.getBuildDir();
            if (workspaceRootDir && buildDir) {
                let filename = path.basename(fileUri.fsPath);
                let configuration = workspace.getConfiguration('amiga-assembly');
                let conf: any = configuration.get('vasm');
                if (this.mayCompile(conf)) {
                    await this.mkdirSync(buildDir.fsPath).catch(err => {
                        reject(new Error(`Error creating the  build dir "${buildDir}: ` + err.toString()));
                        return;
                    });
                    let state = ExtensionState.getCurrent();
                    let warningDiagnosticCollection = state.getWarningDiagnosticCollection();
                    let errorDiagnosticCollection = state.getErrorDiagnosticCollection();
                    let vasmExecutableName: string = conf.file;
                    let extSep = filename.indexOf(".");
                    let objFilename;
                    if (extSep > 0) {
                        objFilename = path.join(buildDir.fsPath, filename.substr(0, filename.lastIndexOf(".")) + ".o");
                    } else {
                        objFilename = path.join(buildDir.fsPath, filename + ".o");
                    }
                    let confArgs = conf.options;
                    if (debug) {
                        confArgs.push("-linedebug");
                    }
                    let args: Array<string> = confArgs.concat(['-o', objFilename, fileUri.fsPath]);
                    errorDiagnosticCollection.delete(fileUri);
                    warningDiagnosticCollection.delete(fileUri);
                    await this.executor.runTool(args, workspaceRootDir.fsPath, "warning", true, vasmExecutableName, null, true, this.parser).then(results => {
                        resolve(results);
                    }).catch(err => {
                        reject(err);
                        return;
                    });
                } else {
                    reject(new Error("Please configure VASM compiler in the workspace"));
                }
            } else {
                reject(new Error("Root workspace path not found"));
            }
        });

    }

    /**
     * Reads the build directory
     */
    getBuildDir(): Uri | null {
        let rootDir = this.getWorkspaceRootDir();
        if (rootDir) {
            return rootDir.with({ path: rootDir.path + '/build' });
        }
        return null;
    }

    /**
     * Deletes a file
     * @param fileUri Uri of the file to delete 
     */
    unlink(fileUri: Uri) {
        fs.unlinkSync(fileUri.fsPath);
    }

    /**
     * Reads the workspace forlder dir
     */
    getWorkspaceRootDir(): Uri | null {
        if (workspace.workspaceFolders && (workspace.workspaceFolders.length > 0)) {
            return workspace.workspaceFolders[0].uri;
        }
        return null;
    }

    /**
     * Creates a directory
     * @param dirPath path to create
     */
    mkdirSync(dirPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    window.showErrorMessage("Error creating build dir: " + dirPath);
                    reject(err);
                }
            }
            resolve();
        });
    }

    /**
     * Function to check if it is possible to compile.
     * Useful for mocking
     * @param conf Configuration
     */
    mayCompile(conf: any) {
        return (conf && conf.enabled);
    }
}

export class VASMController {
    private disposable: Disposable;
    private compiler: VASMCompiler;

    constructor(compiler: VASMCompiler) {
        this.compiler = compiler;
        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        workspace.onDidSaveTextDocument(document => {
            this.onSaveDocument(document);
        }, null, subscriptions);

        // create a combined disposable from both event subscriptions
        this.disposable = Disposable.from(...subscriptions);
    }

    public async onSaveDocument(document: TextDocument) {
        let state = ExtensionState.getCurrent();
        let statusManager = state.getStatusManager();
        if (document.languageId === 'm68k') {
            statusManager.onDefault();
            await this.compiler.buildDocument(document).catch(error => {
                statusManager.onError(error.message);
            });
        }
    }

    dispose() {
        this.disposable.dispose();
    }
}

export class VASMParser implements ExecutorParser {
    parse(text: string): ICheckResult[] {
        let errors: ICheckResult[] = [];
        let lines = text.split(/\r\n|\r|\n/g);
        let error: ICheckResult | undefined = undefined;
        let lastHeaderLine = "";
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
            let line = lines[lineIndex];
            if (line.length > 1) {
                if (!line.startsWith('>')) {
                    let match = /(error|warning|message)\s([\d]+)\sin\sline\s([\d]+)\sof\s[\"](.+)[\"]:\s*(.*)/.exec(line);
                    if (match) {
                        if (error !== undefined) {
                            errors.push(error);
                        }
                        error = new ICheckResult();
                        lastHeaderLine = line;
                        error.file = match[4];
                        error.line = parseInt(match[3]);
                        error.msg = match[1] + " " + match[2] + ": " + match[5];
                        error.severity = match[1];
                    } else {
                        match = /.*error\s([\d]+)\s*:\s*(.*)/.exec(line);
                        if (match) {
                            if (error !== undefined) {
                                errors.push(error);
                            }
                            error = new ICheckResult();
                            lastHeaderLine = line;
                            error.severity = 'error';
                            error.msg = line;
                        } else if (error !== undefined) {
                            // Errors details parse
                            let match = /\s*called from line\s([\d]+)\sof\s[\"](.+)[\"]/.exec(line);
                            if (match) {
                                error.file = match[2];
                                error.line = parseInt(match[1]);
                                error.msg = lastHeaderLine;
                            } else {
                                let match = /\s*included from line\s([\d]+)\sof\s[\"](.+)[\"]/.exec(line);
                                if (match) {
                                    // It's an included file
                                    error.parentFile = match[2];
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
}