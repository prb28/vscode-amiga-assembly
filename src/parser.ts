import * as language from './language';

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

export class HoverInstruction {
    instruction: string = "MOVE";
    decription: string = "ADD binary";
    syntax: string[] = ["Dx,Dy", "Dn,<ea>"];
    size: string = "BW";
    x: string = "*";
    n: string = "*";
    z: string = "*";
    v: string = "*";
    c: string = "*";
    constructor(csvLine: string) {
        //this.parse(csvLine);
    }
    /*    parse(csvLine: string) {
            let elements = csvLine.split(";");
    
        }*/
}