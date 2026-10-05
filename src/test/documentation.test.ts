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
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        const state = ExtensionState.getCurrent();
        documentationManger = await state.getDocumentationManager();
    });
    context("Hover instruction file parsing", function () {
        it("Should read the file correctly", async function () {
            const manager = documentationManger.instructionsManager;
            expect(manager.getCount()).to.be.equal(128);
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
            const manager = documentationManger.instructionsManager;
            const addDocumentation = await manager.getInstructionByName("BNE");
            expect(addDocumentation).to.not.be.undefined;
            if (addDocumentation) {
                expect(addDocumentation.name).to.be.equal("bne");
                expect(addDocumentation.filename).to.contain("bcc");
                expect(addDocumentation.description).to.contain("# Bcc - Branch on condition");
            }
        });
        it("Should resolve dbcc variants", async function () {
            const manager = documentationManger.instructionsManager;
            const addDocumentation = await manager.getInstructionByName("DBNE");
            expect(addDocumentation).to.not.be.undefined;
            if (addDocumentation) {
                expect(addDocumentation.name).to.be.equal("dbne");
                expect(addDocumentation.filename).to.contain("dbcc");
                expect(addDocumentation.description).to.contain("# DBcc - Test condition, decrement, and branch");
            }
        });
        it("Should resolve scc variants", async function () {
            const manager = documentationManger.instructionsManager;
            const addDocumentation = await manager.getInstructionByName("SNE");
            expect(addDocumentation).to.not.be.undefined;
            if (addDocumentation) {
                expect(addDocumentation.name).to.be.equal("sne");
                expect(addDocumentation.filename).to.contain("scc");
                expect(addDocumentation.description).to.contain("# Scc - Set according to condition cc");
            }
        });
        it("Should remove images urls", async function () {
            const manager = documentationManger.instructionsManager;
            const addDocumentation = await manager.getInstructionByName("ROXL");
            expect(addDocumentation).to.not.be.undefined;
            if (addDocumentation) {
                expect(addDocumentation.name).to.be.equal("roxl");
                expect(addDocumentation.description).not.to.contain("roxl_roxr.png");
            }
        });
    });
    context("Hover directive file parsing", function () {
        it("Should read the file correctly", async function () {
            const manager = documentationManger.directivesManager;
            expect(manager.getCount()).to.be.equal(100);
            const documentation = await manager.getDirectiveByName("SECTION");
            expect(documentation).to.not.be.undefined;
            if (documentation) {
                expect(documentation.name).to.be.equal("section");
            }
        });
        it("Should document the rseven and ds directives (issue #358)", async function () {
            const manager = documentationManger.directivesManager;
            for (const name of ["rseven", "ds"]) {
                const documentation = await manager.getDirectiveByName(name.toUpperCase());
                expect(documentation).to.not.be.undefined;
                if (documentation) {
                    expect(documentation.name).to.be.equal(name);
                    expect(documentation.description).to.contain(`# ${name.toUpperCase()}`);
                }
            }
        });
    });
    context("Hover register file parsing", function () {
        it("Should read the files correctly", async function () {
            const manager = documentationManger.registersManager;
            expect(manager.getRegistersByNameCount()).to.be.equal(280);
            expect(manager.getRegistersByAddressCount()).to.be.equal(266);
            const registerByName = await manager.getRegistersByName("ADKCONR");
            const registerByAddress = await manager.getRegistersByAddress("DFF010");
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
        it("Should describe each blitter control register with its own title (issue #208)", async function () {
            const manager = documentationManger.registersManager;
            const expected: Array<[string, string]> = [
                ["BLTCON0", "**BLTCON0($dff040) - Blitter control register 0**"],
                ["BLTCON1", "**BLTCON1($dff042) - Blitter control register 1**"],
                ["BLTCON0L", "**BLTCON0L($dff05a) - Blitter control 0, lower 8 bits (minterms)**"]
            ];
            for (const [name, title] of expected) {
                const register = await manager.getRegistersByName(name);
                expect(register).to.not.be.undefined;
                if (register) {
                    expect(register.description.startsWith(title), `${name}: ${register.description.substring(0, 60)}`).to.be.true;
                }
            }
        });
        it("Should describe each register with its own name and title", async function () {
            const manager = documentationManger.registersManager;
            const expected: Array<[string, string]> = [
                ["SERDATR", "**SERDATR($dff018) - Serial port data and status read**"],
                ["DSKDAT", "**DSKDAT($dff026) - Disk DMA data write**"],
                ["BPLHSTRT", "**BPLHSTRT($dff1d4) - UHRES bit plane vertical start**"],
                ["HSSTRT", "**HSSTRT($dff1de) - Horizontal sync start (VARHSY)**"],
                ["POTINP", "**POTINP($dff016) - Pot pin data read**"]
            ];
            for (const [name, title] of expected) {
                const register = await manager.getRegistersByName(name);
                expect(register, name).to.not.be.undefined;
                if (register) {
                    expect(register.description.startsWith(title), `${name}: ${register.description.substring(0, 60)}`).to.be.true;
                }
            }
            for (const name of ["DKSDAT", "BLTHSTRT"]) {
                expect(await manager.getRegistersByName(name), name).to.be.undefined;
            }
            const intena = await manager.getRegistersByAddress("DFF09A");
            expect(intena?.name).to.be.equal("INTENA");
        });
    });
    context("Hover library file parsing", function () {
        it("Should read the files correctly", async function () {
            const manager = documentationManger.libraryManager;
            expect(manager.size()).to.be.equal(615);
            let registerByName = await manager.loadDescription("OPENLIBRARY");
            expect(registerByName).to.not.be.undefined;
            if (registerByName) {
                expect(registerByName.name).to.be.equals("OpenLibrary");
                expect(registerByName.description).to.contains("gain access to a library");
                // should have refactored a link
                expect(registerByName.description).not.to.contains("[OpenDevice](OpenDevice.md)");
                expect(registerByName.description).to.contains("[OpenDevice](command:amiga-assembly.showdoc?%5B%7B%22path%22%3A%22libs%2Fexec%2FOpenDevice.md%22%7D%5D)");
            }
            registerByName = await manager.loadDescription("ADDTASK");
            expect(registerByName).to.not.be.undefined;
            if (registerByName) {
                // should have refactored a link with relative path
                expect(registerByName.description).not.to.contains("[dos/CreateProc](../dos/CreateProc.md)");
                expect(registerByName.description).to.contains("[dos/CreateProc](command:amiga-assembly.showdoc?%5B%7B%22path%22%3A%22libs%2Fexec%2F..%2Fdos%2FCreateProc.md%22%7D%5D)");
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
        expect(docs.length).to.be.equal(12);
    });
});
