import * as vscode from 'vscode';
import { ASMLine, NumberParser } from './parser';
import { DocumentationManager, DocumentationInstruction } from './documentation';
import { ExtensionState } from './extension';
import { ConfigurationHelper } from './configurationHelper';

/**
 * Hover provider class for le assembly language
 */
export class M68kHoverProvider implements vscode.HoverProvider {
    static readonly DEFAULT_NUMBER_DISPLAY_FORMAT = "#`@dec@` - $`@hex@` - %`@bin@` @ascii@";
    documentationManager: DocumentationManager;
    numberParser = new NumberParser();
    constructor(documentationManager: DocumentationManager) {
        this.documentationManager = documentationManager;
    }
    /**
     * Main hover function
     * @param document Document to be formatted
     * @return Hover results
     */
    public async provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Hover> {
        let configuration = vscode.workspace.getConfiguration('amiga-assembly', document.uri);
        let numberDisplayFormat = ConfigurationHelper.retrieveStringProperty(configuration, 'hover.numberDisplayFormat', M68kHoverProvider.DEFAULT_NUMBER_DISPLAY_FORMAT);
        return new Promise(async (resolve, reject) => {
            // Parse the line
            let line = document.lineAt(position.line);
            let asmLine = new ASMLine(line.text, line);
            // Detect where is the cursor
            if (asmLine.instructionRange && asmLine.instructionRange.contains(position) && (asmLine.instruction.length > 0)) {
                let keyInstruction = asmLine.instruction;
                let idx = keyInstruction.indexOf('.');
                if (idx > 0) {
                    keyInstruction = keyInstruction.substr(0, idx);
                }
                if (token.isCancellationRequested) {
                    resolve();
                }
                let hoverInstruction = await this.documentationManager.getInstruction(keyInstruction.toUpperCase());
                if (hoverInstruction) {
                    let hoverRendered = this.renderHover(hoverInstruction);
                    resolve(new vscode.Hover(hoverRendered, asmLine.instructionRange));
                }
            } else if (asmLine.dataRange && asmLine.dataRange.contains(position)) {
                // get the word
                let word = document.getWordRangeAtPosition(position);
                if (word) {
                    // Text to search in
                    let text = document.getText(word);
                    let rendered = await this.renderWordHover(text.toUpperCase());
                    let renderedLine2 = null;
                    if (!rendered) {
                        // Translate to get the control character
                        text = document.getText(word.with(word.start.translate(undefined, -1)));
                        rendered = this.renderNumberForWord(text, numberDisplayFormat);
                    } else {
                        // Is there a value next to the register ?
                        let elms = asmLine.data.split(",");
                        for (let elm of elms) {
                            if (elm.match(/[$#%@]([\dA-F]+)/i)) {
                                renderedLine2 = this.renderRegisterValue(elm);
                                if (renderedLine2) {
                                    break;
                                }
                            } else if (elm.match(/[$#%@+-/*]([\dA-Z_]+)/i)) {
                                // Try to evaluate a formula
                                // Evaluate the formula value
                                let definitionHandler = ExtensionState.getCurrent().getDefinitionHandler();
                                let value = await definitionHandler.evaluateFormula(elm).catch(err => {
                                    // nothing to do
                                });
                                if (value || value === 0) {
                                    renderedLine2 = this.renderRegisterValueNumber(value);
                                    if (renderedLine2) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (rendered) {
                        if (renderedLine2) {
                            resolve(new vscode.Hover([renderedLine2, rendered], word));
                        } else {
                            resolve(new vscode.Hover(rendered, word));
                        }
                    } else {
                        // try to evaluate a formula
                        let match = /\w+/.exec(text);
                        if (match) {
                            let variable = match[0];
                            let definitionHandler = ExtensionState.getCurrent().getDefinitionHandler();
                            await definitionHandler.evaluateVariable(variable).then(value => {
                                let renderedNumber = this.renderNumber(value, numberDisplayFormat);
                                if (renderedNumber) {
                                    resolve(new vscode.Hover(renderedNumber));
                                }
                            }).catch(err => {
                                // nothing to do
                            });
                        }
                    }
                }
            } else if ((asmLine.variable && asmLine.variableRange.contains(position)) ||
                (asmLine.value && asmLine.valueRange.contains(position))) {
                // Evaluate the variable value
                let word = document.getWordRangeAtPosition(position);
                if (word) {
                    let text = document.getText(word);
                    let match = /\w+/.exec(text);
                    if (match) {
                        let variable = match[0];
                        let definitionHandler = ExtensionState.getCurrent().getDefinitionHandler();
                        await definitionHandler.evaluateVariable(variable).then(value => {
                            let rendered = this.renderNumber(value, numberDisplayFormat);
                            if (rendered) {
                                resolve(new vscode.Hover(rendered));
                            }
                        }).catch(err => {
                            // nothing to do
                        });
                    }
                }
            }
            resolve();
        });
    }

    /**
     * Renders a value of a register
     * @param text Text of the register
     */
    public renderRegisterValue(text: string): vscode.MarkdownString | null {
        let value = this.numberParser.parse(text);
        if (value) {
            return this.renderRegisterValueNumber(value);
        }
        return null;
    }
    /**
     * Renders a value of a register
     * @param value Value of the register
     */
    public renderRegisterValueNumber(value: number): vscode.MarkdownString | null {
        // Transform to bin
        let bin;
        if (value > 0) {
            bin = value.toString(2);
        } else {
            bin = (value >>> 0).toString(2);
        }
        let head = "|Bits";
        let sep = "|----";
        let row = "| ";
        let strBit = bin.toString();
        for (let i = 0; i < strBit.length; i++) {
            head += " | ";
            sep += " | ";
            row += " | ";
            head += strBit.length - i - 1;
            sep += "----";
            row += strBit.charAt(i);
        }
        head += "|\n";
        sep += "|\n";
        row += "|\n\n";
        return new vscode.MarkdownString(head + sep + row);
    }

    /**
     * Render a number if it is present
     * @param text Text to be examined
     * @param format Display format
     * @return Rendered string
     */
    public renderNumberForWord(text: string, format: string): vscode.MarkdownString | null {
        let value = this.numberParser.parse(text);
        if (value) {
            return this.renderNumber(value, format);
        }
        return null;
    }

    /**
     * Render a number if it is present
     * @param value Number to be rendered
     * @param format Display format
     * @return Rendered string
     */
    public renderNumber(value: number, format: string): vscode.MarkdownString | null {
        // Transform to hex
        let dec = value.toString(10);
        // Transform to hex
        let hex = this.numberParser.hexToString(value, true);
        // Transform to bin
        let bin = this.numberParser.binaryToString(value, true);
        // Transform to octal
        let oct = this.numberParser.octalToString(value, true);
        // transform to ascii
        let ascii = this.numberParser.asciiToString(value, false);
        let str = format.replace("@dec@", dec).replace("@hex@", hex).replace("@bin@", bin).replace("@oct@", oct).replace("@ascii@", ascii);
        return new vscode.MarkdownString(str);
    }

    /**
     * Renders a Hover for a register
     * @param word Word to search
     * @return Markdown string
     */
    public renderWordHover(word: string): Promise<vscode.MarkdownString | null> {
        return new Promise(async (resolve, _) => {
            let value = await this.documentationManager.get(word);
            if (value) {
                let mdStr = new vscode.MarkdownString(value);
                mdStr.isTrusted = true;
                resolve(mdStr);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * Renders an instruction
     * @param instruction Instruction hover rendered
     * @return String rendered
     */
    renderHover(hoverInstruction: DocumentationInstruction): vscode.MarkdownString {
        return new vscode.MarkdownString(hoverInstruction.description);
    }

    /**
     * Escapes the text to enter in markdown
     * @param text Text to escape
     * @return text escaped
     */
    escapeText(text: string): string {
        return text.replace("*", "\\*");
    }
}
