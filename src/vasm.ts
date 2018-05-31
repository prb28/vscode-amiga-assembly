import { window, workspace, Disposable, DiagnosticSeverity, TextDocument, Uri } from "vscode";
import { ExecutorParser, ICheckResult, Executor } from "./executor";
import { statusManager, errorDiagnosticCollection, warningDiagnosticCollection } from './extension';
import { VLINKLinker } from './vlink';
import * as fs from "fs";
import * as path from "path";

/**
 * Class to manage the VASM compiler
 */
export class VASMCompiler {
    executor: Executor;
    parser: VASMParser;
    linker: VLINKLinker;

    constructor() {
        this.executor = new Executor();
        this.parser = new VASMParser();
        this.linker = new VLINKLinker();
    }

    /**
     * Builds the file in the current editor
     */
    public buildCurrentEditorFile(): Promise<void> {
        let configuration = workspace.getConfiguration('amiga-assembly');
        let conf: any = configuration.get('vasm');
        if (this.mayCompile(conf)) {
            const editor = window.activeTextEditor;
            if (editor) {
                return this.buildDocument(editor.document).then(() => { return; });
            } else {
                return Promise.reject("Current editor not selected");
            }
        } else {
            return Promise.reject("VASM compilation is disabled in the configuration");
        }
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
        return new Promise((resolve, reject) => {
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
                    resolve(this.buildWorkspaceInner(includes, excludes, exefilename));
                } else {
                    reject("Please configure VLINK compiler files selection");
                }
            } else {
                reject("Please configure VASM compiler");
            }
        });
    }

    /**
     * CLeans the workspace
     */
    public cleanWorkspace(): Promise<void> {
        return new Promise((resolve, reject) => {
            statusManager.outputChannel.appendLine('Cleaning workspace');
            errorDiagnosticCollection.clear();
            warningDiagnosticCollection.clear();
            let configuration = workspace.getConfiguration('amiga-assembly');
            let conf: any = configuration.get('vasm');
            if (this.mayCompile(conf)) {
                const workspaceRootDir = this.getWorkspaceRootDir();
                if (workspaceRootDir) {
                    return workspace.findFiles('build/**/*.o').then(filesURI => {
                        for (let i = 0; i < filesURI.length; i++) {
                            const fileUri = filesURI[i];
                            statusManager.outputChannel.appendLine('Deleting ' + fileUri.fsPath);
                            this.unlink(fileUri);
                        }
                        return resolve();
                    });
                } else {
                    return reject("Root workspace not found");
                }
            } else {
                reject("Please configure VASM compiler");
            }
        });
    }

    private buildWorkspaceInner(includes: string, excludes: string, exefilename: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const workspaceRootDir = this.getWorkspaceRootDir();
            const buildDir = this.getBuildDir();
            const configuration = workspace.getConfiguration('amiga-assembly');
            const confVLINK: any = configuration.get('vlink');
            if (workspaceRootDir && buildDir) {
                return workspace.findFiles(includes, excludes, undefined).then(filesURI => {
                    let promises: Thenable<ICheckResult[]>[] = [];
                    for (let i = 0; i < filesURI.length; i++) {
                        const fileUri = filesURI[i];
                        promises.push(workspace.openTextDocument(fileUri).then(document => {
                            return this.buildDocument(document);
                        }));
                    }
                    Promise.all(promises).then((errosArray) => {
                        for (let i = 0; i < errosArray.length; i += 1) {
                            let errors: ICheckResult[] = errosArray[i];
                            if (errors && (errors.length > 0)) {
                                return reject("Build aborted: there are compile errors");
                            }
                        }
                        // Call the linker
                        if (this.linker.mayLink(confVLINK)) {
                            return this.linker.linkFiles(filesURI, exefilename, workspaceRootDir, buildDir).then(errors => {
                                if (errors && errors.length > 0) {
                                    return reject('Linker errors : ' + errors[0]);
                                } else {
                                    return resolve();
                                }
                            }).catch(err => {
                                return reject(new Error(err));
                            });
                        } else {
                            // The linker is not mandatory
                            // show a warning in the output
                            statusManager.outputChannel.append("Warning : the linker vlink is not configured");
                            return resolve();
                        }
                    }).catch(err => { return reject(new Error(err)); });
                });
            } else {
                return reject("Root workspace or build path not found");
            }
        });
    }

    /**
     * Build the selected file
     * @param filepathname Path of the file to build
     * @param debug If true debug symbols are added
     */
    public buildFile(fileUri: Uri, debug: boolean): Promise<ICheckResult[]> {
        const workspaceRootDir = this.getWorkspaceRootDir();
        const buildDir = this.getBuildDir();
        if (workspaceRootDir && buildDir) {
            let filename = path.basename(fileUri.fsPath);
            let configuration = workspace.getConfiguration('amiga-assembly');
            let conf: any = configuration.get('vasm');
            if (this.mayCompile(conf)) {
                return this.mkdirSync(buildDir.fsPath).then(() => {
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
                    return this.executor.runTool(args, workspaceRootDir.fsPath, "warning", true, vasmExecutableName, null, true, this.parser);
                });
            } else {
                return Promise.reject("Please configure VASM compiler");
            }
        } else {
            return Promise.reject("Root workspace path not found");
        }
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
                if (!fs.exists(dirPath)) {
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

    onSaveDocument(document: TextDocument) {
        if (document.languageId !== 'm68k') {
            return;
        }
        statusManager.onDefault();
        this.compiler.buildDocument(document).catch(error => {
            statusManager.onError(error);
        });
    }

    dispose() {
        this.disposable.dispose();
    }
}

export class VASMParser implements ExecutorParser {
    parse(text: string): ICheckResult[] {
        let errors: ICheckResult[] = [];
        let lines = text.split('\n');
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
            let line = lines[lineIndex];
            if ((line.length > 1) && !line.startsWith('>')) {
                let match = /(error|warning|message)\s([\d]+)\sin\sline\s([\d]+)\sof\s[\"](.+)[\"]:\s*(.*)/.exec(line);
                if (match) {
                    let error: ICheckResult = new ICheckResult();
                    error.file = match[4];
                    error.line = parseInt(match[3]);
                    error.msg = match[1] + " " + match[2] + ": " + match[5];
                    error.severity = match[1];
                    errors.push(error);
                } else {
                    match = /.*error\s([\d]+)\s*:\s*(.*)/.exec(line);
                    if (match) {
                        let error: ICheckResult = new ICheckResult();
                        error.severity = 'error';
                        error.msg = line;
                        errors.push(error);
                    }
                }
            }
        }
        return errors;
    }
}