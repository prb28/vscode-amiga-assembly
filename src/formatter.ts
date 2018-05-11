import * as vscode from 'vscode';
import { ASMLine } from './parser';


/**
 * Formatter class for le assemble language
 */
export class M68kFormatter implements vscode.DocumentFormattingEditProvider {
    /**
     * Main formatting function
     * @param document Document to be formatted
     */
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        //options: vscode.FormattingOptions
        let edits: Array<vscode.TextEdit>;
        edits = [];
        let asmLinesArray = new Array<ASMLine>();
        let maxLabelSize = 0;
        let maxInstructionSize = 0;
        let maxDataSize = 0;
        let labelToInstructionDistance = 2;
        let instructionToDataDistance = 4;
        let dataToCommentsDistance = 4;
        // Parse all the lines
        for (var i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let asmLine = new ASMLine(line.text);
            asmLine.vscodeTextLine = line;
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
            if (asmLine.instruction.length > 0) {
                // Remove all the line
                edits.push(vscode.TextEdit.delete(asmLine.vscodeTextLine.range));

                let s = this.padEnd(asmLine.label, maxLabelSize + labelToInstructionDistance) + this.padEnd(asmLine.instruction, maxInstructionSize + instructionToDataDistance) + this.padEnd(asmLine.data, maxDataSize + dataToCommentsDistance) + asmLine.comment;
                edits.push(vscode.TextEdit.insert(asmLine.vscodeTextLine.range.start, s));
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