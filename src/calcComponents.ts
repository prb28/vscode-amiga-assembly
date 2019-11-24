import { StatusBarAlignment, StatusBarItem, window, Disposable, TextDocument, Selection, Range } from 'vscode';
import { NumberParser, ASMLine } from './parser';
import { ExtensionState } from './extension';

export class CalcComponent {
    private statusBarItem: StatusBarItem | undefined;
    private numberParser = new NumberParser();

    public getStatusBar(): StatusBarItem | undefined {
        return this.statusBarItem;
    }
    public activate() {
        if ((this.statusBarItem === undefined) && (window)) {
            this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }
    }
    public updateCalc(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this.statusBarItem) {
                this.activate();
            }
            if (this.statusBarItem) {
                const stbar = this.statusBarItem;
                // Get the current text editor
                let editor = window.activeTextEditor;
                if (!editor) {
                    this.statusBarItem.hide();
                    resolve();
                    return;
                }
                let docContent = editor.document.getText(editor.selection);
                // Replace hex / bin
                if (docContent.length > 0) {
                    let definitionHandler = ExtensionState.getCurrent().getDefinitionHandler();
                    await definitionHandler.evaluateFormula(docContent).then(result => {
                        // Update the status bar
                        stbar.text = this.formatResult(docContent, result);
                        stbar.show();
                    }).catch(err => {
                        stbar.hide();
                    });
                }
            }
            resolve();
        });
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
        }
        return s;
    }
    /**
     * Performs the calculation
     * @param expression Expression to calculate
     */
    public calculate(expression: string): Promise<number> {
        return new Promise((resolve, reject) => {
            // call the function to calculate the expression
            let dHnd = ExtensionState.getCurrent().getDefinitionHandler();
            dHnd.evaluateFormula(expression).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Iterates over the selections
     * @param all view all elections
     * @param replace Replaces the selection
     * @return Thenable object
     */
    private iterateSelections(all: boolean, replace: boolean): Promise<void> {
        return new Promise(async (resolve, reject) => {
            // Get the current text editor
            let editor = window.activeTextEditor;
            if (editor === undefined) {
                reject(new Error("Cannot access to editor"));
            } else {
                const document = editor.document;
                const selections = editor.selections;
                await editor.edit(async (edit) => {
                    for (const selection of selections) {
                        if (selection.isEmpty && !all) {
                            continue;
                        }
                        const text = document.getText(selection);
                        try {
                            await this.calculate(text).then(value => {
                                if (value !== undefined) {
                                    let result: string;
                                    if (replace) {
                                        result = this.formatResult(null, value);
                                        edit.replace(selection, result);
                                    } else {
                                        result = this.formatResult(text, value);
                                        window.showInformationMessage(result);
                                    }
                                }
                            }).catch(err => {
                                reject(err);
                                return;
                            });
                        } catch (ex) {
                            reject(ex);
                            return;
                        }
                    }
                });
                resolve();
            }
        });
    }

    /**
     * Evaluates the selection
     */
    public evaluateSelections(): Thenable<void> {
        return this.iterateSelections(true, false);
    }

    /**
     * Replaces the selection
     */
    public replaceSelections(): Thenable<void> {
        return this.iterateSelections(true, true);
    }

    /**
     * Shows an input panel to calculate
     */
    public async showInputPanel() {
        await window.showInputBox({
            prompt: "Enter a Math Expression to evaluate.",
            placeHolder: "Expression"
        }).then((value) => {
            if (value) {
                this.calculate(value).then(result => {
                    window.showInformationMessage(this.formatResult(value, result));
                }).catch(err => {
                    // do nothing
                });
            }
        });
    }

    /**
     * Applies a formula to selected numerical values and generates edits
     */
    public async getReplaceValuesForFormula(formula: string, document: TextDocument, selections: Selection[]): Promise<Array<[string, Range]>> {
        return new Promise(async (resolve, reject) => {
            let numberParser = new NumberParser();
            let replaceValues = new Array<[string, Range]>();
            for (const selection of selections) {
                if (!selection.isEmpty) {
                    for (let lineIdx = selection.start.line; lineIdx < selection.end.line + 1; lineIdx++) {
                        const line = document.lineAt(lineIdx);
                        let asmLine = new ASMLine(line.text, line);
                        let numbers = asmLine.getNumbersFromData();
                        for (let i = numbers.length - 1; i >= 0; i--) {
                            let [value, range] = numbers[i];
                            if (selection.contains(range)) {
                                let result = numberParser.parseWithType(value);
                                if (result !== null) {
                                    let num = result[0];
                                    let tp = result[1];
                                    let modifiedFormula = formula.replace('x', num.toString());
                                    let resultValue = await this.calculate(modifiedFormula).catch(err => {
                                        reject(err);
                                    })
                                    if (resultValue) {
                                        replaceValues.push([numberParser.numberToTypedString(resultValue, tp), range]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            resolve(replaceValues);
        });
    }

    /**
     * Applies a formula to selected numerical values
     */
    public applyFormulaToSelections(formula?: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let selectedFormula: string | undefined;
            if (!formula) {
                selectedFormula = await window.showInputBox({
                    prompt: "Enter a formula to apply : 'x' is the variable",
                    placeHolder: "Formula"
                });
            } else {
                selectedFormula = formula;
            }
            if (selectedFormula) {
                // Get the current text editor
                const editor = window.activeTextEditor;
                if (editor !== undefined) {
                    const document = editor.document;
                    const selections = editor.selections;
                    // calculate all edits
                    await this.getReplaceValuesForFormula(selectedFormula, document, selections).then(async (replaceValues) => {
                        await editor.edit(async (edit) => {
                            for (let [value, range] of replaceValues) {
                                edit.replace(range, value);
                            }
                        });
                    })

                }
            }
            resolve();
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
    private calc: CalcComponent;
    private disposable: Disposable;

    constructor(calc: CalcComponent) {
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