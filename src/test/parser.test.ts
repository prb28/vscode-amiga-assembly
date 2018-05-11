//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { ASMLine } from '../parser';


// tslint:disable:no-unused-expression
describe("Parser Tests", function () {
    context("Line parsing", function () {
        it("Should split a comment line", function () {
            let asmLine = new ASMLine("  ;My Comment ");
            expect(asmLine.comment).to.be.equal(";My Comment");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.instruction).to.be.empty;
            asmLine = new ASMLine("  ******--***** ");
            expect(asmLine.comment).to.be.equal("******--*****");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.instruction).to.be.empty;
        });
        it("Should parse a label line", function () {
            let asmLine = new ASMLine("mylabel");
            expect(asmLine.label).to.be.equal("mylabel");
            expect(asmLine.comment).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.instruction).to.be.empty;
        });
        it("Should parse a single line instruction", function () {
            let asmLine = new ASMLine(" rts");
            expect(asmLine.instruction).to.be.equal("rts");
            expect(asmLine.comment).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.label).to.be.empty;
        });
        it("Should parse an entire line", function () {
            let asmLine = new ASMLine("\t.mylabel\t\tmove.l #mempos,d1     ; mycomment");
            expect(asmLine.label).to.be.equal(".mylabel");
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.equal("; mycomment");
            asmLine = new ASMLine("mylabel move.l #mempos,d1;mycomment");
            expect(asmLine.label).to.be.equal("mylabel");
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.equal(";mycomment");
        });
        it("Should parse a line without label", function () {
            let asmLine = new ASMLine("\t\tmove.l #mempos,d1     ; mycomment");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.equal("; mycomment");
        });
        it("Should parse a line without labels nor comment", function () {
            let asmLine = new ASMLine("\t\tmove.l #mempos,d1 ");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.empty;
        });
    });
});
