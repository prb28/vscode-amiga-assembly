//
// Tests of the extension
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'chai' provides assertion methods from node
import { expect } from 'chai';
import * as vscode from 'vscode';
import { spy, verify, anyString, capture, when, anything } from 'ts-mockito/lib/ts-mockito';
import { ExtensionState } from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
describe("Global Extension Tests", function () {
    context("Calc commands", function () {
        let state: ExtensionState | undefined;
        before(async () => {
            const newFile = vscode.Uri.parse("untitled://./myfile.s");
            await vscode.workspace.openTextDocument(newFile).then(async document => {
                const edit = new vscode.WorkspaceEdit();
                edit.insert(newFile, new vscode.Position(0, 0), "3+2");
                await vscode.workspace.applyEdit(edit).then(async (success) => {
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
            state = ExtensionState.getCurrent();
        });
        it("Should evaluate the selection in the status bar", async () => {
            this.timeout(60000);
            if (state) {
                let calc = state.getCalc();
                // Get the satus value
                // tslint:disable-next-line:no-unused-expression
                expect(calc).to.not.be.undefined;
                let sb = calc.getStatusBar();
                // tslint:disable-next-line:no-unused-expression
                expect(sb).to.not.be.undefined;
                if (sb) {
                    expect(sb.text).to.be.equal("#5/$5/%101");
                }
            }
        });
        it("Should hide the status bar if it it not evaluable", async () => {
            let calc = ExtensionState.getCurrent().getCalc();
            let sb = calc.getStatusBar();
            // tslint:disable-next-line:no-unused-expression
            expect(sb).to.not.be.undefined;
            if (sb) {
                let spiedStatus = spy(sb);
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
            }
        });
        it("Should evaluate a selection", async () => {
            const spiedWindow = spy(vscode.window);
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await vscode.commands.executeCommand("amiga-assembly.evaluate-selection");
                expect(editor.document.getText()).to.be.equal("3+2");
                verify(spiedWindow.showInformationMessage(anyString())).once();
                expect(capture(spiedWindow.showInformationMessage).last()[0]).to.be.equal("#5/$5/%101");
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
            when(spiedWindow.showInputBox(anything())).thenReturn(promise);
            await vscode.commands.executeCommand("amiga-assembly.calculator");
            verify(spiedWindow.showInputBox(anything())).once();
        });
    });
});
