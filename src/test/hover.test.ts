//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { M68kHoverProvider } from '../hover';
import { HoverInstruction, ASMLine } from '../parser';

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
        let asmLine = new ASMLine("\t.mylabel\t   move.l $dff180,d1        ; mycomment   ");
        let hp = new M68kHoverProvider();
        let hover = hp.renderRegisterHover(asmLine);
        expect(hover).to.not.be.null;
        if (hover) {
            expect(hover.contents[0]).to.contain("Color");
        }
        asmLine = new ASMLine("\t.mylabel\t   move.l COlor00,d1        ; mycomment   ");
        hover = hp.renderRegisterHover(asmLine);
        expect(hover).to.not.be.null;
        if (hover) {
            expect(hover.contents[0]).to.contain("Color");
        }
    });
});
