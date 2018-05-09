import * as vscode from 'vscode';

export class M68kFormatter implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        //options: vscode.FormattingOptions
        let edits: Array<vscode.TextEdit>;
        edits = [];
        for (var i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let idx = line.firstNonWhitespaceCharacterIndex;
            if (line.text.charAt(idx) === ';') {
                // Test if it is a full comment line
                edits.push(vscode.TextEdit.insert(line.range.start, '42\n'));
            }
        }
        return edits;
    }
}