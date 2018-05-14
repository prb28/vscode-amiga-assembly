import * as vscode from 'vscode';
import { ASMLine } from './parser';


/**
 * Formatter class for the assembly language
 */
export class M68kFormatter implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {
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
     * Main range formatting function
     * @param document Document to format
     * @param options Formatting options
     * @param token token to cancel
     * @param range Range to format or undefined
     * @return edits
     */
    format(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken, range?: vscode.Range): vscode.TextEdit[] {
        //options: vscode.FormattingOptions
        let edits: Array<vscode.TextEdit>;
        edits = [];
        let asmLinesArray = new Array<ASMLine>();
        let maxLabelSize = 0;
        let maxInstructionSize = 0;
        let maxDataSize = 0;
        let configuration = vscode.workspace.getConfiguration('amiga-assembly');
        let labelToInstructionDistance = 2;
        let param = configuration.get('format.labelToInstructionDistance');
        if (param) {
            labelToInstructionDistance = Number(param);
            if (labelToInstructionDistance < 1) {
                labelToInstructionDistance = 1;
            }
        }
        let instructionToDataDistance = 4;
        param = configuration.get('format.instructionToDataDistance');
        if (param) {
            instructionToDataDistance = Number(param);
            if (instructionToDataDistance < 1) {
                instructionToDataDistance = 1;
            }
        }
        let dataToCommentsDistance = 4;
        param = configuration.get('format.dataToCommentsDistance');
        if (param) {
            dataToCommentsDistance = Number(param);
            if (dataToCommentsDistance < 1) {
                dataToCommentsDistance = 1;
            }
        }
        let localRange = range;
        if (!localRange) {
            localRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(document.lineCount - 1, 0));
        }
        // Parse all the lines
        for (var i = localRange.start.line; i <= localRange.end.line; i++) {
            if (token.isCancellationRequested) {
                return edits;
            }
            const line = document.lineAt(i);
            let asmLine = new ASMLine(line.text, line);
            asmLinesArray.push(asmLine);
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
        for (let asmLine of asmLinesArray) {
            if (token.isCancellationRequested) {
                return edits;
            }
            if (asmLine.instruction.length > 0) {
                // Remove all the lines
                if (asmLine.vscodeTextLine) {
                    edits.push(vscode.TextEdit.delete(asmLine.vscodeTextLine.range));
                    let s = this.padEnd(asmLine.label, maxLabelSize + labelToInstructionDistance) + this.padEnd(asmLine.instruction, maxInstructionSize + instructionToDataDistance) + this.padEnd(asmLine.data, maxDataSize + dataToCommentsDistance) + asmLine.comment;
                    edits.push(vscode.TextEdit.insert(asmLine.vscodeTextLine.range.start, s));
                }
            }
        }
        return edits;
    }
    /**
     * Addind pad at end of string
     * @param stringToPad String to pad
     * @param targetLength Length targetted
     * @return Padded string
     */
    padEnd(stringToPad: string, targetLength: number): string {
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
            return stringToPad + padString.slice(0, targetLength);
        }
    }
}
