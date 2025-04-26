import { expect } from 'chai';
import * as vscode from 'vscode';
import * as fs from "fs";
import * as Path from 'path';
import { capture, reset, spy, verify, anyString, when, anything } from '@johanblumenberg/ts-mockito';
import { VLINKParser, VLINKLinker } from '../vlink';
import { ExecutorHelper } from '../execHelper';

describe("VLINK Tests", function () {
    before(async function () {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
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
            const spiedLinker = spy(linker);
            const spiedFs = spy(fs);
            when(spiedFs.existsSync(anyString())).thenReturn(true);
            when(spiedLinker.mayLink(anything())).thenReturn(true);
            const filesUri = [vscode.Uri.parse("file:///file1.s"), vscode.Uri.parse("file:///file2")];
            await linker.linkFiles(VLINKLinker.DEFAULT_BUILD_CONFIGURATION, filesUri, "myprog", undefined, vscode.Uri.parse("file:///workdir"), vscode.Uri.parse("file:///workdir/build"));
            verify(executor.runTool(anything(), anyString(), anyString(), anything(), anyString(), anything(), anything(), anything(), anything(), anything())).once();
            const args = capture(executor.runTool).last();
            const buildPath = "/workdir/build/".replace(/\/+/g, Path.sep);
            expect(args[0]).to.be.eql(["-bamigahunk", "-Bstatic", "-o", buildPath + "myprog", buildPath + "file1.o", buildPath + "file2.o"]);
            reset(spiedFs);
            reset(spiedLinker);
        });
        it('Should sort objects according to the entrypoint', async function () {
            const spiedLinker = spy(linker);
            const spiedFs = spy(fs);
            when(spiedFs.existsSync(anyString())).thenReturn(true);
            when(spiedLinker.mayLink(anything())).thenReturn(true);
            const filesUri = [
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
        it("Should preserve file order to link", async function () {
            const vlinkConf = { ...VLINKLinker.DEFAULT_BUILD_CONFIGURATION };
            vlinkConf.includes = "{hw2-toform.s,comment-docs.s,disassemble-exp.s}";
            const filesUri = [
                vscode.Uri.file('hw2-toform.s'),
                vscode.Uri.file('comment-docs.s'),
                vscode.Uri.file('disassemble-exp.s'),
            ];
            await linker.linkFiles(vlinkConf,
                filesUri, 'myprog', undefined, vscode.Uri.file('workdir'),
                vscode.Uri.file('workdir/build'));
            let args = capture(executor.runTool).last();
            const buildPath = '/workdir/build/'.replace(/\/+/g, Path.sep);
            expect(args[0]).to.be.eql([
                '-bamigahunk', '-Bstatic', '-o', buildPath + 'myprog',
                buildPath + 'hw2-toform.o', buildPath + 'comment-docs.o', buildPath + 'disassemble-exp.o'
            ]);
            vlinkConf.entrypoint = "comment-docs.s"
            await linker.linkFiles(vlinkConf,
                filesUri, 'myprog', vlinkConf.entrypoint, vscode.Uri.file('workdir'),
                vscode.Uri.file('workdir/build'));
            args = capture(executor.runTool).last();
            expect(args[0]).to.be.eql([
                '-bamigahunk', '-Bstatic', '-o', buildPath + 'myprog',
                buildPath + 'comment-docs.o', buildPath + 'hw2-toform.o', buildPath + 'disassemble-exp.o'
            ]);
        });
        it("Should work with an entrypoint on a relative path", async function () {
            const vlinkConf = { ...VLINKLinker.DEFAULT_BUILD_CONFIGURATION };
            const buildPath = '/workdir/build/'.replace(/\/+/g, Path.sep);
            vlinkConf.entrypoint = "sources/tutorial.s";
            const filesUri = [
                vscode.Uri.file('hw2-toform.s'),
                vscode.Uri.file(vlinkConf.entrypoint),
                vscode.Uri.file('disassemble-exp.s'),
            ];
            await linker.linkFiles(vlinkConf, filesUri, 'myprog', vlinkConf.entrypoint, vscode.Uri.file('workdir'), vscode.Uri.file('workdir/build'));
            const args = capture(executor.runTool).last();
            expect(args[0]).to.be.eql([
                '-bamigahunk', '-Bstatic', '-o', buildPath + 'myprog',
                buildPath + 'tutorial.o', buildPath + 'hw2-toform.o', buildPath + 'disassemble-exp.o'
            ]);
        });
        it("Should throw an error if the entrypoint file is not found", async function () {
            const vlinkConf = { ...VLINKLinker.DEFAULT_BUILD_CONFIGURATION };
            vlinkConf.entrypoint = "nonexistent.s";
            const filesUri = [
                vscode.Uri.file('hw2-toform.s'),
                vscode.Uri.file('comment-docs.s'),
                vscode.Uri.file('disassemble-exp.s'),
            ];
            try {
                await linker.linkFiles(vlinkConf, filesUri, 'myprog', vlinkConf.entrypoint, vscode.Uri.file('workdir'), vscode.Uri.file('workdir/build'));
                throw new Error("Expected an error to be thrown");
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.be.equal("Entry point nonexistent.s not found in the provided files");
            }
        });
    });
    context("VLINKParser", function () {
        let parser: VLINKParser;
        before(function () { parser = new VLINKParser(); });
        it("Should parse an empty string to no errors", async function () {
            const errors = parser.parse("");
            expect(errors.length).to.be.equal(0);
        });
        it("Should parse a error", async function () {
            const errors = parser.parse("error 3 : This is not good\n\nnothing\nerror 5 : This is not good too\nwarning 5 in line 2 of \"myfile\": oh no\nError 21: gencop.o (CODE+0xc): Reference to undefined symbol COPPERLIST_SIZE.");
            expect(errors.length).to.be.equal(4);
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
            error = errors[i];
            expect(error.msg).to.be.equal("Link Error 21(CODE+0xc): Reference to undefined symbol COPPERLIST_SIZE.");
            expect(error.severity).to.be.equal("error");
            expect(error.line).to.be.equal(1);
            expect(error.file).to.be.equal("gencop.s");
        });
    });
});
