import { expect } from 'chai';
import * as vscode from 'vscode';
import * as cp from 'child_process';
import { capture, spy, verify, anyString, instance, when, anything, mock, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Executor, ExecutorParser, ICheckResult } from '../executor';
import { ExtensionState } from '../extensionState';
import { DummyTextDocument } from './dummy';

describe("Executor Tests", function () {
    let spiedOutputChannel: vscode.OutputChannel;
    before(() => {
        // Opening file to activate the extension
        const newFile = vscode.Uri.parse("untitled://./exe.s");
        return vscode.window.showTextDocument(newFile).then(() => { spiedOutputChannel = spy(ExtensionState.getInstance().getStatusManager().outputChannel); });
    });
    it("Should execute a command and parse stdout", async () => {
        resetCalls(spiedOutputChannel);
        const stdoutText = 'My Stdout\ntext';
        let spiedCp = spy(cp);
        when(spiedCp.execFile(anything(), anything(), anything(), anything())).thenCall((cmd: string, args: string[], opptions: any, callback: ((error: Error, stdout: string, stderr: string | null) => void)) => {
            callback(new Error('notgood'), stdoutText, null);
        });
        let ex = new Executor();
        let mockedDummy = mock(DummyParser);
        let error: ICheckResult = new ICheckResult();
        error.file = "file";
        error.line = 0;
        error.msg = "errorin0";
        error.severity = "error";
        when(mockedDummy.parse(anyString())).thenReturn([error]);
        let spiedParser = instance(mockedDummy);
        let ret = await ex.runTool(['arg1'], 'mydir', 'error', false, 'ls', {}, false, spiedParser);
        verify(mockedDummy.parse(anyString())).once();
        expect(ret[0]).to.be.equal(error);
        expect(capture(mockedDummy.parse).last()[0]).to.be.equal(stdoutText);
        // The error is in the outputChannel
        verify(spiedOutputChannel.appendLine(anyString())).atLeast(1);
    });
    it("Should execute a command and parse stdr", async () => {
        resetCalls(spiedOutputChannel);
        const stdoutText = 'My Stdout\ntext';
        const stderrText = 'My Strerr\ntext';
        let spiedCp = spy(cp);
        when(spiedCp.execFile(anything(), anything(), anything(), anything())).thenCall((cmd: string, args: string[], opptions: any, callback: ((error: Error, stdout: string, stderr: string) => void)) => {
            callback(new Error('notgood'), stdoutText, stderrText);
        });
        let ex = new Executor();
        let mockedDummy = mock(DummyParser);
        let error: ICheckResult = new ICheckResult();
        error.file = "file";
        error.line = 0;
        error.msg = "errorin0";
        error.severity = "error";
        when(mockedDummy.parse(anyString())).thenReturn([error]);
        let spiedParser = instance(mockedDummy);
        let ret = await ex.runTool(['arg1'], 'mydir', 'error', true, 'ls', {}, false, spiedParser);
        verify(mockedDummy.parse(anyString())).once();
        expect(ret[0]).to.be.equal(error);
        expect(capture(mockedDummy.parse).last()[0]).to.be.equal(stderrText);
        // The error is in the outputChannel
        verify(spiedOutputChannel.appendLine(anyString())).atLeast(1);
    });
    describe("Diagnostics handle", () => {
        let ex: Executor;
        let errorDiagnosticCollection = ExtensionState.getInstance().getErrorDiagnosticCollection();
        let warningDiagnosticCollection = ExtensionState.getInstance().getWarningDiagnosticCollection();
        let spiedErrorDiagnosticCollection: vscode.DiagnosticCollection;
        let spiedWarningDiagnosticCollection: vscode.DiagnosticCollection;
        let error: ICheckResult;
        let warning: ICheckResult;
        let errors: Array<ICheckResult>;
        let document: DummyTextDocument;
        beforeEach(() => {
            errorDiagnosticCollection.clear();
            warningDiagnosticCollection.clear();
            ex = new Executor();
            error = new ICheckResult();
            warning = new ICheckResult();
            errors = [error, warning];
            document = new DummyTextDocument();
            document.addLine('line1');
            document.addLine('line2');
            spiedErrorDiagnosticCollection = spy(errorDiagnosticCollection);
            spiedWarningDiagnosticCollection = spy(warningDiagnosticCollection);
            error.file = document.uri.path;
            error.line = 1;
            error.msg = "errorin0";
            error.severity = "error";
            warning.file = document.uri.path;
            warning.line = 2;
            warning.msg = "warn0";
            warning.severity = "warning";
        });
        it("Should handle the Diagnostics errors and warning", async () => {
            // this warning 2 will be dismissed by the error
            let warning2 = new ICheckResult();
            warning2.file = document.uri.path;
            warning2.line = 1;
            warning2.msg = "warn0";
            warning2.severity = "warning";
            await ex.handleDiagnosticErrors(document, [error, warning, warning2], undefined);
            verify(spiedErrorDiagnosticCollection.clear()).never();
            verify(spiedWarningDiagnosticCollection.clear()).never();
            let [fileUri, newErrors] = capture(spiedErrorDiagnosticCollection.set).last();
            if (newErrors instanceof Array) {
                expect(newErrors.length).to.be.equal(1);
                expect(newErrors[0].message).to.be.equal(error.msg);
            } else {
                expect.fail("Diagnostic errors should be an array");
            }
            if (fileUri instanceof vscode.Uri) {
                expect(fileUri.path).to.be.eql(document.uri.path);
            } else {
                expect.fail("FileUri should be defined and be a uri");
            }
            [fileUri, newErrors] = capture(spiedWarningDiagnosticCollection.set).last();
            if (newErrors instanceof Array) {
                expect(newErrors.length).to.be.equal(1);
                expect(newErrors[0].message).to.be.equal(warning.msg);
            } else {
                expect.fail("Diagnostic errors should be an array");
            }
            if (fileUri instanceof vscode.Uri) {
                expect(fileUri.path).to.be.eql(document.uri.path);
            } else {
                expect.fail("FileUri should be defined and be a uri");
            }
        });
        it("Should handle the Diagnostics of errors only", async () => {
            await ex.handleDiagnosticErrors(document, errors, vscode.DiagnosticSeverity.Error);
            verify(spiedErrorDiagnosticCollection.clear()).never();
            verify(spiedWarningDiagnosticCollection.clear()).never();
            let [fileUri, newErrors] = capture(spiedErrorDiagnosticCollection.set).last();
            if (newErrors instanceof Array) {
                expect(newErrors.length).to.be.equal(1);
                expect(newErrors[0].message).to.be.equal(error.msg);
            } else {
                expect.fail("Diagnostic errors should be an array");
            }
            if (fileUri instanceof vscode.Uri) {
                expect(fileUri.path).to.be.eql(document.uri.path);
            } else {
                expect.fail("FileUri should be defined and be a uri");
            }
            verify(spiedWarningDiagnosticCollection.set(anything(), anything())).never();
        });
        it("Should handle the Diagnostics of waring only", async () => {
            await ex.handleDiagnosticErrors(document, errors, vscode.DiagnosticSeverity.Warning);
            verify(spiedErrorDiagnosticCollection.clear()).never();
            verify(spiedWarningDiagnosticCollection.clear()).never();
            let [fileUri, newErrors] = capture(spiedWarningDiagnosticCollection.set).last();
            if (newErrors instanceof Array) {
                expect(newErrors.length).to.be.equal(1);
                expect(newErrors[0].message).to.be.equal(warning.msg);
            } else {
                expect.fail("Diagnostic warnings should be an array");
            }
            if (fileUri instanceof vscode.Uri) {
                expect(fileUri.path).to.be.eql(document.uri.path);
            } else {
                expect.fail("FileUri should be defined and be a uri");
            }
            verify(spiedErrorDiagnosticCollection.set(anything(), anything())).never();
        });
    });

});

class DummyParser implements ExecutorParser {
    parse(text: string): ICheckResult[] {
        return [];
    }
}