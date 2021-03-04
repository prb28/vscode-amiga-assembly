import { expect } from 'chai';
import { ExtensionState } from '../extension';
import { spy, verify, anyString, when } from 'ts-mockito/lib/ts-mockito';
import * as vscode from 'vscode';

// tslint:disable:no-unused-expression
describe("Status Tests", function () {
    before(async () => {
        // activate the extension
        let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
    });
    it("Should status show on command", () => {
        let state = ExtensionState.getCurrent();
        let statusManager = state.getStatusManager();
        statusManager.showStatus("Build", 'amiga-assembly.build-vasm-workspace', 'Build Workspace');
        statusManager.diagnosticsStatusBarItem.show();
        // status is shown
        expect(statusManager.statusBarEntry).not.to.be.null;
        if (statusManager.statusBarEntry) {
            statusManager.onDefault();
            expect(statusManager.statusBarEntry.text).to.be.equal('Build');
            expect(statusManager.statusBarEntry.command).to.be.equal('amiga-assembly.build-vasm-workspace');
            expect(statusManager.statusBarEntry.tooltip).to.be.equal('Build Workspace');
            expect(statusManager.statusBarEntry.color).to.be.equal('yellow');
            let spiedStatusBarEntry = spy(statusManager.statusBarEntry);
            // try to toggle
            statusManager.showHideStatus();
            verify(spiedStatusBarEntry.hide()).once();

            // dispose
            let spiedDiag = spy(statusManager.diagnosticsStatusBarItem);
            when(spiedDiag.dispose()).thenCall(() => { });
            when(spiedStatusBarEntry.dispose()).thenCall(() => { });
            statusManager.dispose();
            verify(spiedDiag.dispose()).once();
            verify(spiedStatusBarEntry.dispose()).once();
            expect(statusManager.statusBarEntry).to.be.null;
            // try to toggle
            statusManager.showHideStatus();

            //return to normal
            statusManager.showStatus("Build", 'amiga-assembly.build-vasm-workspace', "Build Workspace");
        }

    });
    it("Should show react to an error", () => {
        let spiedWindow = spy(vscode.window);
        let state = ExtensionState.getCurrent();
        let statusManager = state.getStatusManager();
        statusManager.showStatus("Build", 'amiga-assembly.build-vasm-workspace', 'Build Workspace');
        expect(statusManager.statusBarEntry).not.to.be.null;
        if (statusManager.statusBarEntry) {
            // onError
            statusManager.onError('myError');
            expect(statusManager.statusBarEntry.color).to.be.eql(new vscode.ThemeColor('errorForeground'));
            expect(statusManager.statusBarEntry.text).to.be.equal('Build');
            verify(spiedWindow.showErrorMessage(anyString())).once();
        }
    });
    it("Should show react to a success", () => {
        let state = ExtensionState.getCurrent();
        let statusManager = state.getStatusManager();
        statusManager.showStatus("Build", 'amiga-assembly.build-vasm-workspace', 'Build Workspace');
        expect(statusManager.statusBarEntry).not.to.be.null;
        if (statusManager.statusBarEntry) {
            // onError
            statusManager.onSuccess();
            expect(statusManager.statusBarEntry.color).to.be.eql(new vscode.ThemeColor('statusBar.foreground'));
            expect(statusManager.statusBarEntry.text).to.be.equal('Build');
        }
    });
});