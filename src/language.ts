import * as fs from 'fs';
import * as path from 'path';
import { ExtensionState } from './extension';

/**
 * Class to manage the language file
 */
export class M68kLanguage {
    languageMap: any;
    /**
     * Contrutor : parses the file
     */
    constructor() {
        let extensionPath = ExtensionState.getCurrent().getExtensionPath();
        const syntaxeFilePath = path.join(extensionPath, "syntaxes", "M68k-Assembly.tmLanguage.json");
        var data = fs.readFileSync(syntaxeFilePath, 'utf8');
        this.languageMap = JSON.parse(data);
    }
    /**
     * Getting a pattern from it's name
     * @param name Name of the pattern
     * @return the pattern match field or null
     */
    getPattern(name: string): any {
        for (let p of this.languageMap.patterns) {
            if (p.name === name) {
                return p.match;
            }
        }
        return null;
    }
    /**
     * Getting a regexp from it's name
     * @param name Name of the pattern
     * @return the regexp or null
     */
    getRegExp(name: string): any {
        let matchField = this.getPattern(name);
        if (matchField) {
            return this.createRegExpFromMatchField(matchField);
        }
        return null;
    }
    /**
     * Get all the patterns matching the regexp
     * @param nameRegExp RegExp for the name of the pattern
     * @return the list of patterns match fields or empty list
     */
    getAllPatterns(nameRegExp: RegExp): Array<string> {
        let list = new Array<string>();
        for (let p of this.languageMap.patterns) {
            if (p.name.match(nameRegExp)) {
                list.push(p.match);
            }
        }
        return list;
    }
    /**
     * Creates a regex from a match field
     * @param match Match Field
     */
    createRegExpFromMatchField(match: string): RegExp {
        let r: RegExp;
        let m = match;
        if (m.startsWith("(?i)")) {
            // Command to ignore the case
            m = m.replace("(?i)", "");
            r = new RegExp(m, 'i');
        } else {
            r = new RegExp(m);
        }
        return r;
    }
    /**
     * Get all the regexp matching the regexp on name
     * @param nameRegExp RegExp for the name of the pattern
     * @return the list of the regexp from the match fields or empty list
     */
    getAllRegExps(nameRegExp: RegExp): Array<RegExp> {
        let list = new Array<RegExp>();
        let patterns = this.getAllPatterns(nameRegExp);
        for (let p of patterns) {
            list.push(this.createRegExpFromMatchField(p));
        }
        return list;
    }
} 