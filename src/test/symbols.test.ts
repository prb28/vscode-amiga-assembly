//
// Tests of the symbols reader
//

import { expect } from 'chai';
import { SymbolFile } from '../symbols';
import { Uri } from 'vscode';
import * as Path from 'path';
import { ExtensionState } from '../extension';
import { ASMLine } from '../parser';
import * as vscode from 'vscode';
import { DummyTextDocument } from './dummy';


describe("Symbols reader Tests", function () {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..');
    const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
    const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
    before(async () => {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        const state = ExtensionState.getCurrent();
        ASMLine.init(await state.getLanguage());
    });
    it("Should read all the symbols of a file", async function () {
        const sf = new SymbolFile(Uri.file(MAIN_SOURCE));
        const symbolFile = await sf.readFile();
        const definedSymbols = symbolFile.getDefinedSymbols();
        const variables = symbolFile.getVariables();
        const labels = symbolFile.getLabels();
        const macros = symbolFile.getMacros();
        expect(definedSymbols.length).to.be.equal(63);
        const referedSymbols = symbolFile.getReferredSymbols();
        expect(referedSymbols.length).to.be.equal(319);
        const firstDefined = definedSymbols[2];
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
        expect(macros.length).to.be.equal(2);
        expect(sf.getIncludeDirs()[0].getLabel()).to.be.eql("include");
        expect(sf.getIncludedFiles()[0].getLabel()).to.be.eql("hw.i");
    });

    it("Should remove all the trailing colons of a label (issue #344)", function () {
        const document = new DummyTextDocument();
        document.addLine("single:");
        document.addLine("    nop");
        document.addLine("exported::");
        document.addLine("    nop");
        document.addLine(".local::");
        document.addLine("    nop");
        document.addLine("inline::  rts");
        document.addLine("nocolon");
        document.addLine("    rts");
        const symbolFile = new SymbolFile(Uri.file("test.s"));
        symbolFile.readDocument(document);
        const labels = symbolFile.getLabels().map(l => l.getLabel());
        expect(labels).to.be.eql(["single", "exported", "exported.local", "inline", "nocolon"]);
        const definedSymbols = symbolFile.getDefinedSymbols().map(l => l.getLabel());
        expect(definedSymbols).to.be.eql(["single", "exported", ".local", "inline", "nocolon"]);
    });

    context("comment docs", () => {
        const COMMENTS_SOURCE = Path.join(PROJECT_ROOT, 'test_files', 'comment-docs.s');
        let symbolFile: SymbolFile;

        before(async () => {
            const sf = new SymbolFile(Uri.file(COMMENTS_SOURCE));
            symbolFile = await sf.readFile();
        });

        it("Should parse a label with no comments", () => {
            const symbol = symbolFile.getLabels().find(l => l.getLabel() === "LabelNone")!;
            expect(symbol?.getCommentBlock()).to.be.empty;
        });

        it("Should parse a label with comment on same line", () => {
            const symbol = symbolFile.getLabels().find(l => l.getLabel() === "LabelSameLine")!;
            expect(symbol?.getCommentBlock()).to.equal("Same line example");
        });

        it("Should parse a label with comments before symbol", () => {
            const symbol = symbolFile.getLabels().find(l => l.getLabel() === "LabelBefore")!;
            expect(symbol?.getCommentBlock()).to.equal("Before example\n\nLorem ispum dolor\nSit amet");
        });

        it("Should parse a label with comments after symbol", () => {
            const symbol = symbolFile.getLabels().find(l => l.getLabel() === "LabelAfter")!;
            expect(symbol?.getCommentBlock()).to.equal("After example\n\nLorem ispum dolor\nSit amet");
        });

        it("Should parse a label with comments both before and after symbol", () => {
            const symbol = symbolFile.getLabels().find(l => l.getLabel() === "LabelBoth")!;
            expect(symbol?.getCommentBlock()).to.equal("Before/after example\nLorem ispum dolor\nSit amet");
        });

        it("Should parse a label with star style comments", () => {
            const symbol = symbolFile.getLabels().find(l => l.getLabel() === "LabelStar")!;
            expect(symbol?.getCommentBlock()).to.equal("Star example\n\nLorem ispum dolor\nSit amet");
        });

        it("Should parse a macro with comments", () => {
            const symbol = symbolFile.getMacros().find(l => l.getLabel() === "MacroExample")!;
            expect(symbol?.getCommentBlock()).to.equal("Macro example\n\nLorem ispum dolor\nSit amet");
        });

        it("Should parse a variable with comments", () => {
            const symbol = symbolFile.getVariables().find(l => l.getLabel() === "VAR_EXAMPLE")!;
            expect(symbol?.getCommentBlock()).to.equal("Variable example");
        });
    });
});