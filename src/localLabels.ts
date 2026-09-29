import { CodeAction, CodeActionContext, CodeActionKind, CodeActionProvider, Position, Range, TextDocument, TextEdit, WorkspaceEdit } from 'vscode';
import { ASMLine, ASMLineType } from './parser';

/**
 * Local labels starting with "@" (issue #369) are not supported by vasm: they are global labels and
 * a second definition is reported as "label <@name> redefined".
 * This quick fix converts them to the vasm local labels starting with ".".
 */
export class M68kLocalLabelsCodeActionProvider implements CodeActionProvider {
    public static readonly providedCodeActionKinds = [CodeActionKind.QuickFix];
    /** vasm error of a redefined "@" label */
    private static readonly REDEFINED_REGEXP = /label <@[A-Za-z_]\w*> redefined/;
    /** "@" label name */
    private static readonly LABEL_REGEXP = /^@([A-Za-z_]\w*)$/;
    /** "@" label reference: not the "\@" macro unique label, nor the end of another symbol */
    private static readonly REFERENCE_REGEXP = /(?<![\w\\@.$])@([A-Za-z_]\w*)(?!\w)/g;

    public provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext): CodeAction[] {
        const diagnostics = context.diagnostics.filter((d) => M68kLocalLabelsCodeActionProvider.REDEFINED_REGEXP.test(d.message));
        if (diagnostics.length === 0) {
            return [];
        }
        const edits = M68kLocalLabelsCodeActionProvider.computeEdits(document);
        if (edits.length === 0) {
            return [];
        }
        const action = new CodeAction("Convert the '@' local labels to '.' local labels", CodeActionKind.QuickFix);
        action.diagnostics = diagnostics;
        action.isPreferred = true;
        action.edit = new WorkspaceEdit();
        action.edit.set(document.uri, edits);
        return [action];
    }

    /**
     * Computes the edits replacing the "@" of the local labels definitions and references by "."
     * @param document Document to convert
     * @return the edits
     */
    public static computeEdits(document: TextDocument): TextEdit[] {
        const lines = new Array<ASMLine>();
        const names = new Set<string>();
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const asmLine = new ASMLine(line.text, line);
            lines.push(asmLine);
            const name = M68kLocalLabelsCodeActionProvider.getLabelName(asmLine);
            if (name) {
                names.add(name);
            }
        }
        const edits = new Array<TextEdit>();
        if (names.size === 0) {
            return edits;
        }
        for (const asmLine of lines) {
            if (M68kLocalLabelsCodeActionProvider.getLabelName(asmLine)) {
                edits.push(M68kLocalLabelsCodeActionProvider.replaceAt(asmLine.labelRange.start));
            }
            if (asmLine.data.length > 0) {
                edits.push(...M68kLocalLabelsCodeActionProvider.computeReferencesEdits(asmLine.data, asmLine.dataRange, names));
            }
            if (asmLine.value.length > 0) {
                edits.push(...M68kLocalLabelsCodeActionProvider.computeReferencesEdits(asmLine.value, asmLine.valueRange, names));
            }
        }
        return edits;
    }

    /**
     * @return the name (without "@") of the "@" label defined in the line
     */
    private static getLabelName(asmLine: ASMLine): string | undefined {
        if (asmLine.lineType === ASMLineType.COMMENT) {
            return undefined;
        }
        return M68kLocalLabelsCodeActionProvider.LABEL_REGEXP.exec(asmLine.label.replace(/:+$/, ""))?.[1];
    }

    /**
     * Computes the edits of the "@" labels references in an expression, outside of the strings
     */
    private static computeReferencesEdits(text: string, range: Range, names: Set<string>): TextEdit[] {
        const edits = new Array<TextEdit>();
        // Blank the strings to ignore their contents
        let quote: string | undefined = undefined;
        let code = "";
        for (const c of text) {
            if (quote) {
                code += " ";
                if (c === quote) {
                    quote = undefined;
                }
            } else {
                if (c === "\"" || c === "'") {
                    quote = c;
                }
                code += c;
            }
        }
        for (const match of code.matchAll(M68kLocalLabelsCodeActionProvider.REFERENCE_REGEXP)) {
            if (names.has(match[1]) && match.index !== undefined) {
                edits.push(M68kLocalLabelsCodeActionProvider.replaceAt(range.start.translate(0, match.index)));
            }
        }
        return edits;
    }

    private static replaceAt(position: Position): TextEdit {
        return TextEdit.replace(new Range(position, position.translate(0, 1)), ".");
    }
}
