import { Definition, SymbolInformation, DocumentSymbolProvider, DefinitionProvider, TextDocument, Position, CancellationToken, Location, Uri, FileSystemWatcher, ReferenceProvider, ReferenceContext, ProviderResult, Range } from 'vscode';
import * as vscode from 'vscode';
import { SymbolFile, Symbol } from './symbols';
import { Calc } from './calc';

export class M68kDefinitionHandler implements DefinitionProvider, ReferenceProvider, DocumentSymbolProvider {
    static readonly SOURCE_FILES_GLOB = "**/*.{asm,s,i,ASM,S,I}";
    private watcher: FileSystemWatcher;
    private files = new Map<string, SymbolFile>();
    private definedSymbols = new Map<String, Symbol>();
    private referedSymbols = new Map<string, Map<String, Array<Symbol>>>();
    private variables = new Map<String, Symbol>();
    private labels = new Map<String, Symbol>();
    private sortedVariablesNames = new Array<String>();

    constructor() {
        this.watcher = vscode.workspace.createFileSystemWatcher(M68kDefinitionHandler.SOURCE_FILES_GLOB);
        this.watcher.onDidChange(this.scanFile);
        this.scanWorkspace();
    }

    public provideDocumentSymbols(document: TextDocument, token: CancellationToken): ProviderResult<SymbolInformation[]> {
        return new Promise(async (resolve, reject) => {
            let symbolFile: void | SymbolFile = await this.scanFile(document.uri, document).catch(err => {
                reject(err);
                return;
            });
            let results = new Array<SymbolInformation>();
            if (symbolFile) {
                let symbols = symbolFile.getVariables();
                for (let i = 0; i < symbols.length; i++) {
                    let symbol = symbols[i];
                    results.push(new SymbolInformation(symbol.getLabel(), vscode.SymbolKind.Variable, "", new Location(symbol.getFile().getUri(), symbol.getRange())));
                }
                symbols = symbolFile.getLabels();
                for (let i = 0; i < symbols.length; i++) {
                    let symbol = symbols[i];
                    results.push(new SymbolInformation(symbol.getLabel(), vscode.SymbolKind.Method, "", new Location(symbol.getFile().getUri(), symbol.getRange())));
                }
            }
            resolve(results);
        });
    }

    public provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Thenable<Definition> {
        return new Promise(async (resolve, reject) => {
            let rg = document.getWordRangeAtPosition(position);
            if (rg) {
                await this.scanFile(document.uri, document).catch(err => {
                    reject(err);
                    return;
                });
                let label = this.getLabel(document, rg);
                let s = this.definedSymbols.get(label);
                if (s !== undefined) {
                    return resolve(new Location(s.getFile().getUri(), s.getRange()));
                }
            }
            return reject();
        });
    }

    public provideReferences(document: TextDocument, position: Position, context: ReferenceContext, token: CancellationToken): ProviderResult<Location[]> {
        return new Promise(async (resolve, reject) => {
            let rg = document.getWordRangeAtPosition(position);
            if (rg) {
                await this.scanFile(document.uri, document);
                let label = this.getLabel(document, rg);
                let locations = new Array<Location>();
                for (let refs of this.referedSymbols) {
                    let symbs = refs[1].get(label);
                    if (symbs !== undefined) {
                        for (let i = 0; i < symbs.length; i++) {
                            let s = symbs[i];
                            locations.push(new Location(s.getFile().getUri(), s.getRange()));
                        }
                    }
                }
                resolve(locations);
            }
            return reject();
        });
    }

    private getLabel(document: TextDocument, range: Range): string {
        let pos = range.start;
        let label;
        if (pos.character > 0) {
            pos = pos.translate(0, -1);
            label = document.getText(range.with(pos));
            if (!label.startsWith('\.')) {
                label = document.getText(range);
            }
        } else {
            label = document.getText(range);
        }
        return label;
    }

    public scanWorkspace(): Promise<void> {
        return new Promise((resolve, reject) => {
            return vscode.workspace.findFiles(M68kDefinitionHandler.SOURCE_FILES_GLOB, null, undefined).then(filesURI => {
                let promises = [];
                for (let i = 0; i < filesURI.length; i++) {
                    promises.push(this.scanFile(filesURI[i]));
                }
                return Promise.all(promises);
            });
        });
    }

    public scanFile(uri: Uri, document: TextDocument | undefined = undefined): Promise<SymbolFile> {
        return new Promise(async (resolve, reject) => {
            let file = this.files.get(uri.fsPath);
            if (file === undefined) {
                file = new SymbolFile(uri);
                this.files.set(uri.fsPath, file);
            }
            if (document) {
                await file.readDocument(document);
            } else {
                await file.readFile().catch(err => {
                    reject(err);
                    return;
                });
            }
            let symb = file.getDefinedSymbols();
            for (let i = 0; i < symb.length; i++) {
                let s = symb[i];
                this.definedSymbols.set(s.getLabel(), s);
            }
            this.referedSymbols.delete(uri.fsPath);
            let refs = new Map<String, Array<Symbol>>();
            let refSymb = file.getReferedSymbols();
            for (let i = 0; i < refSymb.length; i++) {
                let s = refSymb[i];
                let label = s.getLabel();
                let lst = refs.get(label);
                if (lst === undefined) {
                    lst = new Array<Symbol>();
                    refs.set(label, lst);
                }
                lst.push(s);
            }
            this.referedSymbols.set(uri.fsPath, refs);
            symb = file.getVariables();
            for (let i = 0; i < symb.length; i++) {
                let s = symb[i];
                this.variables.set(s.getLabel(), s);
            }
            // sort variables
            this.sortedVariablesNames = Array.from(this.variables.keys());
            await this.sortedVariablesNames.sort((a, b) => {
                return b.length - a.length;
            });

            symb = file.getLabels();
            for (let i = 0; i < symb.length; i++) {
                let s = symb[i];
                this.labels.set(s.getLabel(), s);
            }
            resolve(file);
        });
    }

    public getVariableValue(variable: string): string | undefined {
        let v = this.variables.get(variable);
        if (v !== undefined) {
            return v.getValue();
        }
        return undefined;
    }

    private evaluateVariableFormula(variable: string): string | undefined {
        let v = this.variables.get(variable);
        if (v !== undefined) {
            let value = v.getValue();
            if ((value !== undefined) && (value.length > 0)) {
                if (value.match(/[A-Za-z_]*/)) {
                    value = this.replaceVaraiblesInFormula(value);
                }
            }
            return value;
        }
        return undefined;
    }

    private replaceVaraiblesInFormula(formula: string): string {
        let newFormula = formula;
        let variables = this.findVariablesInFormula(newFormula);
        for (let i = 0; i < variables.length; i++) {
            let vn = variables[i];
            let formula = this.evaluateVariableFormula(vn);
            if (formula !== undefined) {
                // replace all
                newFormula = newFormula.split(vn).join('(' + formula + ')');
            }
        }
        return newFormula;
    }


    public findVariablesInFormula(formula: string): Array<string> {
        let variables = new Array<string>();
        for (let i = 0; i < this.sortedVariablesNames.length; i++) {
            let vn = this.sortedVariablesNames[i].toString();
            if (formula.indexOf(vn) >= 0) {
                variables.push(vn);
            }
        }
        return variables;
    }

    public evaluateVariable(variable: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let calc = new Calc();
            let formula = this.evaluateVariableFormula(variable);
            if (formula) {
                let result = calc.calculate(formula);
                if (result !== NaN) {
                    return resolve(result);
                }
            }
            reject();
        });
    }

    public evaluateFormula(formula: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let newFormula = this.replaceVaraiblesInFormula(formula);
            if (newFormula) {
                let calc = new Calc();
                let result = calc.calculate(newFormula);
                if (result !== NaN) {
                    return resolve(result);
                }
            }
            reject();
        });
    }

}

