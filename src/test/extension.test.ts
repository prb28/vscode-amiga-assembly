//
// Tests of the extension
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'chai' provides assertion methods from node
import { expect } from 'chai';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spy, verify, anyString, capture, when, mock, anything } from 'ts-mockito';
import * as extension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
describe("Global Extension Tests", function () {
    context("Formatting comand", function () {
        it("Should format a simple file", async () => {
            // Creating the relative path to find the test file
            const testFilesPath = path.join(__dirname, "..", "..", "test_files");
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
    describe("Calc comand", function () {
        before(() => {
            const newFile = vscode.Uri.parse("untitled://" + path.join(__dirname, "..", "..", "out", "myfile.s"));
            return vscode.workspace.openTextDocument(newFile).then(document => {
                const edit = new vscode.WorkspaceEdit();
                edit.insert(newFile, new vscode.Position(0, 0), "3+2");
                return vscode.workspace.applyEdit(edit).then(async (success) => {
                    if (success) {
                        await vscode.window.showTextDocument(document);
                        await vscode.commands.executeCommand("cursorMove", { to: 'right', by: 'character', value: 3, select: true });
                    } else {
                        expect.fail("Edit not sucessful");
                    }
                });
            });
        });
        beforeEach(async () => {
            // Set the editor contents
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await editor.edit(edit => {
                    edit.delete(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 3)));
                    edit.insert(new vscode.Position(0, 0), "3+2");
                });
                await vscode.commands.executeCommand("cursorMove", { to: 'left', by: 'character', value: 3, select: true });
            } else {
                expect.fail("Editor not available");
            }
        });
        it("Should evaluate the selection in the status bar", () => {
            // Get the satus value
            expect(extension.calc.statusBarItem.text).to.be.equal("3+2=#5/$5/%101");
        });
        it("Should hide the status bar if it it not evaluable", async () => {
            let spiedStatus = spy(extension.calc.statusBarItem);
            // Deselected -- not hidden
            await vscode.commands.executeCommand("cursorMove", { to: 'left', by: 'character', value: 1, select: false });
            verify(spiedStatus.hide()).never();
            // Insert text
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await editor.edit(edit => {
                    edit.delete(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 3)));
                    edit.insert(new vscode.Position(0, 0), "ABF");
                });
            } else {
                expect.fail("Editor not available");
            }
            await vscode.commands.executeCommand("cursorMove", { to: 'left', by: 'character', value: 1, select: true });
            verify(spiedStatus.hide()).once();
        });
        it("Should evaluate a selection", async () => {
            const spiedWindow = spy(vscode.window);
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await vscode.commands.executeCommand("amiga-assembly.evaluate-selection");
                expect(editor.document.getText()).to.be.equal("3+2");
                verify(spiedWindow.showInformationMessage(anyString())).once();
                expect(capture(spiedWindow.showInformationMessage).last()[0]).to.be.equal("3+2=#5/$5/%101");
            } else {
                expect.fail("Editor not available");
            }
        });
        it("Should evaluate a selection and replace with the result", async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await vscode.commands.executeCommand("amiga-assembly.evaluate-selection");
                expect(editor.document.getText()).to.be.equal("3+2");
            } else {
                expect.fail("Editor not available");
            }
        });
        it("Should open an inputbox as calc", async () => {
            const spiedWindow = spy(vscode.window);
            let promise = new Promise<string>((resolve, reject) => { resolve("3 + 2"); });
            when(spiedWindow.showInputBox(anything())).thenResolve(promise);
            await vscode.commands.executeCommand("amiga-assembly.calculator").then(() => { verify(spiedWindow.showInputBox(anything())).once(); });
        });

    });
});