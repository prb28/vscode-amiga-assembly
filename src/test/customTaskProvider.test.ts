import * as vscode from "vscode";
import {
    spy,
    verify,
    when,
    resetCalls,
    reset,
    anything,
} from "@johanblumenberg/ts-mockito";
import { CompilerController } from "../customTaskProvider";
import { DummyTextDocument } from "./dummy";
import { expect } from "chai";
import { ExtensionState } from "../extension";

describe("Task Provider tests", function () {
    before(async () => {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        const newFile = vscode.Uri.parse("untitled://./vasm.s");
        return vscode.window.showTextDocument(newFile);
    });
    after(async () => {
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });
    context("CompileController", function () {
        it("Should build the saved document on save", async () => {
            const controller = new CompilerController();
            const spiedController = spy(controller);
            const document = new DummyTextDocument();

            when(spiedController.compile(anything())).thenResolve(null);
            await controller.onSaveDocument(document);
            verify(spiedController.compile(document)).once();
            // Generating a build error
            resetCalls(spiedController);
            const error = new Error("nope");
            when(spiedController.compile(anything())).thenReject(error);
            try {
                await controller.onSaveDocument(document);
            } catch (err) {
                expect(err).to.be.eql(error);
            }
            verify(spiedController.compile(document)).once();
        });
        it("Should not build a document of an other language on save", async () => {
            const controller = new CompilerController();
            const spiedController = spy(controller);
            const document = new DummyTextDocument();
            (<{ languageId: string }>document).languageId = "json";
            when(spiedController.compile(anything())).thenResolve(null);
            await controller.onSaveDocument(document);
            verify(spiedController.compile(anything())).never();
        });
        it("Should build the saved document with the compiler, not the document of the active editor", async () => {
            const compiler = ExtensionState.getCurrent().getCompiler();
            const spiedCompiler = spy(compiler);
            try {
                const document = new DummyTextDocument();
                expect(vscode.window.activeTextEditor?.document).to.not.be.equal(document);
                when(spiedCompiler.buildEditorDocument(anything())).thenResolve();
                const controller = new CompilerController();
                await controller.onSaveDocument(document);
                verify(spiedCompiler.buildEditorDocument(document)).once();
                verify(spiedCompiler.buildCurrentEditorFile()).never();
            } finally {
                reset(spiedCompiler);
            }
        });
    });
});
