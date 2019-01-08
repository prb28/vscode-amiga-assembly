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
        let sf = new SymbolFile(Uri.file(MAIN_SOURCE));
        let symbolFile = await sf.readFile();
        let definedSymbols = symbolFile.getDefinedSymbols();
        let variables = symbolFile.getVariables();
        let labels = symbolFile.getLabels();
        expect(definedSymbols.length).to.be.equal(56);
        let referedSymbols = symbolFile.getReferedSymbols();
        expect(referedSymbols.length).to.be.equal(313);
        let firstDefined = definedSymbols[0];
        expect(firstDefined.getLabel()).to.be.equal("COPPER_WAIT");
        let count = 0;
        for (let i = 0; i < referedSymbols.length; i++) {
            if (referedSymbols[i].getLabel() === firstDefined.getLabel()) {
                count++;
            }
        }
        expect(count).to.be.equal(12);
        expect(variables.length).to.be.equal(16);
        expect(labels.length).to.be.equal(40);
    });
});