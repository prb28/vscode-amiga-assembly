//
// Tests of the formatter
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as chai from 'chai';
//import * as vscode from 'vscode';
import * as formatter from '../formatter';

var expect = chai.expect;

// tslint:disable:no-unused-expression
describe("Formatter Tests", function () {
    context("Global processing", function () {
        /*it("Should aling the elements", function () {
            let f = new formatter.M68kFormatter();
            let text = ".lnspr		swap	d1\n			move.w	d1,2(a0)\nswap	d1";
            let expected = ".lnspr  swap    d1\n        move.w    d1,2(a0)\n        swap    d1";
            expect(f.format(text)).to.be.equal(expected);
        });*/
    });
    context("Line parsing", function () {
        it("Should split a comment line", function () {
            let asmLine = new formatter.ASMLine("  ;My Comment ");
            expect(asmLine.comment).to.be.equal(";My Comment");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.instruction).to.be.empty;
            asmLine = new formatter.ASMLine("  ******--***** ");
            expect(asmLine.comment).to.be.equal("******--*****");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.instruction).to.be.empty;
        });
        it("Should parse a label line", function () {
            let asmLine = new formatter.ASMLine("mylabel");
            expect(asmLine.label).to.be.equal("mylabel");
            expect(asmLine.comment).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.instruction).to.be.empty;
        });
        it("Should parse a single line instruction", function () {
            let asmLine = new formatter.ASMLine(" rts");
            expect(asmLine.instruction).to.be.equal("rts");
            expect(asmLine.comment).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.label).to.be.empty;
        });
        it("Should parse an entire line", function () {
            let asmLine = new formatter.ASMLine("\t.mylabel\t\tmove.l #mempos,d1     ; mycomment");
            expect(asmLine.label).to.be.equal(".mylabel");
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.equal("; mycomment");
            asmLine = new formatter.ASMLine("mylabel move.l #mempos,d1;mycomment");
            expect(asmLine.label).to.be.equal("mylabel");
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.equal(";mycomment");
        });
        it("Should parse a line without label", function () {
            let asmLine = new formatter.ASMLine("\t\tmove.l #mempos,d1     ; mycomment");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.equal("; mycomment");
        });
        it("Should parse a line without labels nor comment", function () {
            let asmLine = new formatter.ASMLine("\t\tmove.l #mempos,d1 ");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.empty;
        });
    });
});
