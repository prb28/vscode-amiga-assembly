//
// Tests of the documentation parsing and managers
//

import { expect } from 'chai';
import { DocumentationInstruction, DocumentationManager } from '../documentation';
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
        documentationManger = state.getDocumentationManager();
    });
    context("Hover instruction file parsing", function () {
        it("Should read the file correctly", function () {
            let manager = documentationManger.instructionsManager;
            expect(manager.instructions.size).to.be.equal(158);
            let list = manager.instructions.get("ADD");
            expect(list).to.not.be.undefined;
            if (list) {
                let hi = list[0];
                expect(hi.name).to.be.equal("add");
                expect(hi.description).to.be.equal("ADD binary");
                expect(hi.syntax).to.be.equal("Dx,Dy");
                expect(hi.size).to.be.equal("BWL");
                expect(hi.x).to.be.equal("*");
                expect(hi.n).to.be.equal("*");
                expect(hi.z).to.be.equal("*");
                expect(hi.v).to.be.equal("*");
                expect(hi.c).to.be.equal("*");
            }
            list = manager.instructions.get("MOVE");
            expect(list).to.not.be.undefined;
            if (list) {
                let hi = list[1];
                expect(hi.name).to.be.equal("move");
                expect(hi.description).to.be.equal("Copy value");
                expect(hi.syntax).to.be.equal("Rn,Dy");
                expect(hi.size).to.be.equal("WL");
                expect(hi.x).to.be.equal("-");
                expect(hi.n).to.be.equal("*");
                expect(hi.z).to.be.equal("*");
                expect(hi.v).to.be.equal("0");
                expect(hi.c).to.be.equal("0");
            }
        });
        it("Should parse a correct line", function () {
            let hi = DocumentationInstruction.parse("ADD;ADD binary;Dx,Dy;BWL;1;2;3;4;5");
            expect(hi.name).to.be.equal("add");
            expect(hi.description).to.be.equal("ADD binary");
            expect(hi.syntax).to.be.equal("Dx,Dy");
            expect(hi.size).to.be.equal("BWL");
            expect(hi.x).to.be.equal("1");
            expect(hi.n).to.be.equal("2");
            expect(hi.z).to.be.equal("3");
            expect(hi.v).to.be.equal("4");
            expect(hi.c).to.be.equal("5");
        });
        it("Should return null if a line parse fail", function () {
            let hi = DocumentationInstruction.parse("ADD;ADD binary");
            expect(hi).to.be.null;
        });
    });
    context("Hover register file parsing", function () {
        it("Should read the files correctly", function () {
            let manager = documentationManger.registersManager;
            expect(manager.registersByName.size).to.be.equal(280);
            expect(manager.registersByAddress.size).to.be.equal(266);
            let registerByName = manager.registersByName.get("ADKCONR");
            let registerByAddress = manager.registersByAddress.get("DFF010");
            expect(registerByName).to.not.be.undefined;
            expect(registerByAddress).to.not.be.undefined;
            if (registerByName) {
                expect(registerByName.name).to.be.equals("ADKCONR");
                expect(registerByName.address).to.be.equals("DFF010");
                expect(registerByName.description.startsWith("**$dff010 - Audio, Disk, UART Control Read**")).to.be.true;
                expect(registerByName.description).to.contains("control bit.determines");
            }
            expect(registerByName).to.be.eql(registerByAddress);
        });
    });
    context("Hover library file parsing", function () {
        it("Should read the files correctly", function () {
            let manager = documentationManger.libraryManager;
            expect(manager.size()).to.be.equal(505);
            let registerByName = manager.loadDescription("OPENLIBRARY");
            expect(registerByName).to.not.be.undefined;
            if (registerByName) {
                expect(registerByName.name).to.be.equals("OpenLibrary");
                expect(registerByName.description).to.contains("gain access to a library");
                // should have refactored a link
                expect(registerByName.description).not.to.contains("[OpenDevice](OpenDevice)");
                expect(registerByName.description).to.contains("[OpenDevice](command:amiga-assembly.showdoc?%5B%7B%22path%22%3A%22libs%2Fexec%2FOpenDevice%22%7D%5D)");
            }
            registerByName = manager.loadDescription("ADDTASK");
            expect(registerByName).to.not.be.undefined;
            if (registerByName) {
                // should have refactored a link with relative path
                expect(registerByName.description).not.to.contains("[dos/CreateProc](../dos/CreateProc)");
                expect(registerByName.description).to.contains("[dos/CreateProc](command:amiga-assembly.showdoc?%5B%7B%22path%22%3A%22libs%2Fexec%2F..%2Fdos%2FCreateProc%22%7D%5D)");
            }
        });
    });
    it("Should find the keywords starting with a word", function () {
        let docs = documentationManger.findKeywordStartingWith("ADDTASK");
        expect(docs[0].name).to.be.equal("AddTask");
        docs = documentationManger.findKeywordStartingWith("_LVOADDTASK");
        expect(docs[0].name).to.be.equal("AddTask");
        docs = documentationManger.findKeywordStartingWith("addt");
        expect(docs[0].name).to.be.equal("AddTail");
        expect(docs[1].name).to.be.equal("AddTask");
        docs = documentationManger.findKeywordStartingWith("move");
        expect(docs.length).to.be.equal(10);
    });
});
