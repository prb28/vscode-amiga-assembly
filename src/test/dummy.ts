
import { Range, Position, TextDocument, TextLine, Uri, EndOfLine, FormattingOptions } from 'vscode';

/**
 * Represents a fake text document for tests
 */
export class DummyTextDocument implements TextDocument {
    readonly uri: Uri = Uri.parse('file://file.s');
    readonly fileName: string = "myfile";
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
        if (positionOrNumberParameter) {
            if (positionOrNumberParameter instanceof Position) {
                return this.lines[positionOrNumberParameter.line];
            } else {
                return this.lines[positionOrNumberParameter];
            }
        }
        return new DummyTextLine("");
    }
    public offsetAt(position: Position): number {
        return 1;
    }
    positionAt(offset: number): Position {
        return new Position(0, 0);
    }
    getText(range?: Range): string {
        return "";
    }
    getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined {
        return undefined;
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