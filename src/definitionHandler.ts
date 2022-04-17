/* eslint-disable @typescript-eslint/ban-types */
import { Definition, SymbolInformation, DocumentSymbolProvider, DefinitionProvider, TextDocument, Position, CancellationToken, Location, Uri, ReferenceProvider, ReferenceContext, Range, window } from 'vscode';
import * as vscode from 'vscode';
import { SymbolFile, Symbol } from './symbols';
import { Calc } from './calc';
import { ASMLine } from './parser';
import { FileProxy } from './fsProxy';
import { StringUtils } from './stringUtils';
import { logger } from 'vscode-debugadapter';

export class M68kDefinitionHandler implements DefinitionProvider, ReferenceProvider, DocumentSymbolProvider {
    static readonly SOURCE_FILES_GLOB = "**/*.{asm,s,i,ASM,S,I}";
    private files = new Map<string, SymbolFile>();
    private definedSymbols = new Map<string, Symbol>();
    private referredSymbols = new Map<string, Map<string, Array<Symbol>>>();
    private variables = new Map<string, Symbol>();
    private labels = new Map<string, Symbol>();
    private macros = new Map<string, Symbol>();
    private includeDirs = new Map<string, Symbol>();
    private xrefs = new Map<string, Symbol>();
    private sortedVariablesNames = new Array<string>();

    public async provideDocumentSymbols(document: TextDocument, token: CancellationToken): Promise<SymbolInformation[]> {
        const symbolFile: void | SymbolFile = await this.scanFile(document.uri, document);
        const results = new Array<SymbolInformation>();
        if (symbolFile) {
            let symbols = symbolFile.getVariables();
            for (const symbol of symbols) {
                results.push(new SymbolInformation(symbol.getLabel(), vscode.SymbolKind.Constant, symbol.getParent(), new Location(symbol.getFile().getUri(), symbol.getRange())));
            }
            symbols = symbolFile.getLabels();
            for (let i = 0; i < symbols.length; i++) {
                const symbol = symbols[i];
                let symbolKind = vscode.SymbolKind.Function;
                const isLocal = symbol.getLabel().includes(".");
                const label = symbol.getLabel().replace(/$.+\./, ".");
                if (symbolFile.getSubRoutines().indexOf(label) >= 0) {
                    symbolKind = vscode.SymbolKind.Class;
                } else if (symbolFile.getDcLabels().indexOf(symbol) >= 0) {
                    symbolKind = vscode.SymbolKind.Variable;
                }
                if (label) {
                    // Extend range to next label:
                    let nextLabel: Symbol | null = null;
                    for (let j = i + 1; j < symbols.length; j++) {
                        const l = symbols[j];
                        // Next global label unless current label is local
                        if (isLocal || !l.getLabel().includes(".")) {
                            nextLabel = l;
                            break;
                        }
                    }
                    const end = nextLabel?.getRange().start ?? document.lineAt(document.lineCount - 1).range.end;
                    const range = new Range(symbol.getRange().start, end);
                    results.push(new SymbolInformation(label, symbolKind, symbol.getParent(), new Location(symbol.getFile().getUri(), range)));
                }
            }
            symbols = symbolFile.getMacros();
            for (const symbol of symbols) {
                const symbolKind = vscode.SymbolKind.Function;
                results.push(new SymbolInformation(symbol.getLabel(), symbolKind, symbol.getParent(), new Location(symbol.getFile().getUri(), symbol.getRange())));
            }
            symbols = symbolFile.getXrefs();
            for (const symbol of symbols) {
                const symbolKind = vscode.SymbolKind.Function;
                results.push(new SymbolInformation(symbol.getLabel(), symbolKind, symbol.getParent(), new Location(symbol.getFile().getUri(), symbol.getRange())));
            }
            const includedFiles = symbolFile.getIncludedFiles();
            for (const includedFile of includedFiles) {
                results.push(new SymbolInformation(includedFile.getLabel(), vscode.SymbolKind.File, includedFile.getParent(), new Location(includedFile.getFile().getUri(), includedFile.getRange())));
            }
        }
        return results;
    }

    public async provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Promise<Definition> {
        const rg = document.getWordRangeAtPosition(position);
        if (rg) {
            await this.scanFile(document.uri, document);
            const label = this.getLabel(document, rg);
            const s = this.definedSymbols.get(label);
            if (s !== undefined) {
                return new Location(s.getFile().getUri(), s.getRange());
            }
        }
        // search for quotes        
        const line = document.lineAt(position.line).text;
        const asmLine = new ASMLine(line);
        if (asmLine.instruction.toLowerCase() === "include") {
            const data = StringUtils.parseQuoted(asmLine.data);
            const s = this.definedSymbols.get(data);
            if (s !== undefined) {
                const includedFileProxy = await this.resolveIncludedFile(new FileProxy(s.getFile().getUri()), s.getLabel());
                if (includedFileProxy) {
                    return new Location(includedFileProxy.getUri(), s.getRange());
                }
            }
        }
        throw new Error("Definition not found");
    }

    public async provideReferences(document: TextDocument, position: Position, context: ReferenceContext, token: CancellationToken): Promise<Location[]> {
        const rg = document.getWordRangeAtPosition(position);
        if (rg) {
            await this.scanFile(document.uri, document);
            const label = this.getLabel(document, rg);
            const locations = new Array<Location>();
            for (const refs of this.referredSymbols) {
                const symbols = refs[1].get(label);
                if (symbols !== undefined) {
                    for (const s of symbols) {
                        locations.push(new Location(s.getFile().getUri(), s.getRange()));
                    }
                }
            }
            return locations;
        }
        throw new Error("Reference not found");
    }

    public findUsedRegisters(document: TextDocument, selections: readonly vscode.Selection[]): Array<string> {
        const foundRegisters = Array<string>();
        for (const selection of selections) {
            if (!selection.isEmpty) {
                let endLine = selection.end.line;
                const text = document.getText(new Range(new Position(endLine, 0), selection.end)).trim();
                if (text.length <= 0) {
                    endLine--;
                }
                for (let i = selection.start.line; i <= endLine; i++) {
                    const line = document.lineAt(i);
                    const asmLine = new ASMLine(line.text, line);
                    // get the registers
                    const registers = asmLine.getRegistersFromData();
                    for (const r of registers) {
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
        const used = registers.filter((x, i, a) => !i || x !== a[i - 1]);
        const aUsed = Array<number>();
        const dUsed = Array<number>();
        const aFree = Array<number>();
        const dFree = Array<number>();
        for (let i = 0; i < 8; i++) {
            const ar = "a" + i;
            const dr = "d" + i;
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
        const u = this.printRegisters(aUsed, dUsed);
        if (u.length > 0) {
            result += "used: " + u;
        } else {
            result += "used: none";
        }
        const f = this.printRegisters(aFree, dFree);
        if (f.length > 0) {
            result += " - free: " + f;
        } else {
            result += " - free: none";
        }
        return result;
    }

    public async provideUsedRegistersSymbols(): Promise<string> {
        // Get the current text editor
        const editor = window.activeTextEditor;
        if (editor === undefined) {
            throw new Error("Cannot access to editor");
        } else {
            const foundRegisters = this.findUsedRegisters(editor.document, editor.selections);
            return this.formatUsedRegistersResponse(foundRegisters);
        }
    }

    public printRegisters(aregs: Array<number>, dregs: Array<number>): string {
        // checking registers "a"
        let results = this.printRegistersForRegType("d", dregs);
        // checking registers "d"
        const aResult = this.printRegistersForRegType("a", aregs);
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
            if (!label.startsWith('.')) {
                label = document.getText(range);
            }
        } else {
            label = document.getText(range);
        }
        return label;
    }

    public async scanWorkspace(): Promise<void> {
        await vscode.workspace.findFiles(M68kDefinitionHandler.SOURCE_FILES_GLOB, null).then(async (filesURI) => {
            const promises = [];
            for (const fURI of filesURI) {
                promises.push(this.scanFile(fURI));
            }
            return Promise.all(promises);
        });
    }

    public async scanFile(uri: Uri, document: TextDocument | undefined = undefined): Promise<SymbolFile> {
        try {
            let file = this.files.get(uri.fsPath);
            if (file === undefined) {
                file = new SymbolFile(uri);
                this.files.set(uri.fsPath, file);
            } else {
                this.clearSymbolsForFile(file);
            }
            if (document) {
                file.readDocument(document);
            } else {
                await file.readFile();
            }
            let symbol = file.getDefinedSymbols();
            for (const s of symbol) {
                this.definedSymbols.set(s.getLabel(), s);
            }
            this.referredSymbols.delete(uri.fsPath);
            const refs = new Map<string, Array<Symbol>>();
            const refSymbol = file.getReferredSymbols();
            for (const s of refSymbol) {
                const label = s.getLabel();
                let lst = refs.get(label);
                if (lst === undefined) {
                    lst = new Array<Symbol>();
                    refs.set(label, lst);
                }
                lst.push(s);
            }
            this.referredSymbols.set(uri.fsPath, refs);
            symbol = file.getVariables();
            for (const s of symbol) {
                this.variables.set(s.getLabel(), s);
            }
            // sort variables
            this.sortedVariablesNames = Array.from(this.variables.keys());
            this.sortedVariablesNames.sort((a, b) => {
                return b.length - a.length;
            });

            symbol = file.getLabels();
            for (const s of symbol) {
                this.labels.set(s.getLabel(), s);
            }
            symbol = file.getMacros();
            for (const s of symbol) {
                this.macros.set(s.getLabel(), s);
            }
            symbol = file.getIncludeDirs();
            for (const s of symbol) {
                this.includeDirs.set(s.getLabel(), s);
            }
            symbol = file.getXrefs();
            for (const s of symbol) {
                this.xrefs.set(s.getLabel(), s);
            }

            // Scan any new included files
            const currentFile = new FileProxy(file.getUri());
            for (const symbol of file.getIncludedFiles()) {
                const includedFile = await this.resolveIncludedFile(currentFile, symbol.getLabel());
                if (includedFile && !this.files.has(includedFile.getPath())) {
                    if (await includedFile.exists() && await includedFile.isFile()) {
                        await this.scanFile(includedFile.getUri());
                    }
                }
            }
            return file;
        } catch (error) {
            logger.error(`Error while scanning file '${uri}': ${error.message}`);
            return new SymbolFile(uri);
        }
    }

    public deleteFile(uri: Uri) {
        const file = this.files.get(uri.fsPath);
        if (file !== undefined) {
            this.clearSymbolsForFile(file);
            this.files.delete(uri.fsPath);
        }
    }

    public getVariableValue(variable: string): string | undefined {
        const v = this.variables.get(variable);
        if (v !== undefined) {
            return v.getValue();
        }
        return undefined;
    }

    private clearSymbolsForFile(file: SymbolFile): void {
        const symbolMaps = [
            this.definedSymbols,
            this.variables,
            this.labels,
            this.macros,
            this.includeDirs
        ];
        symbolMaps.forEach(map => {
            map.forEach((value, key) => {
                if (value.getFile() === file) {
                    map.delete(key);
                }
            });
        });
    }

    private evaluateVariableFormula(variable: string): string | undefined {
        const v = this.variables.get(variable);
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
        const variables = this.findVariablesInFormula(newFormula);
        for (const vn of variables) {
            const evaluatedFormula = this.evaluateVariableFormula(vn);
            if (evaluatedFormula !== undefined) {
                // replace all
                newFormula = newFormula.split(vn).join('(' + evaluatedFormula + ')');
            }
        }
        return newFormula;
    }


    public findVariablesInFormula(formula: string): Array<string> {
        const variables = new Array<string>();
        for (const vn of this.sortedVariablesNames) {
            if (formula.indexOf(vn) >= 0) {
                variables.push(vn);
            }
        }
        return variables;
    }

    public async evaluateVariable(variable: string): Promise<number> {
        const calc = new Calc();
        const formula = this.evaluateVariableFormula(variable);
        if (formula) {
            const result = calc.calculate(formula);
            if (!Number.isNaN(result)) {
                return result;
            }
        }
        throw new Error(`Variable ${variable} cannot be evaluated`);
    }

    public async evaluateFormula(formula: string, replaceVariables?: boolean): Promise<number> {
        let newFormula: string;
        if (replaceVariables === false) {
            newFormula = formula;
        } else {
            newFormula = this.replaceVariablesInFormula(formula);
        }
        if (newFormula) {
            const calc = new Calc();
            const result = calc.calculate(newFormula);
            if ((!Number.isNaN(result)) && (result !== undefined)) {
                return result;
            }
        }
        throw new Error(`Formula '${formula}' can't be evaluated`);
    }

    /**
     * Resolves an included file
     * @param currentPath Path of the current file
     * @param filename Filename to include
     * @returns Resolved file
     */
    private async resolveIncludedFile(currentPath: FileProxy, filename: string): Promise<FileProxy | null> {
        const rootUri = vscode.workspace.getWorkspaceFolder(currentPath.getUri())?.uri;
        const root = rootUri ? new FileProxy(rootUri) : currentPath.getParent();
        // Relative to root
        let fp = root.getRelativeFile(filename);
        if (await fp.exists()) {
            return fp;
        }
        // Relative to each include dir
        for (const [includePath] of this.includeDirs.entries()) {
            const includeDir = root.getRelativeFile(includePath);
            fp = includeDir.getRelativeFile(filename);
            if (await fp.exists()) {
                return fp;
            }
        }
        // Could not resolve file
        return null;
    }

    /**
     * Retrieves the file includes graph
     */
    public async getIncludedFiles(uri: Uri): Promise<Array<string>> {
        const symbolFile = await this.scanFile(uri);
        const returnedFilenames = new Array<string>();
        const current = new FileProxy(uri);
        for (const fn of symbolFile.getIncludedFiles()) {
            const fp = await this.resolveIncludedFile(current, fn.getLabel());
            if (fp) {
                returnedFilenames.push(FileProxy.normalize(fp.getPath()));
            }
        }
        return returnedFilenames;
    }

    /**
     * Get variable by name
     * @param name Name of variable
     * @returns Variable symbol
     */
    getVariableByName(name: string): Symbol | undefined {
        return this.variables.get(name);
    }

    /**
     * Find all the variables starting by word
     * @param word Word to search
     * @return variables found.
     */
    findVariableStartingWith(word: string): Map<string, Symbol> {
        const values = new Map<string, Symbol>();
        const upper = word.toUpperCase();
        for (const [key, value] of this.variables.entries()) {
            if (key.toUpperCase().startsWith(upper)) {
                values.set(key, value);
            }
        }
        return values;
    }

    /**
     * Get label by name
     * @param name Name of label
     * @returns Label symbol
     */
    getLabelByName(name: string): Symbol | undefined {
        return this.labels.get(name);
    }

    /**
     * Find all the labels starting by word
     * @param word Word to search
     * @return labels found.
     */
    findLabelStartingWith(word: string): Map<string, Symbol> {
        const values = new Map<string, Symbol>();
        const upper = word.toUpperCase();
        for (const [key, value] of this.labels.entries()) {
            if (key.toUpperCase().startsWith(upper)) {
                values.set(key, value);
            }
        }
        return values;
    }

    /**
     * Get xref by name
     * @param name Name of label
     * @returns Xref symbol
     */
    getXrefByName(name: string): Symbol | undefined {
        return this.xrefs.get(name);
    }

    /**
     * Find all the xrefs starting by word
     * @param word Word to search
     * @return xrefs found.
     */
    findXrefStartingWith(word: string): Map<string, Symbol> {
        const values = new Map<string, Symbol>();
        const upper = word.toUpperCase();
        for (const [key, value] of this.xrefs.entries()) {
            if (key.toUpperCase().startsWith(upper)) {
                values.set(key, value);
            }
        }
        return values;
    }

    /**
     * Get macro by name
     * @param name Name of macro
     * @returns Macro symbol
     */
    getMacroByName(name: string): Symbol | undefined {
        return this.macros.get(name);
    }

    /**
     * Find all the macros starting by word
     * @param word Word to search
     * @return labels found.
     */
    findMacroStartingWith(word: string): Map<string, Symbol> {
        const values = new Map<string, Symbol>();
        const upper = word.toUpperCase();
        for (const [key, value] of this.macros.entries()) {
            if (key.toUpperCase().startsWith(upper)) {
                values.set(key, value);
            }
        }
        return values;
    }

    /**
     * Get all include directories
     * @returns include dir symbols
     */
    getIncludeDirs(): Map<string, Symbol> {
        return this.includeDirs;
    }
}

