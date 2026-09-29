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
    // A name can be defined in several files: all definitions are kept
    private readonly variables = new Map<string, Array<Symbol>>();
    private readonly labels = new Map<string, Array<Symbol>>();
    private readonly macros = new Map<string, Array<Symbol>>();
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
                label = symbol.getLocalName();
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
            if (!Symbol.isLocalLabelName(label)) {
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
            this.addDefinitions(this.variables, file.getVariables());
            // sort variables
            this.sortedVariablesNames = Array.from(this.variables.keys());
            this.sortedVariablesNames.sort((a, b) => {
                return b.length - a.length;
            });

            this.addDefinitions(this.labels, file.getLabels());
            this.addDefinitions(this.macros, file.getMacros());
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
        const v = this.selectDefinition(this.variables, variable);
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
            this.includeDirs
        ];
        symbolMaps.forEach(map => {
            map.forEach((value, key) => {
                if (value.getFile() === file) {
                    map.delete(key);
                }
            });
        });
        // Only remove this file's definitions: other files may define the same name
        for (const map of [this.variables, this.labels, this.macros]) {
            map.forEach((definitions, key) => {
                const remaining = definitions.filter(s => s.getFile() !== file);
                if (remaining.length > 0) {
                    map.set(key, remaining);
                } else {
                    map.delete(key);
                }
            });
        }
    }

    /**
     * Adds symbols to a map keeping all the definitions of a name.
     * @param map The map of definitions.
     * @param symbols The symbols to add.
     */
    private addDefinitions(map: Map<string, Array<Symbol>>, symbols: Array<Symbol>): void {
        for (const s of symbols) {
            let definitions = map.get(s.getLabel());
            if (definitions === undefined) {
                definitions = new Array<Symbol>();
                map.set(s.getLabel(), definitions);
            }
            definitions.push(s);
        }
    }

    /**
     * Selects the definition of a name to use in a context.
     * Definitions from the context file come first, then from the files it includes
     * (directly or not), and then the last scanned definition.
     * @param map The map of definitions.
     * @param name The name of the symbol.
     * @param scope Paths of the context file and its included files (first is the context file).
     * @returns The selected definition, or undefined if not found.
     */
    private selectDefinition(map: Map<string, Array<Symbol>>, name: string, scope?: Array<string>): Symbol | undefined {
        const definitions = map.get(name);
        if (definitions === undefined || definitions.length === 0) {
            return undefined;
        }
        if (scope) {
            for (const path of scope) {
                const found = definitions.find(s => s.getFile().getUri().fsPath === path);
                if (found) {
                    return found;
                }
            }
        }
        return definitions[definitions.length - 1];
    }

    /**
     * Computes the file and all the files it includes, directly or not.
     * @param uri The URI of the context file.
     * @returns The paths of the files, starting with the context file.
     */
    private async getIncludeScope(uri: Uri): Promise<Array<string>> {
        const scope = [uri.fsPath];
        for (let i = 0; i < scope.length; i++) {
            const file = this.files.get(scope[i]);
            if (file) {
                const current = new FileProxy(file.getUri());
                for (const included of file.getIncludedFiles()) {
                    const fp = await this.resolveIncludedFile(current, included.getLabel());
                    if (fp) {
                        const path = fp.getUri().fsPath;
                        if (!scope.includes(path)) {
                            scope.push(path);
                        }
                    }
                }
            }
        }
        return scope;
    }

    /**
     * Evaluates the formula of a variable and replaces variables within it.
     * @param variable The name of the variable.
     * @param scope Files used to select the variables definitions.
     * @returns The evaluated formula as a string, or undefined if not found.
     */
    private evaluateVariableFormula(variable: string, scope?: Array<string>): string | undefined {
        const v = this.selectDefinition(this.variables, variable, scope);
        if (v !== undefined) {
            let value = v.getValue();
            if ((value !== undefined) && (value.length > 0)) {
                if (RegExp(/[A-Za-z_]*/).exec(value)) {
                    value = this.replaceVariablesInFormula(value, scope);
                }
            }
            return value;
        }
        return undefined;
    }

    /**
     * Replaces variables in a formula with their evaluated values.
     * @param formula The formula to process.
     * @param scope Files used to select the variables definitions.
     * @returns The formula with variables replaced.
     */
    private replaceVariablesInFormula(formula: string, scope?: Array<string>): string {
        let newFormula = formula;
        const variables = this.findVariablesInFormula(newFormula);
        for (const vn of variables) {
            const evaluatedFormula = this.evaluateVariableFormula(vn, scope);
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
     * @param contextUri Optional file from which the variable is used: its definitions (or the ones of its includes) are preferred.
     * @returns The evaluated numeric value.
     */
    public async evaluateVariable(variable: string, contextUri?: Uri): Promise<number> {
        const calc = new Calc();
        const formula = this.evaluateVariableFormula(variable, await this.getScope(contextUri));
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
     * @param contextUri Optional file from which the formula is used: its variables definitions (or the ones of its includes) are preferred.
     * @returns The evaluated numeric value.
     */
    public async evaluateFormula(formula: string, replaceVariables?: boolean, contextUri?: Uri): Promise<number> {
        let newFormula: string;
        if (replaceVariables === false) {
            newFormula = formula;
        } else {
            newFormula = this.replaceVariablesInFormula(formula, await this.getScope(contextUri));
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
     * @param contextUri Optional file from which the variable is used: its definitions (or the ones of its includes) are preferred.
     * @returns The variable symbol, or undefined if not found.
     */
    public async getVariableByName(name: string, contextUri?: Uri): Promise<Symbol | undefined> {
        return this.selectDefinition(this.variables, name, await this.getScope(contextUri));
    }

    /**
     * Finds all variables starting with a given word.
     * @param word The prefix to search for.
     * @param contextUri Optional file from which the variables are used: its definitions (or the ones of its includes) are preferred.
     * @returns A map of matching variables.
     */
    public async findVariableStartingWith(word: string, contextUri?: Uri): Promise<Map<string, Symbol>> {
        return this.findDefinitionsStartingWith(this.variables, word, await this.getScope(contextUri));
    }

    /**
     * Retrieves a label by its name.
     * @param name The name of the label.
     * @param contextUri Optional file from which the label is used: its definitions (or the ones of its includes) are preferred.
     * @returns The label symbol, or undefined if not found.
     */
    public async getLabelByName(name: string, contextUri?: Uri): Promise<Symbol | undefined> {
        return this.selectDefinition(this.labels, name, await this.getScope(contextUri));
    }

    /**
     * Finds all labels starting with a given word.
     * @param word The prefix to search for.
     * @param contextUri Optional file from which the labels are used: its definitions (or the ones of its includes) are preferred.
     * @returns A map of matching labels.
     */
    public async findLabelStartingWith(word: string, contextUri?: Uri): Promise<Map<string, Symbol>> {
        return this.findDefinitionsStartingWith(this.labels, word, await this.getScope(contextUri));
    }

    /**
     * Lists the definitions of a variable visible from a file.
     * @param name The name of the variable.
     * @param contextUri Optional file from which the variable is used.
     * @returns The used definition first, then the other definitions from the file or its includes.
     */
    public async getVariableDefinitions(name: string, contextUri?: Uri): Promise<Array<Symbol>> {
        return this.listDefinitions(this.variables, name, await this.getScope(contextUri));
    }

    /**
     * Lists the definitions of a label visible from a file.
     * @param name The name of the label.
     * @param contextUri Optional file from which the label is used.
     * @returns The used definition first, then the other definitions from the file or its includes.
     */
    public async getLabelDefinitions(name: string, contextUri?: Uri): Promise<Array<Symbol>> {
        return this.listDefinitions(this.labels, name, await this.getScope(contextUri));
    }

    /**
     * Lists the definitions of a macro visible from a file.
     * @param name The name of the macro.
     * @param contextUri Optional file from which the macro is used.
     * @returns The used definition first, then the other definitions from the file or its includes.
     */
    public async getMacroDefinitions(name: string, contextUri?: Uri): Promise<Array<Symbol>> {
        return this.listDefinitions(this.macros, name, await this.getScope(contextUri));
    }

    /**
     * Lists the definitions of a name visible in a context.
     * @param map The map of definitions.
     * @param name The name of the symbol.
     * @param scope Files used to select the definitions.
     * @returns The selected definition first, then the other definitions in the scope order.
     */
    private listDefinitions(map: Map<string, Array<Symbol>>, name: string, scope?: Array<string>): Array<Symbol> {
        const selected = this.selectDefinition(map, name, scope);
        if (selected === undefined) {
            return [];
        }
        const results = [selected];
        const definitions = map.get(name) ?? [];
        for (const path of scope ?? []) {
            for (const s of definitions) {
                if (s !== selected && s.getFile().getUri().fsPath === path) {
                    results.push(s);
                }
            }
        }
        return results;
    }

    /**
     * Computes the include scope of an optional context file.
     * @param contextUri The context file.
     * @returns The scope, or undefined if there is no context file.
     */
    private async getScope(contextUri?: Uri): Promise<Array<string> | undefined> {
        return contextUri ? this.getIncludeScope(contextUri) : undefined;
    }

    /**
     * Finds all names starting with a given word, with the definition to use in a context.
     * @param map The map of definitions.
     * @param word The prefix to search for.
     * @param scope Files used to select the definitions.
     * @returns A map of matching definitions.
     */
    private findDefinitionsStartingWith(map: Map<string, Array<Symbol>>, word: string, scope?: Array<string>): Map<string, Symbol> {
        const values = new Map<string, Symbol>();
        const upper = word.toUpperCase();
        for (const key of map.keys()) {
            if (key.toUpperCase().startsWith(upper)) {
                const value = this.selectDefinition(map, key, scope);
                if (value) {
                    values.set(key, value);
                }
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
     * @param contextUri Optional file from which the macro is used: its definitions (or the ones of its includes) are preferred.
     * @returns The macro symbol, or undefined if not found.
     */
    public async getMacroByName(name: string, contextUri?: Uri): Promise<Symbol | undefined> {
        return this.selectDefinition(this.macros, name, await this.getScope(contextUri));
    }

    /**
     * Finds all macros starting with a given word.
     * @param word The prefix to search for.
     * @param contextUri Optional file from which the macros are used: its definitions (or the ones of its includes) are preferred.
     * @returns A map of matching macros.
     */
    public async findMacroStartingWith(word: string, contextUri?: Uri): Promise<Map<string, Symbol>> {
        return this.findDefinitionsStartingWith(this.macros, word, await this.getScope(contextUri));
    }

    /**
     * Retrieves all include directories.
     * @returns A map of include directory symbols.
     */
    public getIncludeDirs(): Map<string, Symbol> {
        return this.includeDirs;
    }
}

