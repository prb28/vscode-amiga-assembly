import { Definition, FoldingRange, FoldingRangeKind, DocumentSymbol, DocumentSymbolProvider, DefinitionProvider, TextDocument, Position, Location, Uri, ReferenceProvider, Range, window } from 'vscode';
import * as vscode from 'vscode';
import { SymbolFile, Symbol } from './symbols';
import { Calc } from './calc';
import { ASMLine } from './parser';
import { FileProxy } from './fsProxy';
import { StringUtils } from './stringUtils';
import { logger } from '@vscode/debugadapter';

/**
 * The M68kDefinitionHandler class provides functionalities to scan, analyze,
 * and handle Amiga Assembly source files by extracting and managing symbols,
 * definitions, references, document symbols, folding ranges, and register usage.
 *
 * @remarks
 * This class implements several provider interfaces including DefinitionProvider,
 * ReferenceProvider, and DocumentSymbolProvider to integrate with VS Code.
 * It supports:
 *
 * - Scanning individual files and entire workspaces for source files matching a
 *   configurable glob pattern.
 * - Extracting symbols such as variables, labels, macros, include directories, and
 *   cross-references from source files.
 * - Resolving definitions, references, and includes to support navigation and refactoring.
 * - Generating folding ranges for code regions and comments.
 * - Evaluating variable formulas including replacing variables within formulas and
 *   calculating their runtime values.
 * - Identifying used registers within selected editor regions and formatting results.
 *
 * @example
 * ```typescript
 * const handler = new M68kDefinitionHandler();
 * await handler.scanWorkspace();
 * const symbols = await handler.provideDocumentSymbols(document);
 * const definition = await handler.provideDefinition(document, position);
 * ```
 *
 * @public
 */
export class M68kDefinitionHandler implements DefinitionProvider, ReferenceProvider, DocumentSymbolProvider {
    static readonly SOURCE_FILES_GLOB = "**/*.{asm,s,i,ASM,S,I}";
    private readonly files = new Map<string, SymbolFile>();
    private readonly definedSymbols = new Map<string, Symbol>();
    private readonly referredSymbols = new Map<string, Map<string, Array<Symbol>>>();
    private readonly variables = new Map<string, Symbol>();
    private readonly labels = new Map<string, Symbol>();
    private readonly macros = new Map<string, Symbol>();
    private readonly includeDirs = new Map<string, Symbol>();
    private readonly xrefs = new Map<string, Symbol>();
    private sortedVariablesNames = new Array<string>();

    /**
     * Provides folding ranges for the given document.
     * @param document The text document to analyze.
     * @returns An array of folding ranges.
     */
    public async provideFoldingRanges(document: TextDocument): Promise<FoldingRange[]> {
        const symbolFile: void | SymbolFile = await this.scanFile(document.uri, document);
        let results = new Array<FoldingRange>();
        if (symbolFile) {
            results = results.concat(this.createFoldingRanges(symbolFile.getLabels(), FoldingRangeKind.Region, false));
            results = results.concat(this.createFoldingRanges(symbolFile.getMacros(), FoldingRangeKind.Region, false));
            results = results.concat(this.createFoldingRanges(symbolFile.getIncludeDirs().concat(symbolFile.getIncludedFiles()), FoldingRangeKind.Imports, true));
            results = results.concat(this.createFoldingRangesForComments(symbolFile.getCommentLines()));
        }
        return results;
    }

    /**
     * Creates folding ranges for comment lines.
     * @param commentLines An array of line numbers containing comments.
     * @returns An array of folding ranges for comments.
     */
    private createFoldingRangesForComments(commentLines: Array<number>): Array<FoldingRange> {
        const results = new Array<FoldingRange>();
        let lastFoldingRange: FoldingRange | undefined = undefined;
        let createNewRange = true;
        for (const commentLine of commentLines) {
            if (lastFoldingRange) {
                createNewRange = (lastFoldingRange.end != commentLine - 1);
                if (!createNewRange) {
                    lastFoldingRange.end = commentLine;
                }
            }
            if (createNewRange) {
                lastFoldingRange = new FoldingRange(commentLine, commentLine, FoldingRangeKind.Comment);
                results.push(lastFoldingRange);
            }
        }
        return results;
    }

    /**
     * Creates folding ranges for symbols.
     * @param symbols An array of symbols to create folding ranges for.
     * @param foldingKind The kind of folding range (e.g., region, imports).
     * @param concatRegions Whether to concatenate adjacent regions.
     * @returns An array of folding ranges.
     */
    private createFoldingRanges(symbols: Array<Symbol>, foldingKind: FoldingRangeKind, concatRegions: boolean): Array<FoldingRange> {
        const results = new Array<FoldingRange>();
        let lastFoldingRange: FoldingRange | undefined = undefined;
        let createNewRange = true;
        symbols.sort((a, b) => a.getFullRange().start.line - b.getFullRange().start.line);
        for (const symbol of symbols) {
            const startLine = symbol.getFullRange().start.line;
            const endLine = symbol.getFullRange().end.line;
            if (concatRegions && lastFoldingRange) {
                createNewRange = (lastFoldingRange.end != startLine - 1);
                if (!createNewRange) {
                    lastFoldingRange.end = endLine;
                }
            }
            if (createNewRange) {
                lastFoldingRange = new FoldingRange(startLine, endLine, foldingKind);
                results.push(lastFoldingRange);
            }
        }
        return results;
    }

    /**
     * Creates document symbols for a label and its children.
     * @param symbol The label symbol to process.
     * @param addedSymbols A set of already added symbols to avoid duplicates.
     * @returns An array of document symbols.
     */
    private createLabelDocumentSymbol(symbol: Symbol, addedSymbols: Set<Symbol>): Array<DocumentSymbol> {
        const results = new Array<DocumentSymbol>();
        if (!addedSymbols.has(symbol)) {
            let symbolKind = vscode.SymbolKind.Class;
            let label = symbol.getLabel();
            if (symbol.isLocalLabel()) {
                symbolKind = vscode.SymbolKind.Method;
                label = label.split(".")[1];
            }
            const dSymbol = new DocumentSymbol(label, "", symbolKind, symbol.getFullRange(), symbol.getRange());
            results.push(dSymbol);
            addedSymbols.add(symbol);
            const children = symbol.getChildren();
            let childrenResults = new Array<DocumentSymbol>();
            for (const child of children) {
                const symbolsArray = this.createLabelDocumentSymbol(child, addedSymbols);
                childrenResults = childrenResults.concat(symbolsArray);
            }
            dSymbol.children = childrenResults;
        }
        return results;
    }

    /**
     * Creates document symbols for a given set of symbols.
     * @param symbols An array of symbols to process.
     * @param symbolKind The kind of symbol (e.g., constant, function).
     * @returns An array of document symbols.
     */
    private createDocumentSymbols(symbols: Array<Symbol>, symbolKind: vscode.SymbolKind): Array<DocumentSymbol> {
        const results = new Array<DocumentSymbol>();
        for (const symbol of symbols) {
            let detail = "";
            const value = symbol.getValue();
            if (value) {
                detail = value;
            }
            const dSymbol = new DocumentSymbol(symbol.getLabel(), detail, symbolKind, symbol.getFullRange(), symbol.getRange());
            results.push(dSymbol);
        }
        return results;
    }

    /**
     * Provides document symbols for the given document.
     * @param document The text document to analyze.
     * @returns An array of document symbols.
     */
    public async provideDocumentSymbols(document: TextDocument): Promise<DocumentSymbol[]> {
        const symbolFile: void | SymbolFile = await this.scanFile(document.uri, document);
        let results = new Array<DocumentSymbol>();
        if (symbolFile) {
            results = results.concat(this.createDocumentSymbols(symbolFile.getVariables(), vscode.SymbolKind.Constant));
            results = results.concat(this.createDocumentSymbols(symbolFile.getMacros(), vscode.SymbolKind.Function));
            results = results.concat(this.createDocumentSymbols(symbolFile.getXrefs(), vscode.SymbolKind.Function));
            results = results.concat(this.createDocumentSymbols(symbolFile.getIncludedFiles(), vscode.SymbolKind.File));
            results = results.concat(this.createDocumentSymbols(symbolFile.getIncludeDirs(), vscode.SymbolKind.File));
            const symbols = symbolFile.getLabels();
            const addedSymbols = new Set<Symbol>();
            for (const symbol of symbols) {
                const symbolsArray = this.createLabelDocumentSymbol(symbol, addedSymbols);
                results = results.concat(symbolsArray);
            }
        }
        return results;
    }

    /**
     * Provides the definition of a symbol at the given position in the document.
     * @param document The text document to analyze.
     * @param position The position of the symbol.
     * @returns The definition location of the symbol.
     */
    public async provideDefinition(document: TextDocument, position: Position): Promise<Definition> {
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

    /**
     * Provides references to a symbol at the given position in the document.
     * @param document The text document to analyze.
     * @param position The position of the symbol.
     * @returns An array of locations where the symbol is referenced.
     */
    public async provideReferences(document: TextDocument, position: Position): Promise<Location[]> {
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

    /**
     * Finds all registers used in the selected regions of the document.
     * @param document The text document to analyze.
     * @param selections The selected regions in the document.
     * @returns An array of used register names.
     */
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
        foundRegisters.sort((a: string, b: string) => a.localeCompare(b));
        return foundRegisters;
    }

    /**
     * Formats the response for used registers, listing used and free registers.
     * @param registers An array of used register names.
     * @returns A formatted string summarizing used and free registers.
     */
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

    /**
     * Provides a formatted string of used registers in the current editor.
     * @returns A formatted string summarizing used registers.
     */
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

    /**
     * Prints a summary of used registers for a given type (e.g., "a" or "d").
     * @param aregs An array of used "a" registers.
     * @param dregs An array of used "d" registers.
     * @returns A formatted string summarizing the registers.
     */
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

    /**
     * Prints a summary of registers for a specific type (e.g., "a" or "d").
     * @param regkey The register type key (e.g., "a" or "d").
     * @param regs An array of register indices.
     * @returns A formatted string summarizing the registers.
     */
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

    /**
     * Retrieves the label at the given range in the document.
     * @param document The text document to analyze.
     * @param range The range of the label.
     * @returns The label as a string.
     */
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

    /**
     * Scans the entire workspace for source files and extracts symbols.
     */
    public async scanWorkspace(): Promise<void> {
        await vscode.workspace.findFiles(M68kDefinitionHandler.SOURCE_FILES_GLOB, null).then(async (filesURI) => {
            const promises = [];
            for (const fURI of filesURI) {
                promises.push(this.scanFile(fURI));
            }
            return Promise.all(promises);
        });
    }

    /**
     * Scans a specific file for symbols and updates internal data structures.
     * @param uri The URI of the file to scan.
     * @param document Optional text document to read from.
     * @returns The symbol file object.
     */
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

    /**
     * Deletes a file and clears its associated symbols from internal data structures.
     * @param uri The URI of the file to delete.
     */
    public deleteFile(uri: Uri) {
        const file = this.files.get(uri.fsPath);
        if (file !== undefined) {
            this.clearSymbolsForFile(file);
            this.files.delete(uri.fsPath);
        }
    }

    /**
     * Retrieves the value of a variable by its name.
     * @param variable The name of the variable.
     * @returns The value of the variable, or undefined if not found.
     */
    public getVariableValue(variable: string): string | undefined {
        const v = this.variables.get(variable);
        if (v !== undefined) {
            return v.getValue();
        }
        return undefined;
    }

    /**
     * Clears all symbols associated with a specific file.
     * @param file The symbol file to clear.
     */
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

    /**
     * Evaluates the formula of a variable and replaces variables within it.
     * @param variable The name of the variable.
     * @returns The evaluated formula as a string, or undefined if not found.
     */
    private evaluateVariableFormula(variable: string): string | undefined {
        const v = this.variables.get(variable);
        if (v !== undefined) {
            let value = v.getValue();
            if ((value !== undefined) && (value.length > 0)) {
                if (RegExp(/[A-Za-z_]*/).exec(value)) {
                    value = this.replaceVariablesInFormula(value);
                }
            }
            return value;
        }
        return undefined;
    }

    /**
     * Replaces variables in a formula with their evaluated values.
     * @param formula The formula to process.
     * @returns The formula with variables replaced.
     */
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

    /**
     * Finds all variables referenced in a formula.
     * @param formula The formula to analyze.
     * @returns An array of variable names.
     */
    public findVariablesInFormula(formula: string): Array<string> {
        const variables = new Array<string>();
        for (const vn of this.sortedVariablesNames) {
            if (formula.indexOf(vn) >= 0) {
                variables.push(vn);
            }
        }
        return variables;
    }

    /**
     * Evaluates a variable and calculates its numeric value.
     * @param variable The name of the variable.
     * @returns The evaluated numeric value.
     */
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

    /**
     * Evaluates a formula and calculates its numeric value.
     * @param formula The formula to evaluate.
     * @param replaceVariables Whether to replace variables in the formula.
     * @returns The evaluated numeric value.
     */
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
     * Resolves an included file relative to the current file or include directories.
     * @param currentPath The path of the current file.
     * @param filename The name of the file to include.
     * @returns The resolved file proxy, or null if not found.
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
     * Retrieves the list of files included by a given file.
     * @param uri The URI of the file to analyze.
     * @returns An array of included file paths.
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
     * Retrieves a variable by its name.
     * @param name The name of the variable.
     * @returns The variable symbol, or undefined if not found.
     */
    public getVariableByName(name: string): Symbol | undefined {
        return this.variables.get(name);
    }

    /**
     * Finds all variables starting with a given word.
     * @param word The prefix to search for.
     * @returns A map of matching variables.
     */
    public findVariableStartingWith(word: string): Map<string, Symbol> {
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
     * Retrieves a label by its name.
     * @param name The name of the label.
     * @returns The label symbol, or undefined if not found.
     */
    public getLabelByName(name: string): Symbol | undefined {
        return this.labels.get(name);
    }

    /**
     * Finds all labels starting with a given word.
     * @param word The prefix to search for.
     * @returns A map of matching labels.
     */
    public findLabelStartingWith(word: string): Map<string, Symbol> {
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
     * Retrieves a cross-reference (xref) by its name.
     * @param name The name of the xref.
     * @returns The xref symbol, or undefined if not found.
     */
    public getXrefByName(name: string): Symbol | undefined {
        return this.xrefs.get(name);
    }

    /**
     * Finds all cross-references (xrefs) starting with a given word.
     * @param word The prefix to search for.
     * @returns A map of matching xrefs.
     */
    public findXrefStartingWith(word: string): Map<string, Symbol> {
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
     * Retrieves a macro by its name.
     * @param name The name of the macro.
     * @returns The macro symbol, or undefined if not found.
     */
    public getMacroByName(name: string): Symbol | undefined {
        return this.macros.get(name);
    }

    /**
     * Finds all macros starting with a given word.
     * @param word The prefix to search for.
     * @returns A map of matching macros.
     */
    public findMacroStartingWith(word: string): Map<string, Symbol> {
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
     * Retrieves all include directories.
     * @returns A map of include directory symbols.
     */
    public getIncludeDirs(): Map<string, Symbol> {
        return this.includeDirs;
    }
}

