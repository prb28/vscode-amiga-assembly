/* eslint-disable @typescript-eslint/ban-types */
import { Range, Uri, workspace, TextDocument } from 'vscode';
import { ASMLine } from './parser';
import { StringUtils } from './stringUtils';

export class SymbolFile {
    private uri: Uri;
    private document: TextDocument | null = null;
    private definedSymbols = new Array<Symbol>();
    private referredSymbols = new Array<Symbol>();
    private variables = new Array<Symbol>();
    private labels = new Array<Symbol>();
    private macros = new Array<Symbol>();
    private xrefs = new Array<Symbol>();
    private subroutines = new Array<string>();
    private dcLabel = new Array<Symbol>();
    private includeDirs = new Array<Symbol>();
    private includedFiles = new Array<Symbol>();

    constructor(uri: Uri) {
        this.uri = uri;
    }

    public async readFile(): Promise<SymbolFile> {
        // Read the file
        const document = await workspace.openTextDocument(this.uri);
        this.readDocument(document);
        return this;
    }

    public readDocument(document: TextDocument): void {
        this.clear();
        this.document = document;
        let lastLabel: Symbol | null = null;
        const labelsBeforeRts = Array<Symbol>();
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const asmLine = new ASMLine(line.text, line);
            let [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            if ((symbol !== undefined) && (range !== undefined)) {
                this.definedSymbols.push(new Symbol(symbol, this, range));
            } else {
                const results = asmLine.getSymbolFromData();
                for (let k = 0; k < results.length; k++) {
                    [symbol, range] = results[k];
                    if ((symbol !== undefined) && (range !== undefined)) {
                        this.referredSymbols.push(new Symbol(symbol, this, range));
                    }
                }
            }
            const instruct = asmLine.instruction.toLowerCase();
            if (asmLine.label.length > 0) {
                let label = asmLine.label.replace(":", "");
                const isLocal = label.indexOf(".") === 0;
                if (isLocal) {
                    label = lastLabel?.getLabel() + label;
                }
                const s = new Symbol(label, this, asmLine.labelRange);
                // Is this actually a macro definition in `<name> macro` syntax?
                if (instruct.indexOf("macro") === 0) {
                    this.macros.push(s);
                    this.definedSymbols.push(s);
                } else {
                    this.labels.push(s);
                    if (!isLocal) {
                        lastLabel = s;
                    }
                }
            } else if (instruct.indexOf("xref") === 0) {
                const s = new Symbol(asmLine.data, this, asmLine.dataRange);
                this.xrefs.push(s);
                this.definedSymbols.push(s);
            } else if (instruct.indexOf("macro") === 0) {
                // Handle ` macro <name>` syntax
                const s = new Symbol(asmLine.data, this, asmLine.dataRange);
                this.macros.push(s);
                this.definedSymbols.push(s);
            }
            if (asmLine.variable.length > 0) {
                this.variables.push(new Symbol(asmLine.variable, this, asmLine.variableRange, asmLine.value));
            }
            if (instruct.indexOf("bsr") >= 0) {
                this.subroutines.push(asmLine.data);
            } else if ((instruct.indexOf("dc") === 0) || (instruct.indexOf("ds") === 0) || (instruct.indexOf("incbin") === 0)) {
                if (lastLabel) {
                    this.dcLabel.push(lastLabel);
                }
            } else if (instruct.indexOf("rts") >= 0) {
                if (lastLabel) {
                    labelsBeforeRts.push(lastLabel);
                }
            } else if (instruct === "incdir") {
                const includeSymbol = new Symbol(StringUtils.parseQuoted(asmLine.data), this, asmLine.dataRange);
                this.includeDirs.push(includeSymbol);
                this.definedSymbols.push(includeSymbol);
            } else if (instruct === "include") {
                const includeSymbol = new Symbol(StringUtils.parseQuoted(asmLine.data), this, asmLine.dataRange);
                this.includedFiles.push(includeSymbol);
                this.definedSymbols.push(includeSymbol);
            }
        }
        let inSub = false;
        let lastParent: Symbol | undefined;
        for (const l of this.labels) {
            if (this.subroutines.indexOf(l.getLabel()) >= 0) {
                inSub = true;
                lastParent = l;
            } else if (inSub && lastParent) {
                l.setParent(lastParent.getLabel());
                const range = lastParent.getRange();
                lastParent.setRange(range.union(l.getRange()));
            }
            if (labelsBeforeRts.indexOf(l) >= 0) {
                inSub = false;
            }
        }
    }

    public clear(): void {
        this.definedSymbols = new Array<Symbol>();
        this.referredSymbols = new Array<Symbol>();
        this.variables = new Array<Symbol>();
        this.labels = new Array<Symbol>();
        this.macros = new Array<Symbol>();
        this.xrefs = new Array<Symbol>();
        this.subroutines = new Array<string>();
        this.dcLabel = new Array<Symbol>();
        this.includeDirs = new Array<Symbol>();
        this.includedFiles = new Array<Symbol>();
    }

    public getUri(): Uri {
        return this.uri;
    }
    public getDefinedSymbols(): Array<Symbol> {
        return this.definedSymbols;
    }
    public getReferredSymbols(): Array<Symbol> {
        return this.referredSymbols;
    }
    public getVariables(): Array<Symbol> {
        return this.variables;
    }
    public getLabels(): Array<Symbol> {
        return this.labels;
    }
    public getMacros(): Array<Symbol> {
        return this.macros;
    }
    public getXrefs(): Array<Symbol> {
        return this.xrefs;
    }
    public getSubRoutines(): Array<string> {
        return this.subroutines;
    }
    public getDcLabels(): Array<Symbol> {
        return this.dcLabel;
    }
    public getIncludeDirs(): Array<Symbol> {
        return this.includeDirs;
    }
    public getIncludedFiles(): Array<Symbol> {
        return this.includedFiles;
    }
    public getDocument(): TextDocument | null {
        return this.document;
    }
}

export class Symbol {
    private label: string;
    private file: SymbolFile;
    private range: Range;
    private value?: string;
    private parent = "";
    private commentBlock: string | null = null;
    constructor(label: string, file: SymbolFile, range: Range, value?: string) {
        this.label = label;
        this.file = file;
        this.range = range;
        this.value = value;
        this.parent = label;
    }
    public getFile(): SymbolFile {
        return this.file;
    }
    public getRange(): Range {
        return this.range;
    }
    public setRange(range: Range): void {
        this.range = range;
    }
    public getLabel(): string {
        return this.label;
    }
    public getValue(): string | undefined {
        return this.value;
    }
    public getParent(): string {
        return this.parent;
    }
    public setParent(parent: string): void {
        this.parent = parent;
    }
    public getCommentBlock(): string {
        if (this.commentBlock === null) {
            const commentLines: string[] = [];
            const doc = this.file.getDocument();
            if (doc) {
                const line = this.range.start.line;
                // Current line comment:
                const currentLine = doc.lineAt(line).text;
                const currentLineMatch = currentLine.match(/;\s?(.*)/);
                if (currentLineMatch) {
                    commentLines.push(currentLineMatch[1].trim());
                } else {
                    // Preceding line comments:
                    for (let i = line - 1; i >= 0; i--) {
                        const match = doc.lineAt(i).text.match(/^[;\*]+-*\s?(.*)/);
                        if (!match) {
                            break;
                        }
                        commentLines.unshift(match[1].trim());
                    }
                    // Subsequent line comments:
                    for (let i = line + 1; i < doc.lineCount; i++) {
                        const match = doc.lineAt(i).text.match(/^[;\*]+-*\s?(.*)/);
                        if (!match) {
                            break;
                        }
                        commentLines.push(match[1].trim());
                    }
                }
            }
            this.commentBlock = commentLines.join("\n").trim();
        }
        return this.commentBlock;
    }
}