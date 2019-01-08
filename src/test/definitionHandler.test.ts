//
// Tests of the definition handler
//

import { expect } from 'chai';
import { M68kDefinitionHandler } from '../definitionHandler';
import { Uri } from 'vscode';
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
});
