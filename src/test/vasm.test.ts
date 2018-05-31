import { expect } from 'chai';
import * as vscode from 'vscode';
import * as fs from "fs";
import { capture, reset, spy, verify, anyString, when, anything, resetCalls } from 'ts-mockito';
import { VASMCompiler, VASMParser, VASMController } from '../vasm';
import { Executor, ICheckResult } from '../executor';
import { DummyTextDocument } from './dummy';
import { StatusManager } from '../status';
import { statusManager } from '../extension';

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
        let spiedStatusManager: StatusManager;
        before(function () {
            compiler = new VASMCompiler();
            // installing a spy
            executorCompiler = spy(compiler.executor);
            executorLinker = spy(compiler.linker.executor);
            when(executorCompiler.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenResolve([]);
            when(executorLinker.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenResolve([]);
            spiedCompiler = spy(compiler);
            when(spiedCompiler.getWorkspaceRootDir()).thenReturn(vscode.Uri.parse("file:///workdir"));
            spiedStatusManager = spy(statusManager);
        });
        beforeEach(function () {
            resetCalls(spiedCompiler);
            resetCalls(executorCompiler);
            resetCalls(executorLinker);
            resetCalls(spiedStatusManager);
        });
        it("Should call the compiler command", async function () {
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { });
            when(spiedfs.existsSync(anyString())).thenReturn(true);
            let fileUri = vscode.Uri.file("file1.s");
            await compiler.buildFile(fileUri, false);
            verify(executorCompiler.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).once();
            let args = capture(executorCompiler.runTool).last();
            expect(args[0]).to.be.eql(["-kick1hunks", "-devpac", "-Fhunk", "-o", "/workdir/build/file1.o", "/file1.s"]);
            reset(spiedfs);
        });
        it("Should build the current editor file", async function () {
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { });
            when(spiedfs.existsSync(anyString())).thenReturn(true);
            return compiler.buildCurrentEditorFile().then(function () {
                verify(executorCompiler.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).once();
                let args = capture(executorCompiler.runTool).last();
                expect(args[0]).to.be.eql(["-kick1hunks", "-devpac", "-Fhunk", "-o", "/workdir/build/vasm.o", "/vasm.s"]);
                reset(spiedfs);
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
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { });
            when(spiedfs.existsSync(anyString())).thenReturn(true);
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
            expect(args[0]).to.be.eql(["-kick1hunks", "-devpac", "-Fhunk", "-o", "/workdir/build/file2.o", "/file2"]);
            args = capture(executorCompiler.runTool).beforeLast();
            expect(args[0]).to.be.eql(["-kick1hunks", "-devpac", "-Fhunk", "-o", "/workdir/build/file1.o", "/file1.s"]);

            args = capture(executorLinker.runTool).last();
            expect(args[0]).to.be.eql(["-bamigahunk", "-Bstatic", "-o", "/workdir/build/a.out", "/workdir/build/file1.o", "/workdir/build/file2.o"]);
            reset(spiedfs);
        });
        it("Should return an error if the build dir does not exists", function () {
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { throw new Error("Not possible"); });
            when(spiedfs.existsSync(anyString())).thenReturn(false);
            let fileUri = vscode.Uri.file("file1.s");
            return compiler.buildFile(fileUri, false).then(() => {
                expect.fail("Should reject");
            }).catch(error => {
                reset(spiedfs);
                expect(error.message).to.be.equal("Not possible");
            });
        });
        it("Should return an error on buid document if the compiler is not enabled", function () {
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { });
            when(spiedfs.existsSync(anyString())).thenReturn(true);
            when(spiedCompiler.mayCompile(anything())).thenReturn(false);
            let fileUri = vscode.Uri.file("file1.s");
            return compiler.buildFile(fileUri, false).then(() => {
                expect.fail("Should reject");
                reset(spiedfs);
            }).catch(error => {
                reset(spiedfs);
                expect(error).to.be.equal("Please configure VASM compiler");
            });
        });
        it("Should return an error on build workspace if the compiler is not enabled", function () {
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { });
            when(spiedfs.existsSync(anyString())).thenReturn(true);
            when(spiedCompiler.mayCompile(anything())).thenReturn(false);
            return compiler.buildWorkspace().then(() => {
                expect.fail("Should reject");
                reset(spiedfs);
            }).catch(error => {
                reset(spiedfs);
                expect(error).to.be.equal("Please configure VASM compiler");
            });
        });
        it.skip("Should build even if the linker is disable", async function () {
            let spiedfs = spy(fs);
            this.timeout(3000);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { });
            when(spiedfs.existsSync(anyString())).thenReturn(true);
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
            let spiedLinker = spy(compiler.linker);
            when(spiedCompiler.mayCompile(anything())).thenReturn(true);
            when(spiedLinker.mayLink(anything())).thenReturn(false);
            await compiler.buildWorkspace();
            reset(spiedLinker);
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
