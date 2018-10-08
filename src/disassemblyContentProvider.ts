import * as vscode from 'vscode';
import { DebugProtocol } from 'vscode-debugprotocol';
import { DebugDisassembledFile } from './debugDisassembled';

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

    public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Thenable<string> {
        return new Promise((resolve, reject) => {
            let debugSession = this.getDebugSession();
            if (debugSession) {
                const path = uri.path;
                if (DebugDisassembledFile.isDebugAsmFile(path)) {
                    let dAsmFile = DebugDisassembledFile.fromPath(path);
                    if (dAsmFile.isSegment()) {
                        debugSession.customRequest('disassemble', { segmentId: dAsmFile.getSegmentId() }).then((response) => {
                            const variables: Array<DebugProtocol.Variable> = response.variables;
                            let output = '';
                            variables.forEach((v) => {
                                output += `${v.name}: ${v.value}\n`;
                            });
                            resolve(output);
                        }, (error) => {
                            vscode.window.showErrorMessage(error.message);
                            reject(error.message);
                        });
                    } else {
                        debugSession.customRequest('disassemble', { startAddress: dAsmFile.getAddress(), frameId: dAsmFile.getStackFrameIndex(), length: dAsmFile.getLength() }).then((response) => {
                            const variables: Array<DebugProtocol.Variable> = response.variables;
                            let output = '';
                            variables.forEach((v) => {
                                output += `${v.name}: ${v.value}\n`;
                            });
                            resolve(output);
                        }, (error) => {
                            vscode.window.showErrorMessage(error.message);
                            reject(error.message);
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
