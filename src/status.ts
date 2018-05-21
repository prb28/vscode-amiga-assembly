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
    hideStatus() {
        if (this.statusBarEntry) {
            this.statusBarEntry.dispose();
        }
    }
    showStatus(message: string, command: string, tooltip?: string) {
        this.statusBarEntry = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, Number.MIN_VALUE);
        this.statusBarEntry.text = message;
        this.statusBarEntry.command = command;
        this.statusBarEntry.color = 'yellow';
        this.statusBarEntry.tooltip = tooltip;
        this.statusBarEntry.show();
    }
}