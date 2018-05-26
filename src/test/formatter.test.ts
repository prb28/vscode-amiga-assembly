//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { mock } from 'ts-mockito';
import { M68kFormatter } from '../formatter';
import { ASMLine } from '../parser';
import { TextEdit, Range, Position, TextDocument, CancellationTokenSource } from 'vscode';
import { DummyFormattingOptions, DummyTextDocument } from './dummy';

// tslint:disable:no-unused-expression
describe("Formatter Tests", function () {
    it("Should format a full line", function () {
        let f = new M68kFormatter();
        let asmLine = new ASMLine("\t.mylabel\t   move.l #mempos,d1        ; mycomment   ");
        let edits: TextEdit[] = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        let i = 0;
        expect(edits.length).to.be.equal(4);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 30), new Position(0, 38)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 19), new Position(0, 20)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 9), new Position(0, 13)), " ".repeat(3)));
        expect(edits[i++]).to.be.eql(TextEdit.delete(new Range(new Position(0, 0), new Position(0, 1))));
    });
    it("Should format a full line without comment", function () {
        let f = new M68kFormatter();
        let asmLine: ASMLine;
        let edits: TextEdit[];
        let i = 0;
        asmLine = new ASMLine("\t   move.l #mempos,d1        ; mycomment   ");
        edits = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 21), new Position(0, 29)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 10), new Position(0, 11)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(11)));
    });
    it("Should format a line with instruction and data", function () {
        let f = new M68kFormatter();
        let asmLine: ASMLine;
        let edits: TextEdit[];
        let i = 0;
        asmLine = new ASMLine("\t   move.l #mempos,d1     ");
        edits = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 10), new Position(0, 11)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(11)));
    });
    it("Should format a line with only an instruction", function () {
        let f = new M68kFormatter();
        let asmLine: ASMLine;
        let edits: TextEdit[];
        let i = 0;
        asmLine = new ASMLine("\t   rts      ");
        edits = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        expect(edits.length).to.be.equal(1);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(11)));
    });
    it("Should format a line without data", function () {
        let f = new M68kFormatter();
        let asmLine: ASMLine;
        let edits: TextEdit[];
        let i = 0;
        asmLine = new ASMLine("\t.mylabel\t   rts        ; my comment");
        edits = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 16), new Position(0, 24)), " ".repeat(23)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 9), new Position(0, 13)), " ".repeat(3)));
        expect(edits[i++]).to.be.eql(TextEdit.delete(new Range(new Position(0, 0), new Position(0, 1))));
    });

    it("Should format a line on typing with a label", function () {
        let f = new M68kFormatter();
        let asmLine = new ASMLine(".mylabel ");
        let edits: TextEdit[] = f.computeEditsForLineOnType(asmLine, 9, 2, 7, 4, 11, 4, asmLine.end);
        expect(edits.length).to.be.equal(0);
    });
    it("Should format a line on typing with an instruction", function () {
        let f = new M68kFormatter();
        let asmLine: ASMLine;
        let edits: TextEdit[];
        let i = 0;
        asmLine = new ASMLine("\t   move.l ");
        edits = f.computeEditsForLineOnType(asmLine, 9, 2, 7, 4, 11, 4, asmLine.end);
        expect(edits[i++]).to.be.eql(TextEdit.insert(new Position(0, 10), " ".repeat(4)));

    });
    it("Should format a line on typing with a full", function () {
        let f = new M68kFormatter();
        let asmLine: ASMLine;
        let edits: TextEdit[];
        let i = 0;
        asmLine = new ASMLine("\t.mylabel\t   move.l #mempos,d1        ; my comment");
        edits = f.computeEditsForLineOnType(asmLine, 9, 2, 7, 4, 11, 4, asmLine.end);
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
    describe("OnTypeFormattingEditProvider", function () {
        it("Should return no editing command on a empty document", function () {
            let f = new M68kFormatter();
            const document: TextDocument = mock(DummyTextDocument);
            let position: Position = new Position(0, 1);
            let ch = "";
            let options = new DummyFormattingOptions();
            let tockenEmitter = new CancellationTokenSource();
            let results = f.provideOnTypeFormattingEdits(document, position, ch, options, tockenEmitter.token);
            expect(results).to.not.be.undefined;
            expect(results).to.be.empty;
        });
        it.only("Should return an insert spaces command after an instruction", function () {
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
                expect(edits[0]).to.be.eql(TextEdit.insert(new Position(0, 6), " ".repeat(3)));
            }
        });
    });
});

