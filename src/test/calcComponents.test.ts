//
// Tests of the calculator integration
//

import { expect } from 'chai';
import { CalcComponent } from '../calcComponents';
import * as Path from 'path';
import { ExtensionState } from '../extension';
import { Uri } from 'vscode';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { M68kDefinitionHandler } from '../definitionHandler';
import { ASMLine } from '../parser';

// tslint:disable:no-unused-expression
describe("Calc Tests", function () {
    before(async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
        const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        const state = ExtensionState.getCurrent();
        const dHnd = state.getDefinitionHandler();
        await dHnd.scanFile(Uri.file(MAIN_SOURCE));
    });
    it("Should calculate an expression with all kind of numbers", async function () {
        const c = new CalcComponent();
        await expect(c.calculate("3+2")).to.be.eventually.equal(5);
        await expect(c.calculate("3+#2+$a+%100")).to.be.eventually.equal(19);
    });
    it("Should calculate an expression with binary operations", async function () {
        const c = new CalcComponent();
        await expect(c.calculate("$10&16")).to.be.eventually.equal(0x10);
        await expect(c.calculate("$21&16")).to.be.eventually.equal(0);
        await expect(c.calculate("$41&16")).to.be.eventually.equal(0);
        await expect(c.calculate("$61&16")).to.be.eventually.equal(0);
        await expect(c.calculate("5&1")).to.be.eventually.equal(1);
        await expect(c.calculate("4|1")).to.be.eventually.equal(5);
        await expect(c.calculate("5 << 1")).to.be.eventually.equal(10);
        await expect(c.calculate("5 ^| 1")).to.be.eventually.equal(4);
        await expect(c.calculate("5 >> 1")).to.be.eventually.equal(2);
        await expect(c.calculate("5 >>> 1")).to.be.eventually.equal(2);
        await expect(c.calculate("~5")).to.be.eventually.equal(-6);
        await expect(c.calculate("~5&$000f")).to.be.eventually.equal(10);
    });
    it("Should format a result", function () {
        const c = new CalcComponent();
        expect(c.formatResult("3+2", 5)).to.be.equal("#5/$5/%101");
        expect(c.formatResult(null, 2145)).to.be.equal("#2145/$861/%100001100001");
        expect(c.formatResult("$1000+$100", 4352)).to.be.equal("#4352/$1100/%1000100000000");
    });
    it("Should calculate an expression with variables", async function () {
        const c = new CalcComponent();
        await expect(c.calculate("#(BPLSIZE+COPPER_WAIT)/2")).to.be.eventually.equal(((320 * 256 / 8) + 0xFFFE) / 2);
    });
    describe("Variable defined in several files (#376)", function () {
        const ISSUE_DIR = Path.join(__dirname, '..', '..', 'test_files', 'issue-376');
        const ISSUE_MAIN = Path.join(ISSUE_DIR, 'only-custom.s');
        let document: vscode.TextDocument;
        before(async function () {
            const state = ExtensionState.getCurrent();
            ASMLine.init(await state.getLanguage());
            const localHandler = new M68kDefinitionHandler();
            sinon.stub(state, "getDefinitionHandler").returns(localHandler);
            // only-custom.s includes custom.i (CUSTOM equ $dff000)
            await localHandler.scanFile(Uri.file(ISSUE_MAIN));
            // A file not included by only-custom.s, scanned afterwards, redefines CUSTOM
            await localHandler.scanFile(Uri.file(Path.join(ISSUE_DIR, 'ndk', 'preferences.i')));
            document = await vscode.workspace.openTextDocument(Uri.file(ISSUE_MAIN));
        });
        after(async function () {
            sinon.restore();
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        });
        it("Should apply a formula with the variable from the included file", async function () {
            const c = new CalcComponent();
            // "        dc.l    1"
            const selections = [new vscode.Selection(new vscode.Position(7, 0), new vscode.Position(7, 17))];
            const values = await c.getReplaceValuesForFormula("x+CUSTOM", document, selections);
            expect(values).to.have.lengthOf(1);
            expect(values[0][0]).to.be.equal("#" + (0xdff000 + 1));
        });
        it("Should evaluate the selection with the variable from the included file", async function () {
            const editor = await vscode.window.showTextDocument(document);
            // "CUSTOM" in "        lea     CUSTOM,a6"
            editor.selection = new vscode.Selection(new vscode.Position(4, 16), new vscode.Position(4, 22));
            const c = new CalcComponent();
            await c.updateCalc();
            expect(c.getStatusBar()?.text).to.contain("$dff000");
            c.dispose();
        });
    });
});
