//
// Tests of the documentation parsing and managers
//

import { expect } from 'chai';
import { DocumentationManager } from '../documentation';
import * as vscode from 'vscode';
import { ExtensionState } from '../extension';

// tslint:disable:no-unused-expression
describe("Documentation Tests", function () {
    let documentationManger: DocumentationManager;
    before(async () => {
        // activate the extension
        let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        let state = ExtensionState.getCurrent();
        documentationManger = await state.getDocumentationManager();
    });
    context("Hover instruction file parsing", function () {
        it("Should read the file correctly", async function () {
            let manager = documentationManger.instructionsManager;
            expect(manager.getCount()).to.be.equal(89);
            let addDocumentation = await manager.getInstructionByName("ADD");
            expect(addDocumentation).to.not.be.undefined;
            if (addDocumentation) {
                expect(addDocumentation.name).to.be.equal("add");
            }
            addDocumentation = await manager.getInstructionByName("MOVE");
            expect(addDocumentation).to.not.be.undefined;
            if (addDocumentation) {
                expect(addDocumentation.name).to.be.equal("move");
            }
        });
        it("Should resolve bcc variants", async function () {
            let manager = documentationManger.instructionsManager;
            let addDocumentation = await manager.getInstructionByName("BNE");
            expect(addDocumentation).to.not.be.undefined;
            if (addDocumentation) {
                expect(addDocumentation.name).to.be.equal("bne");
                expect(addDocumentation.filename).to.contain("bcc");
                expect(addDocumentation.description).to.contain("# Bcc - Branch on condition");
            }
        });
        it("Should replace images urls", async function () {
            let manager = documentationManger.instructionsManager;
            let addDocumentation = await manager.getInstructionByName("ROXL");
            expect(addDocumentation).to.not.be.undefined;
            if (addDocumentation) {
                expect(addDocumentation.name).to.be.equal("roxl");
                expect(addDocumentation.description).to.contain("doc/instructions/roxl_roxr.png)");
            }
        });
    });
    context("Hover register file parsing", function () {
        it("Should read the files correctly", async function () {
            let manager = documentationManger.registersManager;
            expect(manager.getRegistersByNameCount()).to.be.equal(280);
            expect(manager.getRegistersByAddressCount()).to.be.equal(266);
            let registerByName = await manager.getRegistersByName("ADKCONR");
            let registerByAddress = await manager.getRegistersByAddress("DFF010");
            expect(registerByName).to.not.be.undefined;
            expect(registerByAddress).to.not.be.undefined;
            if (registerByName) {
                expect(registerByName.name).to.be.equals("ADKCONR");
                expect(registerByName.address).to.be.equals("DFF010");
                expect(registerByName.description.startsWith("**ADKCONR($dff010) - Audio, Disk, UART Control Read**")).to.be.true;
                expect(registerByName.description).to.contains("control bit.determines");
            }
            expect(registerByName).to.be.eql(registerByAddress);
        });
    });
    context("Hover library file parsing", function () {
        it("Should read the files correctly", async function () {
            let manager = documentationManger.libraryManager;
            expect(manager.size()).to.be.equal(615);
            let registerByName = await manager.loadDescription("OPENLIBRARY");
            expect(registerByName).to.not.be.undefined;
            if (registerByName) {
                expect(registerByName.name).to.be.equals("OpenLibrary");
                expect(registerByName.description).to.contains("gain access to a library");
                // should have refactored a link
                expect(registerByName.description).not.to.contains("[OpenDevice](OpenDevice)");
                expect(registerByName.description).to.contains("[OpenDevice](command:amiga-assembly.showdoc?%5B%7B%22path%22%3A%22libs%2Fexec%2FOpenDevice%22%7D%5D)");
            }
            registerByName = await manager.loadDescription("ADDTASK");
            expect(registerByName).to.not.be.undefined;
            if (registerByName) {
                // should have refactored a link with relative path
                expect(registerByName.description).not.to.contains("[dos/CreateProc](../dos/CreateProc)");
                expect(registerByName.description).to.contains("[dos/CreateProc](command:amiga-assembly.showdoc?%5B%7B%22path%22%3A%22libs%2Fexec%2F..%2Fdos%2FCreateProc%22%7D%5D)");
            }
        });
    });
    it("Should find the keywords starting with a word", async function () {
        let docs = await documentationManger.findKeywordStartingWith("ADDTASK");
        expect(docs[0].name).to.be.equal("AddTask");
        docs = await documentationManger.findKeywordStartingWith("_LVOADDTASK");
        expect(docs[0].name).to.be.equal("AddTask");
        docs = await documentationManger.findKeywordStartingWith("addt");
        expect(docs[0].name).to.be.equal("AddTail");
        expect(docs[1].name).to.be.equal("AddTask");
        docs = await documentationManger.findKeywordStartingWith("move");
        expect(docs.length).to.be.equal(10);
    });
});
