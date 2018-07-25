//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { ASMLine, HoverInstruction, HoverInstructionsManager, HoverRegistersManager, NumberParser } from '../parser';
import { Position, Range } from 'vscode';

// tslint:disable:no-unused-expression
describe("Parser Tests", function () {
    context("ASM Line parsing", function () {
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
        it("Should retrieve the positions of the elements in the line", function () {
            let asmLine = new ASMLine("   \t  ; mycomment   ");
            expect(asmLine.commentRange).to.be.eql(new Range(new Position(0, 6), new Position(0, 17)));
            asmLine = new ASMLine("   \t  * mycomment   ");
            expect(asmLine.commentRange).to.be.eql(new Range(new Position(0, 6), new Position(0, 17)));
            asmLine = new ASMLine("    include \"exec/types.i\"");
            expect(asmLine.spacesBeforeLabelRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 4)));
            expect(asmLine.labelRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 0)));
            expect(asmLine.spacesLabelToInstructionRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 0)));
            expect(asmLine.instructionRange).to.be.eql(new Range(new Position(0, 4), new Position(0, 11)));
            expect(asmLine.spacesInstructionToDataRange).to.be.eql(new Range(new Position(0, 11), new Position(0, 12)));
            expect(asmLine.dataRange).to.be.eql(new Range(new Position(0, 12), new Position(0, 26)));
            expect(asmLine.spacesDataToCommentRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 0)));
            expect(asmLine.commentRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 0)));
            asmLine = new ASMLine("\t.mylabel\t   move.l #mempos,d1     ; mycomment   ");
            expect(asmLine.spacesBeforeLabelRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 1)));
            expect(asmLine.labelRange).to.be.eql(new Range(new Position(0, 1), new Position(0, 9)));
            expect(asmLine.spacesLabelToInstructionRange).to.be.eql(new Range(new Position(0, 9), new Position(0, 13)));
            expect(asmLine.instructionRange).to.be.eql(new Range(new Position(0, 13), new Position(0, 19)));
            expect(asmLine.spacesInstructionToDataRange).to.be.eql(new Range(new Position(0, 19), new Position(0, 20)));
            expect(asmLine.dataRange).to.be.eql(new Range(new Position(0, 20), new Position(0, 30)));
            expect(asmLine.spacesDataToCommentRange).to.be.eql(new Range(new Position(0, 30), new Position(0, 35)));
            expect(asmLine.commentRange).to.be.eql(new Range(new Position(0, 35), new Position(0, 46)));
            asmLine = new ASMLine("mylabel");
            expect(asmLine.labelRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 7)));
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
    context("Hover instruction file parsing", function () {
        it("Should read the file correctly", function () {
            let manager = new HoverInstructionsManager();
            expect(manager.instructions.size).to.be.equal(116);
            let list = manager.instructions.get("ADD");
            expect(list).to.not.be.undefined;
            if (list) {
                let hi = list[0];
                expect(hi.instruction).to.be.equal("ADD");
                expect(hi.decription).to.be.equal("ADD binary");
                expect(hi.syntax).to.be.equal("Dx,Dy");
                expect(hi.size).to.be.equal("BWL");
                expect(hi.x).to.be.equal("*");
                expect(hi.n).to.be.equal("*");
                expect(hi.z).to.be.equal("*");
                expect(hi.v).to.be.equal("*");
                expect(hi.c).to.be.equal("*");
            }
            list = manager.instructions.get("MOVE");
            expect(list).to.not.be.undefined;
            if (list) {
                let hi = list[1];
                expect(hi.instruction).to.be.equal("MOVE");
                expect(hi.decription).to.be.equal("Copy value");
                expect(hi.syntax).to.be.equal("Rn,Dy");
                expect(hi.size).to.be.equal("WL");
                expect(hi.x).to.be.equal("-");
                expect(hi.n).to.be.equal("*");
                expect(hi.z).to.be.equal("*");
                expect(hi.v).to.be.equal("0");
                expect(hi.c).to.be.equal("0");
            }
        });
        it("Should parse a correct line", function () {
            let hi = HoverInstruction.parse("ADD;ADD binary;Dx,Dy;BWL;1;2;3;4;5");
            expect(hi.instruction).to.be.equal("ADD");
            expect(hi.decription).to.be.equal("ADD binary");
            expect(hi.syntax).to.be.equal("Dx,Dy");
            expect(hi.size).to.be.equal("BWL");
            expect(hi.x).to.be.equal("1");
            expect(hi.n).to.be.equal("2");
            expect(hi.z).to.be.equal("3");
            expect(hi.v).to.be.equal("4");
            expect(hi.c).to.be.equal("5");
        });
        it("Should return null if a line parse fail", function () {
            let hi = HoverInstruction.parse("ADD;ADD binary");
            expect(hi).to.be.null;
        });
    });
    context("Hover register file parsing", function () {
        it("Should read the files correctly", function () {
            let manager = new HoverRegistersManager();
            expect(manager.registersByName.size).to.be.equal(280);
            expect(manager.registersByAddress.size).to.be.equal(266);
            let registerByName = manager.registersByName.get("ADKCONR");
            let registerByAddress = manager.registersByAddress.get("DFF010");
            expect(registerByName).to.not.be.undefined;
            expect(registerByAddress).to.not.be.undefined;
            if (registerByName) {
                expect(registerByName.name).to.be.equals("ADKCONR");
                expect(registerByName.address).to.be.equals("DFF010");
                expect(registerByName.description).to.contains("control bit.determines");
            }
            expect(registerByName).to.be.eql(registerByAddress);
        });
    });
    context("Number parsing", function () {
        it("Should parse a number", function () {
            let np = new NumberParser();
            expect(np.parse("#10")).to.be.equal(10);
            expect(np.parse("$10")).to.be.equal(16);
            expect(np.parse("%10")).to.be.equal(2);
            expect(np.parse(" #10 ")).to.be.equal(10);
            expect(np.parse("#-10")).to.be.equal(-10);
            expect(np.parse("#-10")).to.be.equal(-10);
            expect(np.parse(" 10 ")).to.be.equal(10);
            expect(np.parse(" -10 ")).to.be.equal(-10);
        });
        it("Should tranform a text to decimals", function () {
            let np = new NumberParser();
            expect(np.tranformToDecimal("#10 + $a + %1010")).to.be.equal("10 + 10 + 10");
            expect(np.tranformToDecimal("$1000+$100")).to.be.equal("4096+256");
            expect(np.tranformToDecimal("$1000+($100-%10)/12+$100")).to.be.equal("4096+(256-2)/12+256");
        });
        it("Should display a binarry correctly", function () {
            let np = new NumberParser();
            expect(np.binaryToString(3840, true)).to.be.equal("1111.00000000");
            expect(np.binaryToString(3840, false)).to.be.equal("111100000000");
        });
        it("Should display an hex correctly", function () {
            let np = new NumberParser();
            expect(np.hexToString(703710, true)).to.be.equal("a.bcde");
            expect(np.hexToString(703710, false)).to.be.equal("abcde");
        });
    });
});
