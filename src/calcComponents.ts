import { StatusBarAlignment, StatusBarItem, window, Disposable, TextDocument, Selection, Range } from 'vscode';
import { NumberParser, ASMLine } from './parser';
import { ExtensionState } from './extension';

export class CalcComponent {
    private statusBarItem: StatusBarItem | undefined;
    private numberParser = new NumberParser();

    public getStatusBar(): StatusBarItem | undefined {
        return this.statusBarItem;
    }
    public activate(): void {
        if ((this.statusBarItem === undefined) && (window)) {
            this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }
    }
    public async updateCalc(): Promise<void> {
        if (ExtensionState.isActive()) {
            if (!this.statusBarItem) {
                this.activate();
            }
            if (this.statusBarItem) {
                const statusBarItemConst = this.statusBarItem;
                // Get the current text editor
                const editor = window.activeTextEditor;
                if (!editor) {
                    this.statusBarItem.hide();
                    return;
                }
                const docContent = editor.document.getText(editor.selection);
                // Replace hex / bin
                if (docContent.length > 0) {
                    const definitionHandler = ExtensionState.getCurrent().getDefinitionHandler();
                    try {
                        const result = await definitionHandler.evaluateFormula(docContent);
                        // Update the status bar
                        statusBarItemConst.text = this.formatResult(docContent, result);
                        statusBarItemConst.show();
                    } catch (err) {
                        statusBarItemConst.hide();
                    }
                }
            }
        }
    }

    /**
     * Formats the result
     * @param expression expression evaluated
     * @param result Result of the calculation
     */
    public formatResult(expression: string | null, result: number): string {
        let s = "No result";
        if (result) {
            // Transform to hex
            const dec = result.toString(10);
            // Transform to hex
            const hex = this.numberParser.hexToString(result, false);
            // Transform to bin
            const bin = this.numberParser.binaryToString(result, false);
            // Format the text
            s = "#" + dec + "/$" + hex + "/%" + bin;
        }
        return s;
    }
    /**
     * Performs the calculation
     * @param expression Expression to calculate
     */
    public async calculate(expression: string): Promise<number> {
        // call the function to calculate the expression
        const dHnd = ExtensionState.getCurrent().getDefinitionHandler();
        return await dHnd.evaluateFormula(expression);
    }

    /**
     * Iterates over the selections
     * @param all view all elections
     * @param replace Replaces the selection
     * @return Thenable object
     */
    private async iterateSelections(all: boolean, replace: boolean): Promise<void> {
        // Get the current text editor
        const editor = window.activeTextEditor;
        if (editor === undefined) {
            throw new Error("Cannot access to editor");
        } else {
            const document = editor.document;
            const selections = editor.selections;
            for (const selection of selections) {
                if (selection.isEmpty && !all) {
                    continue;
                }
                const text = document.getText(selection);
                const value = await this.calculate(text);
                if (value !== undefined) {
                    let result: string;
                    if (replace) {
                        result = this.formatResult(null, value);
                        await editor.edit((edit) => {
                            edit.replace(selection, result);
                        });
                    } else {
                        result = this.formatResult(text, value);
                        window.showInformationMessage(result);
                    }
                }
            }
        }
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
    public async showInputPanel(): Promise<void> {
        const value = await window.showInputBox({
            prompt: "Enter a Math Expression to evaluate.",
            placeHolder: "Expression"
        });
        if (value) {
            try {
                const result = await this.calculate(value);
                window.showInformationMessage(this.formatResult(value, result));
            } catch (err) {
                // do nothing
            }
        }
    }

    /**
     * Applies a formula to selected numerical values and generates edits
     */
    public async getReplaceValuesForFormula(formula: string, document: TextDocument, selections: readonly Selection[]): Promise<Array<[string, Range]>> {
        const numberParser = new NumberParser();
        const replaceValues = new Array<[string, Range]>();
        for (const selection of selections) {
            if (!selection.isEmpty) {
                for (let lineIdx = selection.start.line; lineIdx < selection.end.line + 1; lineIdx++) {
                    const line = document.lineAt(lineIdx);
                    const asmLine = new ASMLine(line.text, line);
                    const numbers = asmLine.getNumbersFromData();
                    for (let i = numbers.length - 1; i >= 0; i--) {
                        const [value, range] = numbers[i];
                        if (selection.contains(range)) {
                            const result = numberParser.parseWithType(value);
                            if (result !== null) {
                                const num = result[0];
                                const tp = result[1];
                                const modifiedFormula = formula.replace('x', num.toString());
                                const resultValue = await this.calculate(modifiedFormula);
                                replaceValues.push([numberParser.numberToTypedString(resultValue, tp), range]);
                            }
                        }
                    }
                }
            }
        }
        return replaceValues;
    }

    /**
     * Applies a formula to selected numerical values
     */
    public async applyFormulaToSelections(formula?: string): Promise<void> {
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
                const replaceValues = await this.getReplaceValuesForFormula(selectedFormula, document, selections);
                await editor.edit((edit) => {
                    for (const [value, range] of replaceValues) {
                        edit.replace(range, value);
                    }
                });
            }
        }
    }

    /**
     * Disposes the resources
     */
    dispose(): void {
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
        const subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this.onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this.onEvent, this, subscriptions);

        // update the counter for the current file
        this.calc.updateCalc();

        // create a combined disposable from both event subscriptions
        this.disposable = Disposable.from(...subscriptions);
    }

    dispose(): void {
        this.disposable.dispose();
    }

    private onEvent() {
        this.calc.updateCalc();
    }
}