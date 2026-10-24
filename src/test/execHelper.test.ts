import { expect } from 'chai';
import * as vscode from 'vscode';
import * as cp from 'child_process';
import { reset, capture, spy, verify, anyString, instance, when, anything, mock, imock } from '@johanblumenberg/ts-mockito';
import { ExecutorHelper, ExecutorParser, ICheckResult } from '../execHelper';
import { ExtensionState } from '../extension';
import { DummyTextDocument } from './dummy';
import { Uri, workspace, TextDocument } from 'vscode';
import * as Path from 'path';
import * as fs from 'fs';
import * as os from 'os';
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
    it("Should execute a command with quoted arguments", async () => {
        const stdoutText = 'My Stdout\ntext';
        const spiedCp = spy(cp);
        const cpMock: cp.ChildProcess = imock();
        const cpMockInstance: cp.ChildProcess = instance(cpMock);
        const f = (cmd: string, args: string[], options: unknown, callback: ((error: Error, stdout: string, stderr: string | null) => void)): cp.ChildProcess => {
            callback(new Error(), stdoutText, null);
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
        const ret = await ex.runTool(['arg with spaces', 'arg2'], 'mydir', 'error', false, 'ls', {}, false, spiedParser);
        verify(mockedDummy.parse(anyString())).once();
        expect(ret[0]).to.be.equal(error);
        expect(capture(mockedDummy.parse).last()[0]).to.be.equal(stdoutText);

        // Verify that the arguments are passed as is, without a shell
        const [capturedCmd, capturedArgs, capturedOptions] = capture(spiedCp.execFile).last();
        expect(capturedCmd).to.be.equal('ls');
        expect(capturedArgs).to.deep.equal(['arg with spaces', 'arg2']);
        expect((capturedOptions as cp.ExecFileOptions).shell).to.be.false;

        reset(spiedCp);
    });
    it("Should run a command path that contains spaces without a shell (issue #377)", async () => {
        const spiedCp = spy(cp);
        const cpMock: cp.ChildProcess = imock();
        const cpMockInstance: cp.ChildProcess = instance(cpMock);
        const f = (cmd: string, args: string[], options: unknown, callback: ((error: Error | null, stdout: string, stderr: string | null) => void)): cp.ChildProcess => {
            callback(null, "", null);
            return cpMockInstance;
        };
        const cmdWithSpaces = 'C:\\Users\\John Doe\\bin\\vasmm68k_mot.exe';
        when(spiedCp.execFile(cmdWithSpaces, anything(), anything(), anything())).thenCall(f);
        const ex = new ExecutorHelper();
        await ex.runTool(['arg1'], 'mydir', 'error', false, cmdWithSpaces, {}, false, null);

        const [capturedCmd, , capturedOptions] = capture(spiedCp.execFile).last();
        expect(capturedCmd).to.be.equal(cmdWithSpaces);
        expect((capturedOptions as cp.ExecFileOptions).shell).to.be.false;
        reset(spiedCp);
    });
    it("Should run a Windows batch file through the shell with quoted arguments", async function () {
        if (process.platform !== 'win32') {
            this.skip();
        }
        const spiedCp = spy(cp);
        const cpMockInstance: cp.ChildProcess = instance(imock<cp.ChildProcess>());
        const f = (cmd: string, args: string[], options: unknown, callback: ((error: Error | null, stdout: string, stderr: string | null) => void)): cp.ChildProcess => {
            callback(null, "", null);
            return cpMockInstance;
        };
        const batch = 'C:\\Users\\John Doe\\bin\\vasm.cmd';
        when(spiedCp.execFile(anyString(), anything(), anything(), anything())).thenCall(f);
        const ex = new ExecutorHelper();
        await ex.runTool(['-o', 'C:\\A&B\\main.o', 'plain'], 'mydir', 'error', false, batch, {}, false, null);

        const [capturedCmd, capturedArgs, capturedOptions] = capture(spiedCp.execFile).last();
        expect(capturedCmd).to.be.equal(`"${batch}"`);
        expect(capturedArgs).to.deep.equal(['-o', '"C:\\A&B\\main.o"', 'plain']);
        expect((capturedOptions as cp.ExecFileOptions).shell).to.be.true;
        reset(spiedCp);
    });
    it("Should only use a shell for Windows batch files", () => {
        expect(ExecutorHelper.needsShell('C:\\bin\\vasmm68k_mot.exe', 'win32')).to.be.false;
        expect(ExecutorHelper.needsShell('C:\\bin\\vasmm68k_mot', 'win32')).to.be.false;
        expect(ExecutorHelper.needsShell('C:\\my tools\\vasm.bat', 'win32')).to.be.true;
        expect(ExecutorHelper.needsShell('C:\\my tools\\vasm.CMD', 'win32')).to.be.true;
        expect(ExecutorHelper.needsShell('/usr/bin/vasm.cmd', 'linux')).to.be.false;
    });
    it("Should quote the arguments for cmd.exe", () => {
        expect(ExecutorHelper.quoteForCmd('plain')).to.be.equal('plain');
        expect(ExecutorHelper.quoteForCmd('')).to.be.equal('""');
        expect(ExecutorHelper.quoteForCmd('C:\\Users\\A. Nom')).to.be.equal('"C:\\Users\\A. Nom"');
        expect(ExecutorHelper.quoteForCmd('C:\\A&B')).to.be.equal('"C:\\A&B"');
        expect(ExecutorHelper.quoteForCmd('"already quoted"')).to.be.equal('"already quoted"');
        expect(ExecutorHelper.quoteForCmd('say "hi" now')).to.be.equal('"say ""hi"" now"');
    });
    it("Should build with vasm and vlink in a path with spaces and special characters", async () => {
        const ext = process.platform === 'win32' ? '.exe' : '';
        const binDir = Path.join(PROJECT_ROOT, 'resources', 'bin', process.platform);
        const root = fs.mkdtempSync(Path.join(os.tmpdir(), 'amiga-'));
        // A user directory like 'C:\Users\A. Nom' with characters interpreted by cmd.exe and sh
        const dir = Path.join(root, "A. Nom & O'Brien (x) %TEMP% $HOME");
        try {
            fs.mkdirSync(Path.join(dir, 'bin'), { recursive: true });
            for (const tool of ['vasmm68k_mot', 'vlink']) {
                fs.copyFileSync(Path.join(binDir, tool + ext), Path.join(dir, 'bin', tool + ext));
                fs.chmodSync(Path.join(dir, 'bin', tool + ext), 0o755);
            }
            const source = Path.join(dir, 'main file.s');
            fs.writeFileSync(source, ' section code,code\nstart:\n moveq #0,d0\n rts\n');
            const obj = Path.join(dir, 'main file.o');
            const exe = Path.join(dir, 'my prog');
            const ex = new ExecutorHelper();
            // Command without extension, as in the default configuration ('${config:amiga-assembly.binDir}/vasmm68k_mot')
            const vasmErrors = await ex.runTool(['-m68000', '-Fhunk', '-linedebug', '-I' + dir, '-o', obj, source], dir, 'warning', true, Path.join(dir, 'bin', 'vasmm68k_mot'), undefined, false, null);
            expect(vasmErrors).to.be.empty;
            expect(fs.existsSync(obj)).to.be.true;
            const vlinkErrors = await ex.runTool(['-bamigahunk', '-Bstatic', '-o', exe, obj], dir, 'warning', true, Path.join(dir, 'bin', 'vlink'), undefined, false, null);
            expect(vlinkErrors).to.be.empty;
            expect(fs.existsSync(exe)).to.be.true;
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });
    it("Should fail when the tool cannot be run and stderr is not a diagnostic", async () => {
        const spiedCp = spy(cp);
        const cpMock: cp.ChildProcess = imock();
        const cpMockInstance: cp.ChildProcess = instance(cpMock);
        const f = (cmd: string, args: string[], options: unknown, callback: ((error: Error, stdout: string, stderr: string | null) => void)): cp.ChildProcess => {
            callback(new Error('exit 1'), "", "The system cannot find the path specified.");
            return cpMockInstance;
        };
        when(spiedCp.execFile('missing', anything(), anything(), anything())).thenCall(f);
        const ex = new ExecutorHelper();
        const mockedDummy = mock(DummyParser);
        when(mockedDummy.parse(anyString())).thenReturn([]);
        let failure: Error | undefined;
        try {
            await ex.runTool(['arg1'], 'mydir', 'error', true, 'missing', {}, false, instance(mockedDummy));
        } catch (e) {
            failure = e as Error;
        }
        expect(failure).to.not.be.undefined;
        expect(failure?.message).to.contain('The system cannot find the path specified.');
        reset(spiedCp);
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
     
    parse(text: string): ICheckResult[] {
        return [];
    }
}