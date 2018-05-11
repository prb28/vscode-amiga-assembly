import * as vscode from 'vscode';
import { ASMLine, HoverInstruction } from './parser';

/**
 * Hover provider class for le assembly language
 */
export class M68kHoverProvider implements vscode.HoverProvider {
    static intructionsHoverMap: Map<string, HoverInstruction>;
    /**
     * Prepare maps for hover
     */
    static prepareMaps() {
        if (!M68kHoverProvider.intructionsHoverMap) {
            M68kHoverProvider.intructionsHoverMap = new Map<string, HoverInstruction>();
            let hoverInstruction = new HoverInstruction("");
            M68kHoverProvider.intructionsHoverMap.set(hoverInstruction.instruction, hoverInstruction);
        }
    }
    /**
     * Constructor
     */
    constructor() {
        M68kHoverProvider.prepareMaps();
    }
    /**
     * Main hover function
     * @param document Document to be formatted
     * @return Hover results
     */
    public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        // Parse the line
        let asmLine = new ASMLine(document.lineAt(position.line).text);
        let keyInstruction = asmLine.instruction;
        let idx = keyInstruction.indexOf('.');
        if (idx > 0) {
            keyInstruction = keyInstruction.substr(0, idx);
        }
        let hoverInstruction = M68kHoverProvider.intructionsHoverMap.get(keyInstruction.toUpperCase());
        if (hoverInstruction) {
            let hoverString = this.renderHover(hoverInstruction);
            return new vscode.Hover(hoverString);
        }
        return null;
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
        s += "` `" + hoverInstruction.syntax.join("` | `") + "` _(" +
            "x:" + this.escapeText(hoverInstruction.x) + "," +
            "n:" + this.escapeText(hoverInstruction.n) + "," +
            "z:" + this.escapeText(hoverInstruction.z) + "," +
            "v:" + this.escapeText(hoverInstruction.v) + "," +
            "c:" + this.escapeText(hoverInstruction.c) +
            ")_: " + this.escapeText(hoverInstruction.decription);
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
