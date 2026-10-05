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
import * as sinon from 'sinon';
import { ASMLine } from '../parser';

chai.use(chaiAsPromised);
// tslint:disable:no-unused-expression
describe("Hover Tests", function () {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..');
    const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
    const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
    let dHnd: M68kDefinitionHandler;
    let state: ExtensionState;
    let documentationManager: DocumentationManager;
    before(async function () {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
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
            const hp = new M68kHoverProvider(documentationManager);
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 1);
            const tokenEmitter = new CancellationTokenSource();
            const results = hp.provideHover(document, position, tokenEmitter.token);
            return expect(results).to.be.fulfilled;
        });
        it("Should return a hover on an instruction", async function () {
            const hp = new M68kHoverProvider(documentationManager);
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 15);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(".mylabel\t   move.l #mempos,d1        ; mycomment   ");
            const result = await hp.provideHover(document, position, tokenEmitter.token);
            expect(result).to.not.be.undefined;
            expect(result instanceof Hover).to.be.true;
            if (result instanceof Hover) {
                const elm = result.contents[0];
                expect(elm instanceof MarkdownString).to.be.true;
                if (elm instanceof MarkdownString) {
                    expect(elm.value).to.contains("# MOVE - Copy data from source to destination");
                }
            }
        });
        it("Should return a hover on a directive", async function () {
            const hp = new M68kHoverProvider(documentationManager);
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 14);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(".mylabel\t   dc.b 10        ; mycomment   ");
            const result = await hp.provideHover(document, position, tokenEmitter.token);
            expect(result).to.not.be.undefined;
            expect(result instanceof Hover).to.be.true;
            if (result instanceof Hover) {
                const elm = result.contents[0];
                expect(elm instanceof MarkdownString).to.be.true;
                if (elm instanceof MarkdownString) {
                    expect(elm.value).to.contains("# DC");
                }
            }
        });
        it("Should return a hover on a data with a number", async function () {
            const hp = new M68kHoverProvider(documentationManager);
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 23);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(".mylabel\t   move.l #$20,d1        ; mycomment   ");
            const result = await hp.provideHover(document, position, tokenEmitter.token);
            expect(result).to.not.be.undefined;
            expect(result instanceof Hover).to.be.true;
            if (result instanceof Hover) {
                const elm = result.contents[0];
                expect(elm instanceof MarkdownString).to.be.true;
                if (elm instanceof MarkdownString) {
                    expect(elm.value).to.be.equal("#`32` - $`20` - %`100000` ... ");
                }
            }
        });
    });
    it("Should return a hover on a data with a number and a register", async function () {
        const hp = new M68kHoverProvider(documentationManager);
        const document = new DummyTextDocument();
        const position: Position = new Position(0, 30);
        const tokenEmitter = new CancellationTokenSource();
        document.addLine(".mylabel\t   move.l #$ff5,$dff180        ; mycomment   ");
        const result = await hp.provideHover(document, position, tokenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            const elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value.includes("Bits")).to.be.true;
            }
        }
    });
    it("Should return a hover on a data with a library name", async function () {
        const hp = new M68kHoverProvider(documentationManager);
        const document = new DummyTextDocument();
        const position: Position = new Position(0, 25);
        const tokenEmitter = new CancellationTokenSource();
        document.addLine(".mylabel\t   jsr AllocMem(a6)        ; mycomment   ");
        let result = await hp.provideHover(document, position, tokenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            const elm = result.contents[0];
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
            const elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value.includes("allocator")).to.be.true;
            }
        }
    });
    it("Should return a hover on a data with a formula and a register", async function () {
        const hp = new M68kHoverProvider(documentationManager);
        const document = new DummyTextDocument();
        const position: Position = new Position(0, 51);
        const tokenEmitter = new CancellationTokenSource();
        document.addLine(".mylabel\t   move.l #(BPLSIZE+COPPER_WAIT)/2,$dff180        ; mycomment   ");
        const result = await hp.provideHover(document, position, tokenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            const elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value.includes("|  | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1|")).to.be.true;
            }
        }
    });
    it("Should return a hover on variable", async function () {
        const hp = new M68kHoverProvider(documentationManager);
        const document = new DummyTextDocument();
        const position: Position = new Position(0, 4);
        const tokenEmitter = new CancellationTokenSource();
        document.addLine("MY_H_VAR = xxx");
        const result = await hp.provideHover(document, position, tokenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            const elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value).to.be.equal("#`4096000` - $`3e.8000` - %`111110.10000000.00000000` .>..");
            }
        }
    });
    describe("Symbol defined in several files (#376)", function () {
        const ISSUE_DIR = Path.join(PROJECT_ROOT, 'test_files', 'issue-376');
        const ISSUE_MAIN = Path.join(ISSUE_DIR, 'only-custom.s');
        const OTHER_DEFINITION = Path.join(ISSUE_DIR, 'ndk', 'preferences.i');
        const EXPECTED = "#`14675968` - $`df.f000`";
        let localHandler: M68kDefinitionHandler;
        before(async function () {
            ASMLine.init(await state.getLanguage());
        });
        beforeEach(async function () {
            localHandler = new M68kDefinitionHandler();
            sinon.stub(state, "getDefinitionHandler").returns(localHandler);
            // only-custom.s includes custom.i (CUSTOM, MyWait, MYMACRO)
            await localHandler.scanFile(Uri.file(ISSUE_MAIN));
            // A file not included by only-custom.s, scanned afterwards, redefines the same symbols
            await localHandler.scanFile(Uri.file(OTHER_DEFINITION));
        });
        afterEach(function () {
            sinon.restore();
        });
        async function hoverContents(position: Position, filePath = ISSUE_MAIN): Promise<string[]> {
            const document = await vscode.workspace.openTextDocument(Uri.file(filePath));
            const hp = new M68kHoverProvider(documentationManager);
            const result = await hp.provideHover(document, position, new CancellationTokenSource().token);
            expect(result instanceof Hover).to.be.true;
            return (result as Hover).contents.map(elm => (elm as MarkdownString).value);
        }
        async function hoverOnCustom(): Promise<string> {
            return (await hoverContents(new Position(4, 19)))[0];
        }
        it("Should tell where the variable is defined", async function () {
            const contents = (await hoverContents(new Position(4, 19))).join("\n");
            expect(contents).to.contain("Defined in [custom.i:1]");
            expect(contents).to.not.contain("preferences");
        });
        it("Should not tell where the symbol is defined when it is only in the current file", async function () {
            const document = new DummyTextDocument();
            document.addLine("LOCAL_VAR = 3");
            document.addLine("localLabel:");
            document.addLine("  lea        LOCAL_VAR,a0");
            document.addLine("  bsr        localLabel");
            await localHandler.scanFile(document.uri, document);
            const hp = new M68kHoverProvider(documentationManager);
            for (const position of [new Position(2, 15), new Position(3, 15)]) {
                const result = await hp.provideHover(document, position, new CancellationTokenSource().token);
                expect(result instanceof Hover).to.be.true;
                const all = (result as Hover).contents.map(elm => (elm as MarkdownString).value).join("\n");
                expect(all).to.not.contain("Defined in");
            }
        });
        context("when both files are included", function () {
            // both-included.s includes custom.i and then ndk/preferences.i
            const BOTH_MAIN = Path.join(ISSUE_DIR, 'both-included.s');
            beforeEach(async function () {
                await localHandler.scanFile(Uri.file(BOTH_MAIN));
            });
            it("Should list all the files defining the variable", async function () {
                const contents = await hoverContents(new Position(5, 15), BOTH_MAIN);
                expect(contents[0]).to.contain(EXPECTED);
                const all = contents.join("\n");
                expect(all).to.contain("Defined in [custom.i:1]");
                expect(all).to.contain("Also defined in [preferences.i:2]");
                // The value of the other definition is shown
                expect(all).to.contain("= `2`");
            });
            it("Should list all the files defining the label", async function () {
                const all = (await hoverContents(new Position(6, 15), BOTH_MAIN)).join("\n");
                expect(all).to.contain("Defined in [custom.i:4]");
                expect(all).to.contain("Also defined in [preferences.i:5]");
            });
            it("Should list all the files defining the macro", async function () {
                const all = (await hoverContents(new Position(7, 4), BOTH_MAIN)).join("\n");
                expect(all).to.contain("Defined in [custom.i:8]");
                expect(all).to.contain("Also defined in [preferences.i:9]");
            });
        });
        it("Should use the label from the included file", async function () {
            const contents = (await hoverContents(new Position(5, 18))).join("\n");
            // The comment block is escaped markdown: only check the file name
            expect(contents).to.contain("custom");
            expect(contents).to.not.contain("preferences");
        });
        it("Should use the macro from the included file", async function () {
            const contents = (await hoverContents(new Position(6, 10))).join("\n");
            expect(contents).to.contain("custom");
            expect(contents).to.not.contain("preferences");
        });
        it("Should use the definition from the included file", async function () {
            expect(await hoverOnCustom()).to.contain(EXPECTED);
        });
        it("Should keep the definition after the other file is rescanned", async function () {
            await localHandler.scanFile(Uri.file(OTHER_DEFINITION));
            await localHandler.scanFile(Uri.file(Path.join(ISSUE_DIR, 'include', 'custom.i')));
            await localHandler.scanFile(Uri.file(OTHER_DEFINITION));
            expect(await hoverOnCustom()).to.contain(EXPECTED);
        });
    });
    it("Should render a command", function () {
        const hp = new M68kHoverProvider(documentationManager);
        const hoverInstruction = new DocumentationInstruction("ADD", "parent", "add.md");
        hoverInstruction.name = "ADD";
        hoverInstruction.parentDir = "parent";
        hoverInstruction.description = "ADD binary";
        expect(hp.renderHover(hoverInstruction).value).to.be.equal("ADD binary");
    });
    it("Should render a register hover", async function () {
        const hp = new M68kHoverProvider(documentationManager);
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
        const hp = new M68kHoverProvider(documentationManager);
        const format = "#`@dec@` - $`@hex@` - %`@bin@` - @`@oct@` @ascii@";
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
        const hp = new M68kHoverProvider(documentationManager);
        const expected = "|Bits | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0|\n|---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ----|\n|  | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0|\n\n";
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
    context("Register bits marking (issue #208)", function () {
        it("Should mark the set bits in a vertical bits table", function () {
            const hp = new M68kHoverProvider(documentationManager);
            const doc = "**Title**\n\n| Bit| Function| Description  |\n|---|---|---  |\n|15| SET/CLR| Set  |\n|14| BBUSY| Busy  |\n|05| SPREN| Sprite  |\n|00| AUD0EN| Audio 0|\n\nText";
            const expected = "**Title**\n\n| Bit| Function| Description  |\n|---|---|---  |\n|**15 ●**| SET/CLR| Set  |\n|14| BBUSY| Busy  |\n|**05 ●**| SPREN| Sprite  |\n|00| AUD0EN| Audio 0|\n\nText";
            expect(hp.markRegisterBits(doc, 0x8020)).to.be.equal(expected);
        });
        it("Should show the value of a bits range", function () {
            const hp = new M68kHoverProvider(documentationManager);
            const doc = "|Bit| Function|\n|---|---|\n|14-13| PRECOMP 1-0|\n|07-00| DATA|";
            const expected = "|Bit| Function|\n|---|---|\n|14-13 = %10| PRECOMP 1-0|\n|07-00 = %10100101| DATA|";
            expect(hp.markRegisterBits(doc, 0x40a5)).to.be.equal(expected);
        });
        it("Should add a value row in a horizontal bits table", function () {
            const hp = new M68kHoverProvider(documentationManager);
            const doc = "| Bit| 03| 02| 01| 00  |\n|---|---|---|---|---  |\n|| R| G| B| X|";
            const expected = "| Bit| 03| 02| 01| 00  |\n|---|---|---|---|---  |\n|Value|1|0|1|0|\n|| R| G| B| X|";
            expect(hp.markRegisterBits(doc, 0xa)).to.be.equal(expected);
        });
        it("Should not modify the other tables", function () {
            const hp = new M68kHoverProvider(documentationManager);
            const doc = "|Octant| SUD| SUL| AUL|\n|---|---|---|---|\n|0| 1| 1| 0|\n|7| 1| 0| 0|";
            expect(hp.markRegisterBits(doc, 0xffff)).to.be.equal(doc);
        });
        it("Should mark the bits of BLTCON1 in the hover", async function () {
            const hp = new M68kHoverProvider(documentationManager);
            const document = new DummyTextDocument();
            const tokenEmitter = new CancellationTokenSource();
            document.addLine("    move.w     #$8001,$dff042");
            const result = await hp.provideHover(document, new Position(0, 25), tokenEmitter.token);
            expect(result instanceof Hover).to.be.true;
            if (result instanceof Hover) {
                expect(result.contents.length).to.be.equal(2);
                const elm = result.contents[1];
                expect(elm instanceof MarkdownString).to.be.true;
                if (elm instanceof MarkdownString) {
                    expect(elm.value).to.contain("|**15 ●**| ASH3| BSH3|");
                    expect(elm.value).to.contain("|**00 ●**| LF0| LINE(=0)|");
                    expect(elm.value).to.contain("|14| ASH2| BSH2|");
                }
            }
        });
        it("Should keep the bit number and its mark on the same line", function () {
            const hp = new M68kHoverProvider(documentationManager);
            const doc = "| Bit| Function| Description  |\n|---|---|---  |\n|15| SET/CLR| Set  |\n|09| DMAEN| Enable all DMA below (also UHRES DMA)  |";
            const marked = hp.markRegisterBits(doc, 0x7fff);
            expect(marked).to.contain("|15| SET/CLR|");
            expect(marked).to.contain("|**09 ●**| DMAEN|");
            // The cells of the 'Bit' column must not contain a breaking space
            for (const row of marked.split("\n").slice(2)) {
                expect(row.split("|")[1]).to.not.match(/ /);
            }
        });
    });
});
