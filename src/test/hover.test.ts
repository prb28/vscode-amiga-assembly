//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { M68kHoverProvider } from '../hover';
import { HoverInstruction } from '../parser';

// tslint:disable:no-unused-expression
describe("Hover Tests", function () {
    it("Should render a command", function () {
        let hp = new M68kHoverProvider();
        let hoverInstruction = new HoverInstruction();
        hoverInstruction.instruction = "ADD";
        hoverInstruction.decription = "ADD binary";
        hoverInstruction.syntax = "Dx,Dy";
        hoverInstruction.size = "BW";
        hoverInstruction.x = "1";
        hoverInstruction.n = "2";
        hoverInstruction.z = "3";
        hoverInstruction.v = "4";
        hoverInstruction.c = "5";
        expect(hp.renderHover(hoverInstruction).value).to.be.equal("`ADD[.BW]` `Dx,Dy` _(x:1,n:2,z:3,v:4,c:5)_");
    });
    it("Should render a register hover", function () {
        let hp = new M68kHoverProvider();
        let mdStr = hp.renderRegisterHover("DFF180");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.contain("Color");
        }
        mdStr = hp.renderRegisterHover("COLOR00");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.contain("Color");
        }
    });
    it("Should render a number", function () {
        let hp = new M68kHoverProvider();
        let mdStr = hp.renderNumberForWord("#10");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`10` - $`a` - %`1010`");
        }
        mdStr = hp.renderNumberForWord("$10");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`16` - $`10` - %`10000`");
        }
        mdStr = hp.renderNumberForWord("%10");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`2` - $`2` - %`10`");
        }
    });
    it("Should render a register value", function () {
        let hp = new M68kHoverProvider();
        let mdStr = hp.renderRegisterValue("$1010");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("|Bits | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0|\n|---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ----|\n|  | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0|\n\n");
        }
    });
});
