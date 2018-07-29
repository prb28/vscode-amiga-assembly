import * as cp from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';
import { statusManager, errorDiagnosticCollection, warningDiagnosticCollection } from './extension';

export class ICheckResult {
    file: string = "";
    line: number = -1;
    col: number = 0;
    msg: string = "";
    severity: string = "error";
}

export interface ExecutorParser {
    parse(text: string): ICheckResult[];
}

export class Executor {
    /**
     * Runs the given tool and returns errors/warnings that can be fed to the Problems Matcher
     * @param args Arguments to be passed while running given tool
     * @param cwd cwd that will passed in the env object while running given tool
     * @param severity error or warning
     * @param useStdErr If true, the stderr of the output of the given tool will be used, else stdout will be used
     * @param cmd The path and name of the tool to run
     * @param printUnexpectedOutput If true, then output that doesnt match expected format is printed to the output channel
     * @param parser Parser for the output
     */
    runTool(args: string[], cwd: string | null, severity: string, useStdErr: boolean, cmd: string, env: any, printUnexpectedOutput: boolean, parser: ExecutorParser | null, token?: vscode.CancellationToken): Promise<ICheckResult[]> {
        let outputChannel = statusManager.outputChannel;
        let p: cp.ChildProcess;
        if (token) {
            token.onCancellationRequested(() => {
                if (p) {
                    this.killTree(p.pid);
                }
            });
        }
        return new Promise((resolve, reject) => {
            let options: any = {
                env: env
            };
            if (cwd) {
                options.cwd = cwd;
            }
            p = cp.execFile(cmd, args, options, (err, stdout, stderr) => {
                try {
                    if (err && (<any>err).code === 'ENOENT') {
                        return reject(new Error(`Cannot find ${cmd} : ${err.message}`));
                    }
                    outputChannel.appendLine(stdout);
                    console.log(stdout);
                    outputChannel.appendLine(stderr);
                    console.log(stderr);
                    if (err && stderr && !useStdErr) {
                        let errorMessage = ['Error while running tool:', cmd, ...args].join(' ');
                        outputChannel.appendLine(['Error while running tool:', cmd, ...args].join(' '));
                        return reject(errorMessage);
                    }
                    let text = (useStdErr ? stderr : stdout).toString();
                    outputChannel.appendLine([cwd + '>Finished running tool:', cmd, ...args].join(' '));


                    let ret: ICheckResult[] = [];
                    if (parser) {
                        ret = parser.parse(text);
                    }
                    outputChannel.appendLine('');
                    resolve(ret);
                } catch (e) {
                    reject(e);
                }
            });
        });
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
        let p: cp.ChildProcess;
        if (token) {
            token.onCancellationRequested(() => {
                if (p) {
                    this.killTree(p.pid);
                }
            });
        }
        return new Promise((resolve, reject) => {
            let options: any = {
                env: env
            };
            if (cwd) {
                options.cwd = cwd;
            }
            p = cp.execFile(cmd, args, options, (err, stdout, stderr) => {
                try {
                    if (err && (<any>err).code === 'ENOENT') {
                        return reject(new Error(`Cannot find ${cmd} : ${err.message}`));
                    }
                    resolve(stdout);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    handleDiagnosticErrors(document: vscode.TextDocument | undefined, errors: ICheckResult[], diagnosticSeverity?: vscode.DiagnosticSeverity) {
        let diagnosticMap: Map<string, Map<vscode.DiagnosticSeverity, vscode.Diagnostic[]>> = new Map();
        errors.forEach(error => {
            if (error.line <= 0) {
                vscode.window.showErrorMessage(error.msg);
            } else {
                let canonicalFile = vscode.Uri.file(error.file).toString();
                let startColumn = 0;
                let endColumn = 1;
                if (document && document.uri.toString() === canonicalFile) {
                    let range = new vscode.Range(error.line - 1, 0, error.line - 1, document.lineAt(error.line - 1).range.end.character + 1);
                    let text = document.getText(range);
                    let match = /^(\s*).*(\s*)$/.exec(text);
                    if (match) {
                        let leading = match[1];
                        let trailing = match[2];
                        if (!error.col) {
                            startColumn = leading.length;
                        } else {
                            startColumn = error.col - 1; // range is 0-indexed
                        }
                        endColumn = text.length - trailing.length;
                    }
                }
                let range = new vscode.Range(error.line - 1, startColumn, error.line - 1, endColumn);
                let severity = this.mapSeverityToVSCodeSeverity(error.severity);
                let diagnostic = new vscode.Diagnostic(range, error.msg, severity);
                let diagnostics = diagnosticMap.get(canonicalFile);
                if (!diagnostics) {
                    diagnostics = new Map<vscode.DiagnosticSeverity, vscode.Diagnostic[]>();
                }
                let diag = diagnostics.get(severity);
                if (!diag) {
                    diag = [];
                    diagnostics.set(severity, diag);
                }
                diag.push(diagnostic);
                diagnosticMap.set(canonicalFile, diagnostics);
            }
        });

        diagnosticMap.forEach((diagMap, file) => {
            const fileUri = vscode.Uri.parse(file);
            if (diagnosticSeverity === undefined || diagnosticSeverity === vscode.DiagnosticSeverity.Error) {
                const newErrors = diagMap.get(vscode.DiagnosticSeverity.Error);
                let existingWarnings = warningDiagnosticCollection.get(fileUri);
                errorDiagnosticCollection.set(fileUri, newErrors);

                // If there are warnings on current file, remove the ones co-inciding with the new errors
                if (newErrors && existingWarnings) {
                    const errorLines = newErrors.map(x => x.range.start.line);
                    existingWarnings = existingWarnings.filter(x => errorLines.indexOf(x.range.start.line) === -1);
                    warningDiagnosticCollection.set(fileUri, existingWarnings);
                }
            }
            if (diagnosticSeverity === undefined || diagnosticSeverity === vscode.DiagnosticSeverity.Warning) {
                const existingErrors = errorDiagnosticCollection.get(fileUri);
                let newWarnings = diagMap.get(vscode.DiagnosticSeverity.Warning);

                // If there are errors on current file, ignore the new warnings co-inciding with them
                if (existingErrors && newWarnings) {
                    const errorLines = existingErrors.map(x => x.range.start.line);
                    newWarnings = newWarnings.filter(x => errorLines.indexOf(x.range.start.line) === -1);
                }

                warningDiagnosticCollection.set(fileUri, newWarnings);
            }
        });
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
            let workspace = vscode.workspace.getWorkspaceFolder(fileUri);
            if (workspace) {
                return workspace.uri.fsPath;
            }
        }
        // fall back to the first workspace
        let folders = vscode.workspace.workspaceFolders;
        if (folders && folders.length) {
            return folders[0].uri.fsPath;
        }
        return ".";
    }

    killProcess(p: cp.ChildProcess) {
        if (p) {
            try {
                p.kill();
            } catch (e) {
                console.log('Error killing process: ' + e);
            }
        }
    }

    killTree(processId: number): void {
        if (process.platform === 'win32') {
            const TASK_KILL = 'C:\\Windows\\System32\\taskkill.exe';

            // when killing a process in Windows its child processes are *not* killed but become root processes.
            // Therefore we use TASKKILL.EXE
            try {
                cp.execSync(`${TASK_KILL} /F /T /PID ${processId}`);
            } catch (err) {
            }
        } else {
            // on linux and OS X we kill all direct and indirect child processes as well
            try {
                const cmd = path.join(__dirname, '../scripts/terminateProcess.sh');
                cp.spawnSync(cmd, [processId.toString()]);
            } catch (err) {
            }
        }
    }
}