//
// Tests of the Amiga Hunk file Parser
//

import { expect } from 'chai';
import { HunkParser, HunkType } from '../amigaHunkParser';
import * as Path from 'path';
import { Uri } from 'vscode';

// tslint:disable:no-unused-expression
describe("AmigaHunkFile", function () {
    it("Should open a hunk file", async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'gencop');
        let parser = new HunkParser();
        let hunks = await parser.readFile(Uri.file(programFilename));
        expect(hunks.length).to.be.equal(1);
        let hunk = hunks[0];
        if (hunk.symbols) {
            expect(hunk.symbols.length).to.be.equal(15);
            expect(hunk.symbols[0].name).to.be.equal("init");
            expect(hunk.symbols[0].offset).to.be.equal(0);
        } else {
            expect.fail("hunk has no symbol");
        }
        expect(hunk.codeData).to.exist;
        expect(hunk.lineDebugInfo).to.exist;
        if (hunk.lineDebugInfo) {
            expect(hunk.lineDebugInfo.length).to.be.equal(1);
            let sourceFile = hunk.lineDebugInfo[0];
            expect(sourceFile.lines.length).to.be.equal(106);
            expect(sourceFile.name).to.be.equal("/Users/papa/developpements/amiga/projects/helloworld/gencop.s");
        }
    });

    it("Should parse the symbols of a multi hunk file", async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'tutorial');
        let parser = new HunkParser();
        let hunks = await parser.readFile(Uri.file(programFilename));
        expect(hunks.length).to.be.equal(3);
        // Code hunk
        let hunk = hunks[0];
        expect(hunk.hunkType).to.be.equal(HunkType.CODE);
        if (hunk.symbols) {
            expect(hunk.symbols.length).to.be.equal(13);
            // OSOff and start are at the same offset
            let name = hunk.symbols[0].name;
            expect((name === "start") || (name === "OSOff")).to.be.true;
            expect(hunk.symbols[0].offset).to.be.equal(0);
        } else {
            expect.fail("hunk has no symbol");
        }
        expect(hunk.codeData).to.exist;
        expect(hunk.lineDebugInfo).to.exist;
        // Data hunk
        hunk = hunks[1];
        expect(hunk.hunkType).to.be.equal(HunkType.DATA);
        if (hunk.symbols) {
            expect(hunk.symbols.length).to.be.equal(16);
            expect(hunk.symbols[0].name).to.be.equal("Spr");
            expect(hunk.symbols[0].offset).to.be.equal(0);
        } else {
            expect.fail("hunk has no symbol");
        }
        // Data hunk
        hunk = hunks[2];
        expect(hunk.hunkType).to.be.equal(HunkType.BSS);
        if (hunk.symbols) {
            expect(hunk.symbols.length).to.be.equal(1);
            expect(hunk.symbols[0].name).to.be.equal("Screen");
            expect(hunk.symbols[0].offset).to.be.equal(0);
        } else {
            expect.fail("hunk has no symbol");
        }
    });
    it("Should parse the a vbcc generated file", async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'hello-vbcc');
        let parser = new HunkParser();
        let hunks = await parser.readFile(Uri.file(programFilename));
        expect(hunks.length).to.be.equal(7);
        // Code hunk
        let hunk = hunks[0];
        expect(hunk.codeData).to.exist;
        expect(hunk.lineDebugInfo).to.exist;
        if (hunk.lineDebugInfo) {
            expect(hunk.lineDebugInfo.length).to.be.equal(1);
            let sourceFile = hunk.lineDebugInfo[0];
            expect(sourceFile.lines.length).to.be.equal(11);
            expect(sourceFile.name).to.be.equal("hello.c");
        }
    });
});