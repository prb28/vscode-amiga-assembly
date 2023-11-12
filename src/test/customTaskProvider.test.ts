import * as vscode from "vscode";
import {
    spy,
    verify,
    when,
    resetCalls,
} from "@johanblumenberg/ts-mockito";
import { CompilerController } from "../customTaskProvider";
import { DummyTextDocument } from "./dummy";
import { expect } from "chai";

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
        it("Should build the current document on save", async () => {
            const controller = new CompilerController();
            const spiedController = spy(controller);
            const document = new DummyTextDocument();

            when(spiedController.compile()).thenResolve(null);
            await controller.onSaveDocument(document);
            verify(spiedController.compile()).once();
            // Generating a build error
            resetCalls(spiedController);
            const error = new Error("nope");
            when(spiedController.compile()).thenReject(error);
            try {
                await controller.onSaveDocument(document);
            } catch (err) {
                expect(err).to.be.eql(error);
            }
            verify(spiedController.compile()).once();
        });
    });
});
