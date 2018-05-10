import * as vscode from 'vscode';
import * as language from './language';

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

/**
 * Formatter class for le assemble language
 */
export class ASMLine {
    static m68kLang = new language.M68kLanguage();
    static commentLineRegExps = ASMLine.m68kLang.getAllRegExps(/.*comment\.line.*/g);
    static keywordsRegExps = ASMLine.m68kLang.getAllRegExps(/keyword.*/g);
    label: string = "";
    instruction: string = "";
    data: string = "";
    comment: string = "";
    raw: string = "";
    vscodeTextLine: any;
    parseRegexp: RegExp = /([\.]?[a-zA-Z0-9]+[:]?)?\s+([a-zA-Z0-9]*[\.]?[a-zA-Z]?)\s+([a-zA-Z0-9\.,/>()*+\-#$\s]*)/g;

    constructor(line: string) {
        this.raw = line;
        this.parse(line);
    }

    /**
     * Parse a line
     * @param line Line to parse
     */
    parse(line: string) {
        let l = line.trim();
        // To test the comment line the regexp needs an eol
        if ((l.charAt(0) === ';') || (l.charAt(0) === '*')) {
            this.comment = l;
        } else {
            // Extract comments
            let commentsPos = l.indexOf(';');
            if (commentsPos >= 0) {
                this.comment = l.substr(commentsPos);
                l = l.substr(0, commentsPos).trim();
            }
            // find a keywork
            let keyword = this.search(ASMLine.keywordsRegExps, l);
            if (keyword) {
                // A keyword has been found
                // set the keyword
                this.instruction = keyword[0];
                if (keyword.index > 0) {
                    this.label = l.substr(0, keyword.index).trim();
                }
                let endPos = keyword.index + keyword[0].length;
                this.data = l.substr(endPos).trim();
            } else {
                // no keyword
                // Consider it is a label
                this.label = l;
            }
        }
    }

    /**
     * Checks the value in a list of regexp
     * @param regexps List of regexp
     * @param value Value to test
     * @return True if it as been found
     */
    test(regexps: Array<RegExp>, value: string): boolean {
        for (let regexp of regexps) {
            if (regexp.test(value)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Search the first matched value in a list of regexp
     * @param regexps List of regexp
     * @param value Value to test
     * @return RegExpExecArray if found or null
     */
    search(regexps: Array<RegExp>, value: string): any {
        for (let regexp of regexps) {
            let r = regexp.exec(value);
            if (r) {
                return r;
            }
        }
        return null;
    }
}