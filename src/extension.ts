// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { M68kFormatter } from './formatter';
import { M68kHoverProvider } from './hover';
import { M86kColorProvider } from './color';
import { Calc, CalcController } from './calc';
import { VASMCompiler, VASMController } from './vasm';
import { StatusManager } from "./status";

// Setting all the globals values
export const AMIGA_ASM_MODE: vscode.DocumentFilter = { language: 'm68k', scheme: 'file' };
export let errorDiagnosticCollection: vscode.DiagnosticCollection;
export let warningDiagnosticCollection: vscode.DiagnosticCollection;
export let statusManager: StatusManager;
export let calc: Calc;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Preparing the status manager
    statusManager = new StatusManager();
    statusManager.diagnosticsStatusBarItem.text = "Starting Amiga Assembly";
    statusManager.diagnosticsStatusBarItem.show();
    vscode.window.onDidChangeActiveTextEditor(statusManager.showHideStatus, null, context.subscriptions);
    context.subscriptions.push(statusManager);

    statusManager.outputChannel.appendLine("Starting Amiga Assembly");
    let formatter = new M68kFormatter();
    // Declaring the formatter
    let disposable = vscode.languages.registerDocumentFormattingEditProvider(AMIGA_ASM_MODE, formatter);
    context.subscriptions.push(disposable);

    // Formatter for a range in document
    disposable = vscode.languages.registerDocumentRangeFormattingEditProvider(AMIGA_ASM_MODE, formatter);
    context.subscriptions.push(disposable);

    // Format on type
    disposable = vscode.languages.registerOnTypeFormattingEditProvider(AMIGA_ASM_MODE, formatter, ' ', ';');
    context.subscriptions.push(disposable);

    // Declaring the Hover
    disposable = vscode.languages.registerHoverProvider(AMIGA_ASM_MODE, new M68kHoverProvider());
    context.subscriptions.push(disposable);

    // create a new calculator
    calc = new Calc();
    let controller = new CalcController(calc);

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(calc);

    // Commands for the calculator
    disposable = vscode.commands.registerCommand('amiga-assembly.calculator', () => {
        return calc.showInputPanel();
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('amiga-assembly.evaluate-selection', () => {
        return calc.evaluateSelections();
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('amiga-assembly.evaluate-selection-replace', () => {
        return calc.replaceSelections();
    });
    context.subscriptions.push(disposable);

    // Color provider
    context.subscriptions.push(vscode.languages.registerColorProvider(AMIGA_ASM_MODE, new M86kColorProvider()));

    // Diagnostics 
    errorDiagnosticCollection = vscode.languages.createDiagnosticCollection('m68k-error');
    context.subscriptions.push(errorDiagnosticCollection);
    warningDiagnosticCollection = vscode.languages.createDiagnosticCollection('m68k-warning');
    context.subscriptions.push(warningDiagnosticCollection);

    // VASM Command
    let compiler = new VASMCompiler();
    // Build a file
    disposable = vscode.commands.registerCommand('amiga-assembly.build-vasm', () => {
        return compiler.buildCurrentEditorFile();
    });
    context.subscriptions.push(disposable);
    // Build on save
    let vController = new VASMController(compiler);
    context.subscriptions.push(vController);
    // Build the workspace
    disposable = vscode.commands.registerCommand('amiga-assembly.build-vasm-workspace', () => {
        return compiler.buildWorkspace();
    });
    context.subscriptions.push(disposable);
    statusManager.diagnosticsStatusBarItem.hide();
}
