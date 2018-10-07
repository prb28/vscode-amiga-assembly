import * as vscode from 'vscode';
import { DebugProtocol } from 'vscode-debugprotocol';
import { DebugDisassembledFile } from './debugDisassembled';

export class DisassemblyContentProvider implements vscode.TextDocumentContentProvider {
    static readonly FILE_EXT_SIZE = ".dbgasm".length;
    public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Thenable<string> {
        return new Promise((resolve, reject) => {
            if (vscode.debug.activeDebugSession) {
                const path = uri.path;
                let dAsmFile = DebugDisassembledFile.fromPath(path);
                if (dAsmFile.isSegment()) {
                    vscode.debug.activeDebugSession.customRequest('disassemble', { segmentId: dAsmFile.getSegmentId() }).then((response) => {
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
                    vscode.debug.activeDebugSession.customRequest('disassemble', { startAddress: dAsmFile.getAddress(), frameId: dAsmFile.getStackFrameIndex(), length: dAsmFile.getLength() }).then((response) => {
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
                reject(new Error("No active debug session"));
            }
        });
    }
}
