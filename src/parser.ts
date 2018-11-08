import { M68kLanguage } from './language';
import { Position, Range, TextLine } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Formatter class for le assemble language
 */
export class ASMLine {
    static m68kLang = new M68kLanguage();
    static commentLineRegExps = ASMLine.m68kLang.getAllRegExps(/.*comment\.line.*/g);
    static keywordsRegExps = ASMLine.m68kLang.getAllRegExps(/keyword.*/g);
    static macrosRegExps = ASMLine.m68kLang.getAllRegExps(/macro.*/g);
    label: string = "";
    instruction: string = "";
    data: string = "";
    comment: string = "";
    raw: string = "";
    start: Position;
    end: Position;
    spacesBeforeLabelRange: Range;
    labelRange: Range;
    spacesLabelToInstructionRange: Range;
    instructionRange: Range;
    spacesInstructionToDataRange: Range;
    dataRange: Range;
    spacesDataToCommentRange: Range;
    commentRange: Range;
    vscodeTextLine?: TextLine;
    /**
     * Constructor
     * @param line Text of the line
     * @param vscodeTextLine Line for vscode
     */
    constructor(line: string, vscodeTextLine?: TextLine) {
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
        this.parse(line, lineNumber);
    }

    /**
     * Parse a line
     * @param line Line to parse
     * @param lineNumber index of the line in document
     */
    parse(line: string, lineNumber: number) {
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
        } else {
            // Extract comments
            let commentPosInInputLine = line.indexOf(";");
            if (commentPosInInputLine >= 0) {
                this.comment = line.substring(commentPosInInputLine).trim();
                l = line.substring(0, commentPosInInputLine).trim();
                this.commentRange = new Range(new Position(lineNumber, commentPosInInputLine), new Position(lineNumber, commentPosInInputLine + this.comment.length));
            }
            // find a keywork
            let keyword = this.search(ASMLine.keywordsRegExps, l);
            if (!keyword) {
                // no keyword
                // Consider it is a label iif there are no leading spaces
                if (leadingSpacesCount === 0) {
                    this.label = l;
                    this.labelRange = new Range(new Position(lineNumber, leadingSpacesCount), new Position(lineNumber, leadingSpacesCount + this.label.length));
                }
                else {
                    keyword = this.search(ASMLine.macrosRegExps, l);
                }
            }
            if (keyword) {
                // A keyword has been found
                // set the keyword
                this.instruction = keyword[0];
                let startInInputLine = leadingSpacesCount + keyword.index;
                let endInInputLine = startInInputLine + this.instruction.length;
                this.instructionRange = new Range(new Position(lineNumber, startInInputLine), new Position(lineNumber, endInInputLine));
                if (keyword.index > 0) {
                    this.label = l.substring(0, keyword.index).trim();
                    next = new Position(lineNumber, leadingSpacesCount + this.label.length);
                    this.labelRange = new Range(current, next);
                    current = next;
                    next = this.instructionRange.start;
                    this.spacesLabelToInstructionRange = new Range(current, next);
                    current = next;
                }
                current = this.instructionRange.end;
                let endInTrimLine = keyword.index + keyword[0].length;
                this.data = l.substring(endInTrimLine).trim();
                if (this.data.length > 0) {
                    startInInputLine = line.indexOf(this.data);
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

    /**
     * Returns the symbol retrieved from a label.
     * 
     * @return the symbol string and the range, otherwise undefined
     */
    public getSymbolFromLabel(): [string | undefined, Range | undefined] {
        if (this.label.length > 0) {
            let elements = this.label.split(/(\s)*(\=|[a-z]?equ(.[a-z])?|:)(\s)*/gi);
            let symbol = elements[0].trim();
            let sPos = this.label.indexOf(symbol);
            if (sPos !== undefined) {
                let range = new Range(new Position(this.labelRange.start.line, sPos), new Position(this.labelRange.end.line, sPos + symbol.length));
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
        let symbols = new Array<[string, Range]>();
        if (this.data.length > 0) {
            let reg = /([a-z\.]+[a-z0-9_\.]*|[0-9]+[a-z]+[a-z0-9_\.]*)/gi;
            let match;
            while (match = reg.exec(this.data)) {
                let symbol = match[0];
                let startPos = this.dataRange.start.character + match.index;
                let range = new Range(new Position(this.dataRange.start.line, startPos), new Position(this.dataRange.end.line, startPos + symbol.length));
                symbols.push([symbol, range]);
            }
        }
        return symbols;
    }
}

/**
 * Class to manage the instructions
 */
export class HoverInstructionsManager {
    instructions = new Map<String, Array<HoverInstruction>>();
    constructor() {
        // Read the instructions file
        // Creating the relative path to find the test file
        const filePath = path.join(__dirname, "..", "docs", "intructionsset.csv");
        var lines = fs.readFileSync(filePath, 'utf8').split(/\r\n|\r|\n/g);
        var lineIndex = 0;
        for (let line of lines) {
            if (line.length > 0) {
                let hi = HoverInstruction.parse(line);
                if (hi) {
                    let list = this.instructions.get(hi.instruction);
                    if (!list) {
                        list = new Array<HoverInstruction>();
                    }
                    list.push(hi);
                    this.instructions.set(hi.instruction, list);
                } else {
                    console.error("Error parsing file 'intructionsset.csv' on line [" + lineIndex + "]: '" + line + "'");
                }
            }
            lineIndex += 1;
        }
    }
}

/**
 * Class reprensenting an instruction
 */
export class HoverInstruction {
    instruction: string = "";
    decription: string = "";
    syntax: string = "";
    size: string = "";
    x: string = "";
    n: string = "";
    z: string = "";
    v: string = "";
    c: string = "";
    /**
     * Function to parse a line and create a HoverInstruction
     * 
     * @param cvsLine The line to parse
     * @return HoverInstruction if the parse succeded or null
     */
    static parse(csvLine: string): any {
        let hi = new HoverInstruction();
        let elements = csvLine.split(";");
        if (elements.length < 9) {
            return null;
        } else {
            hi.instruction = elements[0];
            hi.decription = elements[1];
            hi.syntax = elements[2];
            hi.size = elements[3].replace("-", "");
            hi.x = elements[4];
            hi.n = elements[5];
            hi.z = elements[6];
            hi.v = elements[7];
            hi.c = elements[8];
            return hi;
        }
    }
}

/**
 * Class to manage the registers
 */
export class HoverRegistersManager {
    registersByName = new Map<String, HoverRegister>();
    registersByAddress = new Map<String, HoverRegister>();
    constructor() {
        // Read the registers file
        // Creating the relative path to find the test file
        const dirPath = path.join(__dirname, "..", "docs", "hardware");
        fs.readdirSync(dirPath).forEach(filename => {
            if (filename.endsWith(".md")) {
                let filePath = path.join(dirPath, filename);
                let description = fs.readFileSync(filePath, 'utf8');
                let elms = filename.replace(".md", "").split("_");
                if (elms.length === 2) {
                    let name = elms[1].toUpperCase();
                    let address = elms[0].toUpperCase();
                    let hr = new HoverRegister(address, name, description);
                    this.registersByAddress.set(address, hr);
                    this.registersByName.set(name, hr);
                }
            }
        });
    }
}

/**
 * Class reprensenting a register
 */
export class HoverRegister {
    address: string;
    name: string;
    description: string;
    /**
     * Contructor
     * @param address address of the register 
     * @param name Name
     * @param description description in markdown
     */
    constructor(address: string, name: string, description: string) {
        this.address = address;
        this.name = name;
        this.description = description;
    }
}

export class NumberParser {
    /**
     * Parses a number in a word
     * @param word Word to parse
     */
    public parse(word: string): number | null {
        let hexValueRegExp = /\$([\da-z]+)/i;
        let decValueRegExp = /[#]?([-]?[\d]+)/;
        let octValueRegExp = /@(\d+)/;
        let binValueRegExp = /%([01]*)/;
        // look for an hex value
        let match = hexValueRegExp.exec(word);
        if (match) {
            return parseInt(match[1], 16);
        }
        // look for an octal value
        match = octValueRegExp.exec(word);
        if (match) {
            return parseInt(match[1], 8);
        }
        // look for a binary value
        match = binValueRegExp.exec(word);
        if (match) {
            return parseInt(match[1], 2);
        }
        // look for a decimal value
        match = decValueRegExp.exec(word);
        if (match) {
            return parseInt(match[1], 10);
        }
        return null;
    }

    public tranformToDecimal(text: string): string {
        let hexValueRegExp = /\$([\da-z]+)/gi;
        let octValueRegExp = /@(\d+)/g;
        let binValueRegExp = /%([01]*)/g;
        let transformed = text;
        // look for an hex value
        let match;
        while (match = hexValueRegExp.exec(transformed)) {
            for (let i = 1; i < match.length; i++) {
                let s = match[i];
                let v = parseInt(s, 16);
                transformed = transformed.replace("$" + s, v.toString());
            }
        }
        // look for an octal value
        while (match = octValueRegExp.exec(transformed)) {
            for (let i = 1; i < match.length; i++) {
                let s = match[i];
                let v = parseInt(s, 8);
                transformed = transformed.replace("@" + s, v.toString());
            }
        }
        // look for a binary value
        while (match = binValueRegExp.exec(transformed)) {
            for (let i = 1; i < match.length; i++) {
                let s = match[i];
                let v = parseInt(s, 2);
                transformed = transformed.replace("%" + s, v.toString());
            }
        }
        // replace all decimal marks
        transformed = transformed.replace("#", "");
        return transformed;
    }

    chunk(str: string, len: number) {
        let size = Math.ceil(str.length / len);
        let ret = new Array(size);
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
        let end = startPos + len;
        if (end >= len) {
            ret[0] = str;
        } else {
            ret[0] = str.substring(0, end);
        }
        return ret;
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
