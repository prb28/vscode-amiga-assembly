
import * as vscode from 'vscode';
import { Calc } from './calc';
import { VASMCompiler } from './vasm';
import { StatusManager } from "./status";
import { Disassembler } from './disassemble';

export class ExtensionState {
    private static instance: ExtensionState;
    private compiler: VASMCompiler | undefined;
    private errorDiagnosticCollection: vscode.DiagnosticCollection | undefined;
    private warningDiagnosticCollection: vscode.DiagnosticCollection | undefined;
    private statusManager: StatusManager | undefined;
    private calc: Calc | undefined;
    private disassembler: Disassembler | undefined;
    public static getInstance() {
        if (!ExtensionState.instance) {
            ExtensionState.instance = new ExtensionState();
        }
        return ExtensionState.instance;
    }
    public getErrorDiagnosticCollection(): vscode.DiagnosticCollection {
        if (this.errorDiagnosticCollection === undefined) {
            this.errorDiagnosticCollection = vscode.languages.createDiagnosticCollection('m68k-error');
        }
        return this.errorDiagnosticCollection;
    }
    public getWarningDiagnosticCollection(): vscode.DiagnosticCollection {
        if (this.warningDiagnosticCollection === undefined) {
            this.warningDiagnosticCollection = vscode.languages.createDiagnosticCollection('m68k-warning');
        }
        return this.warningDiagnosticCollection;
    }
    public getStatusManager(): StatusManager {
        if (this.statusManager === undefined) {
            this.statusManager = new StatusManager();
        }
        return this.statusManager;
    }
    public getCalc(): Calc {
        if (this.calc === undefined) {
            this.calc = new Calc();
        }
        return this.calc;
    }
    public getCompiler(): VASMCompiler {
        if (this.compiler === undefined) {
            this.compiler = new VASMCompiler();
        }
        return this.compiler;
    }
    public getDisassembler(): Disassembler {
        if (this.disassembler === undefined) {
            this.disassembler = new Disassembler();
        }
        return this.disassembler;
    }
}