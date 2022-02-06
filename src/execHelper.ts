import * as cp from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';
import { ExtensionState } from './extension';
import { workspace, Uri } from 'vscode';
import * as winston from 'winston';
import { SymbolFile } from './symbols';

export class ICheckResult {
    file = "";
    parentFile = "";
    line = -1;
    col = 0;
    msg = "";
    msgData = "";
    severity = "error";
    parentFileLine = -1;
}

export interface ExecutorParser {
    parse(text: string): ICheckResult[];
}

export class ExecutorHelper {
    /**
     * Runs the given tool and returns errors/warnings that can be fed to the Problems Matcher
     * @param args Arguments to be passed while running given tool
     * @param cwd cwd that will passed in the env object while running given tool
     * @param severity error or warning
     * @param useStdErr If true, the stderr of the output of the given tool will be used, else stdout will be used
     * @param cmd The path and name of the tool to run
     * @param printUnexpectedOutput If true, then output that doesn't match expected format is printed to the output channel
     * @param parser Parser for the output
     * @param logEmitter Log event emitter
     */
    runTool(args: string[], cwd: string | null, severity: string, useStdErr: boolean, cmd: string, env: any, printUnexpectedOutput: boolean, parser: ExecutorParser | null, token?: vscode.CancellationToken, logEmitter?: vscode.EventEmitter<string>): Promise<ICheckResult[]> {
        return new Promise((resolve, reject) => {
            const options: any = {
                env: env
            };
            if (cwd) {
                options.cwd = cwd;
            }
            const p = cp.execFile(cmd, args, options, (err, stdout, stderr) => {
                try {
                    if (err && (<any>err).code === 'ENOENT') {
                        const errorMessage = `Cannot find ${cmd} : ${err.message}`;
                        if (logEmitter) {
                            logEmitter.fire(errorMessage + '\r\n');
                        }
                        throw new Error(errorMessage);
                    }
                    if (stdout) {
                        winston.info(stdout.toString());
                        console.log(stdout);
                    }
                    if (stderr) {
                        winston.info(stderr.toString());
                    }
                    console.log(stderr);
                    if (err && stderr && !useStdErr) {
                        const errorMessage = ['Error while running tool:', cmd, ...args].join(' ');
                        winston.info(errorMessage);
                        if (logEmitter) {
                            logEmitter.fire(errorMessage + '\r\n');
                        }
                        throw new Error(errorMessage);
                    }
                    const message = [cwd + '>Finished running tool:', cmd, ...args].join(' ');
                    winston.info(message);
                    if (logEmitter) {
                        logEmitter.fire([cmd, ...args].join(' ') + '\r\n');
                    }

                    let ret: ICheckResult[] = [];
                    if (stdout || (useStdErr && stderr)) {
                        const text = ((useStdErr && stderr) ? stderr : stdout).toString();
                        if (logEmitter) {
                            logEmitter.fire(text + '\r\n');
                        }
                        if (parser) {
                            ret = parser.parse(text);
                        }
                    }
                    winston.info('');
                    resolve(ret);
                } catch (e) {
                    reject(e);
                }
            });
            this.addKillToCancellationToken(p, token);
        });
    }

    /**
     * Add a kill call when cancellation token is called
     * @param p Child process
     * @param token Cancellation token
     */
    private addKillToCancellationToken(p: cp.ChildProcess, token?: vscode.CancellationToken) {
        if (token) {
            token.onCancellationRequested(() => {
                if (p && p.pid) {
                    this.killTree(p.pid);
                }
            });
        }
    }

    /**
     * Runs the given tool and returns the stdout
     * @param args Arguments to be passed while running given tool
     * @param cwd cwd that will passed in the env object while running given tool
     * @param cmd The path and name of the tool to run
     * @param env Environment variables
     * @param token Cancellation token
     */
    runToolRetrieveStdout(args: string[], cwd: string | null, cmd: string, env: any, token?: vscode.CancellationToken): Promise<string> {
        return new Promise((resolve, reject) => {
            const options: any = {
                env: env
            };
            if (cwd) {
                options.cwd = cwd;
            }
            const p = cp.execFile(cmd, args, options, (err, stdout, stderr) => {
                try {
                    let bufferOut = "";
                    if (err) {
                        if ((<any>err).code === 'ENOENT') {
                            throw new Error(`Cannot find ${cmd}`);
                        } else if (err.message) {
                            bufferOut += err.message;
                        }
                    }
                    if (stdout) {
                        bufferOut += "\n" + stdout.toString();
                    }
                    resolve(bufferOut);
                } catch (e) {
                    reject(e);
                }
            });
            this.addKillToCancellationToken(p, token);
        });
    }

    async handleDiagnosticErrors(document: vscode.TextDocument | undefined, errors: ICheckResult[], diagnosticSeverity?: vscode.DiagnosticSeverity): Promise<void> {
        const diagnosticMap: Map<string, Map<vscode.DiagnosticSeverity, vscode.Diagnostic[]>> = new Map();
        for (const error of errors) {
            if (error.line <= 0) {
                vscode.window.showErrorMessage(error.msg);
            } else {
                let canonicalFile;
                if (document && document.fileName.endsWith(error.file)) {
                    canonicalFile = document.uri.toString();
                } else {
                    canonicalFile = vscode.Uri.file(error.file).toString();
                }
                let startColumn = 0;
                let endColumn = 1;
                const perErrorDiagnostics: Array<vscode.Diagnostic> = [];
                if ((document) && ((document.uri.toString() === canonicalFile) || error.parentFile)) {
                    let text = "";
                    // Processing path of included files
                    if (error.parentFile) {
                        const definitionHandler = ExtensionState.getCurrent().getDefinitionHandler();
                        const includedFiles = await definitionHandler.getIncludedFiles(document.uri);
                        const errorFilename = path.parse(error.file).base;
                        for (const filename of includedFiles) {
                            if (filename.endsWith(errorFilename)) {
                                canonicalFile = filename;
                                break;
                            }
                        }
                        // Open the document to get the text
                        const sourceDocument = await workspace.openTextDocument(Uri.file(canonicalFile));
                        if (sourceDocument) {
                            const sErrorLine = error.line - 1;
                            if (sourceDocument.lineCount > sErrorLine) {
                                const newRange = new vscode.Range(sErrorLine, 0, sErrorLine, sourceDocument.lineAt(sErrorLine).range.end.character + 1);
                                text = sourceDocument.getText(newRange);
                            } else {
                                winston.error(`Invalid error message: '${error.msg}'`);
                            }
                        }

                    } else {
                        const sErrorLine = error.line - 1;
                        if (document.lineCount > sErrorLine) {
                            const newRange = new vscode.Range(sErrorLine, 0, sErrorLine, document.lineAt(sErrorLine).range.end.character + 1);
                            text = document.getText(newRange);
                        } else {
                            winston.error(`Invalid error message: '${error.msg}'`);
                        }
                    }
                    const match = /^(\s*).*(\s*)$/.exec(text);
                    if (match) {
                        const leading = match[1];
                        const trailing = match[2];
                        if (!error.col) {
                            startColumn = leading.length;
                        } else {
                            startColumn = error.col - 1; // range is 0-indexed
                        }
                        endColumn = text.length - trailing.length;
                    }
                } else if (error.msg.includes("undefined symbol")) {
                    // parse of the symbol
                    const pos = error.msg.indexOf("undefined symbol");
                    if (pos > 0) {
                        let hasUnderScore = false;
                        let symbol = error.msg.substring(pos + 17).trim();
                        if (symbol.endsWith(".")) {
                            symbol = symbol.substring(0, symbol.length - 1);
                        }
                        if (symbol.startsWith("_")) {
                            symbol = symbol.substring(1, symbol.length);
                            hasUnderScore = true;
                        }
                        // search in file
                        const sFile = new SymbolFile(Uri.file(error.file));
                        await sFile.readFile();
                        for (const fSymbol of sFile.getReferredSymbols()) {
                            if (fSymbol.getLabel() == symbol) {
                                const symbolErrorSeverity = this.mapSeverityToVSCodeSeverity(error.severity);
                                let range = fSymbol.getRange();
                                if (hasUnderScore && range.start.character > 0) {
                                    range = new vscode.Range(new vscode.Position(range.start.line, range.start.character - 1), range.end);
                                }
                                perErrorDiagnostics.push(new vscode.Diagnostic(range, error.msg, symbolErrorSeverity));
                            }
                        }
                    }
                }
                const errorRange = new vscode.Range(error.line - 1, startColumn, error.line - 1, endColumn);
                const errorSeverity = this.mapSeverityToVSCodeSeverity(error.severity);
                const diagnostic = new vscode.Diagnostic(errorRange, error.msg, errorSeverity);
                let diagnostics = diagnosticMap.get(canonicalFile);
                if (!diagnostics) {
                    diagnostics = new Map<vscode.DiagnosticSeverity, vscode.Diagnostic[]>();
                }
                let diag = diagnostics.get(errorSeverity);
                if (!diag) {
                    diag = [];
                    diagnostics.set(errorSeverity, diag);
                }
                if (perErrorDiagnostics.length > 0) {
                    for (const d of perErrorDiagnostics) {
                        diag.push(d);
                    }
                } else {
                    diag.push(diagnostic);
                }
                diagnosticMap.set(canonicalFile, diagnostics);
            }
        }

        for (const [file, diagMap] of diagnosticMap) {
            let fileUri: vscode.Uri;
            if (file.startsWith("file:")) {
                fileUri = vscode.Uri.parse(file);
            } else {
                fileUri = vscode.Uri.file(file);
            }
            const warningDiagnosticCollection = ExtensionState.getCurrent().getWarningDiagnosticCollection();
            const errorDiagnosticCollection = ExtensionState.getCurrent().getErrorDiagnosticCollection();
            if (diagnosticSeverity === undefined || diagnosticSeverity === vscode.DiagnosticSeverity.Error) {
                const newErrors = diagMap.get(vscode.DiagnosticSeverity.Error);
                let existingWarnings = warningDiagnosticCollection.get(fileUri);
                errorDiagnosticCollection.set(fileUri, newErrors);

                // If there are warnings on current file, remove the ones equal to new errors
                if (newErrors && existingWarnings) {
                    const errorLines = newErrors.map(x => x.range.start.line);
                    existingWarnings = existingWarnings.filter(x => errorLines.indexOf(x.range.start.line) === -1);
                    if (existingWarnings.length > 0) {
                        warningDiagnosticCollection.set(fileUri, existingWarnings);
                    }
                }
            }
            if (diagnosticSeverity === undefined || diagnosticSeverity === vscode.DiagnosticSeverity.Warning) {
                const existingErrors = errorDiagnosticCollection.get(fileUri);
                let newWarnings = diagMap.get(vscode.DiagnosticSeverity.Warning);

                // If there are errors on current file, ignore the new warnings similar with them
                if (existingErrors && newWarnings) {
                    const errorLines = existingErrors.map(x => x.range.start.line);
                    newWarnings = newWarnings.filter(x => errorLines.indexOf(x.range.start.line) === -1);
                }

                warningDiagnosticCollection.set(fileUri, newWarnings);
            }
        }
    }


    mapSeverityToVSCodeSeverity(sev: string): vscode.DiagnosticSeverity {
        switch (sev) {
            case 'error': return vscode.DiagnosticSeverity.Error;
            case 'warning': return vscode.DiagnosticSeverity.Warning;
            default: return vscode.DiagnosticSeverity.Error;
        }
    }

    getWorkspaceFolderPath(fileUri: vscode.Uri): string {
        if (fileUri) {
            const wFolder = vscode.workspace.getWorkspaceFolder(fileUri);
            if (wFolder) {
                return wFolder.uri.fsPath;
            }
        }
        // fall back to the first workspace
        const folders = vscode.workspace.workspaceFolders;
        if (folders && folders.length) {
            return folders[0].uri.fsPath;
        }
        return ".";
    }

    killProcess(p: cp.ChildProcess): void {
        if (p) {
            try {
                p.kill();
            } catch (e) {
                winston.error(`Error killing process '${e}'`);
            }
        }
    }

    killTree(processId: number): void {
        if (process.platform === 'win32') {
            const TASK_KILL = 'C:\\Windows\\System32\\taskkill.exe';

            // when killing a process in Windows its child processes are *not* killed but become root processes.
            // Therefore we use TASKKILL.EXE
            try {
                winston.info(`Killing process with command ${TASK_KILL} /F /T /PID ${processId}'`);
                cp.execSync(`${TASK_KILL} /F /T /PID ${processId}`);
            } catch (err) {
                winston.error(`Error killing process '${err}'`);
            }
        } else {
            // on linux and OS X we kill the process
            try {
                winston.info(`Killing process with command 'kill -9 ${processId}'`);
                cp.spawnSync('kill', ['-9', processId.toString(), '>', '/dev/null', '2>&1']);
            } catch (err) {
                winston.error(`Error killing process '${err}'`);
            }
        }
    }
}