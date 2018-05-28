import { expect } from 'chai';
import * as vscode from 'vscode';
import * as fs from "fs";
import { capture, reset, spy, verify, anyString, when, anything, resetCalls } from 'ts-mockito';
import { VASMCompiler, VASMParser } from '../vasm';
import { Executor } from '../executor';

describe("VASM Tests", function () {
    before(function () {
        // Opening file to activate the extension
        const newFile = vscode.Uri.parse("untitled://./vasm.s");
        return vscode.window.showTextDocument(newFile);
    });
    context("VASMCompiler", function () {
        let compiler: VASMCompiler;
        let spiedCompiler: VASMCompiler;
        let executor: Executor;
        before(function () {
            compiler = new VASMCompiler();
            // installing a spy
            executor = spy(compiler.executor);
            when(executor.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenResolve([]);
            spiedCompiler = spy(compiler);
            when(spiedCompiler.getWorkspaceRootDir()).thenReturn(vscode.Uri.parse("file:///workdir"));
        });
        beforeEach(function () {
            resetCalls(spiedCompiler);
            resetCalls(executor);
        });
        it("Should call the compiler command", async function () {
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { });
            when(spiedfs.existsSync(anyString())).thenReturn(true);
            await compiler.buildFile("file1.s", false);
            verify(executor.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).once();
            let args = capture(executor.runTool).last();
            expect(args[0]).to.be.eql(["-kick1hunks", "-devpac", "-Fhunk", "-o", "/workdir/build/file1.o", "file1.s"]);
            reset(spiedfs);
        });
        it("Should build the current editor file", async function () {
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { });
            when(spiedfs.existsSync(anyString())).thenReturn(true);
            return compiler.buildCurrentEditorFile().then(function () {
                verify(executor.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).once();
                let args = capture(executor.runTool).last();
                expect(args[0]).to.be.eql(["-kick1hunks", "-devpac", "-Fhunk", "-o", "/workdir/build/vasm.o", "/vasm.s"]);
                reset(spiedfs);
            });
        });
        it.skip("Should build the all the workspace", async function () {
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { });
            when(spiedfs.existsSync(anyString())).thenReturn(true);
            let spiedWorkspace = spy(vscode.workspace);
            when(spiedWorkspace.findFiles(anything(), anything(), anything())).thenReturn(new Promise((resolve, reject) => {
                resolve([vscode.Uri.parse("file:///file1.s"), vscode.Uri.parse("file:///file2.s")]);
            }));
            return compiler.buildWorkspace().then(function () {
                verify(executor.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything())).once();
                let args = capture(executor.runTool).last();
                expect(args[0]).to.be.eql(["-kick1hunks", "-devpac", "-Fhunk", "-o", "/workdir/build/vasm.o", "/vasm.s"]);
                reset(spiedfs);
            });
        });
        it("Should return an error if the build dir does not exists", function () {
            let spiedfs = spy(fs);
            when(spiedfs.mkdirSync(anyString())).thenCall(function () { throw new Error("Not possible"); });
            when(spiedfs.existsSync(anyString())).thenReturn(false);
            return compiler.buildFile("file1.s", false).then(() => {
                expect.fail("Should reject");
            }).catch(error => {
                reset(spiedfs);
                expect(error.message).to.be.equal("Not possible");
            });
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
