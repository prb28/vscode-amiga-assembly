import { expect } from 'chai';
import { CopperInstruction, CopperIntructionType, CopperWait, CopperSkip, CopperMove } from '../copperDisassembler';

describe("Copper Disassembler Tests", function () {
    // tslint:disable:no-unused-expression
    it("Should disassemble a move instruction", function () {
        let i = CopperInstruction.parse("f1800502");
        expect(i.instructionType).to.be.equal(CopperIntructionType.MOVE);
        expect(i.first).to.be.equal(0xf180);
        expect(i.second).to.be.equal(0x0502);
        expect(i instanceof CopperMove).to.be.true;
        if (i instanceof CopperMove) {
            expect(i.DA).to.be.equal(0x180);
            expect(i.RD).to.be.equal(0x0502);
            expect(i.label).to.be.equal("COLOR00");
            expect(i.toString()).to.be.equal("dc.w COLOR00,$502    ; COLOR00 <- $502");
        }
    });
    it("Should disassemble a wait instruction", function () {
        let i = CopperInstruction.parse("9601ff00");
        expect(i.instructionType).to.be.equal(CopperIntructionType.WAIT);
        expect(i.first).to.be.equal(0x9601);
        expect(i.second).to.be.equal(0xff00);
        expect(i instanceof CopperWait).to.be.true;
        if (i instanceof CopperWait) {
            expect(i.VP).to.be.equal(0x96);
            expect(i.HP).to.be.equal(0x00);
            expect(i.BFD).to.be.equal(0x1);
            expect(i.VE).to.be.equal(0xff);
            expect(i.HE).to.be.equal(0x00);
            expect(i.vertical).to.be.equal(0x96);
            expect(i.horizontal).to.be.equal(0x00);
        }
        i = CopperInstruction.parse("3fd3fffe");
        expect(i instanceof CopperWait).to.be.true;
        if (i instanceof CopperWait) {
            expect(i.VP).to.be.equal(0x3f);
            expect(i.HP).to.be.equal(0xd2);
            expect(i.BFD).to.be.equal(0x1);
            expect(i.VE).to.be.equal(0xff);
            expect(i.HE).to.be.equal(0xfe);
            expect(i.vertical).to.be.equal(0x3f);
            expect(i.horizontal).to.be.equal(0xd2);
        }
    });
    it("Should disassemble a skip instruction", function () {
        let i = CopperInstruction.parse("6401ff01");
        expect(i.instructionType).to.be.equal(CopperIntructionType.SKIP);
        expect(i.first).to.be.equal(0x6401);
        expect(i.second).to.be.equal(0xff01);
        expect(i instanceof CopperSkip).to.be.true;
        if (i instanceof CopperSkip) {
            expect(i.VP).to.be.equal(0x64);
            expect(i.HP).to.be.equal(0x00);
            expect(i.BFD).to.be.equal(0x1);
            expect(i.VE).to.be.equal(0xff);
            expect(i.HE).to.be.equal(0x00);
            expect(i.vertical).to.be.equal(0x64);
            expect(i.horizontal).to.be.equal(0x00);
        }
    });
});
