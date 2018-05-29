/*---------------------------------------------------------
 * Inspired from status of go extension
 *--------------------------------------------------------*/
'use strict';

import { AMIGA_ASM_MODE } from "./extension";
import * as vscode from "vscode";

export class StatusManager {
    outputChannel = vscode.window.createOutputChannel('Amiga Assembly');
    diagnosticsStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarEntry: vscode.StatusBarItem | null = null;
    showHideStatus() {
        if (!this.statusBarEntry) {
            return;
        }
        if (!vscode.window.activeTextEditor) {
            this.statusBarEntry.hide();
            return;
        }
        if (vscode.languages.match(AMIGA_ASM_MODE, vscode.window.activeTextEditor.document)) {
            this.statusBarEntry.show();
            return;
        }
        this.statusBarEntry.hide();
    }
    dispose() {
        if (this.statusBarEntry) {
            this.statusBarEntry.dispose();
            this.statusBarEntry = null;
        }
        this.diagnosticsStatusBarItem.dispose();
        this.outputChannel.dispose();
    }
    showStatus(message: string, command: string, tooltip?: string) {
        this.statusBarEntry = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.statusBarEntry.text = message;
        this.statusBarEntry.command = command;
        this.statusBarEntry.tooltip = tooltip;
        this.onDefault();
        this.statusBarEntry.show();
    }
    onDefault() {
        if (this.statusBarEntry) {
            this.statusBarEntry.color = 'yellow';
        }
    }
    onSuccess() {
        if (this.statusBarEntry) {
            this.statusBarEntry.color = new vscode.ThemeColor('statusBar.foreground');
        }
    }
    onError(message: string) {
        vscode.window.showErrorMessage(message);
        if (this.statusBarEntry) {
            this.statusBarEntry.color = new vscode.ThemeColor('errorForeground');
        }
    }
}