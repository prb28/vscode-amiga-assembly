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
                        let args = new DisassembleAddressArguments();
                        args.segmentId = dAsmFile.getSegmentId();
                        debugSession.customRequest('disassembleInner', args).then((response) => {
                            resolve(this.printVariables(response.instructions));
                        }, (error) => {
                            vscode.window.showErrorMessage(error.message);
                            reject(error);
                        });
                    } else if (dAsmFile.isCopper()) {
                        let args = new DisassembleAddressArguments(dAsmFile.getAddressExpression(), dAsmFile.getLength(), true);
                        await debugSession.customRequest('disassembleInner', args).then((response) => {
                            const variables: Array<DebugProtocol.DisassembledInstruction> = response.instructions;
                            let output = '';
                            let isFirst = true;
                            for (let v of variables) {
                                if (!isFirst) {
                                    output += `\n`;
                                } else {
                                    isFirst = false;
                                }
                                output += `${v.address}: ${v.instruction}`;
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
                        let args = new DisassembleAddressArguments(dAsmFile.getAddressExpression(), dAsmFile.getLength(), false);
                        args.stackFrameIndex = dAsmFile.getStackFrameIndex();
                        await debugSession.customRequest('disassembleInner', args).then((response) => {
                            resolve(this.printVariables(response.instructions));
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

    /**
     * Print variables to stirng
     * @param variables to b printed/
     */
    private printVariables(variables: Array<DebugProtocol.DisassembledInstruction>): string {
        let output = '';
        for (let v of variables) {
            output += `${v.address}: ${v.instruction}\n`;
        }
        return output;
    }
}
