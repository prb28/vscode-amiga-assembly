import { StatusBarAlignment, StatusBarItem, window, Disposable } from 'vscode';
import { MathCalc } from './mathcalc.js';
import { NumberParser } from './parser';

export class Calc {
    private statusBarItem: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    private numberParser = new NumberParser();
    public updateCalc() {
        if (window) {
            // Get the current text editor
            let editor = window.activeTextEditor;
            if (!editor) {
                this.statusBarItem.hide();
                return;
            }
            let docContent = editor.document.getText(editor.selection);
            // Replace hex / bin
            if (docContent.length > 0) {
                let result = this.calculate(docContent);
                if (result) {
                    // Update the status bar
                    this.statusBarItem.text = this.formatResult(docContent, result);
                    this.statusBarItem.show();
                } else {
                    this.statusBarItem.hide();
                }
            }
        }
    }

    /**
     * Formats the result
     * @param expression expression evalated
     * @param result Result of the calculation
     */
    private formatResult(expression: string | null, result: number): string {
        let s = "No result";
        if (result) {
            // Transform to hex
            let dec = result.toString(10);
            // Transform to hex
            let hex = this.numberParser.hexToString(result);
            // Transform to bin
            let bin = this.numberParser.binaryToString(result);
            // Format the text
            s = "#" + dec + "/$" + hex + "/%" + bin;
            if (expression) {
                s = expression.trim() + "=" + s;
            }
        }
        return s;
    }
    /**
     * Performs the calculation
     * @param expression Expression to calculate
     */
    public calculate(expression: string): number {
        // call the function to calculate the expression
        var calc = new MathCalc();
        var expr = calc.parse(this.numberParser.tranformToDecimal(expression));
        return expr.eval();
    }

    /**
     * Iterates over the selections
     * @param all view all elections
     * @param replace Replaces the selection
     * @param callback Returns the value
     */
    private iterateSelections(all: boolean, replace: boolean, callback: (input: string) => string): void {
        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        const selections = editor.selections;
        editor.edit((edit) => {
            for (const selection of selections) {
                if (selection.isEmpty && !all) {
                    continue;
                }
                const text = document.getText(selection);
                try {
                    const result = callback(text);
                    if (result) {
                        if (replace) {
                            edit.replace(selection, result);
                        } else {
                            window.showInformationMessage(result);
                        }
                    }
                } catch (ex) {
                    console.error(ex);
                }
            }

        });

    }

    /**
     * Evaluates the selection
     */
    public evaluateSelections(): void {
        this.iterateSelections(true, false, (input) => {
            return (this.formatResult(input, this.calculate(input)));
        });
    }

    /**
     * Replaces the selection
     */
    public replaceSelections(): void {
        this.iterateSelections(true, true, (input) => {
            return this.formatResult(null, this.calculate(input));
        });
    }

    /**
     * Shows an input panel to calculate
     */
    public showInputPanel(): void {
        window.showInputBox({
            prompt: "Enter a Math Expression to evaluate.",
            placeHolder: "Expression"
        }).then((value) => {
            if (value) {
                let result = this.calculate(value);
                window.showInformationMessage(this.formatResult(value, result));
            }
        });
    }

    /**
     * Disposes the resources
     */
    dispose() {
        this.statusBarItem.dispose();
    }
}

export class CalcController {
    private calc: Calc;
    private disposable: Disposable;

    constructor(calc: Calc) {
        this.calc = calc;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this.onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this.onEvent, this, subscriptions);

        // update the counter for the current file
        this.calc.updateCalc();

        // create a combined disposable from both event subscriptions
        this.disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this.disposable.dispose();
    }

    private onEvent() {
        this.calc.updateCalc();
    }
}