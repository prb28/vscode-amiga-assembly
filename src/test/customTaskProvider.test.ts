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
import { VASMCompiler } from "../vasm";
import { VLINKLinker } from "../vlink";

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
            let thrown: unknown;
            try {
                await controller.onSaveDocument(document);
            } catch (err) {
                thrown = err;
            }
            expect(thrown).to.be.equal(error);
            verify(spiedController.compile(document)).once();
        });
        it("Should show a compile on save error once", function () {
            const controller = new CompilerController();
            expect(controller.onCompileError(new Error("nope"))).to.be.equal(true);
            expect(controller.onCompileError(new Error("nope"))).to.be.equal(false);
            expect(controller.onCompileError("other")).to.be.equal(true);
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
                verify(spiedCompiler.buildEditorDocument(document, undefined)).once();
                verify(spiedCompiler.buildCurrentEditorFile()).never();
            } finally {
                reset(spiedCompiler);
            }
        });
        it("Should build the saved document with the vasm configuration of the workspace tasks (issue #365)", async () => {
            const compiler = ExtensionState.getCurrent().getCompiler();
            const spiedCompiler = spy(compiler);
            try {
                const document = new DummyTextDocument();
                const vasm = { ...VASMCompiler.DEFAULT_BUILD_CONFIGURATION };
                const vasmSpaces = { ...vasm, args: ["-m68000", "-Fhunk", "-linedebug", "-spaces"] };
                const vasmDisabled = { ...vasm, enabled: false };
                const vlink = VLINKLinker.DEFAULT_BUILD_CONFIGURATION;
                when(spiedCompiler.buildEditorDocument(anything(), anything())).thenResolve();
                const controller = new CompilerController();
                const spiedController = spy(controller);
                // The 'compile current file' task is preferred to the build task
                when(spiedController.getTaskDefinitions(anything())).thenReturn([
                    { type: "shell" },
                    { type: "amigaassembly", vasm: vasm, vlink: vlink },
                    { type: "amigaassembly", vasm: vasmSpaces }
                ]);
                await controller.onSaveDocument(document);
                verify(spiedCompiler.buildEditorDocument(document, vasmSpaces)).once();
                // Without a compile task the configuration of the build task is used
                when(spiedController.getTaskDefinitions(anything())).thenReturn([
                    { type: "amigaassembly", vasm: vasmDisabled },
                    { type: "amigaassembly", vasm: vasmSpaces, vlink: vlink }
                ]);
                expect(controller.getVasmBuildProperties(document)).to.be.equal(vasmSpaces);
                // A disabled vasm configuration is ignored: the default configuration is used
                when(spiedController.getTaskDefinitions(anything())).thenReturn([{ type: "amigaassembly", vasm: vasmDisabled }]);
                expect(controller.getVasmBuildProperties(document)).to.be.equal(undefined);
                // No tasks
                reset(spiedController);
                expect(controller.getVasmBuildProperties(document)).to.be.equal(undefined);
            } finally {
                reset(spiedCompiler);
            }
        });
    });
});
