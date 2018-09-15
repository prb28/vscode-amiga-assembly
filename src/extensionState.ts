
import * as vscode from 'vscode';
import { Calc } from './calc';
import { VASMCompiler } from './vasm';
import { StatusManager } from "./status";
import { Disassembler } from './disassemble';

export class ExtensionState {
    private compiler: VASMCompiler;
    private errorDiagnosticCollection: vscode.DiagnosticCollection;
    private warningDiagnosticCollection: vscode.DiagnosticCollection;
    private statusManager: StatusManager;
    private calc: Calc;
    private disassembler: Disassembler;
    public static getInstance() {
        return INSTANCE;
    }
    public constructor() {
        this.compiler = new VASMCompiler();
        this.errorDiagnosticCollection = vscode.languages.createDiagnosticCollection('m68k-error');
        this.warningDiagnosticCollection = vscode.languages.createDiagnosticCollection('m68k-warning');
        this.statusManager = new StatusManager();
        this.calc = new Calc();
        this.disassembler = new Disassembler();
    }
    public getErrorDiagnosticCollection(): vscode.DiagnosticCollection {
        return this.errorDiagnosticCollection;
    }
    public getWarningDiagnosticCollection(): vscode.DiagnosticCollection {
        return this.warningDiagnosticCollection;
    }
    public getStatusManager(): StatusManager {
        return this.statusManager;
    }
    public getCalc(): Calc {
        return this.calc;
    }
    public getCompiler(): VASMCompiler {
        return this.compiler;
    }
    public getDisassembler(): Disassembler {
        return this.disassembler;
    }
}


const INSTANCE = new ExtensionState();