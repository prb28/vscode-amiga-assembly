//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { M68kFormatter } from '../formatter';
import { ASMLine } from '../parser';
import { TextEdit, Range, Position } from 'vscode';

// tslint:disable:no-unused-expression
describe.only("Formatter Tests", function () {
    it("Should format full line", function () {
        let f = new M68kFormatter();
        let asmLine = new ASMLine("\t.mylabel\t   move.l #mempos,d1     ; mycomment   ");
        let edits: TextEdit[] = f.computeEditsForLine(asmLine, 9, 2, 7, 4, 11, 4);
        let i = 0;
        // space between data and comment : removed
        expect(edits[i++]).to.be.eql(TextEdit.delete(new Range(new Position(0, 30), new Position(0, 36))));
    });
});
