import { Definition, SymbolInformation, DocumentSymbolProvider, DefinitionProvider, TextDocument, Position, CancellationToken, Location, Uri, ReferenceProvider, ReferenceContext, ProviderResult, Range, window } from 'vscode';
import * as vscode from 'vscode';
import { SymbolFile, Symbol } from './symbols';
import { Calc } from './calc';
import { ASMLine } from './parser';

export class M68kDefinitionHandler implements DefinitionProvider, ReferenceProvider, DocumentSymbolProvider {
    static readonly SOURCE_FILES_GLOB = "**/*.{asm,s,i,ASM,S,I}";
    private files = new Map<string, SymbolFile>();
    private definedSymbols = new Map<string, Symbol>();
    private referredSymbols = new Map<string, Map<string, Array<Symbol>>>();
    private variables = new Map<string, Symbol>();
    private labels = new Map<string, Symbol>();
    private sortedVariablesNames = new Array<string>();

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
                    results.push(new SymbolInformation(symbol.getLabel(), vscode.SymbolKind.Constant, symbol.getParent(), new Location(symbol.getFile().getUri(), symbol.getRange())));
                }
                symbols = symbolFile.getLabels();
                for (let i = 0; i < symbols.length; i++) {
                    let symbol = symbols[i];
                    let symbolKind = vscode.SymbolKind.Function;
                    if (symbolFile.getSubRoutines().indexOf(symbol.getLabel()) >= 0) {
                        symbolKind = vscode.SymbolKind.Class;
                    } else if (symbolFile.getDcLabels().indexOf(symbol) >= 0) {
                        symbolKind = vscode.SymbolKind.Variable;
                    }
                    if (symbol.getLabel()) {
                        results.push(new SymbolInformation(symbol.getLabel(), symbolKind, symbol.getParent(), new Location(symbol.getFile().getUri(), symbol.getRange())));
                    }
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
                for (let refs of this.referredSymbols) {
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

    public findUsedRegisters(document: TextDocument, selections: vscode.Selection[]): Array<string> {
        let foundRegisters = Array<string>();
        for (const selection of selections) {
            if (!selection.isEmpty) {
                let endLine = selection.end.line;
                let text = document.getText(new Range(new Position(endLine, 0), selection.end)).trim();
                if (text.length <= 0) {
                    endLine--;
                }
                for (let i = selection.start.line; i <= endLine; i++) {
                    const line = document.lineAt(i);
                    let asmLine = new ASMLine(line.text, line);
                    // get the registers
                    let registers = asmLine.getRegistersFromData();
                    for (let r of registers) {
                        if (foundRegisters.indexOf(r) < 0) {
                            foundRegisters.push(r);
                        }
                    }
                }
            }
        }
        foundRegisters.sort();
        return foundRegisters;
    }

    public formatUsedRegistersResponse(registers: Array<string>): string {
        let used = registers.filter((x, i, a) => !i || x !== a[i - 1]);
        let aUsed = Array<number>();
        let dUsed = Array<number>();
        let aFree = Array<number>();
        let dFree = Array<number>();
        for (let i = 0; i < 8; i++) {
            let ar = "a" + i;
            let dr = "d" + i;
            if (used.indexOf(ar) < 0) {
                aFree.push(i);
            } else {
                aUsed.push(i);
            }
            if (used.indexOf(dr) < 0) {
                dFree.push(i);
            } else {
                dUsed.push(i);
            }
        }
        let result = "Registers ";
        let u = this.printRegisters(aUsed, dUsed);
        if (u.length > 0) {
            result += "used: " + u;
        } else {
            result += "used: none";
        }
        let f = this.printRegisters(aFree, dFree);
        if (f.length > 0) {
            result += " - free: " + f;
        } else {
            result += " - free: none";
        }
        return result;
    }

    public provideUsedRegistersSymbols(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            // Get the current text editor
            let editor = window.activeTextEditor;
            if (editor === undefined) {
                reject(new Error("Cannot access to editor"));
            } else {
                let foundRegisters = this.findUsedRegisters(editor.document, editor.selections);
                resolve(this.formatUsedRegistersResponse(foundRegisters));
            }
        });
    }

    public printRegisters(aregs: Array<number>, dregs: Array<number>): string {
        // checking registers "a"
        let results = this.printRegistersForRegType("d", dregs);
        // checking registers "d"
        let aResult = this.printRegistersForRegType("a", aregs);
        if ((results.length > 0) && (aResult.length > 0)) {
            results += "/" + aResult;
        }
        return results;
    }

    public printRegistersForRegType(regkey: string, regs: Array<number>): string {
        let result = "";
        let startRange = -1;
        let endRange = -1;
        for (let i = 0; i < 9; i++) {
            if (regs.indexOf(i) < 0) {
                if (startRange >= 0) {
                    if (result.length > 0) {
                        result += "/";
                    }
                    if (endRange <= startRange) {
                        result += regkey + startRange;
                    } else {
                        result += regkey + startRange + "-" + regkey + endRange;
                    }
                    startRange = -1;
                    endRange = -1;
                }
            } else if (startRange >= 0) {
                endRange = i;
            } else {
                startRange = i;
            }
        }
        return result;
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
        return new Promise(async (resolve, reject) => {
            await vscode.workspace.findFiles(M68kDefinitionHandler.SOURCE_FILES_GLOB, null).then(async (filesURI) => {
                let promises = [];
                for (let i = 0; i < filesURI.length; i++) {
                    promises.push(this.scanFile(filesURI[i]));
                }
                await Promise.all(promises).then(() => {
                    resolve();
                }).catch(err => {
                    reject(err);
                });
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
                file.readDocument(document);
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
            this.referredSymbols.delete(uri.fsPath);
            let refs = new Map<string, Array<Symbol>>();
            let refSymb = file.getReferredSymbols();
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
            this.referredSymbols.set(uri.fsPath, refs);
            symb = file.getVariables();
            for (let i = 0; i < symb.length; i++) {
                let s = symb[i];
                this.variables.set(s.getLabel(), s);
            }
            // sort variables
            this.sortedVariablesNames = Array.from(this.variables.keys());
            this.sortedVariablesNames.sort((a, b) => {
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
                    value = this.replaceVariablesInFormula(value);
                }
            }
            return value;
        }
        return undefined;
    }

    private replaceVariablesInFormula(formula: string): string {
        let newFormula = formula;
        let variables = this.findVariablesInFormula(newFormula);
        for (let i = 0; i < variables.length; i++) {
            let vn = variables[i];
            let evaluatedFormula = this.evaluateVariableFormula(vn);
            if (evaluatedFormula !== undefined) {
                // replace all
                newFormula = newFormula.split(vn).join('(' + evaluatedFormula + ')');
            }
        }
        return newFormula;
    }


    public findVariablesInFormula(formula: string): Array<string> {
        let variables = new Array<string>();
        for (let i = 0; i < this.sortedVariablesNames.length; i++) {
            let vn = this.sortedVariablesNames[i];
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
                if (!Number.isNaN(result)) {
                    return resolve(result);
                }
            }
            reject();
        });
    }

    public evaluateFormula(formula: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let resolved = false;
            let newFormula = this.replaceVariablesInFormula(formula);
            if (newFormula) {
                let calc = new Calc();
                let result = calc.calculate(newFormula);
                if ((!Number.isNaN(result)) && (result !== undefined)) {
                    resolve(result);
                    resolved = true;
                }
            }
            if (!resolved) {
                reject(new Error(`Formula '${formula}' can't be evaluated`));
            }
        });
    }

    /**
     * Retrieves the file includes graph
     */
    public async getIncludedFiles(uri: Uri): Promise<Array<string>> {
        return new Promise(async (resolve, reject) => {
            this.scanFile(uri).then((symbolFile) => {
                let returnedFilenames = new Array<string>();
                let includeDir = symbolFile.getIncludeDir();
                if (includeDir.length > 0) {
                    includeDir += '/';
                }
                for (let fn of symbolFile.getIncludedFiles()) {
                    returnedFilenames.push(includeDir + fn);
                }
                resolve(returnedFilenames);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Find all the variables starting by word
     * @param word Word to search
     * @return variables found.
     */
    findVariableStartingWith(word: string): Map<string, string | undefined> {
        let values = new Map<string, string | undefined>();
        let upper = word.toUpperCase();
        for (const [key, value] of this.variables.entries()) {
            if (key.toUpperCase().startsWith(upper)) {
                values.set(key, value.getValue());
            }
        }
        return values;
    }
}

