//
// Tests of the definition handler
//

import { expect } from 'chai';
import { M68kDefinitionHandler } from '../definitionHandler';
import { Uri, workspace, WorkspaceEdit, window, commands, Position, extensions } from 'vscode';
import * as Path from 'path';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';

chai.use(chaiAsPromised);

describe("Definition handler Tests", function () {
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
        await expect(dHnd.printRegisters([0], [0])).to.be.equal("d0/a0");
        await expect(dHnd.printRegisters([1, 2, 3, 7], [0, 1, 5])).to.be.equal("d0-d1/d5/a1-a3/a7");
        await expect(dHnd.printRegisters([0, 4, 5, 6], [2, 3, 4, 6, 7])).to.be.equal("d2-d4/d6-d7/a0/a4-a6");
    });
    context("Editor selection", function () {
        before(async function () {
            // activate the extension
            let ext = extensions.getExtension('prb28.amiga-assembly');
            if (ext) {
                await ext.activate();
            }
            await workspace.openTextDocument(Uri.file(MAIN_SOURCE)).then(async document => {
                const edit = new WorkspaceEdit();
                await workspace.applyEdit(edit).then(async (success) => {
                    if (success) {
                        await window.showTextDocument(document);
                        await commands.executeCommand("cursorMove", { to: 'down', by: 'line', value: 20, select: true });
                    } else {
                        expect.fail("Edit not sucessful");
                    }
                });
            });
        });
        it("Should find the used and free registers", async () => {
            await expect(dHnd.provideUsedRegistersSymbols()).to.be.eventually.equal("Registers used: none - free: d0-d7/a0-a7");
        });
    });
});
