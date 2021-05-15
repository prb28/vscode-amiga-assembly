import { Position, Range, TextLine, TextDocument, CancellationToken } from 'vscode';
import { M68kLanguage } from './language';
import { DocumentFormatterConfiguration } from './formatterConfiguration';
import { StringUtils } from './stringUtils';

export enum ASMLineType {
    ASSIGNMENT, // Line containing an assignment with or without comment
    INSTRUCTION, // Line containing with or without comment and data
    COMMENT, // Line containing only a comment
    LABEL, // Line containing a label with or without comment
    OTHER
}

/**
 * Formatter class for le assemble language
 */
export class ASMLine {
    static m68kLang?: M68kLanguage;
    static keywordsRegExps?: Array<RegExp>;
    static macrosRegExps?: Array<RegExp>;
    label = "";
    instruction = "";
    data = "";
    comment = "";
    raw = "";
    start: Position;
    end: Position;
    variable = "";
    operator = "";
    value = "";
    spacesBeforeLabelRange: Range;
    labelRange: Range;
    spacesLabelToInstructionRange: Range;
    instructionRange: Range;
    spacesInstructionToDataRange: Range;
    dataRange: Range;
    spacesDataToCommentRange: Range;
    commentRange: Range;
    variableRange: Range;
    operatorRange: Range;
    valueRange: Range;
    lineType: ASMLineType;

    vscodeTextLine?: TextLine;

    public static init(language: M68kLanguage): void {
        if (!ASMLine.m68kLang) {
            ASMLine.m68kLang = language;
            ASMLine.keywordsRegExps = ASMLine.m68kLang.getAllRegExps(/keyword.*/g);
            ASMLine.macrosRegExps = ASMLine.m68kLang.getAllRegExps(/macro.*/g);
        }
    }

    /**
     * Constructor
     * @param line Text of the line
     * @param vscodeTextLine Line for vscode
     */
    constructor(line: string, vscodeTextLine?: TextLine) {
        this.lineType = ASMLineType.OTHER;
        this.raw = line;
        this.vscodeTextLine = vscodeTextLine;
        let lineNumber = 0;
        if (vscodeTextLine) {
            lineNumber = vscodeTextLine.lineNumber;
        }
        this.start = new Position(lineNumber, 0);
        this.end = new Position(lineNumber, line.length);
        this.spacesBeforeLabelRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.labelRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.spacesLabelToInstructionRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.instructionRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.spacesInstructionToDataRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.dataRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.spacesDataToCommentRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.commentRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.variableRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.operatorRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.valueRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, 0));
        this.parse(line, lineNumber);
    }

    /**
     * Parse a line
     * @param line Line to parse
     * @param lineNumber index of the line in document
     */
    parse(line: string, lineNumber: number): void {
        let l = line.trim();
        let leadingSpacesCount = line.search(/\S/);
        let current = new Position(lineNumber, 0);
        let next: Position;
        if (leadingSpacesCount < 0) {
            leadingSpacesCount = 0;
        } else {
            next = new Position(lineNumber, leadingSpacesCount);
            this.spacesBeforeLabelRange = new Range(current, next);
            current = next;
        }
        // To test the comment line the regexp needs an eol
        if ((l.charAt(0) === ';') || (l.charAt(0) === '*')) {
            this.comment = l;
            this.commentRange = new Range(new Position(lineNumber, leadingSpacesCount), new Position(lineNumber, leadingSpacesCount + l.length));
            this.lineType = ASMLineType.COMMENT;
        } else {
            // Extract comments
            let searchAssignmentString = line;
            let inQuotes = false;
            let commentPosInInputLine = -1;
            for (let i = 0; i < line.length; i++) {
                const c = line.charAt(i);
                if (c === "\"") {
                    inQuotes = !inQuotes;
                } else if (!inQuotes && (c === ";")) {
                    commentPosInInputLine = i;
                    break;
                }
            }
            if (commentPosInInputLine >= 0) {
                this.comment = line.substring(commentPosInInputLine).trim();
                searchAssignmentString = line.substring(0, commentPosInInputLine);
                l = searchAssignmentString.trim();
                this.commentRange = new Range(new Position(lineNumber, commentPosInInputLine), new Position(lineNumber, commentPosInInputLine + this.comment.length));
            }
            // Find if it is an assignment
            if (this.parseAssignment(searchAssignmentString, lineNumber)) {
                this.lineType = ASMLineType.ASSIGNMENT;
                return;
            }
            // find a keyword
            // remove quotes
            let searchInstructionString = l;
            let keywordIndex = 0;
            if (leadingSpacesCount === 0) {
                // Fist word must be a label
                const sPos = line.search(/\s/);
                if (sPos > 0) {
                    searchInstructionString = searchInstructionString.substring(sPos);
                    keywordIndex = sPos;
                }
            }
            let qPos = searchInstructionString.indexOf("\"");
            if (qPos > 0) {
                searchInstructionString = searchInstructionString.substring(0, qPos);
            }
            qPos = searchInstructionString.indexOf("'");
            if (qPos > 0) {
                searchInstructionString = searchInstructionString.substring(0, qPos);
            }
            let keyword: RegExpExecArray | null = null;
            if (ASMLine.keywordsRegExps) {
                keyword = this.search(ASMLine.keywordsRegExps, searchInstructionString);
            }
            if ((!keyword || !searchInstructionString.startsWith(keyword[0])) && leadingSpacesCount !== 0 && ASMLine.macrosRegExps) {
                // it's not a keyword - this could be a macro if there are leading spaces
                // Consider it is a label if there are no leading spaces
                keyword = this.search(ASMLine.macrosRegExps, searchInstructionString);
            }
            if (keyword) {
                // A keyword has been found
                // set the keyword
                this.lineType = ASMLineType.INSTRUCTION;
                this.instruction = keyword[0];
                keywordIndex += keyword.index;
                let startInInputLine = leadingSpacesCount + keywordIndex;
                const endInInputLine = startInInputLine + this.instruction.length;
                this.instructionRange = new Range(new Position(lineNumber, startInInputLine), new Position(lineNumber, endInInputLine));
                if (keywordIndex > 0) {
                    this.label = l.substring(0, keywordIndex).trim();
                    next = new Position(lineNumber, leadingSpacesCount + this.label.length);
                    this.labelRange = new Range(current, next);
                    current = next;
                    next = this.instructionRange.start;
                    this.spacesLabelToInstructionRange = new Range(current, next);
                }
                current = this.instructionRange.end;
                const endInTrimLine = keywordIndex + keyword[0].length;
                const dataStr = l.substring(endInTrimLine);
                this.data = dataStr.trim();
                if (this.data.length > 0) {
                    startInInputLine = this.instructionRange.end.character + dataStr.indexOf(this.data);
                    next = new Position(lineNumber, startInInputLine);
                    this.spacesInstructionToDataRange = new Range(current, next);
                    current = next;
                    next = new Position(lineNumber, startInInputLine + this.data.length);
                    this.dataRange = new Range(current, next);
                    current = next;
                }
                if (this.comment.length > 0) {
                    this.spacesDataToCommentRange = new Range(current, this.commentRange.start);
                }
            } else {
                // no keyword
                const startPosValue = leadingSpacesCount;
                let lastPos = startPosValue;
                let pos = 0;
                const regexp = /([^\s]+)/g;
                let match = regexp.exec(l);
                while (match) {
                    const word = match[0];
                    const startPos = startPosValue + match.index;
                    const endPos = startPos + word.length;
                    const spacesCount = startPos - lastPos;
                    const range = new Range(new Position(lineNumber, startPos), new Position(lineNumber, endPos));
                    if (pos === 0) {
                        if (leadingSpacesCount <= 0) {
                            this.label = word;
                            this.labelRange = range;
                        } else {
                            this.instruction = word;
                            this.instructionRange = range;
                        }
                    } else if (pos === 1) {
                        this.instruction = word;
                        this.instructionRange = range;
                        this.spacesLabelToInstructionRange = new Range(new Position(lineNumber, endPos), new Position(lineNumber, endPos + spacesCount));
                    } else {
                        this.data = word;
                        this.dataRange = range;
                        this.spacesInstructionToDataRange = new Range(new Position(lineNumber, endPos), new Position(lineNumber, endPos + spacesCount));
                        break;
                    }
                    lastPos = endPos;
                    pos++;
                    match = regexp.exec(l)
                }
                if (pos > 1) {
                    this.lineType = ASMLineType.INSTRUCTION;
                } else {
                    this.lineType = ASMLineType.LABEL;
                }
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
        for (const regexp of regexps) {
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
    search(regexps: Array<RegExp>, value: string): RegExpExecArray | null {
        let firstMatch: RegExpExecArray | null = null;
        for (const regexp of regexps) {
            const r = regexp.exec(value);
            if (r) {
                if (firstMatch !== null) {
                    // Which one is the first in the line
                    if (r.index < firstMatch.index) {
                        firstMatch = r;
                    }
                } else {
                    firstMatch = r;
                }
            }
        }
        return firstMatch;
    }

    /**
     * Check if it is an assignment and parses it
     * @return true if it is an assignment
     */
    public parseAssignment(line: string, lineNumber: number): boolean {
        const regexp = /^([a-z0-9\-_]*)[\s]*(=|[\s][a-z]?equ(\.[a-z])?[\s])[\s]*(.*)/gi;
        const match = regexp.exec(line);
        if (match !== null) {
            this.variable = match[1].trim();
            this.operator = match[2].trim();
            this.value = match[4].trim();
            this.variableRange = new Range(new Position(lineNumber, 0), new Position(lineNumber, this.variable.length));
            const startPosOperator = line.indexOf(this.operator);
            const endPosOperator = startPosOperator + this.operator.length;
            this.operatorRange = new Range(new Position(lineNumber, startPosOperator), new Position(lineNumber, endPosOperator));
            const startPosValue = endPosOperator + line.substring(endPosOperator).indexOf(this.value);
            const endPosValue = startPosValue + this.value.length;
            this.valueRange = new Range(new Position(lineNumber, startPosValue), new Position(lineNumber, endPosValue));
            return true;
        }
        return false;
    }

    /**
     * Returns the symbol retrieved from a label.
     * 
     * @return the symbol string and the range, otherwise undefined
     */
    public getSymbolFromLabelOrVariable(): [string | undefined, Range | undefined] {
        if (this.variable.length > 0) {
            return [this.variable, this.variableRange];
        } else if (this.label.length > 0) {
            const elements = this.label.split(/(\s)*(=|[a-z]?equ(.[a-z])?|:)(\s)*/gi);
            const symbol = elements[0].trim();
            const sPos = this.label.indexOf(symbol);
            if (sPos !== undefined) {
                const range = new Range(new Position(this.labelRange.start.line, sPos), new Position(this.labelRange.end.line, sPos + symbol.length));
                return [symbol, range];
            }
        }
        return [undefined, undefined];
    }

    /**
     * Returns the symbol retrieved from a data.
     * 
     * @return the symbol string and the range, otherwise undefined
     */
    public getSymbolFromData(): Array<[string, Range]> {
        const symbols = new Array<[string, Range]>();
        if (this.data.length > 0) {
            const reg = /([a-z.]+[a-z0-9_.]*|[0-9]+[a-z]+[a-z0-9_.]*)/gi;
            let match = reg.exec(this.data);
            while (match) {
                const symbol = match[0];
                const startPos = this.dataRange.start.character + match.index;
                const range = new Range(new Position(this.dataRange.start.line, startPos), new Position(this.dataRange.end.line, startPos + symbol.length));
                symbols.push([symbol, range]);
                match = reg.exec(this.data)
            }
        }
        return symbols;
    }

    /**
     * Returns the registers retrieved from a data.
     * 
     * @param registersRange range of registers: format d1-d7
     * @return a list of registers found
     */
    public getRegistersFromRegistersRange(registersRange: string): Array<string> {
        const registers = new Array<string>();
        const reg = /^([ad][0-7])-([ad]?[0-7])$/gi;
        const match = reg.exec(registersRange);
        if (match) {
            const start = match[1];
            const end = match[2];
            const startKey = start.charAt(0);
            const startIndex = parseInt(start.charAt(1));
            let endIndex = 0;
            let endKey;
            if (end.length > 1) {
                endKey = end.charAt(0);
                endIndex = parseInt(end.charAt(1));
            } else {
                endIndex = parseInt(end.charAt(0));
            }
            if (endKey && endKey !== startKey) {
                for (let i = startIndex; i < 8; i++) {
                    registers.push(`${startKey}${i}`);
                }
                for (let i = 0; i <= endIndex; i++) {
                    registers.push(`${endKey}${i}`);
                }
            } else {
                for (let i = startIndex; i <= endIndex; i++) {
                    registers.push(`${startKey}${i}`);
                }
            }
        }
        return registers;
    }

    /**
     * Returns the registers retrieved from a data.
     * 
     * @return a list of registers found
     */
    public getRegistersFromData(): Array<string> {
        const registers = new Array<string>();
        if (this.data.length > 0) {
            const reg = /(^|[(,\s/])([ad][0-7](-[ad]?[0-7])?)/gi;
            let match = reg.exec(this.data);
            while (match) {
                const value = match[2].toLowerCase();
                const regRegistersRange = /^[ad][0-7]-[ad]?[0-7]$/gi;
                if (value.match(regRegistersRange)) {
                    const lRegisters = this.getRegistersFromRegistersRange(value);
                    for (const r of lRegisters) {
                        if (registers.indexOf(r) < 0) {
                            registers.push(r);
                        }
                    }
                } else {
                    if (registers.indexOf(value) < 0) {
                        registers.push(value);
                    }
                }
                match = reg.exec(this.data);
            }
        }
        return registers.sort();
    }

    /**
     * Returns the numbers retrieved from a data.
     * 
     * @return a list of registers found
     */
    public getNumbersFromData(): Array<[string, Range]> {
        const numbers = new Array<[string, Range]>();
        if (this.data.length > 0) {
            const numberParser = new NumberParser();
            const reg = /([\w$#%@-]+)/g;
            let match = reg.exec(this.data);
            // Match all words
            while (match) {
                const value = match[0];
                if (numberParser.parse(value) !== null) {
                    const startPos = this.dataRange.start.character + match.index;
                    const range = new Range(new Position(this.dataRange.start.line, startPos), new Position(this.dataRange.end.line, startPos + value.length));
                    numbers.push([value, range]);
                }
                match = reg.exec(this.data)
            }
        }
        return numbers;
    }
}

export enum NumberType {
    HEX, DEC, OCT, BIN, REF
}

export class NumberParser {
    /**
     * Parses a number in a word
     * @param word Word to parse
     */
    public parse(word: string): number | null {
        const parsedValue = this.parseWithType(word);
        if (parsedValue) {
            return parsedValue[0];
        }
        return null;
    }

    /**
     * Parses a number in a word
     * @param word Word to parse
     */
    public parseWithType(word: string): [number, NumberType] | null {
        const hexValueRegExp = /[#]?\$([\da-z]+)/i;
        const decValueRegExp = /[#]?([-]?[\d]+)/;
        const octValueRegExp = /@(\d+)/;
        const binValueRegExp = /%([01]*)/;
        // look for an hex value
        let match = hexValueRegExp.exec(word);
        if (match) {
            if (match[0].startsWith("#")) {
                return [parseInt(match[1], 16), NumberType.REF];
            } else {
                return [parseInt(match[1], 16), NumberType.HEX];
            }
        }
        // look for an octal value
        match = octValueRegExp.exec(word);
        if (match) {
            return [parseInt(match[1], 8), NumberType.OCT];
        }
        // look for a binary value
        match = binValueRegExp.exec(word);
        if (match) {
            return [parseInt(match[1], 2), NumberType.BIN];
        }
        // look for a decimal value
        match = decValueRegExp.exec(word);
        if (match) {
            return [parseInt(match[1], 10), NumberType.DEC];
        }
        return null;
    }

    /**
     * Parses the type of a number in string.
     * @param word Number to parse
     * @return Type or null
     */
    public parseType(word: string): NumberType | null {
        const parsedValue = this.parseWithType(word);
        if (parsedValue) {
            return parsedValue[1];
        }
        return null;
    }

    public transformToDecimal(text: string): string {
        const hexValueRegExp = /\$([\da-z]+)/gi;
        const octValueRegExp = /@(\d+)/g;
        const binValueRegExp = /%([01]*)/g;
        let transformed = text;
        // look for an hex value
        let match = hexValueRegExp.exec(transformed);
        while (match) {
            for (let i = 1; i < match.length; i++) {
                const s = match[i];
                const v = parseInt(s, 16);
                transformed = transformed.replace("$" + s, v.toString());
            }
            match = hexValueRegExp.exec(transformed);
        }
        // look for an octal value
        match = octValueRegExp.exec(transformed);
        while (match) {
            for (let i = 1; i < match.length; i++) {
                const s = match[i];
                const v = parseInt(s, 8);
                transformed = transformed.replace("@" + s, v.toString());
            }
            match = octValueRegExp.exec(transformed);
        }
        // look for a binary value
        match = binValueRegExp.exec(transformed);
        while (match) {
            for (let i = 1; i < match.length; i++) {
                const s = match[i];
                const v = parseInt(s, 2);
                transformed = transformed.replace("%" + s, v.toString());
            }
            match = binValueRegExp.exec(transformed);
        }
        // replace all decimal marks
        transformed = transformed.replace("#", "");
        return transformed;
    }

    chunk(str: string, len: number): Array<string> {
        const size = Math.ceil(str.length / len);
        const ret = new Array<string>(size);
        let i;
        let pos = size - 1;
        let startPos = str.length - len;
        let lastStartPos = str.length;
        for (i = 0; i < size - 1; i++) {
            ret[pos] = str.substring(startPos, lastStartPos);
            lastStartPos = startPos;
            startPos -= len;
            pos--;
        }
        const end = startPos + len;
        ret[0] = str.substring(0, end);
        return ret;
    }

    public numberToTypedString(num: number, numberType: NumberType): string {
        switch (numberType) {
            case NumberType.BIN:
                return "%" + this.binaryToString(num, false);
            case NumberType.DEC:
                return "#" + num.toString();
            case NumberType.HEX:
                return "$" + this.hexToString(num, false);
            case NumberType.OCT:
                return "@" + this.octalToString(num, false);
            case NumberType.REF:
                return "#$" + this.hexToString(num, false);
        }
    }

    public binaryToString(num: number, chunk: boolean): string {
        let bin;
        if (num < 0) {
            bin = (num >>> 0).toString(2);
        } else {
            bin = num.toString(2);
        }
        if (chunk) {
            return this.chunk(bin, 8).join('.');
        } else {
            return bin;
        }
    }

    public asciiToString(num: number, chunk: boolean): string {
        let asciiContents = StringUtils.convertInt32ToASCII(num);
        if (chunk) {
            asciiContents = this.chunk(asciiContents, 4).join(' ');
        }
        return asciiContents;
    }

    public octalToString(num: number, chunk: boolean): string {
        let oct;
        if (num < 0) {
            oct = (num >>> 0).toString(8);
        } else {
            oct = num.toString(8);
        }
        if (chunk) {
            return this.chunk(oct, 4).join('.');
        } else {
            return oct;
        }
    }

    public hexToString(num: number, chunk: boolean): string {
        let hex;
        if (num < 0) {
            hex = (num >>> 0).toString(16);
        } else {
            hex = num.toString(16);
        }
        if (chunk) {
            return this.chunk(hex, 4).join('.');
        } else {
            return hex;
        }
    }
}

export class ASMDocument {
    public asmLinesArray = new Array<ASMLine>();
    public oversizedCommentLine = new Array<ASMLine>();
    public maxLabelSize = 0;
    public maxInstructionSize = 0;
    public maxDataSize = 0;
    public maxVariableSize = 0;
    public maxOperatorSize = 0;
    public maxValueSize = 0;
    public onTypeAsmLine?: ASMLine;
    public useTabs = false;
    public tabSize = 4;
    public labelColumn = 0;
    public instructionColumn = 0;
    public dataColumn = 0;
    public commentColumn = 0;
    public variableColumn = 0;
    public operatorColumn = 0;
    public valueColumn = 0;
    public assignmentCommentColumn = 0;

    /**
     * Main range parse function
     * @param document Document to format
     * @param formatterConfiguration Formatter configuration
     * @param token token to cancel
     * @param range Range to format or undefined
     * @param position in case of on type format
     */
    public parse(document: TextDocument, formatterConfiguration: DocumentFormatterConfiguration, token?: CancellationToken, range?: Range, position?: Position): void {
        this.useTabs = formatterConfiguration.useTabs;
        let localRange = range;
        if (document.lineCount <= 0) {
            return;
        }
        if (!localRange) {
            localRange = new Range(new Position(0, 0), new Position(document.lineCount - 1, 0));
        }
        // Parse all the lines
        for (let i = localRange.start.line; i <= localRange.end.line; i++) {
            let isOversized = false;
            if (token && token.isCancellationRequested) {
                return;
            }
            const line = document.lineAt(i);
            const asmLine = new ASMLine(line.text, line);
            if (position && (i === position.line)) {
                this.onTypeAsmLine = asmLine;
            } else {
                this.asmLinesArray.push(asmLine);
            }
            if ((formatterConfiguration.preferredCommentPosition > 0) || (formatterConfiguration.preferredInstructionPosition > 0)) {
                // Check if it is a oversized line
                const endOfLineCommentPositionInst = asmLine.label.length + asmLine.instruction.length + asmLine.data.length +
                    formatterConfiguration.labelToInstructionDistance + formatterConfiguration.instructionToDataDistance + formatterConfiguration.dataToCommentsDistance;
                if (((formatterConfiguration.preferredCommentPosition > 0) && (endOfLineCommentPositionInst > formatterConfiguration.preferredCommentPosition)) ||
                    ((formatterConfiguration.preferredInstructionPosition > 0) && (asmLine.label.length + formatterConfiguration.labelToInstructionDistance >= formatterConfiguration.preferredInstructionPosition))) {
                    this.oversizedCommentLine.push(asmLine);
                    isOversized = true;
                }
            }
            if (!isOversized) {
                if (asmLine.instruction.length > 0) {
                    if (this.maxLabelSize < asmLine.label.length) {
                        this.maxLabelSize = asmLine.label.length;
                    }
                    if (this.maxInstructionSize < asmLine.instruction.length) {
                        this.maxInstructionSize = asmLine.instruction.length;
                    }
                    if (this.maxDataSize < asmLine.data.length) {
                        this.maxDataSize = asmLine.data.length;
                    }
                } else if (asmLine.variable.length > 0) {
                    if (this.maxVariableSize < asmLine.variable.length) {
                        this.maxVariableSize = asmLine.variable.length;
                    }
                    if (this.maxValueSize < asmLine.value.length) {
                        this.maxValueSize = asmLine.value.length;
                    }
                    if (this.maxOperatorSize < asmLine.operator.length) {
                        this.maxOperatorSize = asmLine.operator.length;
                    }
                }
            }
        }
        this.tabSize = formatterConfiguration.tabSize;
        if (formatterConfiguration.preferredInstructionPosition > 0) {
            this.instructionColumn = formatterConfiguration.preferredInstructionPosition;
        } else {
            this.instructionColumn = this.maxLabelSize + formatterConfiguration.labelToInstructionDistance;
        }
        this.instructionColumn = this.fitToTabColumn(this.instructionColumn);
        this.dataColumn = this.instructionColumn + this.maxInstructionSize + formatterConfiguration.instructionToDataDistance;
        this.dataColumn = this.fitToTabColumn(this.dataColumn);
        if (formatterConfiguration.preferredCommentPosition > 0) {
            this.commentColumn = formatterConfiguration.preferredCommentPosition;
        } else {
            this.commentColumn = this.dataColumn + this.maxDataSize + formatterConfiguration.dataToCommentsDistance;
        }
        this.commentColumn = this.fitToTabColumn(this.commentColumn);
        this.operatorColumn = this.maxVariableSize + formatterConfiguration.variableToOperatorDistance;
        this.operatorColumn = this.fitToTabColumn(this.operatorColumn);
        this.valueColumn = this.operatorColumn + this.maxOperatorSize + formatterConfiguration.operatorToValueDistance;
        this.valueColumn = this.fitToTabColumn(this.valueColumn);
        if (formatterConfiguration.preferredCommentPosition > 0) {
            this.assignmentCommentColumn = formatterConfiguration.preferredCommentPosition;
        } else {
            this.assignmentCommentColumn = this.valueColumn + this.maxValueSize + formatterConfiguration.dataToCommentsDistance;
        }
        this.assignmentCommentColumn = this.fitToTabColumn(this.assignmentCommentColumn);
    }
    fitToTabColumn(column: number): number {
        if (this.useTabs) {
            return Math.ceil(column / this.tabSize) * this.tabSize;
        } else {
            return column;
        }
    }
    isOversized(asmLine: ASMLine): boolean {
        return this.oversizedCommentLine.indexOf(asmLine) >= 0;
    }
}