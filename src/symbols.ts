import { Range, Uri, workspace, TextDocument } from 'vscode';
import { ASMLine } from './parser';

export class SymbolFile {
    private uri: Uri;
    private definedSymbols = new Array<Symbol>();
    private referedSymbols = new Array<Symbol>();
    private variables = new Array<Symbol>();
    private labels = new Array<Symbol>();
    //private importedFiles = new Array<SymbolFile>();

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
        for (let i = 0; i < document.lineCount; i++) {
            let line = document.lineAt(i);
            let asmLine = new ASMLine(line.text, line);
            let [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            if ((symbol !== undefined) && (range !== undefined)) {
                this.definedSymbols.push(new Symbol(symbol, this, range));
            } else {
                let results = asmLine.getSymbolFromData();
                for (let i = 0; i < results.length; i++) {
                    [symbol, range] = results[i];
                    if ((symbol !== undefined) && (range !== undefined)) {
                        this.referedSymbols.push(new Symbol(symbol, this, range));
                    }
                }
            }
            if (asmLine.label.length > 0) {
                this.labels.push(new Symbol(asmLine.label, this, asmLine.labelRange));
            }
            if (asmLine.variable.length > 0) {
                this.variables.push(new Symbol(asmLine.variable, this, asmLine.variableRange, asmLine.value));
            }
        }
    }

    public clear() {
        this.definedSymbols = new Array<Symbol>();
        this.referedSymbols = new Array<Symbol>();
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
}

export class Symbol {
    private label: string;
    private file: SymbolFile;
    private range: Range;
    private value?: string;
    constructor(label: string, file: SymbolFile, range: Range, value?: string) {
        this.label = label;
        this.file = file;
        this.range = range;
        this.value = value;
    }
    public getFile(): SymbolFile {
        return this.file;
    }
    public getRange(): Range {
        return this.range;
    }
    public getLabel(): string {
        return this.label;
    }
    public getValue(): string | undefined {
        return this.value;
    }
}