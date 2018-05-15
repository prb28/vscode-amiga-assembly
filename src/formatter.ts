import * as vscode from 'vscode';
import { ASMLine } from './parser';


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
    provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {
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
    public provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {
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
        ch: string, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {
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
    format(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken, range?: vscode.Range, position?: vscode.Position): vscode.TextEdit[] {
        let asmLinesArray = new Array<ASMLine>();
        let maxLabelSize = 0;
        let maxInstructionSize = 0;
        let maxDataSize = 0;
        let configuration = vscode.workspace.getConfiguration('amiga-assembly');
        let labelToInstructionDistance = this.retrieveProperty(configuration, 'format.labelToInstructionDistance', 2);
        let instructionToDataDistance = this.retrieveProperty(configuration, 'format.instructionToDataDistance', 4);
        let dataToCommentsDistance = this.retrieveProperty(configuration, 'format.dataToCommentsDistance', 4);
        let localRange = range;
        if (!localRange) {
            localRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(document.lineCount - 1, 0));
        }
        // Parse all the lines
        for (var i = localRange.start.line; i <= localRange.end.line; i++) {
            if (token.isCancellationRequested) {
                return [];
            }
            const line = document.lineAt(i);
            let asmLine = new ASMLine(line.text, line);
            if ((!position) || (i == position.line)) {
                asmLinesArray.push(asmLine);
            }
            if (asmLine.instruction.length > 0) {
                if (maxLabelSize < asmLine.label.length) {
                    maxLabelSize = asmLine.label.length;
                }
                if (maxInstructionSize < asmLine.instruction.length) {
                    maxInstructionSize = asmLine.instruction.length;
                }
                if (maxDataSize < asmLine.data.length) {
                    maxDataSize = asmLine.data.length;
                }
            }
        }
        // Make the edits
        return this.computeEdits(asmLinesArray, maxLabelSize, labelToInstructionDistance, maxInstructionSize, instructionToDataDistance, maxDataSize, dataToCommentsDistance, token);
    }

    /**
     * Retrieve a configuration value
     * @param configuration Configuration
     * @param key Keyword for property
     * @param defaultValue Default value to be affected
     * @return New value
     */
    public retrieveProperty(configuration: vscode.WorkspaceConfiguration, key: string, defaultValue: number): number {
        let value = defaultValue;
        let confValue = configuration.get(key);
        if (confValue) {
            value = Number(confValue);
            if (value < 1) {
                value = 1;
            }
        }
        return value;
    }

    /**
     * Compute the edits to format the document
     * @param asmLinesArray Array of lines
     * @param token Cancellation tocken
     * @param maxLabelSize Max label size
     * @param labelToInstructionDistance Distance between a label and an instruction
     * @param maxInstructionSize Max instruction size
     * @param instructionToDataDistance Distance between an instruction and the data
     * @param maxDataSize Max data size
     * @param dataToCommentsDistance Distance between the data a comment
     * @return List of edits
     */
    public computeEdits(asmLinesArray: Array<ASMLine>, maxLabelSize: number, labelToInstructionDistance: number, maxInstructionSize: number, instructionToDataDistance: number, maxDataSize: number, dataToCommentsDistance: number, token: vscode.CancellationToken): vscode.TextEdit[] {
        let edits = new Array<vscode.TextEdit>();
        for (let asmLine of asmLinesArray) {
            if (token.isCancellationRequested) {
                return [];
            }
            edits = edits.concat(this.computeEditsForLine(asmLine, maxLabelSize, labelToInstructionDistance, maxInstructionSize, instructionToDataDistance, maxDataSize, dataToCommentsDistance));
        }
        return edits;
    }

    /**
     * Compute the edits to format the document
     * @param asmLinesArray Array of lines
     * @param token Cancellation tocken
     * @param maxLabelSize Max label size
     * @param labelToInstructionDistance Distance between a label and an instruction
     * @param maxInstructionSize Max instruction size
     * @param instructionToDataDistance Distance between an instruction and the data
     * @param maxDataSize Max data size
     * @param dataToCommentsDistance Distance between the data a comment
     * @return List of edits
     */
    public computeEditsForLine(asmLine: ASMLine, maxLabelSize: number, labelToInstructionDistance: number, maxInstructionSize: number, instructionToDataDistance: number, maxDataSize: number, dataToCommentsDistance: number): vscode.TextEdit[] {
        let edits = new Array<vscode.TextEdit>();
        let range: vscode.Range;
        let s: string;
        if (asmLine.instruction.length > 0) {
            // Remove all the lines
            if (asmLine.data.length > 0) {
                if (asmLine.comment.length > 0) {
                    s = this.getEndPad(asmLine.data, maxDataSize + dataToCommentsDistance);
                    range = new vscode.Range(asmLine.dataRange.end, asmLine.commentRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                }
                s = this.getEndPad(asmLine.instruction, maxInstructionSize + instructionToDataDistance);
                range = new vscode.Range(asmLine.instructionRange.end, asmLine.dataRange.start);
                edits.push(vscode.TextEdit.replace(range, s));
            } else if (asmLine.comment.length > 0) {
                s = this.getEndPad(asmLine.instruction, maxInstructionSize + instructionToDataDistance + maxDataSize + dataToCommentsDistance);
                range = new vscode.Range(asmLine.instructionRange.end, asmLine.commentRange.start);
                edits.push(vscode.TextEdit.replace(range, s));
            }
            if (asmLine.label.length > 0) {
                s = this.getEndPad(asmLine.label, maxLabelSize + labelToInstructionDistance);
                range = new vscode.Range(asmLine.labelRange.end, asmLine.instructionRange.start);
                edits.push(vscode.TextEdit.replace(range, s));
                edits.push(vscode.TextEdit.delete(asmLine.spacesBeforeLabelRange));
            } else {
                s = this.getEndPad("", maxLabelSize + labelToInstructionDistance);
                range = new vscode.Range(asmLine.labelRange.start, asmLine.instructionRange.start);
                edits.push(vscode.TextEdit.replace(range, s));
            }
        }
        return edits;
    }

    /**
     * Getting the pad of the goot size at the end of string
     * @param stringToPad String to pad
     * @param targetLength Length targetted
     * @return Padding string
     */
    getEndPad(stringToPad: string, targetLength: number): string {
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        let padString = ' ';
        if (stringToPad.length > targetLength) {
            return String(stringToPad);
        }
        else {
            targetLength = targetLength - stringToPad.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength);
        }
    }
}
