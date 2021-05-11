import { expect } from 'chai';
import * as vscode from 'vscode';
import * as fs from "fs";
import * as Path from 'path';
import { capture, reset, spy, verify, anyString, when, anything } from 'ts-mockito/lib/ts-mockito';
import { VLINKParser, VLINKLinker } from '../vlink';
import { ExecutorHelper } from '../execHelper';

describe("VLINK Tests", function () {
    before(function () {
        // Opening file to activate the extension
        const newFile = vscode.Uri.parse("untitled://./vlink.s");
        return vscode.window.showTextDocument(newFile);
    });
    after(async () => {
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });
    context("VLINKLinker", function () {
        let linker: VLINKLinker;
        let executor: ExecutorHelper;
        before(function () {
            linker = new VLINKLinker();
            // installing a spy
            executor = spy(linker.executor);
            when(executor.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenResolve([]);
        });
        after(function () {
            reset(executor);
        });
        it("Should call the link command", async function () {
            let spiedLinker = spy(linker);
            let spiedFs = spy(fs);
            when(spiedFs.existsSync(anyString())).thenReturn(true);
            when(spiedLinker.mayLink(anything())).thenReturn(true);
            let filesUri = [vscode.Uri.parse("file:///file1.s"), vscode.Uri.parse("file:///file2")];
            await linker.linkFiles(VLINKLinker.DEFAULT_BUILD_CONFIGURATION, filesUri, "myprog", undefined, vscode.Uri.parse("file:///workdir"), vscode.Uri.parse("file:///workdir/build"));
            verify(executor.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything(), anything(), anything())).once();
            let args = capture(executor.runTool).last();
            let buildPath = "/workdir/build/".replace(/\/+/g, Path.sep);
            expect(args[0]).to.be.eql(["-bamigahunk", "-Bstatic", "-o", buildPath + "myprog", buildPath + "file1.o", buildPath + "file2.o"]);
            reset(spiedFs);
            reset(spiedLinker);
        });
        it('Should sort objects according to the entrypoint', async function () {
            let spiedLinker = spy(linker);
            let spiedFs = spy(fs);
            when(spiedFs.existsSync(anyString())).thenReturn(true);
            when(spiedLinker.mayLink(anything())).thenReturn(true);
            let filesUri = [
                vscode.Uri.parse('file:///file1.s'),
                vscode.Uri.parse('file:///file2.s'),
                vscode.Uri.parse('file:///file3.s'),
                vscode.Uri.parse('file:///file4.s')
            ];
            await linker.linkFiles(VLINKLinker.DEFAULT_BUILD_CONFIGURATION,
                filesUri, 'myprog', 'file2.o', vscode.Uri.parse('file:///workdir'),
                vscode.Uri.parse('file:///workdir/build'));
            let args = capture(executor.runTool).last();
            let buildPath = '/workdir/build/'.replace(/\/+/g, Path.sep);
            expect(args[0]).to.be.eql([
                '-bamigahunk', '-Bstatic', '-o', buildPath + 'myprog',
                buildPath + 'file2.o', buildPath + 'file1.o', buildPath + 'file3.o', buildPath + 'file4.o'
            ]);
            // Test the need of .o
            await linker.linkFiles(VLINKLinker.DEFAULT_BUILD_CONFIGURATION,
                filesUri, 'myprog', 'file2', vscode.Uri.parse('file:///workdir'),
                vscode.Uri.parse('file:///workdir/build'));
            args = capture(executor.runTool).last();
            buildPath = '/workdir/build/'.replace(/\/+/g, Path.sep);
            expect(args[0]).to.be.eql([
                '-bamigahunk', '-Bstatic', '-o', buildPath + 'myprog',
                buildPath + 'file2.o', buildPath + 'file1.o', buildPath + 'file3.o', buildPath + 'file4.o'
            ]);
            reset(spiedFs);
            reset(spiedLinker);
        });
    });
    context("VLINKParser", function () {
        let parser: VLINKParser;
        before(function () { parser = new VLINKParser(); });
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
            error = errors[i];
            expect(error.msg).to.be.equal("warning 5: oh no");
            expect(error.severity).to.be.equal("warning");
            expect(error.line).to.be.equal(2);
            expect(error.file).to.be.equal("myfile");
        });
    });
});
