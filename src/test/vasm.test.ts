import { expect } from 'chai';
import * as vscode from 'vscode';
import * as Path from 'path';
import { capture, spy, verify, anyString, when, anything, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { VASMCompiler, VASMParser, VASMController } from '../vasm';
import { Executor, ICheckResult } from '../executor';
import { DummyTextDocument } from './dummy';
import { statusManager } from '../extension';
import { VLINKLinker } from '../vlink';

describe("VASM Tests", function () {
    before(function () {
        // Opening file to activate the extension
        const newFile = vscode.Uri.parse("untitled://./vasm.s");
        return vscode.window.showTextDocument(newFile);
    });
    context("VASMCompiler", function () {
        let compiler: VASMCompiler;
        let spiedCompiler: VASMCompiler;
        let executorCompiler: Executor;
        let executorLinker: Executor;
        let spiedLinker: VLINKLinker;
        before(function () {
            compiler = new VASMCompiler();
            // installing a spy
            executorCompiler = spy(compiler.executor);
            executorLinker = spy(compiler.linker.executor);
            when(executorCompiler.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenResolve([]);
            when(executorLinker.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenResolve([]);
            spiedLinker = spy(compiler.linker);
            when(spiedLinker.mayLink(anything())).thenReturn(true);
        });
        beforeEach(function () {
            resetCalls(executorCompiler);
            resetCalls(executorLinker);
            resetCalls(spiedLinker);
            spiedCompiler = spy(compiler);
            when(spiedCompiler.mkdirSync(anything())).thenCall(() => { return Promise.resolve(); });
            when(spiedCompiler.mayCompile(anything())).thenReturn(true);
            when(spiedCompiler.getWorkspaceRootDir()).thenReturn(vscode.Uri.parse("file:///workdir"));
        });
        it("Should call the compiler command", async function () {
            let fileUri = vscode.Uri.file("file1.s");
            await compiler.buildFile(fileUri, false);
            verify(executorCompiler.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).once();
            let args = capture(executorCompiler.runTool).last();
            let filePath = "/workdir/build/file1.o".replace(/\/+/g, Path.sep);
            expect(args[0]).to.be.eql(["-m68000", "-Fhunk", "-linedebug", "-o", filePath, Path.sep + "file1.s"]);
        });
        it("Should build the current editor file", async function () {
            return compiler.buildCurrentEditorFile().then(function () {
                verify(executorCompiler.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).once();
                let args = capture(executorCompiler.runTool).last();
                let filePath = "/workdir/build/vasm.o".replace(/\/+/g, Path.sep);
                expect(args[0]).to.be.eql(["-m68000", "-Fhunk", "-linedebug", "-o", filePath, Path.sep + "vasm.s"]);
            });
        });
        it("Should process the global errors to find the line in document", async function () {
            let document = new DummyTextDocument();
            document.addLine("First line");
            document.addLine("   include \"myfile.i\"");
            document.addLine("alabel");
            let error = new ICheckResult();
            error.line = -1;
            error.msg = "file not found <myfile.i>";
            compiler.processGlobalErrors(document, [error]);
            expect(error.line).to.be.equal(2);

        });
        it("Should build the all the workspace", async function () {
            this.timeout(3000);
            let spiedWorkspace = spy(vscode.workspace);
            let file1 = vscode.Uri.parse("file:///file1.s");
            let file2 = vscode.Uri.parse("file:///file2");
            when(spiedWorkspace.findFiles(anything(), anything(), anything())).thenReturn(new Promise((resolve, reject) => {
                resolve([file1, file2]);
            }));
            when(spiedWorkspace.openTextDocument(file1)).thenReturn(new Promise((resolve, reject) => {
                let document = new DummyTextDocument();
                document.uri = file1;
                resolve(document);
            }));
            when(spiedWorkspace.openTextDocument(file2)).thenReturn(new Promise((resolve, reject) => {
                let document = new DummyTextDocument();
                document.uri = file2;
                resolve(document);
            }));
            await compiler.buildWorkspace();
            verify(executorCompiler.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).twice();
            verify(executorLinker.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).once();
            verify(executorLinker.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).calledAfter(executorCompiler.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything()));

            let args = capture(executorCompiler.runTool).last();

            let buildPath = "/workdir/build/".replace(/\/+/g, Path.sep);
            expect(args[0]).to.be.eql(["-m68000", "-Fhunk", "-linedebug", "-o", buildPath + "file2.o", Path.sep + "file2"]);
            args = capture(executorCompiler.runTool).beforeLast();
            expect(args[0]).to.be.eql(["-m68000", "-Fhunk", "-linedebug", "-o", buildPath + "file1.o", Path.sep + "file1.s"]);

            args = capture(executorLinker.runTool).last();
            expect(args[0]).to.be.eql(["-bamigahunk", "-Bstatic", "-o", buildPath + "a.out", buildPath + "file1.o", buildPath + "file2.o"]);
        });
        it("Should return an error if the build dir does not exists", function () {
            spiedCompiler = spy(compiler);
            when(spiedCompiler.getWorkspaceRootDir()).thenReturn(vscode.Uri.parse("file:///workdir"));
            when(spiedCompiler.mkdirSync(anything())).thenCall(() => { return Promise.reject('Not possible'); });
            when(spiedCompiler.mayCompile(anything())).thenReturn(true);
            let fileUri = vscode.Uri.file("file1.s");
            return compiler.buildFile(fileUri, false).then(() => {
                expect.fail("Should reject");
            }).catch(error => {
                expect(error).to.be.equal("Not possible");
            });
        });
        it("Should return an error on build document if the compiler is not enabled", function () {
            spiedCompiler = spy(compiler);
            when(spiedCompiler.getWorkspaceRootDir()).thenReturn(vscode.Uri.parse("file:///workdir"));
            when(spiedCompiler.mkdirSync(anything())).thenCall(() => { return Promise.resolve(); });
            when(spiedCompiler.mayCompile(anything())).thenReturn(false);
            let fileUri = vscode.Uri.file("file1.s");
            return compiler.buildFile(fileUri, false).then(() => {
                expect.fail("Should reject");
            }).catch(error => {
                expect(error).to.be.equal("Please configure VASM compiler");
            });
        });
        it("Should return an error on build workspace if the compiler is not enabled", function () {
            spiedCompiler = spy(compiler);
            when(spiedCompiler.getWorkspaceRootDir()).thenReturn(vscode.Uri.parse("file:///workdir"));
            when(spiedCompiler.mkdirSync(anything())).thenCall(() => { return Promise.resolve(); });
            when(spiedCompiler.mayCompile(anything())).thenReturn(false);
            return compiler.buildWorkspace().then(() => {
                expect.fail("Should reject");
            }).catch(error => {
                expect(error).to.be.equal("Please configure VASM compiler");
            });
        });
        it("Should build even if the linker is disable", function () {
            this.timeout(3000);
            let spiedWorkspace = spy(vscode.workspace);
            let file1 = vscode.Uri.parse("file:///file1.s");
            let file2 = vscode.Uri.parse("file:///file2");
            when(spiedWorkspace.findFiles(anything(), anything(), anything())).thenReturn(new Promise((resolve, reject) => {
                resolve([file1, file2]);
            }));
            when(spiedWorkspace.openTextDocument(file1)).thenReturn(new Promise((resolve, reject) => {
                let document = new DummyTextDocument();
                document.uri = file1;
                resolve(document);
            }));
            when(spiedWorkspace.openTextDocument(file2)).thenReturn(new Promise((resolve, reject) => {
                let document = new DummyTextDocument();
                document.uri = file2;
                resolve(document);
            }));
            when(spiedLinker.mayLink(anything())).thenReturn(false);
            return compiler.buildWorkspace();
        });
        it("Should clean the workspace", async function () {
            let spiedWorkspace = spy(vscode.workspace);
            let spiedOutputChannel = spy(statusManager.outputChannel);
            when(spiedCompiler.unlink(anything())).thenCall(() => { });
            let file1 = vscode.Uri.parse("file:///build/file1.o");
            let file2 = vscode.Uri.parse("file:///build/file2.o");
            when(spiedWorkspace.findFiles(anything())).thenReturn(Promise.resolve([file1, file2]));
            return compiler.cleanWorkspace().then(() => {
                verify(spiedCompiler.unlink(anything())).twice();
                verify(spiedOutputChannel.appendLine(anyString())).thrice();
                return Promise.resolve();
            });
        });
        it("Should get an error when cleaning the workspace", async function () {
            //let spiedWorkspace = spy(vscode.workspace);
            let spiedOutputChannel = spy(statusManager.outputChannel);
            spiedCompiler = spy(compiler);
            when(spiedCompiler.getWorkspaceRootDir()).thenReturn(vscode.Uri.parse("file:///workdir"));
            when(spiedCompiler.mkdirSync(anything())).thenCall(() => { return Promise.resolve(); });
            when(spiedCompiler.mayCompile(anything())).thenReturn(false);
            when(spiedCompiler.unlink(anything())).thenCall(() => { });
            await compiler.cleanWorkspace().then(() => {
                expect.fail("Should reject");
            }).catch(error => {
                expect(error).to.be.equal("Please configure VASM compiler");
            });
            verify(spiedCompiler.unlink(anything())).never();
            verify(spiedOutputChannel.appendLine(anyString())).once();
            resetCalls(spiedOutputChannel);
        });
        it("Should get a folder error when cleaning the workspace", async function () {
            spiedCompiler = spy(compiler);
            when(spiedCompiler.mkdirSync(anything())).thenCall(() => { return Promise.resolve(); });
            when(spiedCompiler.mayCompile(anything())).thenReturn(true);
            when(spiedCompiler.getWorkspaceRootDir()).thenReturn(null);
            return compiler.cleanWorkspace().then(() => {
                expect.fail("Should reject");
            }).catch(error => {
                expect(error).to.be.equal("Root workspace not found");
            });
        });
    });
    context("VASMController", function () {
        it("Should build the current document on save", async () => {
            let compiler = new VASMCompiler();
            const spiedCompiler = spy(compiler);
            const spiedStatus = spy(statusManager);
            let controller = new VASMController(compiler);
            let document = new DummyTextDocument();

            when(spiedCompiler.buildDocument(anything())).thenCall(() => { return Promise.resolve(); });
            await controller.onSaveDocument(document);
            verify(spiedCompiler.buildDocument(anything())).once();
            verify(spiedStatus.onDefault()).once();
            verify(spiedStatus.onSuccess()).never(); // On success is only for the workspace
            // Generating a build error
            resetCalls(spiedCompiler);
            resetCalls(spiedStatus);
            when(spiedCompiler.buildDocument(anything())).thenCall(() => { return Promise.reject("nope"); });
            await controller.onSaveDocument(document);
            verify(spiedCompiler.buildDocument(anything())).once();
            verify(spiedStatus.onDefault()).once();
            verify(spiedStatus.onError("nope")).once();
        });
    });
    context("VASMParser", function () {
        let parser: VASMParser;
        before(function () { parser = new VASMParser(); });
        it("Should parse an empty string to no errors", async function () {
            let errors = parser.parse("");
            expect(errors.length).to.be.equal(0);
        });
        it("Should parse a error", async function () {
            let errors = parser.parse("error 3 : This is not good\n\nnothing\nerror 5 : This is not good too\nwarning 5 in line 2 of \"myfile\": oh no");
            expect(errors.length).to.be.equal(3);
            let i = 0;
            let error = errors[i++];
            expect(error.msg).to.be.equal("error 3 : This is not good");
            expect(error.severity).to.be.equal("error");
            error = errors[i++];
            expect(error.msg).to.be.equal("error 5 : This is not good too");
            expect(error.severity).to.be.equal("error");
            error = errors[i++];
            expect(error.msg).to.be.equal("warning 5: oh no");
            expect(error.severity).to.be.equal("warning");
            expect(error.line).to.be.equal(2);
            expect(error.file).to.be.equal("myfile");
        });
    });
});
