//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { M68kHoverProvider } from '../hover';
import { DocumentationInstruction, DocumentationManager } from '../documentation';
import { Position, CancellationTokenSource, Hover, MarkdownString, Uri } from 'vscode';
import { DummyTextDocument } from './dummy';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { ExtensionState } from '../extension';
import * as Path from 'path';
import { M68kDefinitionHandler } from '../definitionHandler';
import * as vscode from 'vscode';

chai.use(chaiAsPromised);
// tslint:disable:no-unused-expression
describe("Hover Tests", function () {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..');
    const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
    const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
    let dHnd: M68kDefinitionHandler;
    let state: ExtensionState;
    let documentationManager: DocumentationManager;
    const defaultTimeout = 10000;
    before(async function () {
        this.timeout(defaultTimeout);
        // activate the extension
        let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        state = ExtensionState.getCurrent();
        dHnd = state.getDefinitionHandler();
        documentationManager = await state.getDocumentationManager();
        await dHnd.scanFile(Uri.file(MAIN_SOURCE));
    });
    describe("HoverProvider api", function () {
        it("Should return no hover on a empty document", function () {
            this.timeout(defaultTimeout);
            let hp = new M68kHoverProvider(documentationManager);
            const document = new DummyTextDocument();
            let position: Position = new Position(0, 1);
            let tokenEmitter = new CancellationTokenSource();
            let results = hp.provideHover(document, position, tokenEmitter.token);
            return expect(results).to.be.fulfilled;
        });
        it("Should return a hover on an instruction", async function () {
            this.timeout(defaultTimeout);
            let hp = new M68kHoverProvider(documentationManager);
            const document = new DummyTextDocument();
            let position: Position = new Position(0, 15);
            let tokenEmitter = new CancellationTokenSource();
            document.addLine(".mylabel\t   move.l #mempos,d1        ; mycomment   ");
            let result = await hp.provideHover(document, position, tokenEmitter.token);
            expect(result).to.not.be.undefined;
            expect(result instanceof Hover).to.be.true;
            if (result instanceof Hover) {
                let elm = result.contents[0];
                expect(elm instanceof MarkdownString).to.be.true;
                if (elm instanceof MarkdownString) {
                    expect(elm.value).to.contains("# MOVE - Copy data from source to destination");
                }
            }
        });
        it("Should return a hover on a data with a number", async function () {
            this.timeout(defaultTimeout);
            let hp = new M68kHoverProvider(documentationManager);
            const document = new DummyTextDocument();
            let position: Position = new Position(0, 23);
            let tokenEmitter = new CancellationTokenSource();
            document.addLine(".mylabel\t   move.l #$20,d1        ; mycomment   ");
            let result = await hp.provideHover(document, position, tokenEmitter.token);
            expect(result).to.not.be.undefined;
            expect(result instanceof Hover).to.be.true;
            if (result instanceof Hover) {
                let elm = result.contents[0];
                expect(elm instanceof MarkdownString).to.be.true;
                if (elm instanceof MarkdownString) {
                    expect(elm.value).to.be.equal("#`32` - $`20` - %`100000` ... ");
                }
            }
        });
    });
    it("Should return a hover on a data with a number and a register", async function () {
        this.timeout(defaultTimeout);
        let hp = new M68kHoverProvider(documentationManager);
        const document = new DummyTextDocument();
        let position: Position = new Position(0, 30);
        let tokenEmitter = new CancellationTokenSource();
        document.addLine(".mylabel\t   move.l #$ff5,$dff180        ; mycomment   ");
        let result = await hp.provideHover(document, position, tokenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            let elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value.indexOf("Bits") > 0).to.be.true;
            }
        }
    });
    it("Should return a hover on a data with a library name", async function () {
        this.timeout(defaultTimeout);
        let hp = new M68kHoverProvider(documentationManager);
        const document = new DummyTextDocument();
        let position: Position = new Position(0, 25);
        let tokenEmitter = new CancellationTokenSource();
        document.addLine(".mylabel\t   jsr AllocMem(a6)        ; mycomment   ");
        let result = await hp.provideHover(document, position, tokenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            let elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value.includes("allocator")).to.be.true;
            }
        }
        // LVOprefix is accepted
        document.addLine(".mylabel\t   jsr _LVOAllocMem(a6)        ; mycomment   ");
        result = await hp.provideHover(document, position, tokenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            let elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value.includes("allocator")).to.be.true;
            }
        }
    });
    it("Should return a hover on a data with a formula and a register", async function () {
        this.timeout(defaultTimeout);
        let hp = new M68kHoverProvider(documentationManager);
        const document = new DummyTextDocument();
        let position: Position = new Position(0, 51);
        let tokenEmitter = new CancellationTokenSource();
        document.addLine(".mylabel\t   move.l #(BPLSIZE+COPPER_WAIT)/2,$dff180        ; mycomment   ");
        let result = await hp.provideHover(document, position, tokenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            let elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value.indexOf("|  | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1|") > 0).to.be.true;
            }
        }
    });
    it("Should return a hover on variable", async function () {
        this.timeout(defaultTimeout);
        let hp = new M68kHoverProvider(documentationManager);
        const document = new DummyTextDocument();
        let position: Position = new Position(0, 4);
        let tokenEmitter = new CancellationTokenSource();
        document.addLine("MY_H_VAR = xxx");
        let result = await hp.provideHover(document, position, tokenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            let elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value).to.be.equal("#`4096000` - $`3e.8000` - %`111110.10000000.00000000` .>..");
            }
        }
    });
    it("Should render a command", function () {
        this.timeout(defaultTimeout);
        let hp = new M68kHoverProvider(documentationManager);
        let hoverInstruction = new DocumentationInstruction("ADD", "parent", "add.md");
        hoverInstruction.name = "ADD";
        hoverInstruction.parentDir = "parent";
        hoverInstruction.description = "ADD binary";
        expect(hp.renderHover(hoverInstruction).value).to.be.equal("ADD binary");
    });
    it("Should render a register hover", async function () {
        this.timeout(defaultTimeout);
        let hp = new M68kHoverProvider(documentationManager);
        let mdStr = await hp.renderWordHover("DFF180");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.contain("Color");
        }
        mdStr = await hp.renderWordHover("COLOR00");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.contain("Color");
        }
    });
    it("Should render a number", function () {
        this.timeout(defaultTimeout);
        let hp = new M68kHoverProvider(documentationManager);
        let format = "#`@dec@` - $`@hex@` - %`@bin@` - @`@oct@` @ascii@";
        let mdStr = hp.renderNumberForWord("#10", format);
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`10` - $`a` - %`1010` - @`12` ....");
        }
        mdStr = hp.renderNumberForWord("$10", format);
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`16` - $`10` - %`10000` - @`20` ....");
        }
        mdStr = hp.renderNumberForWord("%10", format);
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`2` - $`2` - %`10` - @`2` ....");
        }
        mdStr = hp.renderNumberForWord("@10", format);
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`8` - $`8` - %`1000` - @`10` ....");
        }
        mdStr = hp.renderNumberForWord("#$83f0", format);
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`33776` - $`83f0` - %`10000011.11110000` - @`10.1760` ...ð");
        }
    });
    it("Should render a register value", function () {
        this.timeout(defaultTimeout);
        let hp = new M68kHoverProvider(documentationManager);
        let expected = "|Bits | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0|\n|---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ----|\n|  | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0|\n\n";
        let mdStr = hp.renderRegisterValue("$1010");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal(expected);
        }
        mdStr = hp.renderRegisterValue("@10020");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal(expected);
        }
        mdStr = hp.renderRegisterValue("#4112");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal(expected);
        }
        mdStr = hp.renderRegisterValue("%1000000010000");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal(expected);
        }
    });
});
