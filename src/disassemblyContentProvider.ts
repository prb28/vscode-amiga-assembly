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

    public async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
        let debugSession = this.getDebugSession();
        if (debugSession) {
            const path = uri.path;
            if (DebugDisassembledFile.isDebugAsmFile(path)) {
                let dAsmFile = DebugDisassembledFile.fromPath(path);
                try {
                    if (dAsmFile.isSegment()) {
                        let args = new DisassembleAddressArguments();
                        args.segmentId = dAsmFile.getSegmentId();
                        let response = await debugSession.customRequest('disassembleInner', args);
                        return this.printVariables(response.instructions);
                    } else if (dAsmFile.isCopper()) {
                        let args = new DisassembleAddressArguments(dAsmFile.getAddressExpression(), dAsmFile.getLength(), true);
                        let response = await debugSession.customRequest('disassembleInner', args);
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
                            throw new Error("Cancelled");
                        } else {
                            return output;
                        }
                    } else {
                        let args = new DisassembleAddressArguments(dAsmFile.getAddressExpression(), dAsmFile.getLength(), false);
                        args.stackFrameIndex = dAsmFile.getStackFrameIndex();
                        let response = await debugSession.customRequest('disassembleInner', args);
                        return this.printVariables(response.instructions);
                    }
                } catch (error) {
                    vscode.window.showErrorMessage(error.message);
                    throw error;
                }
            } else {
                throw new Error("Invalid file path");
            }
        } else {
            throw new Error("No active debug session");
        }
    }

    /**
     * Print variables to string
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
