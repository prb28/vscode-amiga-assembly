//
// Tests of the formatter
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { M68kLanguage } from '../language';

// tslint:disable:no-unused-expression
describe("Language Tests", function () {
    describe("ASMLine Tests", function () {
        it("Should parse the language json file", function () {
            let l = new M68kLanguage();
            expect(l.languageMap.name).to.be.equal("m68k");
        });
        it("Should get a pattern from it's name", function () {
            let l = new M68kLanguage();
            expect(l.getPattern("string.quoted.double.m68k")).to.be.equal("\"[^\"]*\"");
        });
        it("Should get a correct regex from it's name", function () {
            let l = new M68kLanguage();
            let r: RegExp = l.getRegExp("keyword.other.opcode.cpu.bwl.m68k");
            expect(r.test("move")).to.be.true;
            // must ignore the case for this keyword
            expect(r.test("MOVE")).to.be.true;
        });
        it("Should get a pattern from a regex on it's name", function () {
            let l = new M68kLanguage();
            let list: Array<string> = l.getAllPatterns(/.*quoted.*/);
            expect(list.length).to.be.equal(2);
            expect(list[0]).to.be.equal("\"[^\"]*\"");
        });
        it("Should get a correct list of regex from a regex on it's name", function () {
            let l = new M68kLanguage();
            let list: Array<RegExp> = l.getAllRegExps(/.*opcode.cpu.*/);
            expect(list.length).to.be.equal(13);
            expect(list[0].test("bchg.l")).to.be.true;
        });
    });
    describe("HoverInstruction Tests", function () {
        it("Should parse the language json file", function () {
            let l = new M68kLanguage();
            expect(l.languageMap.name).to.be.equal("m68k");
        });
    });
});
