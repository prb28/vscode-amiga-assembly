import { StatusBarAlignment, StatusBarItem, window, Disposable } from 'vscode';
import { MathCalc } from './mathcalc.js';
import { NumberParser } from './parser';

export class Calc {
    private statusBarItem: StatusBarItem | undefined;
    private numberParser = new NumberParser();
    constructor() {
        this.getStatusBar();
    }
    public getStatusBar(): StatusBarItem | undefined {
        if ((this.statusBarItem === undefined) && (window)) {
            this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }
        return this.statusBarItem;
    }
    public updateCalc() {
        let sBar = this.getStatusBar();
        if (sBar) {
            // Get the current text editor
            let editor = window.activeTextEditor;
            if (!editor) {
                sBar.hide();
                return;
            }
            let docContent = editor.document.getText(editor.selection);
            // Replace hex / bin
            if (docContent.length > 0) {
                let result = this.calculate(docContent);
                if (result) {
                    // Update the status bar
                    sBar.text = this.formatResult(docContent, result);
                    sBar.show();
                } else {
                    sBar.hide();
                }
            }
        }
    }

    /**
     * Formats the result
     * @param expression expression evalated
     * @param result Result of the calculation
     */
    public formatResult(expression: string | null, result: number): string {
        let s = "No result";
        if (result) {
            // Transform to hex
            let dec = result.toString(10);
            // Transform to hex
            let hex = this.numberParser.hexToString(result, false);
            // Transform to bin
            let bin = this.numberParser.binaryToString(result, false);
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
     * @return Thenable object
     */
    private iterateSelections(all: boolean, replace: boolean): Thenable<boolean> {
        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            return Promise.reject("Cannot access to editor");
        }
        const document = editor.document;
        const selections = editor.selections;
        return editor.edit((edit) => {
            for (const selection of selections) {
                if (selection.isEmpty && !all) {
                    continue;
                }
                const text = document.getText(selection);
                try {
                    let result: string;
                    if (replace) {
                        result = this.formatResult(null, this.calculate(text));
                    } else {
                        result = this.formatResult(text, this.calculate(text));
                    }
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
    public evaluateSelections(): Thenable<boolean> {
        return this.iterateSelections(true, false);
    }

    /**
     * Replaces the selection
     */
    public replaceSelections(): Thenable<boolean> {
        return this.iterateSelections(true, true);
    }

    /**
     * Shows an input panel to calculate
     */
    public showInputPanel() {
        return window.showInputBox({
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
        if (this.statusBarItem) {
            this.statusBarItem.dispose();
        }
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