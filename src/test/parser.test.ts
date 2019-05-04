//
// Tests of the parser
//

import { expect } from 'chai';
import { ASMLine, NumberParser } from '../parser';
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
        it("Should retrieve the symbol from a label line", function () {
            let asmLine = new ASMLine("mylabel");
            let [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            expect(symbol).to.be.equal("mylabel");
            expect(range).to.be.eql(new Range(new Position(0, 0), new Position(0, 7)));
            asmLine = new ASMLine("mylabel = 123");
            [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            expect(symbol).to.be.equal("mylabel");
            expect(range).to.be.eql(new Range(new Position(0, 0), new Position(0, 7)));
            asmLine = new ASMLine("mylabel \tequ.l 123");
            [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            expect(symbol).to.be.equal("mylabel");
            expect(range).to.be.eql(new Range(new Position(0, 0), new Position(0, 7)));
            asmLine = new ASMLine("mylabel:");
            [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            expect(symbol).to.be.equal("mylabel");
            expect(range).to.be.eql(new Range(new Position(0, 0), new Position(0, 7)));
            asmLine = new ASMLine(" rts");
            [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            expect(symbol).to.be.eql(undefined);
            expect(range).to.be.eql(undefined);
            asmLine = new ASMLine(".mylabel   move.l #mysymb,a0");
            [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            expect(symbol).to.be.equal(".mylabel");
            expect(range).to.be.eql(new Range(new Position(0, 0), new Position(0, 8)));
            asmLine = new ASMLine("LOGOW        equ        192                                                        ; padding à 1 word 12*16 = 192 / 11*16 = 172 < 178");
            [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            expect(symbol).to.be.equal("LOGOW");
            expect(range).to.be.eql(new Range(new Position(0, 0), new Position(0, 5)));
            asmLine = new ASMLine("    bsr.w      WaitRaster                                                 ; Appel de la routine wait raster - bsr");
            [symbol, range] = asmLine.getSymbolFromLabelOrVariable();
            expect(symbol).to.be.eql(undefined);
            expect(range).to.be.eql(undefined);
        });
        it("Should retrieve the symbol from a data line", function () {
            let asmLine = new ASMLine("   move.l #mysymb,a0");
            let results = asmLine.getSymbolFromData();
            expect(results.length).to.be.equal(2);
            let [symbol, range] = results[0];
            expect(symbol).to.be.equal("mysymb");
            expect(range).to.be.eql(new Range(new Position(0, 11), new Position(0, 17)));
            [symbol, range] = results[1];
            expect(symbol).to.be.equal("a0");
            expect(range).to.be.eql(new Range(new Position(0, 18), new Position(0, 20)));

            asmLine = new ASMLine("  move       (INTENARSave),INTENA(a6)  ");
            results = asmLine.getSymbolFromData();
            expect(results.length).to.be.equal(3);
            [symbol, range] = results[0];
            expect(symbol).to.be.equal("INTENARSave");
            expect(range).to.be.eql(new Range(new Position(0, 14), new Position(0, 25)));
            [symbol, range] = results[1];
            expect(symbol).to.be.equal("INTENA");
            expect(range).to.be.eql(new Range(new Position(0, 27), new Position(0, 33)));
            [symbol, range] = results[2];
            expect(symbol).to.be.equal("a6");
            expect(range).to.be.eql(new Range(new Position(0, 34), new Position(0, 36)));

            asmLine = new ASMLine(".OSOn       move.w     #$7fff,DMACON(a6)");
            results = asmLine.getSymbolFromData();
            expect(results.length).to.be.equal(3);
            [symbol, range] = results[0];
            expect(symbol).to.be.equal("7fff");
            expect(range).to.be.eql(new Range(new Position(0, 25), new Position(0, 29)));
            [symbol, range] = results[1];
            expect(symbol).to.be.equal("DMACON");
            expect(range).to.be.eql(new Range(new Position(0, 30), new Position(0, 36)));
            [symbol, range] = results[2];
            expect(symbol).to.be.equal("a6");
            expect(range).to.be.eql(new Range(new Position(0, 37), new Position(0, 39)));

            asmLine = new ASMLine("   dc.w       DDFSTRT,$d0-LOGOMARGIN/2   ; Display ");
            results = asmLine.getSymbolFromData();
            expect(results.length).to.be.equal(3);
            [symbol, range] = results[0];
            expect(symbol).to.be.equal("DDFSTRT");
            expect(range).to.be.eql(new Range(new Position(0, 14), new Position(0, 21)));
            [symbol, range] = results[1];
            expect(symbol).to.be.equal("d0");
            expect(range).to.be.eql(new Range(new Position(0, 23), new Position(0, 25)));
            [symbol, range] = results[2];
            expect(symbol).to.be.equal("LOGOMARGIN");
            expect(range).to.be.eql(new Range(new Position(0, 26), new Position(0, 36)));
        });
        it("Should retrieve the registers from a data line", function () {
            let asmLine = new ASMLine("   move.l #mysymb,a0");
            let results = asmLine.getRegistersFromData();
            expect(results.length).to.be.equal(1);
            expect(results[0]).to.be.equal("a0");
            asmLine = new ASMLine("   move.l D1,A0   ; d0 not selected");
            results = asmLine.getRegistersFromData();
            expect(results.length).to.be.equal(2);
            expect(results[0]).to.be.equal("d1");
            expect(results[1]).to.be.equal("a0");
            asmLine = new ASMLine("   move.l d8,a8 ");
            results = asmLine.getRegistersFromData();
            expect(results.length).to.be.equal(0);
            asmLine = new ASMLine("   move.l $d1,a7 ");
            results = asmLine.getRegistersFromData();
            expect(results.length).to.be.equal(1);
            expect(results[0]).to.be.equal("a7");
            asmLine = new ASMLine("   move.l #$a1,d7 ");
            results = asmLine.getRegistersFromData();
            expect(results.length).to.be.equal(1);
            expect(results[0]).to.be.equal("d7");
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
            asmLine = new ASMLine("Pdl0Wait	dc.l\t0	\t;# of cycles until paddle timer is done");
            expect(asmLine.labelRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 8)));
            expect(asmLine.instructionRange).to.be.eql(new Range(new Position(0, 9), new Position(0, 13)));
            expect(asmLine.dataRange).to.be.eql(new Range(new Position(0, 14), new Position(0, 15)));
            expect(asmLine.commentRange).to.be.eql(new Range(new Position(0, 17), new Position(0, 56)));
            asmLine = new ASMLine("\t\taddq.l	#6,Cycles");
            expect(asmLine.instructionRange).to.be.eql(new Range(new Position(0, 2), new Position(0, 8)));
            expect(asmLine.dataRange).to.be.eql(new Range(new Position(0, 9), new Position(0, 18)));
            asmLine = new ASMLine(".Save12Msg\tdc.b	\"Save disk from\",10,\"drive 1  or           2 ? \",0");
            expect(asmLine.labelRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 10)));
            expect(asmLine.instructionRange).to.be.eql(new Range(new Position(0, 11), new Position(0, 15)));
            expect(asmLine.dataRange).to.be.eql(new Range(new Position(0, 16), new Position(0, 66)));
            asmLine = new ASMLine("	beq.b\t.rts	\t\t;mem is same so video is same; don't change anything");
            expect(asmLine.instructionRange).to.be.eql(new Range(new Position(0, 1), new Position(0, 6)));
            expect(asmLine.dataRange).to.be.eql(new Range(new Position(0, 7), new Position(0, 11)));
            expect(asmLine.commentRange).to.be.eql(new Range(new Position(0, 14), new Position(0, 66)));
            asmLine = new ASMLine(".rts	rts");
            expect(asmLine.labelRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 4)));
            expect(asmLine.instructionRange).to.be.eql(new Range(new Position(0, 5), new Position(0, 8)));
        });
        it("Should parse an asignement", function () {
            let asmLine = new ASMLine("mylabel =    123");
            expect(asmLine.variable).to.be.equal("mylabel");
            expect(asmLine.variableRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 7)));
            expect(asmLine.operator).to.be.equal("=");
            expect(asmLine.operatorRange).to.be.eql(new Range(new Position(0, 8), new Position(0, 9)));
            expect(asmLine.value).to.be.equal("123");
            expect(asmLine.valueRange).to.be.eql(new Range(new Position(0, 13), new Position(0, 16)));
            asmLine = new ASMLine("mylabel \tequ.l 123");
            expect(asmLine.variable).to.be.equal("mylabel");
            expect(asmLine.variableRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 7)));
            expect(asmLine.operator).to.be.equal("equ.l");
            expect(asmLine.operatorRange).to.be.eql(new Range(new Position(0, 9), new Position(0, 14)));
            expect(asmLine.value).to.be.equal("123");
            expect(asmLine.valueRange).to.be.eql(new Range(new Position(0, 15), new Position(0, 18)));
            // Should not parse in the comments
            asmLine = new ASMLine("LOGOW        equ        192                                                        ; padding à 1 word 12*16 = 192 / 11*16 = 172 < 178");
            expect(asmLine.variable).to.be.equal("LOGOW");
            expect(asmLine.variableRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 5)));
            expect(asmLine.operator).to.be.equal("equ");
            expect(asmLine.operatorRange).to.be.eql(new Range(new Position(0, 13), new Position(0, 16)));
            expect(asmLine.value).to.be.equal("192");
            expect(asmLine.valueRange).to.be.eql(new Range(new Position(0, 24), new Position(0, 27)));
            // Should not parse in the comments
            asmLine = new ASMLine("bsr.w      WaitRaster                                                 ; foo = 43");
            expect(asmLine.variable).to.be.equal("");
            // Should parse with same value
            asmLine = new ASMLine("SC_W_P      = W");
            expect(asmLine.variable).to.be.equal("SC_W_P");
            expect(asmLine.variableRange).to.be.eql(new Range(new Position(0, 0), new Position(0, 6)));
            expect(asmLine.operator).to.be.equal("=");
            expect(asmLine.operatorRange).to.be.eql(new Range(new Position(0, 12), new Position(0, 13)));
            expect(asmLine.value).to.be.equal("W");
            expect(asmLine.valueRange).to.be.eql(new Range(new Position(0, 14), new Position(0, 15)));
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
        it("Should parse macros as instruction", function () {
            let asmLine = new ASMLine("\t\t    WAIT_BLITTER2 $FFF    ; mycomment");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.instruction).to.be.equal("WAIT_BLITTER2");
            expect(asmLine.data).to.be.equal("$FFF");
        });
        it("Should parse compiler option as instruction", function () {
            let asmLine = new ASMLine("\t\tOPT O+,OW-,OW1+,OW6+,P=68000    ; mycomment");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.instruction).to.be.equal("OPT");
            expect(asmLine.data).to.be.equal("O+,OW-,OW1+,OW6+,P=68000");
            expect(asmLine.comment).to.be.equal("; mycomment");
        });
        it("Should parse a library call", function () {
            let asmLine = new ASMLine(" jsr AllocMem(a6)");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.instruction).to.be.equal("jsr");
            expect(asmLine.data).to.be.equal("AllocMem(a6)");
            expect(asmLine.comment).to.be.empty;
        });

    });
    context("Number parsing", function () {
        it("Should parse a number", function () {
            let np = new NumberParser();
            expect(np.parse("#10")).to.be.equal(10);
            expect(np.parse("$10")).to.be.equal(16);
            expect(np.parse("%10")).to.be.equal(2);
            expect(np.parse("@10")).to.be.equal(8);
            expect(np.parse(" #10 ")).to.be.equal(10);
            expect(np.parse("#-10")).to.be.equal(-10);
            expect(np.parse("#-10")).to.be.equal(-10);
            expect(np.parse(" 10 ")).to.be.equal(10);
            expect(np.parse(" -10 ")).to.be.equal(-10);
        });
        it("Should tranform a text to decimals", function () {
            let np = new NumberParser();
            expect(np.tranformToDecimal("#10 + $a + %1010 + @12")).to.be.equal("10 + 10 + 10 + 10");
            expect(np.tranformToDecimal("$1000+$100")).to.be.equal("4096+256");
            expect(np.tranformToDecimal("$1000+($100-%10)/12+$100+@12")).to.be.equal("4096+(256-2)/12+256+10");
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
