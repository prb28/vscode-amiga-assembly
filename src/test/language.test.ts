//
// Tests of the formatter
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { M68kLanguage } from '../language';
import { fail } from 'assert';
import * as vscode from 'vscode';

// tslint:disable:no-unused-expression
describe("Language Tests", function () {
    let l: M68kLanguage;
    before(async function () {
        // activate the extension
        let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
            l = new M68kLanguage(ext.extensionPath);
            await l.load();
        }
    });
    describe("ASMLine Tests", function () {
        it("Should parse the language json file", function () {
            expect(l.languageMap.name).to.be.equal("m68k");
        });
        it("Should get a pattern from it's name", function () {
            expect(l.getPattern("string.quoted.double.m68k")).to.be.equal("\"[^\"]*\"");
        });
        it("Should get a correct regex from it's name", function () {
            let r: RegExp | null = l.getRegExp("keyword.other.opcode.cpu.bwl.m68k");
            if (r !== null) {
                expect(r.test("move")).to.be.true;
                // must ignore the case for this keyword
                expect(r.test("MOVE")).to.be.true;
            } else {
                fail("Regexp not found");
            }
        });
        it("Should get a pattern from a regex on it's name", function () {
            let list: Array<string> = l.getAllPatterns(/.*quoted.*/);
            expect(list.length).to.be.equal(2);
            expect(list[0]).to.be.equal("\"[^\"]*\"");
        });
        it("Should get a correct list of regex from a regex on it's name", function () {
            let list: Array<RegExp> = l.getAllRegExps(/.*opcode.cpu.*/);
            expect(list.length).to.be.equal(13);
            expect(list[0].test("bchg.l")).to.be.true;
        });
        it("Should get the list of possible extensions for an instruction", function () {
            expect(l.getExtensions('move')).to.be.eql(['b', 'w', 'l']);
            expect(l.getExtensions('bcc')).to.be.eql(['b', 'w', 'l', 's']);
            expect(l.getExtensions('dc')).to.be.eql(['b', 'd', 'l', 'q', 's', 'w', 'x']);
            expect(l.getExtensions('dr')).to.be.eql(['b', 'w', 'l']);
        });
    });
    context("HoverInstruction Tests", function () {
        it("Should parse the language json file", function () {
            expect(l.languageMap.name).to.be.equal("m68k");
        });
    });
});
