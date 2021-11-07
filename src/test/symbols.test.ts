//
// Tests of the symbols reader
//

import { expect } from 'chai';
import { SymbolFile } from '../symbols';
import { Uri } from 'vscode';
import * as Path from 'path';


describe("Symbols reader Tests", function () {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..');
    const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
    const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
    it("Should read all the symbols of a file", async function () {
        const sf = new SymbolFile(Uri.file(MAIN_SOURCE));
        const symbolFile = await sf.readFile();
        const definedSymbols = symbolFile.getDefinedSymbols();
        const variables = symbolFile.getVariables();
        const labels = symbolFile.getLabels();
        expect(definedSymbols.length).to.be.equal(59);
        const referedSymbols = symbolFile.getReferredSymbols();
        expect(referedSymbols.length).to.be.equal(313);
        const firstDefined = definedSymbols[1];
        expect(firstDefined.getLabel()).to.be.equal("COPPER_WAIT");
        let count = 0;
        for (let i = 0; i < referedSymbols.length; i++) {
            if (referedSymbols[i].getLabel() === firstDefined.getLabel()) {
                count++;
            }
        }
        expect(count).to.be.equal(12);
        expect(variables.length).to.be.equal(18);
        expect(labels.length).to.be.equal(40);
        expect(sf.getIncludeDir()).to.be.equal("include");
        expect(sf.getIncludedFiles()[0].getLabel()).to.be.eql("hw.i");
    });
});