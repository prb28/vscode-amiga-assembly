import * as path from 'path';
import { FileProxy } from './fsProxy';
import { Uri } from 'vscode';

/**
 * Rule of the TextMate grammar
 */
interface GrammarRule {
    name?: string;
    match?: string;
    patterns?: Array<GrammarRule>;
}

/**
 * Class to manage the language file
 */
export class M68kLanguage {
    private isLoaded = false;
    private extensionPath: string;
    languageMap: any;
    extensionsMap: Map<string, Array<string>>;
    /**
     * Constructor : parses the file
     */
    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
        this.extensionsMap = new Map<string, Array<string>>();
    }

    /**
     * Loads the language definition.
     */
    public async load(): Promise<void> {
        if (!this.isLoaded) {
            const syntaxFilePath = path.join(this.extensionPath, "syntaxes", "M68k-Assembly.tmLanguage.json");
            const fileProxy = new FileProxy(Uri.file(syntaxFilePath));
            const data = await fileProxy.readFileText('utf8');
            this.languageMap = JSON.parse(data);
            this.createExtensionMap();
        }
    }

    /**
     * Create a map from instruction to extension
     */
    private createExtensionMap() {
        const syntaxes = ["keyword.other.opcode.cpu.bl.m68k", "keyword.other.opcode.cpu.bwl.m68k", "keyword.other.opcode.cpu.bwlsdxp.m68k",
            "keyword.other.opcode.cpu.wl.m68k", "keyword.other.opcode.cpu.bwls.m68k", "keyword.other.opcode.cpu.ld.m68k",
            "keyword.other.opcode.cpu.l.m68k", "keyword.other.opcode.cpu.w.m68k", "keyword.other.opcode.cpu.b.m68k",
            "keyword.other.opcode.cpu.bw.m68k", "keyword.other.opcode.cpu.bwld.m68k", "keyword.other.opcode.cpu.ldx.m68k",
            "keyword.other.opcode.fpu.x.m68k", "keyword.other.opcode.fpu.bwlsdxp.m68k", "keyword.control.directive.data.m68k",
            "keyword.control.directive.data.pc.m68k"];
        // Matches the "(inst1|inst2|...)(\.[exts])" part of an instruction pattern
        const instructionsRegExp = /\(([a-z0-9_|]+)\)\(\\\.\[([a-z]+)\]\)/i;
        for (const s of syntaxes) {
            for (const p of this.getAllPatterns(new RegExp(`^${s.replace(/\./g, "\\.")}$`))) {
                const elms = instructionsRegExp.exec(p);
                if (elms) {
                    const extensions = elms[2].split("");
                    for (const i of elms[1].split("|")) {
                        this.extensionsMap.set(i, extensions);
                    }
                }
            }
        }
    }
    /**
     * Retrieves all the named match rules of the grammar,
     * from the top level patterns and the repository
     * @return list of the rules
     */
    private getAllRules(): Array<{ name: string; match: string }> {
        const rules = new Array<{ name: string; match: string }>();
        const visit = (patterns: Array<GrammarRule> | undefined) => {
            if (patterns) {
                for (const p of patterns) {
                    if (p.name && p.match) {
                        rules.push({ name: p.name, match: p.match });
                    }
                    visit(p.patterns);
                }
            }
        };
        visit(this.languageMap.patterns);
        if (this.languageMap.repository) {
            visit(Object.values(this.languageMap.repository));
        }
        return rules;
    }
    /**
     * Getting a pattern from it's name
     * @param name Name of the pattern
     * @return the pattern match field or null
     */
    getPattern(name: string): any {
        for (const p of this.getAllRules()) {
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
    getRegExp(name: string): RegExp | null {
        const matchField = this.getPattern(name);
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
        const list = new Array<string>();
        for (const p of this.getAllRules()) {
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
        const list = new Array<RegExp>();
        const patterns = this.getAllPatterns(nameRegExp);
        for (const p of patterns) {
            list.push(this.createRegExpFromMatchField(p));
        }
        return list;
    }
    /**
     * Retrieves the extension for an instruction
     * @param instruction instruction
     * @return List of extensions or undefined
     */
    getExtensions(instruction: string): string[] | undefined {
        return this.extensionsMap.get(instruction);
    }
}