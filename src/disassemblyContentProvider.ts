import * as vscode from 'vscode';
import { DebugProtocol } from 'vscode-debugprotocol';
import { DebugDisassembledFile, DisassembleAddressArguments } from './debugDisassembled';

export class DisassemblyContentProvider implements vscode.TextDocumentContentProvider {
    private testDebugSession: vscode.DebugSession | null = null;

    public setTestContext(testDebugSession: vscode.DebugSession) {
        this.testDebugSession = testDebugSession;
    }

    private getDebugSession(): vscode.DebugSession | undefined {
        if (this.testDebugSession !== null) {
            return this.testDebugSession;
        } else {
            return vscode.debug.activeDebugSession;
        }
    }

    public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let debugSession = this.getDebugSession();
            if (debugSession) {
                const path = uri.path;
                if (DebugDisassembledFile.isDebugAsmFile(path)) {
                    let dAsmFile = DebugDisassembledFile.fromPath(path);
                    if (dAsmFile.isSegment()) {
                        debugSession.customRequest('disassemble', <DisassembleAddressArguments>{ segmentId: dAsmFile.getSegmentId() }).then((response) => {
                            const variables: Array<DebugProtocol.Variable> = response.variables;
                            let output = '';
                            for (let v of variables) {
                                output += `${v.name}: ${v.value}\n`;
                            }
                            resolve(output);
                        }, (error) => {
                            vscode.window.showErrorMessage(error.message);
                            reject(error);
                        });
                    } else if (dAsmFile.isCopper()) {
                        await debugSession.customRequest('disassemble', <DisassembleAddressArguments>{ addressExpression: dAsmFile.getAddressExpression(), length: dAsmFile.getLength(), copper: true }).then((response) => {
                            const variables: Array<DebugProtocol.Variable> = response.variables;
                            let output = '';
                            let isFirst = true;
                            let sz = 0;
                            for (let v of variables) {
                                if (!isFirst) {
                                    output += `\n`;
                                } else {
                                    isFirst = false;
                                }
                                output += `${v.name}: ${v.value}`;
                                sz++;
                                if (sz > 40) {
                                    break;
                                }
                            }
                            if (token.isCancellationRequested) {
                                reject(new Error("Cancelled"));
                            } else {
                                resolve(output);
                            }
                        }, (error) => {
                            vscode.window.showErrorMessage(error.message);
                            reject(error);
                        });
                    } else {
                        await debugSession.customRequest('disassemble', <DisassembleAddressArguments>{ addressExpression: dAsmFile.getAddressExpression(), stackFrameIndex: dAsmFile.getStackFrameIndex(), length: dAsmFile.getLength() }).then((response) => {
                            const variables: Array<DebugProtocol.Variable> = response.variables;
                            let output = '';
                            for (let v of variables) {
                                output += `${v.name}: ${v.value}\n`;
                            }
                            resolve(output);
                        }, (error) => {
                            vscode.window.showErrorMessage(error.message);
                            reject(error);
                        });
                    }
                } else {
                    reject(new Error("Invalid file path"));
                }
            } else {
                reject(new Error("No active debug session"));
            }
        });
    }
}
