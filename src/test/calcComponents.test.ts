//
// Tests of the calculator integration
//

import { expect } from 'chai';
import { CalcComponent } from '../calcComponents';
import * as Path from 'path';
import { ExtensionState } from '../extension';
import { Uri } from 'vscode';
import * as vscode from 'vscode';

// tslint:disable:no-unused-expression
describe("Calc Tests", function () {
    before(async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
        const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
        // activate the extension
        let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        let state = ExtensionState.getCurrent();
        let dHnd = state.getDefinitionHandler();
        await dHnd.scanFile(Uri.file(MAIN_SOURCE));
    });
    it("Should calculate an expression with all kind of numbers", async function () {
        let c = new CalcComponent();
        await expect(c.calculate("3+2")).to.be.eventually.equal(5);
        await expect(c.calculate("3+#2+$a+%100")).to.be.eventually.equal(19);
    });
    it("Should format a result", function () {
        let c = new CalcComponent();
        expect(c.formatResult("3+2", 5)).to.be.equal("#5/$5/%101");
        expect(c.formatResult(null, 2145)).to.be.equal("#2145/$861/%100001100001");
        expect(c.formatResult("$1000+$100", 4352)).to.be.equal("#4352/$1100/%1000100000000");
    });
    it("Should calculate an expression with variables", async function () {
        let c = new CalcComponent();
        await expect(c.calculate("#(BPLSIZE+COPPER_WAIT)/2")).to.be.eventually.equal(((320 * 256 / 8) + 0xFFFE) / 2);
    });
});
