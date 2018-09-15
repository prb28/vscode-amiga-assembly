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
import { ExtensionState } from '../extensionState';
import { Capstone } from '../capstone';

// Defines a Mocha test suite to group tests of similar kind together
describe("Global Extension Tests", function () {
    before(async () => {
        // activate the extension
        let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
    });
    // Creating the relative path to find the test file
    const testFilesPath = path.join(__dirname, "..", "..", "test_files");
    context("Formatting comand", function () {
        it("Should format a simple file", async () => {
            this.timeout(2000);
            // Simple test file
            const uri = vscode.Uri.file(path.join(testFilesPath, "hw-toform.s"));
            // Read the expected file
            let expectedFileContents = fs.readFileSync(path.join(testFilesPath, "hw-exp.s"), 'utf8');
            // Opens the file in the editor
            await vscode.window.showTextDocument(uri);
            let editor = vscode.window.activeTextEditor;
            // tslint:disable-next-line:no-unused-expression
            expect(editor).to.not.be.undefined;
            if (editor) {
                // Editor openned
                // Call the formatting command
                await vscode.commands.executeCommand("editor.action.formatDocument");
                expect(editor.document.getText()).to.be.equal(expectedFileContents);
            }
        });
        it("Should format another simple file with sprite", async () => {
            this.timeout(2000);
            // Creating the relative path to find the test file
            const testFilesPath = path.join(__dirname, "..", "..", "test_files");
            // Simple test file
            const uri = vscode.Uri.file(path.join(testFilesPath, "hw2-toform.s"));
            // Read the expected file
            let expectedFileContents = fs.readFileSync(path.join(testFilesPath, "hw2-exp.s"), 'utf8');
            // Opens the file in the editor
            await vscode.window.showTextDocument(uri);
            let editor = vscode.window.activeTextEditor;
            // tslint:disable-next-line:no-unused-expression
            expect(editor).to.not.be.undefined;
            if (editor) {
                // Editor openned
                // Call the formatting command
                await vscode.commands.executeCommand("editor.action.formatDocument");
                expect(editor.document.getText()).to.be.equal(expectedFileContents);
            }
        });
    });
    describe("Build commands", function () {
        it("Should build the workspace on command", async () => {
            let state = ExtensionState.getInstance();
            let spiedCompiler = spy(state.getCompiler());
            let spiedStatus = spy(state.getStatusManager());
            when(spiedCompiler.buildWorkspace()).thenCall(() => { return Promise.resolve(); });
            await vscode.commands.executeCommand("amiga-assembly.build-vasm-workspace");
            verify(spiedCompiler.buildWorkspace()).once();
            verify(spiedStatus.onDefault()).once();
            verify(spiedStatus.onSuccess()).once();
            // Generating a build error
            resetCalls(spiedCompiler);
            resetCalls(spiedStatus);
            when(spiedCompiler.buildWorkspace()).thenReject("nope");
            await vscode.commands.executeCommand("amiga-assembly.build-vasm-workspace");
            verify(spiedCompiler.buildWorkspace()).once();
            verify(spiedStatus.onDefault()).once();
            verify(spiedStatus.onSuccess()).never();
            verify(spiedStatus.onError("nope")).once();
        });
        it("Should build the current document on command", async () => {
            let state = ExtensionState.getInstance();
            let spiedCompiler = spy(state.getCompiler());
            let spiedStatus = spy(state.getStatusManager());
            when(spiedCompiler.buildCurrentEditorFile()).thenCall(() => { return Promise.resolve(); });
            await vscode.commands.executeCommand("amiga-assembly.build-vasm");
            verify(spiedCompiler.buildCurrentEditorFile()).once();
            verify(spiedStatus.onDefault()).once();
            verify(spiedStatus.onSuccess()).never(); // On success is only for the workspace
            // Generating a build error
            resetCalls(spiedCompiler);
            resetCalls(spiedStatus);
            when(spiedCompiler.buildCurrentEditorFile()).thenCall(() => { return Promise.reject("nope"); });
            await vscode.commands.executeCommand("amiga-assembly.build-vasm");
            verify(spiedCompiler.buildCurrentEditorFile()).once();
            verify(spiedStatus.onDefault()).once();
            verify(spiedStatus.onError("nope")).once();
        });
        it("Should clean the current workspace on command", async () => {
            let state = ExtensionState.getInstance();
            let spiedCompiler = spy(state.getCompiler());
            let spiedStatus = spy(state.getStatusManager());
            when(spiedCompiler.cleanWorkspace()).thenCall(() => { return Promise.resolve(); });
            await vscode.commands.executeCommand("amiga-assembly.clean-vasm-workspace");
            verify(spiedCompiler.cleanWorkspace()).once();
            verify(spiedStatus.onDefault()).once();
            // Generating a build error
            resetCalls(spiedCompiler);
            resetCalls(spiedStatus);
            when(spiedCompiler.cleanWorkspace()).thenReject("nope");
            await vscode.commands.executeCommand("amiga-assembly.clean-vasm-workspace");
            verify(spiedCompiler.cleanWorkspace()).once();
            verify(spiedStatus.onDefault()).never();
            verify(spiedStatus.onSuccess()).never();
            verify(spiedStatus.onError("nope")).once();
        });
    });
    describe("Disassemble command", function () {
        it("Should disassemble a file", async () => {
            let state = ExtensionState.getInstance();
            let spiedDisassembler = spy(state.getDisassembler());
            let mockedCapstone = mock(Capstone);
            let capstone = instance(mockedCapstone);
            when(spiedDisassembler.getCapstone()).thenCall(() => { return capstone; });
            when(mockedCapstone.disassembleFile(anything())).thenReturn(Promise.resolve(" 0  90 91  sub.l\t(a1), d0"));
            const uri = vscode.Uri.file(path.join(testFilesPath, "debug", "fs-uae", "hd0", "gencop"));
            const spiedWindow = spy(vscode.window);
            let promise = new Promise<vscode.Uri[] | undefined>((resolve, reject) => { resolve([uri]); });
            when(spiedWindow.showOpenDialog(anything())).thenReturn(promise);
            await vscode.commands.executeCommand("amiga-assembly.disassemble-file");
            verify(spiedWindow.showOpenDialog(anything())).once();
            await vscode.commands.executeCommand("cursorMove", { to: 'left', by: 'character', value: 3, select: true });

            // Read the expected file
            let expectedFileContents = fs.readFileSync(path.join(testFilesPath, "disassemble-exp.s"), 'utf8');
            let editor = vscode.window.activeTextEditor;
            // tslint:disable-next-line:no-unused-expression
            expect(editor).to.not.be.undefined;
            if (editor) {
                // Editor openned
                expect(editor.document.getText()).to.be.equal(expectedFileContents);
            }
        });
    });
});
