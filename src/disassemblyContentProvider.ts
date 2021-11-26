import * as vscode from 'vscode';
import { DebugProtocol } from 'vscode-debugprotocol';
import { DebugDisassembledFile, DisassembleAddressArguments } from './debugDisassembled';

export class DisassemblyContentProvider implements vscode.TextDocumentContentProvider {
    private testDebugSession: vscode.DebugSession | null = null;

    public setTestContext(testDebugSession: vscode.DebugSession): void {
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
        const debugSession = this.getDebugSession();
        if (debugSession) {
            const path = uri.path;
            if (DebugDisassembledFile.isDebugAsmFile(path)) {
                const dAsmFile = DebugDisassembledFile.fromPath(path);
                try {
                    if (dAsmFile.isSegment()) {
                        const args = new DisassembleAddressArguments();
                        args.segmentId = dAsmFile.getSegmentId();
                        const response = await debugSession.customRequest('disassembleInner', args);
                        return this.printVariables(response.instructions);
                    } else if (dAsmFile.isCopper()) {
                        const args = new DisassembleAddressArguments(dAsmFile.getAddressExpression(), dAsmFile.getLength(), true);
                        const response = await debugSession.customRequest('disassembleInner', args);
                        const variables: Array<DebugProtocol.DisassembledInstruction> = response.instructions;
                        let output = '';
                        let isFirst = true;
                        for (const v of variables) {
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
                        const args = new DisassembleAddressArguments(dAsmFile.getAddressExpression(), dAsmFile.getLength(), false);
                        args.stackFrameIndex = dAsmFile.getStackFrameIndex();
                        const response = await debugSession.customRequest('disassembleInner', args);
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
        for (const v of variables) {
            output += `${v.address}: ${v.instruction}\n`;
        }
        return output;
    }
}
