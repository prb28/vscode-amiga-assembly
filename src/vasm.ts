import { window, workspace, Disposable, DiagnosticSeverity, TextDocument } from "vscode";
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
    public buildCurrentEditorFile() {
        let configuration = workspace.getConfiguration('amiga-assembly');
        let conf: any = configuration.get('vasm');
        if (conf && conf.enabled) {
            const editor = window.activeTextEditor;
            if (editor) {
                this.buildDocument(editor.document);
            }
        }
    }

    /**
     * Build the selected document
     * @param document The document to build
     */
    public buildDocument(document: TextDocument): Promise<void> {
        let filename = document.fileName;
        return this.buildFile(filename, false).then(errors => {
            this.processGlobalErrors(document, errors);
            this.executor.handleDiagnosticErrors(document, errors, DiagnosticSeverity.Error);
            statusManager.diagnosticsStatusBarItem.hide();
        }).catch(err => {
            window.showInformationMessage('Error: ' + err);
            statusManager.diagnosticsStatusBarItem.text = 'Build Failed';
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

    public buildWorkspace() {
        let configuration = workspace.getConfiguration('amiga-assembly');
        let confVLINK: any = configuration.get('vlink');
        if (confVLINK && confVLINK.enabled) {
            let includes = confVLINK.includes;
            let excludes = confVLINK.excludes;
            let exefilename = confVLINK.exefilename;
            this.buildWorkspaceInner(includes, excludes, exefilename);
        }
    }

    private buildWorkspaceInner(includes: string, excludes: string, exefilename: string): Thenable<void> {
        return workspace.findFiles(includes, excludes, undefined).then(filesURI => {
            let promises: Promise<void>[] = [];
            for (let i = 0; i < filesURI.length; i++) {
                workspace.openTextDocument(filesURI[i]).then(document => {
                    promises.push(this.buildDocument(document));
                });
            }
            return new Promise((resolve, reject) => {
                Promise.all(promises).then((errosArray) => {
                    for (let i = 0; i < errosArray.length; i += 1) {
                        let errors: void = errosArray[i];
                        if (errors) {
                            reject("Build aborted: there are compile errors");
                        }
                    }
                    // Call the linker
                    return this.linker.linkFiles(filesURI, exefilename).then(errors => {
                        this.executor.handleDiagnosticErrors(undefined, errors, DiagnosticSeverity.Error);
                        statusManager.diagnosticsStatusBarItem.hide();
                    });

                });
            });
        });
    }

    /**
     * Build the selected file
     * @param filepathname Path of the file to build
     * @param debug If true debug symbols are added
     */
    public buildFile(filepathname: string, debug: boolean): Promise<ICheckResult[]> {
        let filename = path.basename(filepathname);
        if (workspace.rootPath) {
            let configuration = workspace.getConfiguration('amiga-assembly');
            let conf: any = configuration.get('vasm');
            if (conf) {
                errorDiagnosticCollection.clear();
                warningDiagnosticCollection.clear();
                let buildDir = path.join(workspace.rootPath, "build");
                this.mkdirSync(buildDir);
                let vasmExecutableName: string = conf.file;
                let objFilename = buildDir;
                let extSep = filename.indexOf(".");
                if (extSep > 0) {
                    objFilename = path.join(buildDir, filename.substr(0, filename.lastIndexOf(".")) + ".o");
                } else {
                    objFilename = path.join(buildDir, filename + ".o");
                }
                let confArgs = conf.options;
                if (debug) {
                    confArgs.push("-linedebug");
                }
                let args: Array<string> = confArgs.concat(['-o', objFilename, filepathname]);
                return this.executor.runTool(args, workspace.rootPath, "warning", true, vasmExecutableName, null, true, this.parser);
            } else {
                return new Promise((resolve, reject) => {
                    reject("Please configure VASM compiler");
                });
            }
        } else {
            return new Promise((resolve, reject) => {
                reject("Root workspace path not found");
            });
        }
    }

    /**
     * Creates a directory
     * @param dirPath path to create
     */
    mkdirSync(dirPath: string) {
        try {
            if (!fs.exists(dirPath)) {
                fs.mkdirSync(dirPath);
            }
        } catch (err) {
            if (err.code !== 'EEXIST') {
                window.showErrorMessage("Error creatinb build dir: " + dirPath);
                throw err;
            }
        }
    }
}

export class VASMController {
    private disposable: Disposable;

    constructor(compiler: VASMCompiler) {
        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        workspace.onDidSaveTextDocument(document => {
            if (document.languageId !== 'm68k') {
                return;
            }
            compiler.buildDocument(document);
        }, null, subscriptions);

        // create a combined disposable from both event subscriptions
        this.disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this.disposable.dispose();
    }
}

class VASMParser implements ExecutorParser {
    parse(text: string): ICheckResult[] {
        console.log(text);
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
                    error.msg = match[1] + " " + match[2] + ": " + match[4];
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