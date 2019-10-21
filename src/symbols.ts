import { Range, Uri, workspace, TextDocument } from 'vscode';
import { ASMLine } from './parser';

export class SymbolFile {
    private uri: Uri;
    private definedSymbols = new Array<Symbol>();
    private referedSymbols = new Array<Symbol>();
    private variables = new Array<Symbol>();
    private labels = new Array<Symbol>();
    private subroutines = new Array<string>();
    private dclabel = new Array<Symbol>();
    private includeDir = "";
    private includedFiles = new Array<string>();

    constructor(uri: Uri) {
        this.uri = uri;
    }

    public readFile(): Promise<SymbolFile> {
        return new Promise(async (resolve, reject) => {
            // Read the file
            let document = await workspace.openTextDocument(this.uri);
            if (document) {
                this.readDocument(document);
                resolve(this);
            } else {
                reject(new Error("Error opening document: '" + this.uri + "'"));
            }
        });
    }

    public readDocument(document: TextDocument) {
        this.clear();
        let lastLabel: Symbol | null = null;
        let labelsBeforeRts = Array<Symbol>();
        for (let i = 0; i < document.lineCount; i++) {
            let line = document.lineAt(i);
            let asmLine = new ASMLine(line.text, line);
            let [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            if ((symbol !== undefined) && (range !== undefined)) {
                this.definedSymbols.push(new Symbol(symbol, this, range));
            } else {
                let results = asmLine.getSymbolFromData();
                for (let k = 0; k < results.length; k++) {
                    [symbol, range] = results[k];
                    if ((symbol !== undefined) && (range !== undefined)) {
                        this.referedSymbols.push(new Symbol(symbol, this, range));
                    }
                }
            }
            if (asmLine.label.length > 0) {
                let label = asmLine.label.replace(":", "");
                let s = new Symbol(label, this, asmLine.labelRange);
                this.labels.push(s);
                lastLabel = s;
            }
            if (asmLine.variable.length > 0) {
                this.variables.push(new Symbol(asmLine.variable, this, asmLine.variableRange, asmLine.value));
            }
            let instruct = asmLine.instruction.toLowerCase();
            if (instruct.indexOf("bsr") >= 0) {
                this.subroutines.push(asmLine.data);
            } else if ((instruct.indexOf("dc") === 0) || (instruct.indexOf("ds") === 0) || (instruct.indexOf("incbin") === 0)) {
                if (lastLabel) {
                    this.dclabel.push(lastLabel);
                }
            } else if (instruct.indexOf("rts") >= 0) {
                if (lastLabel) {
                    labelsBeforeRts.push(lastLabel);
                }
            } else if (instruct === "incdir") {
                this.includeDir = asmLine.data.replace(/"/g, '');
            } else if (instruct === "include") {
                this.includedFiles.push(asmLine.data.replace(/"/g, ''));
            }
        }
        let inSub = false;
        let lastParent: Symbol | undefined;
        for (let l of this.labels) {
            if (this.subroutines.indexOf(l.getLabel()) >= 0) {
                inSub = true;
                lastParent = l;
            } else if (inSub && lastParent) {
                l.setParent(lastParent.getLabel());
                let range = lastParent.getRange();
                lastParent.setRange(range.union(l.getRange()));
            }
            if (labelsBeforeRts.indexOf(l) >= 0) {
                inSub = false;
            }
        }
    }

    public clear() {
        this.definedSymbols = new Array<Symbol>();
        this.referedSymbols = new Array<Symbol>();
        this.variables = new Array<Symbol>();
        this.labels = new Array<Symbol>();
        this.subroutines = new Array<string>();
        this.dclabel = new Array<Symbol>();
        this.includeDir = "";
        this.includedFiles = new Array<string>();
    }

    public getUri(): Uri {
        return this.uri;
    }
    public getDefinedSymbols(): Array<Symbol> {
        return this.definedSymbols;
    }
    public getReferedSymbols(): Array<Symbol> {
        return this.referedSymbols;
    }
    public getVariables(): Array<Symbol> {
        return this.variables;
    }
    public getLabels(): Array<Symbol> {
        return this.labels;
    }
    public getSubRoutines(): Array<string> {
        return this.subroutines;
    }
    public getDcLabels(): Array<Symbol> {
        return this.dclabel;
    }
    public getIncludeDir(): string {
        return this.includeDir;
    }
    public getIncludedFiles(): Array<string> {
        return this.includedFiles;
    }
}

export class Symbol {
    private label: string;
    private file: SymbolFile;
    private range: Range;
    private value?: string;
    private parent: string = "";
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
    public setRange(range: Range) {
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
    public setParent(parent: string) {
        this.parent = parent;
    }
}