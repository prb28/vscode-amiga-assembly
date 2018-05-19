import * as vscode from 'vscode';
import { ASMLine, HoverInstruction, HoverInstructionsManager, HoverRegistersManager, NumberParser } from './parser';

/**
 * Hover provider class for le assembly language
 */
export class M68kHoverProvider implements vscode.HoverProvider {
    static hoverInstructionsManager = new HoverInstructionsManager();
    static hoverRegistersManager = new HoverRegistersManager();
    numberParser = new NumberParser();
    /**
     * Main hover function
     * @param document Document to be formatted
     * @return Hover results
     */
    public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
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
                return null;
            }
            let hoverInstructionList = M68kHoverProvider.hoverInstructionsManager.instructions.get(keyInstruction.toUpperCase());
            if (hoverInstructionList) {
                let hoverRendered = this.renderHoverList(hoverInstructionList);
                return new vscode.Hover(hoverRendered, asmLine.instructionRange);
            }
        } else if (asmLine.dataRange && asmLine.dataRange.contains(position)) {
            // get the word
            let word = document.getWordRangeAtPosition(position);
            if (word) {
                // Text to search in
                let text = document.getText(word);
                let rendered = this.renderRegisterHover(text.toUpperCase());
                let renderedLine2 = null;
                if (!rendered) {
                    // Translate to get the control character
                    text = document.getText(word.with(word.start.translate(undefined, -1)));
                    rendered = this.renderNumberForWord(text);
                } else {
                    // Is there a value next to the register ?
                    let elms = asmLine.data.split(",");
                    for (let elm of elms) {
                        if (elm.match(/[$#%]([\dA-F]+)/i)) {
                            renderedLine2 = this.renderRegisterValue(elm);
                            if (renderedLine2) {
                                break;
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
        let value = this.numberParser.parse(text);
        if (value) {
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
        return null;
    }
    /**
     * Render a number if it is present
     * @param text Text to be examined
     * @return Rendered string
     */
    public renderNumberForWord(text: string): vscode.MarkdownString | null {
        let value = this.numberParser.parse(text);
        if (value) {
            // Transform to hex
            let dec = value.toString(10);
            // Transform to hex
            let hex = this.numberParser.hexToString(value);
            // Transform to bin
            let bin = this.numberParser.binaryToString(value);
            return new vscode.MarkdownString("#`" + dec + "` - $`" + hex + "` - %`" + bin + "`");
        }
        return null;
    }

    /**
     * Renders a Hover for a register
     * @param register Register to search
     * @return Markdown string
     */
    public renderRegisterHover(register: string): vscode.MarkdownString | null {
        let hr;
        if (register.length > 0) {
            hr = M68kHoverProvider.hoverRegistersManager.registersByAddress.get(register);
            if (!hr) {
                hr = M68kHoverProvider.hoverRegistersManager.registersByName.get(register);
            }
        }
        if (hr) {
            return new vscode.MarkdownString(hr.description);
        } else {
            return null;
        }
    }

    /**
     * Rendering a list of instructions
     * @param hoverInstructionList Instructions list
     */
    renderHoverList(hoverInstructionList: Array<HoverInstruction>): Array<vscode.MarkdownString> {
        let rendered = new Array<vscode.MarkdownString>();
        let firstInst = hoverInstructionList[0];
        let title = "**" + firstInst.instruction + "**: " + this.escapeText(firstInst.decription);
        rendered.push(new vscode.MarkdownString(title));
        for (let hoverInstruction of hoverInstructionList) {
            rendered.push(this.renderHover(hoverInstruction));
        }
        return rendered;
    }

    /**
     * Renders an intruction
     * @param intruction Intruction hover rendered
     * @return String rendered
     */
    renderHover(hoverInstruction: HoverInstruction): vscode.MarkdownString {
        let rendered = new vscode.MarkdownString();
        let s = "`" + hoverInstruction.instruction;
        if (hoverInstruction.size.length > 0) {
            s += "[." + hoverInstruction.size + "]";
        }
        s += "` `" + hoverInstruction.syntax + "` _(" +
            "x:" + this.escapeText(hoverInstruction.x) + "," +
            "n:" + this.escapeText(hoverInstruction.n) + "," +
            "z:" + this.escapeText(hoverInstruction.z) + "," +
            "v:" + this.escapeText(hoverInstruction.v) + "," +
            "c:" + this.escapeText(hoverInstruction.c) +
            ")_";
        return rendered.appendMarkdown(s);
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
