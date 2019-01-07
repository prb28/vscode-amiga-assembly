import * as vscode from 'vscode';
import { ASMLine, ASMDocument } from './parser';
import { DocumentFormatterConfiguration } from './formatterConfiguration';


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
        let configuration = DocumentFormatterConfiguration.create(document.uri);
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
     * @param token Cacellation tocken
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
            let endOfLineDataPosition = asmDocument.maxLabelSize + asmDocument.maxInstructionSize + asmDocument.maxDataSize + configuration.labelToInstructionDistance + configuration.instructionToDataDistance;
            let endOfLineValuePosition = asmDocument.maxVariableSize + asmDocument.maxOperatorSize + asmDocument.maxValueSize + configuration.variableToOperatorDistance + configuration.operatorToValueDistance;
            if (configuration.preferedIntructionPosition > 0) {
                endOfLineDataPosition = (configuration.preferedIntructionPosition - 1) + asmDocument.maxInstructionSize + configuration.instructionToDataDistance + asmDocument.maxDataSize;
            }
            let endOfLineCommentPositionInst = endOfLineDataPosition + configuration.dataToCommentsDistance;
            let endOfLineCommentPositionAsgn = endOfLineValuePosition + configuration.dataToCommentsDistance;
            if (asmLine.instruction.length > 0) {
                if (asmLine.data.length > 0) {
                    if (asmLine.comment.length > 0) {
                        let commentSpaceSize: number;
                        if (configuration.preferedCommentPosition > 0) {
                            commentSpaceSize = asmDocument.maxDataSize + (configuration.preferedCommentPosition - 1) - endOfLineDataPosition;
                        } else {
                            commentSpaceSize = asmDocument.maxDataSize + configuration.dataToCommentsDistance;
                            let additionToComments = endOfLineCommentPositionAsgn - endOfLineCommentPositionInst;
                            if (additionToComments > 0) {
                                commentSpaceSize += additionToComments;
                            }
                        }
                        s = this.getEndPad(asmLine.data, commentSpaceSize);
                        range = new vscode.Range(asmLine.dataRange.end, asmLine.commentRange.start);
                        edits.push(vscode.TextEdit.replace(range, s));
                    }
                    s = this.getEndPad(asmLine.instruction, asmDocument.maxInstructionSize + configuration.instructionToDataDistance);
                    range = new vscode.Range(asmLine.instructionRange.end, asmLine.dataRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                } else if (asmLine.comment.length > 0) {
                    let commentSpaceSize: number;
                    if (configuration.preferedCommentPosition > 0) {
                        commentSpaceSize = asmDocument.maxInstructionSize + configuration.instructionToDataDistance + asmDocument.maxDataSize + (configuration.preferedCommentPosition - 1) - endOfLineDataPosition;
                    } else {
                        commentSpaceSize = asmDocument.maxInstructionSize + configuration.instructionToDataDistance + asmDocument.maxDataSize + configuration.dataToCommentsDistance;
                    }
                    s = this.getEndPad(asmLine.instruction, commentSpaceSize);
                    range = new vscode.Range(asmLine.instructionRange.end, asmLine.commentRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                }
                if (asmLine.label.length > 0) {
                    if ((asmLine.labelRange.end.character - asmLine.instructionRange.start.character) > 0) {
                        s = this.getEndPad(asmLine.label, asmDocument.maxLabelSize + configuration.labelToInstructionDistance);
                        range = new vscode.Range(asmLine.labelRange.end, asmLine.instructionRange.start);
                        edits.push(vscode.TextEdit.replace(range, s));
                        if (!asmLine.spacesBeforeLabelRange.isEmpty) {
                            edits.push(vscode.TextEdit.delete(asmLine.spacesBeforeLabelRange));
                        }
                    } else {
                        let labelSpacesSize: number;
                        if (configuration.preferedIntructionPosition > 0) {
                            labelSpacesSize = configuration.preferedIntructionPosition - 1;
                        } else {
                            labelSpacesSize = asmDocument.maxLabelSize + configuration.labelToInstructionDistance;
                        }
                        s = this.getEndPad(asmLine.label, labelSpacesSize);
                        range = new vscode.Range(asmLine.labelRange.end, asmLine.instructionRange.start);
                        edits.push(vscode.TextEdit.replace(range, s));
                        if (!asmLine.spacesBeforeLabelRange.isEmpty) {
                            edits.push(vscode.TextEdit.delete(asmLine.spacesBeforeLabelRange));
                        }
                    }
                } else {
                    let labelSpacesSize: number;
                    if (configuration.preferedIntructionPosition > 0) {
                        labelSpacesSize = configuration.preferedIntructionPosition - 1;
                    } else {
                        labelSpacesSize = asmDocument.maxLabelSize + configuration.labelToInstructionDistance;
                    }
                    s = this.getEndPad("", labelSpacesSize);
                    range = new vscode.Range(asmLine.start, asmLine.instructionRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                }
            } else if (asmLine.variable.length > 0) {
                if (asmLine.comment.length > 0) {
                    let commentSpaceSize: number;
                    if (configuration.preferedCommentPosition > 0) {
                        commentSpaceSize = asmDocument.maxValueSize + (configuration.preferedCommentPosition - 1) - endOfLineValuePosition;
                    } else {
                        let additionToComments = endOfLineCommentPositionInst - endOfLineCommentPositionAsgn;
                        commentSpaceSize = asmDocument.maxValueSize + configuration.dataToCommentsDistance;
                        if (additionToComments > 0) {
                            commentSpaceSize += additionToComments;
                        }
                    }
                    s = this.getEndPad(asmLine.value, commentSpaceSize);
                    range = new vscode.Range(asmLine.valueRange.end, asmLine.commentRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                }
                s = this.getEndPad(asmLine.operator, asmLine.operator.length + configuration.operatorToValueDistance);
                if (asmLine.valueRange.start.character - asmLine.operatorRange.end.character !== s.length) {
                    range = new vscode.Range(asmLine.operatorRange.end, asmLine.valueRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                }
                s = this.getEndPad(asmLine.variable, asmDocument.maxVariableSize + configuration.variableToOperatorDistance + (asmDocument.maxOperatorSize - asmLine.operator.length));
                if (asmLine.operatorRange.start.character - asmLine.variableRange.end.character !== s.length) {
                    range = new vscode.Range(asmLine.variableRange.end, asmLine.operatorRange.start);
                    edits.push(vscode.TextEdit.replace(range, s));
                }
            }
        }
        return edits;
    }

    /**
     * Getting the pad of the good size at the end of string
     * @param stringToPad String to pad
     * @param targetLength Length targetted
     * @return Padding string
     */
    public getEndPad(stringToPad: string, targetLength: number): string {
        let result = ' ';
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        let padString = ' ';
        if (stringToPad.length <= targetLength) {
            targetLength = targetLength - stringToPad.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            result = padString.slice(0, targetLength);
            if (result.length <= 0) {
                result = ' ';
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
                    s = this.getEndPad(asmLine.instruction, asmDocument.maxInstructionSize + configuration.instructionToDataDistance - 1);
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