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
     * @param document Document to be processed
     * @return Hover results
     */
    public async provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Hover | null> {
        const definitionHandler = ExtensionState.getCurrent().getDefinitionHandler();
        const configuration = ConfigurationHelper.getDefaultConfiguration(document.uri);
        const numberDisplayFormat = ConfigurationHelper.retrieveStringProperty(configuration, 'hover.numberDisplayFormat', M68kHoverProvider.DEFAULT_NUMBER_DISPLAY_FORMAT);
        // Parse the line
        const line = document.lineAt(position.line);
        const asmLine = new ASMLine(line.text, line);
        // Detect where is the cursor
        if (asmLine.instructionRange && asmLine.instructionRange.contains(position) && (asmLine.instruction.length > 0)) {
            let keyInstruction = asmLine.instruction;
            const idx = keyInstruction.indexOf('.');
            if (idx > 0) {
                keyInstruction = keyInstruction.substr(0, idx);
            }
            if (!token.isCancellationRequested) {
                const [hoverInstruction, hoverDirective, macro] = await Promise.all([
                    this.documentationManager.getInstruction(keyInstruction.toUpperCase()),
                    this.documentationManager.getDirective(keyInstruction.toUpperCase()),
                    definitionHandler.getMacroByName(keyInstruction)
                ]);
                const hoverElement = hoverInstruction || hoverDirective
                if (hoverElement) {
                    const hoverRendered = this.renderHover(hoverElement);
                    return new vscode.Hover(hoverRendered, asmLine.instructionRange);
                } else if (macro) {
                    const info = new vscode.MarkdownString();
                    info.appendCodeblock("(macro) " + macro.getLabel());
                    const contents = [info];
                    const description = macro.getCommentBlock();
                    if (description) {
                        const renderedLine2 = new vscode.MarkdownString();
                        renderedLine2.appendText(description);
                        contents.push(renderedLine2);
                    }
                    return new vscode.Hover(contents, asmLine.instructionRange);
                }
            }
        } else if (asmLine.dataRange && asmLine.dataRange.contains(position)) {
            // get the word
            let word = document.getWordRangeAtPosition(position);
            let prefix = "";
            if (word) {
                if (line.text.charAt(word.start.character - 1) === '.') {
                    // Extend range to include leading dot
                    word = new vscode.Range(
                        new vscode.Position(word.start.line, word.start.character - 1),
                        word.end
                    )
                    // Find previous global label
                    for (let i = word.start.line; i >= 0; i--) {
                        const match = document.lineAt(i).text.match(/^(\w+)\b/);
                        if (match) {
                            prefix = match[0];
                            break;
                        }
                    }
                }
                // Text to search in
                let text = prefix + document.getText(word);
                let rendered = await this.renderWordHover(text.toUpperCase());
                let renderedLine2 = null;
                if (!rendered) {
                    const [cpuReg, label, xref] = await Promise.all([
                        this.documentationManager.getCpuRegister(text.toUpperCase()),
                        definitionHandler.getLabelByName(text),
                        definitionHandler.getXrefByName(text)
                    ]);
                    if (cpuReg) {
                        rendered = new vscode.MarkdownString(cpuReg.detail);
                    } else if (label || xref) {
                        const symbol = label || xref;
                        const info = new vscode.MarkdownString();
                        info.appendCodeblock("(label) " + symbol?.getLabel());
                        const description = symbol?.getCommentBlock();
                        if (description) {
                            rendered = new vscode.MarkdownString();
                            rendered.appendText(description);
                            renderedLine2 = info;
                        } else {
                            rendered = info
                        }
                    } else {
                        // Translate to get the control character
                        text = document.getText(word.with(word.start.translate(undefined, -1)));
                        rendered = this.renderNumberForWord(text, numberDisplayFormat);
                    }
                } else {
                    // Is there a value next to the register ?
                    const elms = asmLine.data.split(",");
                    for (const elm of elms) {
                        if (elm.match(/[$#%@]([\dA-F]+)/i)) {
                            renderedLine2 = this.renderRegisterValue(elm);
                            if (renderedLine2) {
                                break;
                            }
                        } else if (elm.match(/[$#%@+-/*]([\dA-Z_]+)/i)) {
                            // Try to evaluate a formula
                            // Evaluate the formula value
                            try {
                                const value = await definitionHandler.evaluateFormula(elm);
                                if (value || value === 0) {
                                    renderedLine2 = this.renderRegisterValueNumber(value);
                                    if (renderedLine2) {
                                        break;
                                    }
                                }
                            } catch (err) {
                                // nothing to do
                            }
                        }
                    }
                }
                if (rendered) {
                    if (renderedLine2) {
                        return new vscode.Hover([renderedLine2, rendered], word);
                    } else {
                        return new vscode.Hover(rendered, word);
                    }
                } else {
                    // try to evaluate a formula
                    const match = /\w+/.exec(text);
                    if (match) {
                        const variable = match[0];
                        try {
                            const value = await definitionHandler.evaluateVariable(variable);
                            const renderedNumber = this.renderNumber(value, numberDisplayFormat);
                            if (renderedNumber) {
                                const searchedVar = definitionHandler.getVariableByName(document.getText(word));
                                const desc = searchedVar?.getCommentBlock();
                                if (desc) {
                                    rendered = new vscode.MarkdownString();
                                    rendered.appendText(desc);
                                    return new vscode.Hover([renderedNumber, rendered]);
                                } else {
                                    return new vscode.Hover(renderedNumber);
                                }
                            }
                        } catch (err) {
                            // nothing to do
                        }
                    }
                }
            }
        } else if ((asmLine.variable && asmLine.variableRange.contains(position)) ||
            (asmLine.value && asmLine.valueRange.contains(position))) {
            // Evaluate the variable value
            const word = document.getWordRangeAtPosition(position);
            if (word) {
                const text = document.getText(word);
                const match = /\w+/.exec(text);
                if (match) {
                    const variable = match[0];
                    try {
                        const value = await definitionHandler.evaluateVariable(variable);
                        const rendered = this.renderNumber(value, numberDisplayFormat);
                        if (rendered) {
                            return new vscode.Hover(rendered);
                        }
                    } catch (err) {
                        // nothing to do
                    }
                }
            }
        }
        return null;
    }

    /**
     * Renders a value of a register
     * @param text Text of the register
     */
    public renderRegisterValue(text: string): vscode.MarkdownString | null {
        const value = this.numberParser.parse(text);
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
        const strBit = bin.toString();
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
        const value = this.numberParser.parse(text);
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
        const dec = value.toString(10);
        // Transform to hex
        const hex = this.numberParser.hexToString(value, true);
        // Transform to bin
        const bin = this.numberParser.binaryToString(value, true);
        // Transform to octal
        const oct = this.numberParser.octalToString(value, true);
        // transform to ascii
        const ascii = this.numberParser.asciiToString(value, false);
        const str = format.replace("@dec@", dec).replace("@hex@", hex).replace("@bin@", bin).replace("@oct@", oct).replace("@ascii@", ascii);
        return new vscode.MarkdownString(str);
    }

    /**
     * Renders a Hover for a register
     * @param word Word to search
     * @return Markdown string
     */
    public async renderWordHover(word: string): Promise<vscode.MarkdownString | null> {
        const value = await this.documentationManager.get(word);
        if (value) {
            const mdStr = new vscode.MarkdownString(value);
            mdStr.isTrusted = true;
            return mdStr;
        } else {
            return null;
        }
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
