//
// Tests of the extension
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'chai' provides assertion methods from node
import { expect } from 'chai';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spy, verify, when, anything, resetCalls, mock, instance } from 'ts-mockito/lib/ts-mockito';
import { ExtensionState } from '../../extension';
import { Capstone } from '../../capstone';
import { IFFViewerPanel } from '../../iffImageViewer';
import { fail } from 'assert';
import { ConfigurationHelper } from '../../configurationHelper';

// Defines a Mocha test suite to group tests of similar kind together
describe("Global Extension Tests", function () {
    const defaultTimeout = 10000;
    // Creating the relative path to find the test file
    let testFilesPath = "";
    before(async () => {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
            testFilesPath = path.join(ext.extensionPath, "test_files");
        } else {
            fail("Extension no loaded");
        }
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
        }).timeout(defaultTimeout);
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
        }).timeout(defaultTimeout);
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
        }).timeout(defaultTimeout);
    });
    context("Build commands", function () {
        it("Should clean the current workspace on command", async () => {
            const state = ExtensionState.getCurrent();
            const spiedCompiler = spy(state.getCompiler());
            const spiedStatus = spy(state.getStatusManager());
            when(spiedCompiler.cleanWorkspace()).thenCall(() => { return Promise.resolve(); });
            await vscode.commands.executeCommand("amiga-assembly.clean-vasm-workspace");
            verify(spiedCompiler.cleanWorkspace()).once();
            verify(spiedStatus.onDefault()).once();
            // Generating a build error
            resetCalls(spiedCompiler);
            resetCalls(spiedStatus);
            when(spiedCompiler.cleanWorkspace()).thenReject(new Error("nope"));
            await vscode.commands.executeCommand("amiga-assembly.clean-vasm-workspace");
            verify(spiedCompiler.cleanWorkspace()).once();
            verify(spiedStatus.onDefault()).never();
            verify(spiedStatus.onSuccess()).never();
            verify(spiedStatus.onError("nope")).once();
        });
    });
    context("Disassemble command", function () {
        it("Should disassemble a file", async () => {
            const state = ExtensionState.getCurrent();
            const spiedDisassembler = spy(state.getDisassembler());
            const mockedCapstone = mock(Capstone);
            const capstone = instance(mockedCapstone);
            when(spiedDisassembler.getCapstone()).thenCall(() => { return capstone; });
            when(mockedCapstone.disassembleFile(anything())).thenReturn(Promise.resolve(" 0  90 91  sub.l\t(a1), d0"));
            const uri = vscode.Uri.file(path.join(testFilesPath, "debug", "fs-uae", "hd0", "gencop"));
            const spiedWindow = spy(vscode.window);
            const promise = new Promise<vscode.Uri[] | undefined>((resolve) => { resolve([uri]); });
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
                expect(editor.document.getText().replace('\r', '')).to.be.equal(expectedFileContents.replace('\r', ''));
            }
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        });
    });
    context("Webview", function () {
        it("Should show an iff file", async () => {
            const imageName = "TRU256.IFF";
            const uri = vscode.Uri.file(path.join(testFilesPath, imageName));
            await vscode.commands.executeCommand("amiga-assembly.view-iff", uri);

            expect(IFFViewerPanel.views.size).to.be.greaterThan(0);
            for (const panel of IFFViewerPanel.views.keys()) {
                expect(panel.title).to.be.equal(imageName);
                expect(panel.webview.html).to.contain("iff.min.js");
            }
        }).timeout(defaultTimeout);
    });
});
