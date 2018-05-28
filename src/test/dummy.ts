
import { Range, Position, TextDocument, TextLine, Uri, EndOfLine, FormattingOptions, WorkspaceConfiguration } from 'vscode';

/**
 * Represents a fake text document for tests
 */
export class DummyTextDocument implements TextDocument {
    uri: Uri = Uri.parse('file:///file.s');
    fileName: string = "myfile";
    readonly isUntitled: boolean = true;
    readonly languageId: string = "m68k";
    readonly version: number = 1;
    readonly isDirty: boolean = false;
    readonly isClosed: boolean = false;
    readonly eol: EndOfLine = EndOfLine.LF;
    lineCount: number = 0;
    lines = new Array<TextLine>();
    public addLine(line: string) {
        let newLine = new DummyTextLine(line);
        this.lines.push(newLine);
        this.lineCount += 1;
    }
    public save(): Thenable<boolean> {
        return new Promise((resolve, reject) => { });
    }
    public lineAt(positionOrNumberParameter: number | Position): TextLine {
        let line: TextLine;
        if (positionOrNumberParameter instanceof Position) {
            line = this.lines[positionOrNumberParameter.line];
        } else {
            line = this.lines[positionOrNumberParameter];
        }
        if (!line) {
            return new DummyTextLine("");
        }
        return line;
    }
    public offsetAt(position: Position): number {
        return 1;
    }
    positionAt(offset: number): Position {
        return new Position(0, 0);
    }
    getText(range?: Range): string {
        let s = "";
        let startLine = 0;
        let endLine = this.lineCount;
        let startChar = -1;
        let endChar = -1;
        if (range) {
            if (range.start.line === range.end.line) {
                let line = this.lineAt(range.start.line);
                return line.text.substring(range.start.character, range.end.character);
            } else {
                startLine = range.start.line;
                endLine = range.end.line;
                startChar = range.start.character;
                endChar = range.end.character;
            }
        }
        if (startChar >= 0) {
            s += this.lineAt(startLine).text;
        } else {
            s += this.lineAt(startLine).text;
        }
        for (let i = startLine + 1; i < endLine - 1; i++) {
            s += this.lineAt(startLine).text;
        }
        if (endChar >= 0) {
            s += this.lineAt(startLine).text.substring(0, endChar);
        } else {
            s += this.lineAt(startLine);
        }
        return s;
    }
    public getWordAt(str: string, pos: number): string {
        // Perform type conversions.
        str = String(str);
        pos = Number(pos) >>> 0;
        // Search for the word's beginning and end.
        var left = str.slice(0, pos + 1).search(/\S+$/),
            right = str.slice(pos).search(/\s/);
        // The last word in the string is a special case.
        if (right < 0) {
            return str.slice(left);
        }
        // Return the word, using the located bounds to extract it from the string.
        return str.slice(left, right + pos);
    }
    public getWordRangeAt(line: TextLine, pos: number): Range {
        let str = line.text;
        // Perform type conversions.
        str = String(str);
        pos = Number(pos) >>> 0;
        // Search for the word's beginning and end.
        var left = str.slice(0, pos + 1).search(/[^\s,\.;:\$#]+$/),
            right = str.slice(pos).search(/[\s,\.;:\$#]/);
        // The last word in the string is a special case.
        if (right < 0) {
            return new Range(new Position(line.lineNumber, left), new Position(line.lineNumber, str.length));
        }
        // Return the word, using the located bounds to extract it from the string.
        return new Range(new Position(line.lineNumber, left), new Position(line.lineNumber, right + pos));
    }
    getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined {
        let line = this.lineAt(position.line);
        return this.getWordRangeAt(line, position.character);
    }
    validateRange(range: Range): Range {
        return new Range(new Position(0, 0), new Position(0, 1));
    }
    validatePosition(position: Position): Position {
        return new Position(0, 0);
    }

}


/**
 * Represents a fake line of text for tests
 */
export class DummyTextLine implements TextLine {
    lineNumber: number = 0;
    text: string = "";
    range: Range = new Range(new Position(0, 0), new Position(0, 1));
    rangeIncludingLineBreak: Range = new Range(new Position(0, 0), new Position(0, 1));
    firstNonWhitespaceCharacterIndex: number = 1;
    isEmptyOrWhitespace: boolean = false;
    constructor(text: string) {
        this.text = text;
        this.range = new Range(new Position(0, 0), new Position(0, text.length));
    }
}


/**
 * Value-object describing what options formatting should use.
 */
export class DummyFormattingOptions implements FormattingOptions {
    tabSize: number = 4;
    insertSpaces: boolean = true;
    [key: string]: boolean | number | string;
}

/**
 * Dummy configuration for tests
 */
export class DummyWorkspaceConfiguration implements WorkspaceConfiguration {
    map = new Map<any, any>();
    public get<T>(section: string): T | undefined {
        return this.map.get(section);
    }
    has(section: string): boolean {
        return this.map.has(section);
    }
    inspect<T>(section: string): { key: string; defaultValue?: T; globalValue?: T; workspaceValue?: T, workspaceFolderValue?: T } | undefined {
        return undefined;
    }
    update(section: string, value: any): Thenable<void> {
        this.map.set(section, value);
        return new Promise((resolve, reject) => { });
    }

    readonly [key: string]: any;
}