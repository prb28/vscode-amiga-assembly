//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { M68kFormatter, DocumentFormatterConfiguration } from '../formatter';
import { ASMDocument } from '../parser';
import { TextEdit, Range, Position, CancellationTokenSource } from 'vscode';
import { DummyFormattingOptions, DummyTextDocument, DummyWorkspaceConfiguration } from './dummy';

function getEditsForLine(line: string): TextEdit[] {
    let f = new M68kFormatter();
    let document = new DummyTextDocument();
    document.addLine(line);
    let asmDocument = new ASMDocument();
    asmDocument.parse(document);
    asmDocument.maxLabelSize = 9;
    asmDocument.maxInstructionSize = 7;
    asmDocument.maxDataSize = 11;
    let conf = new DocumentFormatterConfiguration(2, 4, 4, 1, 1);
    return f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[0], conf);
}

function getEditsForLineOnType(line: string): TextEdit[] {
    let f = new M68kFormatter();
    let document = new DummyTextDocument();
    document.addLine(line);
    let asmDocument = new ASMDocument();
    asmDocument.parse(document);
    asmDocument.maxLabelSize = 9;
    asmDocument.maxInstructionSize = 7;
    asmDocument.maxDataSize = 11;
    let asmLine = asmDocument.asmLinesArray[0];
    let conf = new DocumentFormatterConfiguration(2, 4, 4, 1, 1);
    return f.computeEditsForLineOnType(asmDocument, asmLine, conf, asmLine.end);
}

// tslint:disable:no-unused-expression
describe("Formatter Tests", function () {
    it("Should format a full line", function () {
        let edits = getEditsForLine("\t.mylabel\t   move.l #mempos,d1        ; mycomment   ");
        let i = 0;
        expect(edits.length).to.be.equal(4);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 30), new Position(0, 38)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 19), new Position(0, 20)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 9), new Position(0, 13)), " ".repeat(3)));
        expect(edits[i++]).to.be.eql(TextEdit.delete(new Range(new Position(0, 0), new Position(0, 1))));
    });
    it("Should format a full line without comment", function () {
        let edits = getEditsForLine("\t   move.l #mempos,d1        ; mycomment   ");
        let i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 21), new Position(0, 29)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 10), new Position(0, 11)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(11)));
    });
    it("Should format a line with instruction and data", function () {
        let edits = getEditsForLine("\t   move.l #mempos,d1     ");
        let i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 10), new Position(0, 11)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(11)));
    });
    it("Should format a line with only an instruction", function () {
        let edits = getEditsForLine("\t   rts      ");
        let i = 0;
        expect(edits.length).to.be.equal(1);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(11)));
    });
    it("Should format a line without data", function () {
        let edits = getEditsForLine("\t.mylabel\t   rts        ; my comment");
        let i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 16), new Position(0, 24)), " ".repeat(23)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 9), new Position(0, 13)), " ".repeat(3)));
        expect(edits[i++]).to.be.eql(TextEdit.delete(new Range(new Position(0, 0), new Position(0, 1))));
    });
    it("Should format a line on typing with a label", function () {
        let edits = getEditsForLineOnType(".mylabel ");
        expect(edits.length).to.be.equal(0);
    });
    it("Should format a line on typing with an instruction", function () {
        let edits = getEditsForLineOnType("\t   move.l ");
        expect(edits[0]).to.be.eql(TextEdit.insert(new Position(0, 10), " ".repeat(4)));

    });
    it("Should format a line on typing with a full", function () {
        let edits = getEditsForLineOnType("\t.mylabel\t   move.l #mempos,d1        ; my comment");
        let i = 0;
        expect(edits.length).to.be.equal(4);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 30), new Position(0, 38)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 19), new Position(0, 20)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 9), new Position(0, 13)), " ".repeat(3)));
        expect(edits[i++]).to.be.eql(TextEdit.delete(new Range(new Position(0, 0), new Position(0, 1))));

    });
    it("Should add pad to the end of a string", function () {
        let f = new M68kFormatter();
        expect(f.getEndPad("aa", 10)).to.be.equal("        ");
        expect(f.getEndPad("aaaa", 3)).to.be.equal("");
    });
    it("Should retrieve 1 for a negative property", function () {
        let conf = new DummyWorkspaceConfiguration();
        expect(DocumentFormatterConfiguration.retrieveProperty(conf, 'testconf', 12)).to.be.equal(12);
        conf.update('testconf', -1);
        expect(conf.has('testconf')).to.be.true;
        expect(DocumentFormatterConfiguration.retrieveProperty(conf, 'testconf', 12)).to.be.equal(1);
        conf.update('testconf', 5);
        expect(DocumentFormatterConfiguration.retrieveProperty(conf, 'testconf', 12)).to.be.equal(5);
    });
    describe("OnTypeFormattingEditProvider", function () {
        it("Should return no editing command on a empty document", function () {
            let f = new M68kFormatter();
            const document = new DummyTextDocument();
            let position: Position = new Position(0, 1);
            let ch = "";
            let options = new DummyFormattingOptions();
            let tockenEmitter = new CancellationTokenSource();
            let results = f.provideOnTypeFormattingEdits(document, position, ch, options, tockenEmitter.token);
            if ((results) && (results instanceof Array)) {
                expect(results.length).to.be.equal(0);
            }
        });
        it("Should return an insert spaces command after an instruction", function () {
            let f = new M68kFormatter();
            const document = new DummyTextDocument();
            let ch = "";
            let options = new DummyFormattingOptions();
            let tockenEmitter = new CancellationTokenSource();
            document.addLine("\t   move.l #mempos,d1        ; mycomment   ");
            document.addLine("   rts ");
            let position: Position = new Position(1, 7);
            let edits = f.provideOnTypeFormattingEdits(document, position, ch, options, tockenEmitter.token);
            expect(edits).to.not.be.undefined;
            if (edits instanceof Array) {
                expect(edits.length).to.be.equal(1);
                expect(edits[0]).to.be.eql(TextEdit.insert(new Position(0, 6), " ".repeat(6)));
            }
        });
    });
    it("Should format an asignment", function () {
        let f = new M68kFormatter();
        let document = new DummyTextDocument();
        document.addLine("myvar2  equ 28  ;comment");
        document.addLine("foo = 43");
        // expected
        //myvar2 equ 28  ;comment
        //foo      = 43
        let asmDocument = new ASMDocument();
        asmDocument.parse(document);
        let conf = new DocumentFormatterConfiguration(1, 1, 4, 1, 1);
        let edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[0], conf);
        let i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 14), new Position(0, 16)), " ".repeat(4)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 11), new Position(0, 12)), " ".repeat(1)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 6), new Position(0, 8)), " ".repeat(1)));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[1], conf);
        i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 5), new Position(0, 6)), " ".repeat(1)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 3), new Position(0, 4)), " ".repeat(6)));
    });

});

