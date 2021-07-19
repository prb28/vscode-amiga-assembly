import { expect } from 'chai';
import * as vscode from 'vscode';
import * as cp from 'child_process';
import { reset, capture, spy, verify, anyString, instance, when, anything, mock, resetCalls, imock } from '@johanblumenberg/ts-mockito';
import { ExecutorHelper, ExecutorParser, ICheckResult } from '../execHelper';
import { ExtensionState } from '../extension';
import { DummyTextDocument } from './dummy';
import { Uri, workspace, TextDocument } from 'vscode';
import * as Path from 'path';

describe("Executor Tests", function () {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..');
    const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
    const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
    let spiedOutputChannel: vscode.OutputChannel;
    before(async () => {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        const newFile = vscode.Uri.parse("untitled://./exe.s");
        return vscode.window.showTextDocument(newFile).then(() => { spiedOutputChannel = spy(ExtensionState.getCurrent().getOutputChannel()); });
    });
    after(async () => {
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });
    it("Should execute a command and parse stdout", async () => {
        resetCalls(spiedOutputChannel);
        const stdoutText = 'My Stdout\ntext';
        const spiedCp = spy(cp);
        const cpMock: cp.ChildProcess = imock();
        const cpMockInstance: cp.ChildProcess = instance(cpMock);
        const f = (cmd: string, args: string[], options: any, callback: ((error: Error, stdout: string, stderr: string | null) => void)): cp.ChildProcess => {
            callback(new Error('notgood'), stdoutText, null);
            return cpMockInstance;
        };
        when(spiedCp.execFile('ls', anything(), anything(), anything())).thenCall(f);
        const ex = new ExecutorHelper();
        const mockedDummy = mock(DummyParser);
        const error: ICheckResult = new ICheckResult();
        error.file = "file";
        error.line = 0;
        error.msg = "errorin0";
        error.severity = "error";
        when(mockedDummy.parse(anyString())).thenReturn([error]);
        const spiedParser = instance(mockedDummy);
        const ret = await ex.runTool(['arg1'], 'mydir', 'error', false, 'ls', {}, false, spiedParser);
        verify(mockedDummy.parse(anyString())).once();
        expect(ret[0]).to.be.equal(error);
        expect(capture(mockedDummy.parse).last()[0]).to.be.equal(stdoutText);
        // The error is in the outputChannel
        verify(spiedOutputChannel.appendLine(anyString())).atLeast(1);
        reset(spiedCp);
    });
    it("Should execute a command and parse stderr", async () => {
        resetCalls(spiedOutputChannel);
        const stderrText = 'My Strerr\ntext';
        const spiedCp = spy(cp);
        const cpMock: cp.ChildProcess = imock();
        const cpMockInstance: cp.ChildProcess = instance(cpMock);
        const f = (cmd: string, args: string[], options: any, callback: ((error: Error, stdout: string, stderr: string | null) => void)): cp.ChildProcess => {
            callback(new Error('notgood'), "", stderrText);
            return cpMockInstance;
        };
        when(spiedCp.execFile('ls', anything(), anything(), anything())).thenCall(f);
        const ex = new ExecutorHelper();
        const mockedDummy = mock(DummyParser);
        const error: ICheckResult = new ICheckResult();
        error.file = "file";
        error.line = 0;
        error.msg = "errorin0";
        error.severity = "error";
        when(mockedDummy.parse(anyString())).thenReturn([error]);
        const spiedParser = instance(mockedDummy);
        const ret = await ex.runTool(['arg1'], 'mydir', 'error', true, 'ls', {}, false, spiedParser);
        verify(mockedDummy.parse(anyString())).once();
        expect(ret[0]).to.be.equal(error);
        expect(capture(mockedDummy.parse).last()[0]).to.be.equal(stderrText);
        // The error is in the outputChannel
        verify(spiedOutputChannel.appendLine(anyString())).atLeast(1);
    });
    describe("Diagnostics handle", () => {
        let ex: ExecutorHelper;
        let errorDiagnosticCollection: vscode.DiagnosticCollection;
        let warningDiagnosticCollection: vscode.DiagnosticCollection;
        let spiedErrorDiagnosticCollection: vscode.DiagnosticCollection;
        let spiedWarningDiagnosticCollection: vscode.DiagnosticCollection;
        let error: ICheckResult;
        let warning: ICheckResult;
        let errors: Array<ICheckResult>;
        let document: DummyTextDocument;
        beforeEach(() => {
            errorDiagnosticCollection = ExtensionState.getCurrent().getErrorDiagnosticCollection();
            warningDiagnosticCollection = ExtensionState.getCurrent().getWarningDiagnosticCollection();
            errorDiagnosticCollection.clear();
            warningDiagnosticCollection.clear();
            ex = new ExecutorHelper();
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
            const warning2 = new ICheckResult();
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
            const [fileUri, newErrors] = capture(spiedErrorDiagnosticCollection.set).last();
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
        it("Should handle the Diagnostics of warning only", async () => {
            await ex.handleDiagnosticErrors(document, errors, vscode.DiagnosticSeverity.Warning);
            verify(spiedErrorDiagnosticCollection.clear()).never();
            verify(spiedWarningDiagnosticCollection.clear()).never();
            const [fileUri, newErrors] = capture(spiedWarningDiagnosticCollection.set).last();
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
        context("Opened document", function () {
            let sourceDocument: TextDocument;
            before(async function () {
                sourceDocument = await workspace.openTextDocument(Uri.file(MAIN_SOURCE));
            });
            it("Should handle the Diagnostics errors of included files", async () => {
                const includedFileError = new ICheckResult();
                includedFileError.file = "hw.i";
                includedFileError.parentFile = sourceDocument.uri.path;
                includedFileError.line = 1;
                includedFileError.msg = "errorin0";
                includedFileError.severity = "error";
                await ex.handleDiagnosticErrors(sourceDocument, [includedFileError], undefined);
                const [fileUri, newErrors] = capture(spiedErrorDiagnosticCollection.set).last();
                if (newErrors instanceof Array) {
                    expect(newErrors.length).to.be.equal(1);
                    expect(newErrors[0].message).to.be.equal(error.msg);
                } else {
                    expect.fail("Diagnostic errors should be an array");
                }
                if (fileUri instanceof vscode.Uri) {
                    const fileParentDir = Path.parse(sourceDocument.uri.path).dir;
                    expect(fileUri.path).to.be.eql(fileParentDir + "/include/hw.i");
                } else {
                    expect.fail("FileUri should be defined and be a uri");
                }
            });
        });
    });

});

class DummyParser implements ExecutorParser {
    parse(text: string): ICheckResult[] {
        return [];
    }
}