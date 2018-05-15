//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { M68kFormatter } from '../formatter';
import { ASMLine } from '../parser';
import { TextEdit, Range, Position } from 'vscode';

// tslint:disable:no-unused-expression
describe("Formatter Tests", function () {
    it("Should format full line", function () {
        let f = new M68kFormatter();
        let asmLine = new ASMLine("\t.mylabel\t   move.l #mempos,d1        ; mycomment   ");
        let edits: TextEdit[] = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        let i = 0;
        expect(edits.length).to.be.equal(4);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 30), new Position(0, 38)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 19), new Position(0, 20)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 9), new Position(0, 13)), " ".repeat(3)));
        expect(edits[i++]).to.be.eql(TextEdit.delete(new Range(new Position(0, 0), new Position(0, 1))));
        asmLine = new ASMLine("\t   move.l #mempos,d1        ; mycomment   ");
        edits = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 21), new Position(0, 29)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 10), new Position(0, 11)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(11)));
        asmLine = new ASMLine("\t   move.l #mempos,d1     ");
        edits = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 10), new Position(0, 11)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(11)));
        asmLine = new ASMLine("\t   rts      ");
        edits = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        i = 0;
        expect(edits.length).to.be.equal(1);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(11)));
    });
});
