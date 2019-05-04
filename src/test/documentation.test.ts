//
// Tests of the documentation parsing and managers
//

import { expect } from 'chai';
import { HoverInstruction, HoverInstructionsManager, HoverRegistersManager, HoverLibraryManager } from '../documentation';

// tslint:disable:no-unused-expression
describe("Documentation Tests", function () {
    context("Hover instruction file parsing", function () {
        it("Should read the file correctly", function () {
            let manager = new HoverInstructionsManager();
            expect(manager.instructions.size).to.be.equal(116);
            let list = manager.instructions.get("ADD");
            expect(list).to.not.be.undefined;
            if (list) {
                let hi = list[0];
                expect(hi.instruction).to.be.equal("ADD");
                expect(hi.decription).to.be.equal("ADD binary");
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
                expect(hi.instruction).to.be.equal("MOVE");
                expect(hi.decription).to.be.equal("Copy value");
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
            let hi = HoverInstruction.parse("ADD;ADD binary;Dx,Dy;BWL;1;2;3;4;5");
            expect(hi.instruction).to.be.equal("ADD");
            expect(hi.decription).to.be.equal("ADD binary");
            expect(hi.syntax).to.be.equal("Dx,Dy");
            expect(hi.size).to.be.equal("BWL");
            expect(hi.x).to.be.equal("1");
            expect(hi.n).to.be.equal("2");
            expect(hi.z).to.be.equal("3");
            expect(hi.v).to.be.equal("4");
            expect(hi.c).to.be.equal("5");
        });
        it("Should return null if a line parse fail", function () {
            let hi = HoverInstruction.parse("ADD;ADD binary");
            expect(hi).to.be.null;
        });
    });
    context("Hover register file parsing", function () {
        it("Should read the files correctly", function () {
            let manager = new HoverRegistersManager();
            expect(manager.registersByName.size).to.be.equal(280);
            expect(manager.registersByAddress.size).to.be.equal(266);
            let registerByName = manager.registersByName.get("ADKCONR");
            let registerByAddress = manager.registersByAddress.get("DFF010");
            expect(registerByName).to.not.be.undefined;
            expect(registerByAddress).to.not.be.undefined;
            if (registerByName) {
                expect(registerByName.name).to.be.equals("ADKCONR");
                expect(registerByName.address).to.be.equals("DFF010");
                expect(registerByName.description).to.contains("control bit.determines");
            }
            expect(registerByName).to.be.eql(registerByAddress);
        });
    });
    context("Hover library file parsing", function () {
        it("Should read the files correctly", function () {
            let manager = new HoverLibraryManager();
            expect(manager.size()).to.be.equal(390);
            let registerByName = manager.loadDescription("OPENLIBRARY");
            expect(registerByName).to.not.be.undefined;
            if (registerByName) {
                expect(registerByName.name).to.be.equals("OPENLIBRARY");
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
});
