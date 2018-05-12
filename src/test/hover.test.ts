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
        hoverInstruction.syntax = ["Dx,Dy", "Dn,<ea>"];
        hoverInstruction.size = "BW-";
        hoverInstruction.x = "1";
        hoverInstruction.n = "2";
        hoverInstruction.z = "3";
        hoverInstruction.v = "4";
        hoverInstruction.c = "5";
        expect(hp.renderHover(hoverInstruction).value).to.be.equal("`ADD[.BW-]` `Dx,Dy` | `Dn,<ea>`: **ADD binary**     _(x:1,n:2,z:3,v:4,c:5)_");
    });
});
