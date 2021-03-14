//
// Tests of the definition handler
//

import { expect } from 'chai';
import { M68kDefinitionHandler } from '../definitionHandler';
import { Uri, workspace, WorkspaceEdit, window, commands, extensions, Selection, Position } from 'vscode';
import { DummyTextDocument } from './dummy';
import * as Path from 'path';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';

chai.use(chaiAsPromised);

describe("Definition handler Tests", function () {
    before(async function () {
        // activate the extension
        let ext = extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
    });
    context("tutorial source", function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
        const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
        let dHnd = new M68kDefinitionHandler();
        before(async function () {
            await dHnd.scanFile(Uri.file(MAIN_SOURCE));
        });
        it("Should get a value for a variable", function () {
            expect(dHnd.getVariableValue("COPPER_WAIT")).to.be.equal("$FFFE");
            expect(dHnd.getVariableValue("BPLSIZE")).to.be.equal("(W*H)/8");
            // tslint:disable-next-line:no-unused-expression
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
                await workspace.openTextDocument(Uri.file(MAIN_SOURCE)).then(async document => {
                    const edit = new WorkspaceEdit();
                    await workspace.applyEdit(edit).then(async (success) => {
                        if (success) {
                            await window.showTextDocument(document);
                            await commands.executeCommand("cursorMove", { to: 'down', by: 'line', value: 20, select: true });
                        } else {
                            expect.fail("Edit not successful");
                        }
                    });
                });
            });
            it("Should find the used and free registers", async () => {
                await expect(dHnd.provideUsedRegistersSymbols()).to.be.eventually.equal("Registers used: none - free: d0-d7/a0-a7");
            });
            it("Should find the variables beginning by a work", async () => {
                let vars = dHnd.findVariableStartingWith("MY_");
                expect(vars.size).to.be.equal(2);
                expect(vars.get("MY_W_VAR")).to.be.equal("W/2");
                expect(vars.get("MY_H_VAR")).to.be.equal("W*MY_W_VAR/2*(MY_W_VAR)");
            });
        });
        context("Opened document", function () {
            before(async function () {
                // activate the extension
                let ext = extensions.getExtension('prb28.amiga-assembly');
                if (ext) {
                    await ext.activate();
                }
                await workspace.openTextDocument(Uri.file(MAIN_SOURCE));
            });
            it("Should have the included files graph", async () => {
                let files = dHnd.getIncludedFiles(Uri.file(MAIN_SOURCE));
                return expect(files).to.be.eventually.eql(["include/hw.i"]);
            });
        });
    });
    context("Functions", function () {
        let dHnd = new M68kDefinitionHandler();
        it("Should find used registers", async () => {
            let document = new DummyTextDocument();
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
});
