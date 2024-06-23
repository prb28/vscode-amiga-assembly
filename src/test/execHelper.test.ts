import { expect } from 'chai';
import * as vscode from 'vscode';
import * as cp from 'child_process';
import { reset, capture, spy, verify, anyString, instance, when, anything, mock, imock } from '@johanblumenberg/ts-mockito';
import { ExecutorHelper, ExecutorParser, ICheckResult } from '../execHelper';
import { ExtensionState } from '../extension';
import { DummyTextDocument } from './dummy';
import { Uri, workspace, TextDocument } from 'vscode';
import * as Path from 'path';
import { ASMLine } from '../parser';

describe("Executor Tests", function () {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..');
    const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
    const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
    before(async () => {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        const state = ExtensionState.getCurrent();
        ASMLine.init(await state.getLanguage());
    });
    it("Should execute a command and parse stdout", async () => {
        const stdoutText = 'My Stdout\ntext';
        const spiedCp = spy(cp);
        const cpMock: cp.ChildProcess = imock();
        const cpMockInstance: cp.ChildProcess = instance(cpMock);
        const f = (cmd: string, args: string[], options: unknown, callback: ((error: Error, stdout: string, stderr: string | null) => void)): cp.ChildProcess => {
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
        reset(spiedCp);
    });
    it("Should execute a command and parse stderr", async () => {
        const stderrText = 'My Strerr\ntext';
        const spiedCp = spy(cp);
        const cpMock: cp.ChildProcess = imock();
        const cpMockInstance: cp.ChildProcess = instance(cpMock);
        const f = (cmd: string, args: string[], options: unknown, callback: ((error: Error, stdout: string, stderr: string | null) => void)): cp.ChildProcess => {
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
            document.addLine('   move.l #2,COPPERLIST_SIZE');
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
            await ex.handleDiagnosticErrors(document, [error, warning, warning2]);
            verify(spiedErrorDiagnosticCollection.clear()).never();
            verify(spiedWarningDiagnosticCollection.clear()).never();
            let [fileUri, newErrors] = capture<vscode.Uri, readonly vscode.Diagnostic[] | undefined>(spiedErrorDiagnosticCollection.set).last();
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
            [fileUri, newErrors] = capture<vscode.Uri, readonly vscode.Diagnostic[] | undefined>(spiedWarningDiagnosticCollection.set).last();
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
            const [fileUri, newErrors] = capture<vscode.Uri, readonly vscode.Diagnostic[] | undefined>(spiedErrorDiagnosticCollection.set).last();
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
            const [fileUri, newErrors] = capture<vscode.Uri, readonly vscode.Diagnostic[] | undefined>(spiedWarningDiagnosticCollection.set).last();
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
                await ex.handleDiagnosticErrors(sourceDocument, [includedFileError]);
                const [fileUri, newErrors] = capture<vscode.Uri, readonly vscode.Diagnostic[] | undefined>(spiedErrorDiagnosticCollection.set).last();
                if (newErrors instanceof Array) {
                    expect(newErrors.length).to.be.equal(1);
                    expect(newErrors[0].message).to.be.equal(error.msg);
                } else {
                    expect.fail("Diagnostic errors should be an array");
                }
                if (fileUri instanceof vscode.Uri) {
                    expect(fileUri.path.includes("test_files/sources/include/hw.i")).to.be.true;
                } else {
                    expect.fail("FileUri should be defined and be a uri");
                }
            });
            it("Should handle the Diagnostics of errors for symbols", async () => {
                const error = new ICheckResult();
                error.file = MAIN_SOURCE;
                error.line = 1;
                error.msg = "Link Error 21(CODE+0xc): Reference to undefined symbol GfxName.";
                error.severity = "error";
                const error2 = new ICheckResult();
                error2.file = MAIN_SOURCE;
                error2.line = 1;
                error2.msg = "Link Error 21(CODE+0xc): Reference to undefined symbol _LVOCloseLibrary.";
                error2.severity = "error";
                await ex.handleDiagnosticErrors(undefined, [error, error2], vscode.DiagnosticSeverity.Error);
                const [fileUri, newErrors] = capture<vscode.Uri, readonly vscode.Diagnostic[] | undefined>(spiedErrorDiagnosticCollection.set).last();
                if (newErrors instanceof Array) {
                    expect(newErrors.length).to.be.equal(2);
                    expect(newErrors[0].message).to.be.equal(error.msg);
                    expect(newErrors[0].range.end.character - newErrors[0].range.start.character).to.be.equal(7);
                    expect(newErrors[1].message).to.be.equal(error2.msg);
                    expect(newErrors[1].range.end.character - newErrors[1].range.start.character).to.be.equal(16);
                } else {
                    expect.fail("Diagnostic errors should be an array");
                }
                if (fileUri instanceof vscode.Uri) {
                    expect(fileUri.path.includes("tutorial.s")).to.be.true;
                } else {
                    expect.fail("FileUri should be defined and be a uri");
                }
            });
        });
    });

});

class DummyParser implements ExecutorParser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parse(text: string): ICheckResult[] {
        return [];
    }
}