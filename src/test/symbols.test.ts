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
        expect(definedSymbols.length).to.be.equal(56);
    });
});