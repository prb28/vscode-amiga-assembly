// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { M68kFormatter } from './formatter';
import { M68kHoverProvider } from './hover';

const AMIGA_ASM_MODE: vscode.DocumentFilter = { language: 'm68k', scheme: 'file' };

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Declaring the formatter
    let disposable = vscode.languages.registerDocumentFormattingEditProvider(AMIGA_ASM_MODE, new M68kFormatter());
    context.subscriptions.push(disposable);

    // Formatter for a range in document
    disposable = vscode.languages.registerDocumentRangeFormattingEditProvider(AMIGA_ASM_MODE, new M68kFormatter());
    context.subscriptions.push(disposable);

    // Declaring the Hover
    disposable = vscode.languages.registerHoverProvider(AMIGA_ASM_MODE, new M68kHoverProvider());
    context.subscriptions.push(disposable);
}