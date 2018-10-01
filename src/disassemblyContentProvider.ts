import * as vscode from 'vscode';
import { DebugProtocol } from 'vscode-debugprotocol';

export class DisassemblyContentProvider implements vscode.TextDocumentContentProvider {
    static readonly FILE_EXT_SIZE = ".dbgasm".length;
    public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Thenable<string> {
        return new Promise((resolve, reject) => {
            if (vscode.debug.activeDebugSession) {
                const path = uri.path;
                const pathParts = path.substring(1, path.length - DisassemblyContentProvider.FILE_EXT_SIZE).split('_');
                let frameId = -1;
                let address = "";

                if (pathParts.length > 1) {
                    frameId = parseInt(pathParts[0]);
                    address = pathParts[1];
                }
                vscode.debug.activeDebugSession.customRequest('disassemble', { startAddress: address, frameId: frameId, length: 100 }).then((response) => {
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
                reject(new Error("No active debug session"));
            }
        });
    }
}
