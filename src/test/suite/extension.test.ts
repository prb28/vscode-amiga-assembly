//
// Tests of the extension
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'chai' provides assertion methods from node
import { expect } from 'chai';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spy, verify, when, anything, resetCalls } from '@johanblumenberg/ts-mockito';
import { ExtensionState } from '../../extension';
import { fail } from 'assert';
import { ConfigurationHelper } from '../../configurationHelper';
import { FileProxy } from '../../fsProxy';

// Defines a Mocha test suite to group tests of similar kind together
describe("Global Extension Tests", function () {
    // Creating the relative path to find the test file
    let testFilesPath = "";
    before(async () => {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
            testFilesPath = path.join(ext.extensionPath, "test_files");
        } else {
            fail("Extension not loaded");
        }
    });
    context("Initialization", function () {
        it("Should chmod the resources", async () => {
            const resourcesPath = ExtensionState.getCurrent().getResourcesPath();
            const darwinDir = new FileProxy(vscode.Uri.file(path.join(resourcesPath, "bin/darwin")));
            for (const f of await darwinDir.listFiles()) {
                expect(f.testPermissions(fs.constants.X_OK)).to.be.true;
            }
            const linuxDir = new FileProxy(vscode.Uri.file(path.join(resourcesPath, "bin/linux")));
            for (const f of await linuxDir.listFiles()) {
                expect(f.testPermissions(fs.constants.X_OK)).to.be.true;
            }
        });
    });
    context("Formatting command", function () {
        it("Should format a simple file", async () => {
            // Simple test file
            const uri = vscode.Uri.file(path.join(testFilesPath, "hw-toform.s"));
            // Read the expected file
            const expectedFileContents = fs.readFileSync(path.join(testFilesPath, "hw-exp.s"), 'utf8');
            // Opens the file in the editor
            await vscode.window.showTextDocument(uri);
            const editor = vscode.window.activeTextEditor;
            // tslint:disable-next-line:no-unused-expression
            expect(editor).to.not.be.undefined;
            if (editor) {
                // Editor opened
                // Call the formatting command
                await vscode.commands.executeCommand("editor.action.formatDocument");
                expect(editor.document.getText()).to.be.equal(expectedFileContents);
            }
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        });
        it("Should format another simple file with sprite", async () => {
            // Simple test file
            const uri = vscode.Uri.file(path.join(testFilesPath, "hw2-toform.s"));
            // Read the expected file
            const expectedFileContents = fs.readFileSync(path.join(testFilesPath, "hw2-exp.s"), 'utf8');
            // Opens the file in the editor
            await vscode.window.showTextDocument(uri);
            const editor = vscode.window.activeTextEditor;
            // tslint:disable-next-line:no-unused-expression
            expect(editor).to.not.be.undefined;
            if (editor) {
                // Editor opened
                // Call the formatting command
                await vscode.commands.executeCommand("editor.action.formatDocument");
                expect(editor.document.getText()).to.be.equal(expectedFileContents);
            }
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        });
        it("Should format a file with tabs", async () => {
            // Simple test file
            const uri = vscode.Uri.file(path.join(testFilesPath, "hw-tabs-toform.s"));
            // Read the expected file
            const expectedFileContents = fs.readFileSync(path.join(testFilesPath, "hw-tabs-exp.s"), 'utf8');
            // Opens the file in the editor
            await vscode.window.showTextDocument(uri);
            const editor = vscode.window.activeTextEditor;
            // tslint:disable-next-line:no-unused-expression
            expect(editor).to.not.be.undefined;
            if (editor) {
                // Editor opened
                // Call the formatting command
                await ConfigurationHelper.getDefaultConfiguration(uri).update('format.useTabs', true, true);
                await vscode.commands.executeCommand("editor.action.formatDocument");
                await ConfigurationHelper.getDefaultConfiguration(uri).update('format.useTabs', false, true);
                expect(editor.document.getText()).to.be.equal(expectedFileContents);
            }
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        });
    });
    context("Build commands", function () {
        it("Should clean the current workspace on command", async () => {
            const state = ExtensionState.getCurrent();
            const spiedCompiler = spy(state.getCompiler());
            when(spiedCompiler.cleanWorkspace()).thenCall(() => { return Promise.resolve(); });
            await vscode.commands.executeCommand("amiga-assembly.clean-vasm-workspace");
            verify(spiedCompiler.cleanWorkspace()).once();
            // Generating a build error
            resetCalls(spiedCompiler);
            when(spiedCompiler.cleanWorkspace()).thenReject(new Error("nope"));
            expect(vscode.commands.executeCommand("amiga-assembly.clean-vasm-workspace")).to.be.rejected;
        });
    });
    context("Disassemble command", function () {
        it("Should disassemble a file", async () => {
            const uri = vscode.Uri.file(path.join(testFilesPath, "debug", "fs-uae", "hd0", "gencop"));
            const spiedWindow = spy(vscode.window);
            const promise = Promise.resolve([uri]);
            when(spiedWindow.showOpenDialog(anything())).thenReturn(promise);
            await vscode.commands.executeCommand("amiga-assembly.disassemble-file");
            verify(spiedWindow.showOpenDialog(anything())).once();
            await vscode.commands.executeCommand("cursorMove", { to: 'left', by: 'character', value: 3, select: true });

            // Read the expected file
            const expectedFileContents = fs.readFileSync(path.join(testFilesPath, "disassemble-exp.s"), 'utf8');
            const editor = vscode.window.activeTextEditor;
            // tslint:disable-next-line:no-unused-expression
            expect(editor).to.not.be.undefined;
            if (editor) {
                // Editor opened
                expect(editor.document.getText().replace(/\r/g, '')).to.be.equal(expectedFileContents.replace(/\r/g, ''));
            }
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        });
    });
    context("Webview", function () {
        it("Should show an iff file", async () => {
            const imageName = "TRU256.IFF";
            const uri = vscode.Uri.file(path.join(testFilesPath, imageName));
            await vscode.commands.executeCommand("amiga-assembly.view-iff", uri);

            const sz = ExtensionState.getCurrent().getIffViewPanelsMap().size;
            expect(sz).to.be.greaterThan(0);
        });
    });
});
