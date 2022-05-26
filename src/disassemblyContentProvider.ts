import * as vscode from 'vscode';
import { isDisassembledFile } from 'uae-dap';

export class DisassemblyContentProvider
    implements vscode.TextDocumentContentProvider
{
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

    public async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const debugSession = this.getDebugSession();
        if (!debugSession) {
            throw new Error('No active debug session');
        }
        if (!isDisassembledFile(uri.path)) {
            throw new Error('Invalid file path');
        }
        try {
            const response = await debugSession.customRequest(
                'disassembledFileContents',
                { path: uri.path }
            );
            return response.content;
        } catch (error) {
            vscode.window.showErrorMessage(error.message);
            throw error;
        }
    }
}
