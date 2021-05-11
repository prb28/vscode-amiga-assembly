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
    let state: ExtensionState | undefined;
    context("Simple calc commands", function () {
        before(async () => {
            // activate the extension
            let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
            if (ext) {
                await ext.activate();
            }
            const newFile = vscode.Uri.parse("untitled://./myfile.s");
            await vscode.workspace.openTextDocument(newFile).then(async document => {
                const edit = new vscode.WorkspaceEdit();
                edit.insert(newFile, new vscode.Position(0, 0), "3+2");
                await vscode.workspace.applyEdit(edit).then(async (success) => {
                    if (success) {
                        await vscode.window.showTextDocument(document);
                        await vscode.commands.executeCommand("cursorMove", { to: 'right', by: 'character', value: 3, select: true });
                    } else {
                        expect.fail("Edit not successful");
                    }
                });
            });
        });
        beforeEach(async () => {
            // Set the editor contents
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await new Promise<void>((resolve) => {
                    editor.edit(edit => {
                        edit.delete(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 3)));
                        edit.insert(new vscode.Position(0, 0), "3+2");
                        resolve();
                    });
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
                // Get the status value
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
        it("Should hide the status bar if it it not valuable", async () => {
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
            this.timeout(60000);
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await vscode.commands.executeCommand("amiga-assembly.evaluate-selection-replace");
                expect(editor.document.getText()).to.be.equal("#5/$5/%101");
            } else {
                expect.fail("Editor not available");
            }
        });
        it("Should open an inputBox as calc", async () => {
            const spiedWindow = spy(vscode.window);
            let promise = new Promise<string>((resolve, reject) => { resolve("3 + 2"); });
            when(spiedWindow.showInputBox(anything())).thenReturn(promise);
            await vscode.commands.executeCommand("amiga-assembly.calculator");
            verify(spiedWindow.showInputBox(anything())).once();
        });
    });
    context("Apply formula commands", function () {
        before(async () => {
            const newFile = vscode.Uri.parse("untitled://./myfileform.s");
            await vscode.workspace.openTextDocument(newFile).then(async document => {
                const edit = new vscode.WorkspaceEdit();
                edit.insert(newFile, new vscode.Position(0, 0), " dc.b $1, #10, #-1, $a, %1010, @1\n");
                edit.insert(newFile, new vscode.Position(1, 0), " move.l #$80,d7\n");
                edit.insert(newFile, new vscode.Position(2, 0), " dc.b $10,$21,$10,$41,$10,$61\n");
                let success = await vscode.workspace.applyEdit(edit);
                if (success) {
                    await vscode.window.showTextDocument(document);
                    await vscode.commands.executeCommand("cursorMove", { to: 'up', by: 'line', value: 3, select: false });
                    await vscode.commands.executeCommand("cursorMove", { to: 'right', by: 'character', value: 12, select: true });
                    await vscode.commands.executeCommand("cursorMove", { to: 'down', by: 'line', value: 1, select: true });
                } else {
                    expect.fail("Edit not successful");
                }
            });
        });
        it("Should apply a formula to a selection and replace with the result", async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await vscode.commands.executeCommand("amiga-assembly.apply-formula", { formula: "x+3" });
                expect(editor.document.lineAt(0).text).to.be.equal(" dc.b $4, #13, #2, $d, %1101, @4");
                expect(editor.document.lineAt(1).text).to.be.equal(" move.l #$83,d7");
            } else {
                expect.fail("Editor not available");
            }
        });
        it("Should apply a formula with binary operators to a selection and replace with the result", async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await vscode.commands.executeCommand("cursorMove", { to: 'down', by: 'line', value: 1, select: false });
                await vscode.commands.executeCommand("cursorMove", { to: 'wrappedLineFirstNonWhitespaceCharacter', select: false });
                await vscode.commands.executeCommand("cursorMove", { to: 'wrappedLineLastNonWhitespaceCharacter', select: true });
                await vscode.commands.executeCommand("amiga-assembly.apply-formula", { formula: "x&16" });
                expect(editor.document.lineAt(2).text).to.be.equal(" dc.b $10,$0,$10,$0,$10,$0");
            } else {
                expect.fail("Editor not available");
            }
        });
    });
});
