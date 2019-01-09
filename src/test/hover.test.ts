//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { M68kHoverProvider } from '../hover';
import { HoverInstruction } from '../parser';
import { Position, CancellationTokenSource, Hover, MarkdownString, Uri } from 'vscode';
import { DummyTextDocument } from './dummy';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { ExtensionState } from '../extension';
import * as Path from 'path';
import { M68kDefinitionHandler } from '../definitionHandler';

chai.use(chaiAsPromised);
// tslint:disable:no-unused-expression
describe("Hover Tests", function () {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..');
    const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
    const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
    let dHnd: M68kDefinitionHandler;
    before(async function () {
        let state = ExtensionState.getCurrent();
        dHnd = state.getDefinitionHandler();
        await dHnd.scanFile(Uri.file(MAIN_SOURCE));
    });
    describe("HoverProvider api", function () {
        it("Should return no hover on a empty document", function () {
            let hp = new M68kHoverProvider();
            const document = new DummyTextDocument();
            let position: Position = new Position(0, 1);
            let tockenEmitter = new CancellationTokenSource();
            let results = hp.provideHover(document, position, tockenEmitter.token);
            expect(results).to.be.rejected;
        });
        it("Should return a hover on an instruction", async function () {
            let hp = new M68kHoverProvider();
            const document = new DummyTextDocument();
            let position: Position = new Position(0, 15);
            let tockenEmitter = new CancellationTokenSource();
            document.addLine("\t.mylabel\t   move.l #mempos,d1        ; mycomment   ");
            let result = await hp.provideHover(document, position, tockenEmitter.token);
            expect(result).to.not.be.undefined;
            expect(result instanceof Hover).to.be.true;
            if (result instanceof Hover) {
                let elm = result.contents[0];
                expect(elm instanceof MarkdownString).to.be.true;
                if (elm instanceof MarkdownString) {
                    expect(elm.value).to.be.equal("**MOVE**: Copy value");
                }
            }
        });
        it("Should return a hover on a data with a number", async function () {
            let hp = new M68kHoverProvider();
            const document = new DummyTextDocument();
            let position: Position = new Position(0, 23);
            let tockenEmitter = new CancellationTokenSource();
            document.addLine("\t.mylabel\t   move.l #$20,d1        ; mycomment   ");
            let result = await hp.provideHover(document, position, tockenEmitter.token);
            expect(result).to.not.be.undefined;
            expect(result instanceof Hover).to.be.true;
            if (result instanceof Hover) {
                let elm = result.contents[0];
                expect(elm instanceof MarkdownString).to.be.true;
                if (elm instanceof MarkdownString) {
                    expect(elm.value).to.be.equal("#`32` - $`20` - %`100000` - @`40`");
                }
            }
        });
    });
    it("Should return a hover on a data with a number and a register", async function () {
        let hp = new M68kHoverProvider();
        const document = new DummyTextDocument();
        let position: Position = new Position(0, 30);
        let tockenEmitter = new CancellationTokenSource();
        document.addLine("\t.mylabel\t   move.l #$ff5,$dff180        ; mycomment   ");
        let result = await hp.provideHover(document, position, tockenEmitter.token);
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
    it("Should return a hover on a data with a formula and a register", async function () {
        let hp = new M68kHoverProvider();
        const document = new DummyTextDocument();
        let position: Position = new Position(0, 51);
        let tockenEmitter = new CancellationTokenSource();
        document.addLine("\t.mylabel\t   move.l #(BPLSIZE+COPPER_WAIT)/2,$dff180        ; mycomment   ");
        let result = await hp.provideHover(document, position, tockenEmitter.token);
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
        let hp = new M68kHoverProvider();
        const document = new DummyTextDocument();
        let position: Position = new Position(0, 4);
        let tockenEmitter = new CancellationTokenSource();
        document.addLine("MY_H_VAR = xxx");
        let result = await hp.provideHover(document, position, tockenEmitter.token);
        expect(result).to.not.be.undefined;
        expect(result instanceof Hover).to.be.true;
        if (result instanceof Hover) {
            let elm = result.contents[0];
            expect(elm instanceof MarkdownString).to.be.true;
            if (elm instanceof MarkdownString) {
                expect(elm.value).to.be.equal("#`4096000` - $`3e.8000` - %`111110.10000000.00000000` - @`17500000.0000`");
            }
        }
    });
    it("Should render a command", function () {
        let hp = new M68kHoverProvider();
        let hoverInstruction = new HoverInstruction();
        hoverInstruction.instruction = "ADD";
        hoverInstruction.decription = "ADD binary";
        hoverInstruction.syntax = "Dx,Dy";
        hoverInstruction.size = "BW";
        hoverInstruction.x = "1";
        hoverInstruction.n = "2";
        hoverInstruction.z = "3";
        hoverInstruction.v = "4";
        hoverInstruction.c = "5";
        expect(hp.renderHover(hoverInstruction).value).to.be.equal("`ADD[.BW]` `Dx,Dy` _(x:1,n:2,z:3,v:4,c:5)_");
    });
    it("Should render a register hover", function () {
        let hp = new M68kHoverProvider();
        let mdStr = hp.renderRegisterHover("DFF180");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.contain("Color");
        }
        mdStr = hp.renderRegisterHover("COLOR00");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.contain("Color");
        }
    });
    it("Should render a number", function () {
        let hp = new M68kHoverProvider();
        let mdStr = hp.renderNumberForWord("#10");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`10` - $`a` - %`1010` - @`12`");
        }
        mdStr = hp.renderNumberForWord("$10");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`16` - $`10` - %`10000` - @`20`");
        }
        mdStr = hp.renderNumberForWord("%10");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`2` - $`2` - %`10` - @`2`");
        }
        mdStr = hp.renderNumberForWord("@10");
        expect(mdStr).to.not.be.null;
        if (mdStr) {
            expect(mdStr.value).to.be.equal("#`8` - $`8` - %`1000` - @`10`");
        }
    });
    it("Should render a register value", function () {
        let hp = new M68kHoverProvider();
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
