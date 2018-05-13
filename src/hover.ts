import * as vscode from 'vscode';
import { ASMLine, HoverInstruction, HoverInstructionsManager, HoverRegistersManager } from './parser';

/**
 * Hover provider class for le assembly language
 */
export class M68kHoverProvider implements vscode.HoverProvider {
    static hoverInstructionsManager = new HoverInstructionsManager();
    static hoverRegistersManager = new HoverRegistersManager();
    registerAddressRegExp = /\$(DFF[\dA-Z]{3})/;
    registerNameRegExp = /([A-Z0-9]{6,})/g;
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
            let hoverInstructionList = M68kHoverProvider.hoverInstructionsManager.instructions.get(keyInstruction.toUpperCase());
            if (hoverInstructionList) {
                let hoverRendered = this.renderHoverList(hoverInstructionList);
                return new vscode.Hover(hoverRendered, asmLine.instructionRange);
            }
        } else if (asmLine.dataRange && asmLine.dataRange.contains(position) && (asmLine.data.length > 0)) {
            // check if it has a register address
            let data = asmLine.data.toUpperCase();
            let match = this.registerAddressRegExp.exec(data);
            if (match) {
                let hr = M68kHoverProvider.hoverRegistersManager.registersByAddress.get(match[1]);
                if (hr) {
                    let range = asmLine.dataRange;
                    let newStart = range.start.with(undefined, range.start.character + match.index);
                    let newEnd = range.end.with(undefined, range.start.character + match.index + match[1].length + 1);
                    return new vscode.Hover(hr.description, asmLine.dataRange.with(newStart, newEnd));
                }
            } else {
                let match = this.registerNameRegExp.exec(data);
                if (match) {
                    let hr = M68kHoverProvider.hoverRegistersManager.registersByName.get(match[1]);
                    if (hr) {
                        let range = asmLine.dataRange;
                        let newStart = range.start.with(undefined, range.start.character + match.index);
                        let newEnd = range.end.with(undefined, range.start.character + match.index + match[1].length);
                        return new vscode.Hover(hr.description, asmLine.dataRange.with(newStart, newEnd));
                    }
                }
            }
        }
        return null;
    }
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
