import { expect } from 'chai';
import { statusManager } from '../extension';
import { spy, verify } from 'ts-mockito';
import * as vscode from 'vscode';

// tslint:disable:no-unused-expression
describe("Status Tests", function () {
    before(() => {
        // Opening file to activate the extension
        const newFile = vscode.Uri.parse("untitled://./sta.s");
        return vscode.window.showTextDocument(newFile);
    });
    it("Should status should show on command", () => {
        expect(statusManager.statusBarEntry).to.be.null;
        statusManager.diagnosticsStatusBarItem.show();
        statusManager.showStatus("mymessage", "mycommand", "mytooltip");
        // status is shown
        expect(statusManager.statusBarEntry).not.to.be.null;
        if (statusManager.statusBarEntry) {
            expect(statusManager.statusBarEntry.text).to.be.equal('mymessage');
            expect(statusManager.statusBarEntry.command).to.be.equal('mycommand');
            expect(statusManager.statusBarEntry.tooltip).to.be.equal('mytooltip');
            let spiedStatusBarEntry = spy(statusManager.statusBarEntry);
            // try to toggle
            statusManager.showHideStatus();
            verify(spiedStatusBarEntry.hide()).once();

            // dispose
            statusManager.dispose();
            verify(spiedStatusBarEntry.dispose()).once();
            expect(statusManager.statusBarEntry).to.be.null;
            // try to toggle
            statusManager.showHideStatus();
        }
    });
});