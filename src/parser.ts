import { M68kLanguage } from './language';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Formatter class for le assemble language
 */
export class ASMLine {
    static m68kLang = new M68kLanguage();
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

/**
 * Class to manage the instructions
 */
export class HoverInstructionsManager {
    instructions = new Map<String, Array<HoverInstruction>>();
    constructor() {
        // Read the instructions file
        // Creating the relative path to find the test file
        const syntaxeFilePath = path.join(__dirname, "..", "docs", "intructionsset.csv");
        var lines = fs.readFileSync(syntaxeFilePath, 'utf8').split('\n');
        for (let line of lines) {
            let hi = HoverInstruction.parse(line);
            if (hi) {
                let list = this.instructions.get(hi.instruction);
                if (!list) {
                    list = new Array<HoverInstruction>();
                }
                list.push(hi);
                this.instructions.set(hi.instruction, list);
            } else {
                console.error("Error parsing file 'intructionsset.csv' on line : " + line);
            }
        }
    }
}

/**
 * Class reprensenting an instruction
 */
export class HoverInstruction {
    instruction: string = "";
    decription: string = "";
    syntax: string[] = [];
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
            hi.syntax = elements[2].split("|");
            hi.size = elements[3];
            hi.x = elements[4];
            hi.n = elements[5];
            hi.z = elements[6];
            hi.v = elements[7];
            hi.c = elements[8];
            return hi;
        }
    }
}