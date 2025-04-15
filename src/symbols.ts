import { Range, Uri, workspace, TextDocument, TextLine } from 'vscode';
import { ASMLine, ASMLineType } from './parser';
import { StringUtils } from './stringUtils';

export class SymbolFile {
    private readonly uri: Uri;
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
    private readonly commentLines = new Array<number>();

    constructor(uri: Uri) {
        this.uri = uri;
    }

    public async readFile(): Promise<SymbolFile> {
        // Read the file
        const document = await workspace.openTextDocument(this.uri);
        this.readDocument(document);
        return this;
    }

    /**
     * Processes the provided text document by parsing each line and identifying various assembly components such as labels,
     * macros, variables, subroutines, and include directives. The function clears any existing symbol data before beginning
     * the scan, then iterates through all lines in the document to:
     *
     * - Extract symbols from labels or variables using pattern matching.
     * - Identify macro definitions in both `<name> macro` and `macro <name>` forms.
     * - Collect data symbols for xref, and include directives.
     * - Track subroutine calls and manage parent-child relationships between labels.
     * - Maintain multiple lists (definedSymbols, referredSymbols, labels, macros, variables, subroutines, includeDirs, includedFiles)
     *   to organize and reference symbols accurately.
     * - Update symbol ranges to cover the correct region in the document, especially for macros and include symbols.
     *
     * @param document - The text document to be analyzed and from which assembly symbols are extracted.
     */
    public readDocument(document: TextDocument): void {
        this.clear();
        this.document = document;
        let lastLabel: Symbol | null = null;
        let lastParentLabel: Symbol | null = null;
        let lastNonEmptyLine: TextLine | null = null;
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const asmLine = new ASMLine(line.text, line);
            if (asmLine.lineType == ASMLineType.COMMENT) {
                this.commentLines.push(line.lineNumber);
                continue;
            }
            let [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            if ((symbol !== undefined) && (range !== undefined)) {
                this.definedSymbols.push(new Symbol(symbol, this, range));
            } else {
                const results = asmLine.getSymbolFromData();
                for (const element of results) {
                    [symbol, range] = element;
                    if ((symbol !== undefined) && (range !== undefined)) {
                        this.referredSymbols.push(new Symbol(symbol, this, range));
                    }
                }
            }
            const instruct = asmLine.instruction.toLowerCase();
            if (asmLine.label.length > 0) {
                let label = asmLine.label.replace(":", "");
                const isLocal = label.startsWith(".");
                if (isLocal) {
                    label = lastParentLabel?.getLabel() + label;
                }
                const s = new Symbol(label, this, asmLine.labelRange);
                // Is this actually a macro definition in `<name> macro` syntax?
                if (instruct.startsWith("macro")) {
                    this.macros.push(s);
                    this.definedSymbols.push(s);
                } else {
                    this.labels.push(s);
                    if (lastNonEmptyLine) {
                        lastLabel?.setFullRange(new Range(lastLabel.getRange().start, lastNonEmptyLine.range.end));
                        lastParentLabel?.setFullRange(new Range(lastParentLabel.getRange().start, lastNonEmptyLine.range.end));
                    }
                    if (!isLocal || !lastParentLabel) {
                        lastParentLabel = s;
                    } else if (isLocal && lastParentLabel) {
                        s.setParent(lastParentLabel.getLabel());
                        lastParentLabel.addChild(s);
                    }
                    lastLabel = s;
                }
            } else if (instruct.startsWith("xref")) {
                const s = new Symbol(asmLine.data, this, asmLine.dataRange);
                this.xrefs.push(s);
                this.definedSymbols.push(s);
            } else if (instruct.startsWith("macro")) {
                // Handle ` macro <name>` syntax
                const s = new Symbol(asmLine.data, this, asmLine.dataRange);
                this.macros.push(s);
                this.definedSymbols.push(s);
            } else if (instruct.startsWith("endm")) {
                const lastMacro = this.macros.at(this.macros.length - 1);
                if (lastMacro) {
                    lastMacro.setFullRange(new Range(lastMacro.getRange().start, line.range.end));
                }
            }
            if (asmLine.variable.length > 0) {
                const variableSymbol = new Symbol(asmLine.variable, this, asmLine.variableRange, asmLine.value)
                variableSymbol.setFullRange(new Range(line.range.start, line.range.end));
                this.variables.push(variableSymbol);
            }
            if (instruct.indexOf("bsr") >= 0) {
                this.subroutines.push(asmLine.data);
            } else if (instruct.startsWith("dc") || instruct.startsWith("ds") || instruct.startsWith("incbin")) {
                if (lastParentLabel) {
                    this.dcLabel.push(lastParentLabel);
                }
            } else if (instruct === "incdir") {
                const includeSymbol = new Symbol(StringUtils.parseQuoted(asmLine.data), this, asmLine.dataRange);
                this.includeDirs.push(includeSymbol);
                this.definedSymbols.push(includeSymbol);
                includeSymbol.setFullRange(new Range(asmLine.instructionRange.start, line.range.end));
            } else if (instruct === "include") {
                const includeSymbol = new Symbol(StringUtils.parseQuoted(asmLine.data), this, asmLine.dataRange);
                this.includedFiles.push(includeSymbol);
                this.definedSymbols.push(includeSymbol);
                includeSymbol.setFullRange(new Range(asmLine.instructionRange.start, line.range.end));
            }
            if (!line.isEmptyOrWhitespace) {
                lastNonEmptyLine = line;
            }
        }
        if (lastNonEmptyLine) {
            lastLabel?.setFullRange(new Range(lastLabel.getRange().start, lastNonEmptyLine.range.end));
            lastParentLabel?.setFullRange(new Range(lastParentLabel.getRange().start, lastNonEmptyLine.range.end));
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
    public getCommentLines(): Array<number> {
        return this.commentLines;
    }
}

export class Symbol {
    private readonly label: string;
    private readonly file: SymbolFile;
    private range: Range;
    private fullRange: Range;
    private readonly value?: string;
    private parent = "";
    private commentBlock: string | null = null;
    private readonly children: Array<Symbol> = new Array<Symbol>();
    constructor(label: string, file: SymbolFile, range: Range, value?: string) {
        this.label = label;
        this.file = file;
        this.range = range;
        this.value = value;
        this.parent = label;
        this.fullRange = new Range(range.start, range.end);
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
    public getFullRange(): Range {
        return this.fullRange;
    }
    public setFullRange(range: Range): void {
        this.fullRange = range;
    }
    public getChildren(): Array<Symbol> {
        return this.children;
    }
    public addChild(child: Symbol): void {
        this.children.push(child);
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
    public isLocalLabel(): boolean {
        return this.label.includes(".");
    }
    public getCommentBlock(): string {
        if (this.commentBlock === null) {
            const commentLines: string[] = [];
            const doc = this.file.getDocument();
            if (doc) {
                const line = this.range.start.line;
                // Current line comment:
                const currentLine = doc.lineAt(line).text;
                const currentLineMatch = RegExp(/;\s?(.*)/).exec(currentLine);
                if (currentLineMatch) {
                    commentLines.push(currentLineMatch[1].trim());
                } else {
                    // Preceding line comments:
                    for (let i = line - 1; i >= 0; i--) {
                        const match = RegExp(/^[;*]+-*\s?(.*)/).exec(doc.lineAt(i).text);
                        if (!match) {
                            break;
                        }
                        commentLines.unshift(match[1].trim());
                    }
                    // Subsequent line comments:
                    for (let i = line + 1; i < doc.lineCount; i++) {
                        const match = RegExp(/^[;*]+-*\s?(.*)/).exec(doc.lineAt(i).text);
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