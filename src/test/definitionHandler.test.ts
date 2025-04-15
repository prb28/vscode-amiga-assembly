//
// Tests of the definition handler
//

import { expect } from 'chai';
import { M68kDefinitionHandler } from '../definitionHandler';
import { Uri, workspace, window, commands, extensions, Selection, Position, FoldingRangeKind, SymbolKind } from 'vscode';
import { DummyTextDocument } from './dummy';
import * as Path from 'path';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { ExtensionState } from '../extension';
import { ASMLine } from '../parser';
import * as sinon from 'sinon';
import { SymbolFile } from '../symbols';

chai.use(chaiAsPromised);

describe("Definition handler Tests", function () {
    before(async function () {
        // activate the extension
        const ext = extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        const state = ExtensionState.getCurrent();
        ASMLine.init(await state.getLanguage());
    });
    context("tutorial source", function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
        const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
        const dHnd = new M68kDefinitionHandler();
        before(async function () {
            await dHnd.scanFile(Uri.file(MAIN_SOURCE));
        });
        it("Should get a value for a variable", function () {
            expect(dHnd.getVariableValue("COPPER_WAIT")).to.be.equal("$FFFE");
            expect(dHnd.getVariableValue("BPLSIZE")).to.be.equal("(W*H)/8");
            // eslint-disable-next-line no-unused-expressions
            expect(dHnd.getVariableValue("XXXXX")).to.be.undefined;
        });
        it("Should evaluate a variable", async function () {
            await expect(dHnd.evaluateVariable("COPPER_WAIT")).to.be.eventually.equal(0xFFFE);
            await expect(dHnd.evaluateVariable("BPLSIZE")).to.be.eventually.equal(320 * 256 / 8);
            await expect(dHnd.evaluateVariable("MY_H_VAR")).to.be.eventually.equal(320 * 320 / 2 / 2 * (320 / 2));
        });
        it("Should evaluate a formula", async function () {
            await expect(dHnd.evaluateFormula("#(BPLSIZE+COPPER_WAIT)/2")).to.be.eventually.equal(((320 * 256 / 8) + 0xFFFE) / 2);
        });
        it("Should print a register array", async function () {
            expect(dHnd.printRegisters([0], [0])).to.be.equal("d0/a0");
            expect(dHnd.printRegisters([1, 2, 3, 7], [0, 1, 5])).to.be.equal("d0-d1/d5/a1-a3/a7");
            expect(dHnd.printRegisters([0, 4, 5, 6], [2, 3, 4, 6, 7])).to.be.equal("d2-d4/d6-d7/a0/a4-a6");
        });
        context("Editor selection", function () {
            before(async function () {
                const document = await workspace.openTextDocument(Uri.file(MAIN_SOURCE));
                await window.showTextDocument(document);
                await commands.executeCommand("cursorMove", { to: 'up', by: 'line', value: 20, select: false });
                await commands.executeCommand("cursorMove", { to: 'down', by: 'line', value: 20, select: true });
            });
            after(async () => {
                await commands.executeCommand('workbench.action.closeActiveEditor');
            });
            it("Should find the used and free registers", async () => {
                await expect(dHnd.provideUsedRegistersSymbols()).to.be.eventually.equal("Registers used: none - free: d0-d7/a0-a7");
            });
            it("Should find the variables beginning by a work", async () => {
                const vars = dHnd.findVariableStartingWith("MY_");
                expect(vars.size).to.be.equal(2);
                expect(vars.get("MY_W_VAR")?.getValue()).to.be.equal("W/2");
                expect(vars.get("MY_H_VAR")?.getValue()).to.be.equal("W*MY_W_VAR/2*(MY_W_VAR)");
            });
        });
        context("Opened document", function () {
            before(async function () {
                // activate the extension
                const ext = extensions.getExtension('prb28.amiga-assembly');
                if (ext) {
                    await ext.activate();
                }
                await workspace.openTextDocument(Uri.file(MAIN_SOURCE));
            });
            it("Should have the included files graph", async () => {
                const files = await dHnd.getIncludedFiles(Uri.file(MAIN_SOURCE));
                return expect(files[0].includes("hw.i")).to.be.true;
            });
        });
    });
    context("Functions", function () {
        const dHnd = new M68kDefinitionHandler();
        it("Should find used registers", async () => {
            const document = new DummyTextDocument();
            document.addLine(" move.w d0,d1");
            document.addLine(" movem.l	(a0)+,d1-d7/a2");
            document.addLine(" movem.l	d1-d7/a2,(a1)");
            document.addLine("doslib  EQUR   d4");
            document.addLine("        move.l d0,doslib");
            let selections = new Array<Selection>();
            selections.push(new Selection(new Position(0, 0), new Position(1, 0)));
            expect(dHnd.findUsedRegisters(document, selections)).to.be.eql(["d0", "d1"]);

            selections = new Array<Selection>();
            selections.push(new Selection(new Position(1, 0), new Position(2, 0)));
            expect(dHnd.findUsedRegisters(document, selections)).to.be.eql(["a0", "a2", "d1", "d2", "d3", "d4", "d5", "d6", "d7"]);

            selections = new Array<Selection>();
            selections.push(new Selection(new Position(3, 0), new Position(5, 0)));
            expect(dHnd.findUsedRegisters(document, selections)).to.be.eql(["d0", "d4"]);
        });
    });
    describe("Folding Ranges", function () {
        const dHnd = new M68kDefinitionHandler();
        afterEach(() => {
            // Restore all sinon stubs after each test
            sinon.restore();
        });
        it("Should provide folding ranges for a document", async () => {
            // Create a dummy document with some content
            const document = new DummyTextDocument();
            document.addLine("; Comment line 1");
            document.addLine("; Comment line 2");
            document.addLine(" include \"test.i\"");
            document.addLine(" include \"test3.i\"");
            document.addLine("label1:");
            document.addLine("    move.w d0,d1");
            document.addLine(".label2:");
            document.addLine("    move.l d1,d2");

            const symbolFile = new SymbolFile(Uri.file("test.s"));
            symbolFile.readDocument(document);

            sinon.stub(dHnd, "scanFile").resolves(symbolFile);

            // Call the provideFoldingRanges function
            const foldingRanges = await dHnd.provideFoldingRanges(document);

            // Verify the folding ranges
            expect(foldingRanges).to.have.length(4);
            foldingRanges.sort((a, b) => a.start - b.start);
            expect(foldingRanges[0].start).to.equal(0);
            expect(foldingRanges[0].end).to.equal(1);
            expect(foldingRanges[0].kind).to.equal(FoldingRangeKind.Comment);
            expect(foldingRanges[1].start).to.equal(2);
            expect(foldingRanges[1].end).to.equal(3);
            expect(foldingRanges[1].kind).to.equal(FoldingRangeKind.Imports);
            expect(foldingRanges[2].start).to.equal(4);
            expect(foldingRanges[2].end).to.equal(7);
            expect(foldingRanges[2].kind).to.equal(FoldingRangeKind.Region);
            expect(foldingRanges[3].start).to.equal(6);
            expect(foldingRanges[3].end).to.equal(7);
            expect(foldingRanges[3].kind).to.equal(FoldingRangeKind.Region);
        });

        it("Should provide document symbols for a document", async () => {
            // Create a dummy document with some content
            const document = new DummyTextDocument();
            document.addLine("; Comment line 1");
            document.addLine("; Comment line 2");
            document.addLine(" include \"test.i\"");
            document.addLine(" include \"test3.i\"");
            document.addLine("FOO = 0x1234");
            document.addLine("label1:");
            document.addLine("    move.w d0,d1");
            document.addLine(".label2:");
            document.addLine("    move.l d1,d2");

            const symbolFile = new SymbolFile(Uri.file("test.s"));
            symbolFile.readDocument(document);

            sinon.stub(dHnd, "scanFile").resolves(symbolFile);

            // Call the provideDocumentSymbols function
            const documentSymbols = await dHnd.provideDocumentSymbols(document);

            // Verify the folding ranges
            expect(documentSymbols).to.have.length(4);
            documentSymbols.sort((a, b) => a.range.start.line - b.range.start.line);
            expect(documentSymbols[0].name).to.equal("test.i");
            expect(documentSymbols[0].range.start.line).to.equal(2);
            expect(documentSymbols[1].name).to.equal("test3.i");
            expect(documentSymbols[1].range.start.line).to.equal(3);
            expect(documentSymbols[1].kind).to.equal(SymbolKind.File);
            expect(documentSymbols[2].name).to.equal("FOO");
            expect(documentSymbols[2].range.start.line).to.equal(4);
            expect(documentSymbols[2].kind).to.equal(SymbolKind.Constant);
            expect(documentSymbols[3].name).to.equal("label1");
            expect(documentSymbols[3].range.start.line).to.equal(5);
            expect(documentSymbols[3].kind).to.equal(SymbolKind.Class);
            expect(documentSymbols[3].children[0].name).to.equal("label2");
            expect(documentSymbols[3].children[0].range.start.line).to.equal(7);
            expect(documentSymbols[3].children[0].kind).to.equal(SymbolKind.Method);
        });
    });
});
