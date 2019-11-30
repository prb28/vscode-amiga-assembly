import * as vscode from 'vscode';
import { ASMLine, ASMDocument } from './parser';
import { DocumentFormatterConfiguration } from './formatterConfiguration';
import { StringUtils } from './stringUtils';


/**
 * Formatter class for the assembly language
 */
export class M68kFormatter implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider, vscode.OnTypeFormattingEditProvider {
    /**
     * Main formatting function
     * @param document Document to format
     * @param range Range to format or undefined
     * @param options Formatting options
     * @param token token to cancel
     * @return edits
     */
    provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        return this.format(document, options, token);
    }

    /**
     * Main range formatting function
     * @param document Document to format
     * @param range Range to format or undefined
     * @param options Formatting options
     * @param token token to cancel
     * @return edits
     */
    public provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        return this.format(document, options, token, range);
    }

    /**
     * Main range formatting on typing
     * @param document Document to format
     * @param position Position in the document
     * @param ch Chain to format
     * @param options Formatting options
     * @param token token to cancel
     * @return edits
     */
    public provideOnTypeFormattingEdits(document: vscode.TextDocument, position: vscode.Position,
        ch: string, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        return this.format(document, options, token, undefined, position);
    }

    /**
     * Main range formatting function
     * @param document Document to format
     * @param options Formatting options
     * @param token token to cancel
     * @param range Range to format or undefined
     * @param position in case of on type format
     * @return edits
     */
    format(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken, range?: vscode.Range, position?: vscode.Position): vscode.ProviderResult<vscode.TextEdit[]> {
        let configuration = DocumentFormatterConfiguration.create(document.uri, options.tabSize);
        let asmDocument = new ASMDocument();
        asmDocument.parse(document, configuration, token, range, position);
        // Compute the edits
        if (asmDocument.onTypeAsmLine && position) {
            return this.computeEditsForLineOnType(asmDocument, asmDocument.onTypeAsmLine, configuration, position);
        } else {
            return this.computeEdits(asmDocument, configuration, token);
        }
    }

    /**
     * Compute the edits to format the document
     * @param asmDocument Parsed Document
     * @param configuration Configuration for the formatter
     * @param token Cancellation token
     * @return List of edits
     */
    public computeEdits(asmDocument: ASMDocument, configuration: DocumentFormatterConfiguration, token: vscode.CancellationToken): vscode.TextEdit[] {
        let edits = new Array<vscode.TextEdit>();
        for (let asmLine of asmDocument.asmLinesArray) {
            if (token.isCancellationRequested) {
                return [];
            }
            edits = edits.concat(this.computeEditsForLine(asmDocument, asmLine, configuration));
        }
        return edits;
    }

    /**
     * Compute the edits to format the document
     * @param asmDocument Parsed Document
     * @param asmLine Line to process
     * @param configuration Configuration for the formatter
     * @return List of edits
     */
    public computeEditsForLine(asmDocument: ASMDocument, asmLine: ASMLine, configuration: DocumentFormatterConfiguration): vscode.TextEdit[] {
        let edits = new Array<vscode.TextEdit>();
        if (!asmDocument.isOversized(asmLine)) {
            let range: vscode.Range;
            let s: string;
            if (asmLine.instruction.length > 0) {
                if (asmLine.data.length > 0) {
                    if (asmLine.comment.length > 0) {
                        s = this.getEndPad(asmLine.data, asmDocument.dataColumn, asmDocument.commentColumn, asmDocument.useTabs, asmDocument.tabSize);
                        range = new vscode.Range(asmLine.dataRange.end, asmLine.commentRange.start);
                        edits.push(vscode.TextEdit.replace(range, s));
                    }
                    s = this.getEndPad(asmLine.instruction, asmDocument.instructionColumn, asmDocument.dataColumn, asmDocument.useTabs, asmDocument.tabSize);
                    range = new vscode.Range(asmLine.instructionRange.end, asmLine.dataRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                } else if (asmLine.comment.length > 0) {
                    s = this.getEndPad(asmLine.instruction, asmDocument.instructionColumn, asmDocument.commentColumn, asmDocument.useTabs, asmDocument.tabSize);
                    range = new vscode.Range(asmLine.instructionRange.end, asmLine.commentRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                }
                if (asmLine.label.length > 0) {
                    s = this.getEndPad(asmLine.label, asmDocument.labelColumn, asmDocument.instructionColumn, asmDocument.useTabs, asmDocument.tabSize);
                    range = new vscode.Range(asmLine.labelRange.end, asmLine.instructionRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                    if (!asmLine.spacesBeforeLabelRange.isEmpty) {
                        edits.push(vscode.TextEdit.delete(asmLine.spacesBeforeLabelRange));
                    }
                } else {
                    s = this.getEndPad("", asmDocument.labelColumn, asmDocument.instructionColumn, asmDocument.useTabs, asmDocument.tabSize);
                    range = new vscode.Range(asmLine.start, asmLine.instructionRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                }
            } else if (asmLine.variable.length > 0) {
                if (asmLine.comment.length > 0) {
                    s = this.getEndPad(asmLine.value, asmDocument.valueColumn, asmDocument.commentColumn, asmDocument.useTabs, asmDocument.tabSize);
                    range = new vscode.Range(asmLine.valueRange.end, asmLine.commentRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                }
                let operatorLeftPadSize = asmDocument.maxOperatorSize - asmLine.operator.length;
                s = this.getEndPad(asmLine.operator, asmDocument.operatorColumn, asmDocument.valueColumn, asmDocument.useTabs, asmDocument.tabSize);
                if (!asmDocument.useTabs && operatorLeftPadSize > 0 && s.length > operatorLeftPadSize) {
                    s = s.substring(operatorLeftPadSize);
                }
                range = new vscode.Range(asmLine.operatorRange.end, asmLine.valueRange.start);
                edits.push(vscode.TextEdit.replace(range, s));
                s = this.getEndPad(asmLine.variable, asmDocument.variableColumn, asmDocument.operatorColumn, asmDocument.useTabs, asmDocument.tabSize);
                if (!asmDocument.useTabs && operatorLeftPadSize > 0) {
                    s = StringUtils.padStart(s, s.length + operatorLeftPadSize);
                }
                range = new vscode.Range(asmLine.variableRange.end, asmLine.operatorRange.start);
                edits.push(vscode.TextEdit.replace(range, s));
            }
        }
        return edits;
    }

    /**
     * Getting the pad of the good size at the end of string
     * @param stringToPad String to pad
     * @param targetLength Length targeted
     * @return Padding string
     */
    public getEndPad(stringToPad: string, startColumn: number, endColumn: number, useTabs: boolean, tabSize: number): string {
        let result;
        if (useTabs) {
            let padStartColumnTabIndex = Math.floor((startColumn + stringToPad.length) / tabSize);
            let padEndColumnTabIndex = Math.ceil(endColumn / tabSize);
            let tabsCount = padEndColumnTabIndex - padStartColumnTabIndex;
            if (tabsCount > 0) {
                result = "\t".repeat(tabsCount);
            } else {
                result = "\t";
            }
        } else {
            result = StringUtils.createPad(stringToPad, endColumn - startColumn);
            if (result.length <= 0) {
                result = " ";
            }
        }
        return result;
    }

    /**
     * Compute the edits to format the document
     * @param asmDocument Parsed Document
     * @param asmLinesArray Array of lines
     * @param configuration Configuration for the formatter
     * @param position Editing position
     * @return List of edits
     */
    public computeEditsForLineOnType(asmDocument: ASMDocument, asmLine: ASMLine, configuration: DocumentFormatterConfiguration, position: vscode.Position): vscode.TextEdit[] {
        let edits = new Array<vscode.TextEdit>();
        if (asmLine.instruction.length > 0) {
            let s: string;
            if (position.isAfter(asmLine.instructionRange.end)) {
                if (asmLine.data.length <= 0) {
                    s = this.getEndPad(asmLine.instruction, asmDocument.instructionColumn, asmDocument.dataColumn, asmDocument.useTabs, asmDocument.tabSize);
                    edits.push(vscode.TextEdit.insert(asmLine.instructionRange.end, s));
                    return edits;
                }
            }
            // Call standard format
            edits = this.computeEditsForLine(asmDocument, asmLine, configuration);
        }
        return edits;
    }
}