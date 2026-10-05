//
// For ADFTools class
//
import * as vscode from 'vscode';
import { expect } from 'chai';
import * as chai from 'chai';
import { ADFTools } from '../adf';
import * as chaiAsPromised from 'chai-as-promised';
import * as path from 'path';
import { ExecutorHelper, ICheckResult } from '../execHelper';
import { VASMCompiler } from '../vasm';
import { instance, when, anything, mock, capture, reset } from '@johanblumenberg/ts-mockito';
import * as fs from 'fs';
import * as temp from 'temp';
import { Uri } from 'vscode';

chai.use(chaiAsPromised);
describe("ADFTools test", function () {
    let mockedExecutor: ExecutorHelper;
    let executor: ExecutorHelper;
    before(async () => {
        // Automatically track and cleanup files at exit
        temp.track();
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
    });
    beforeEach(function () {
        mockedExecutor = mock(ExecutorHelper);
        executor = instance(mockedExecutor);
    });
    afterEach(function () {
        reset(mockedExecutor);
    });
    it("Should create a bootable disk", async function () {
        const rootToolsDir = __dirname;
        const adfDiskName = "mydisk.adf";
        const adfRootDir = path.join(__dirname, "..", "..", "test_files", "debug", "fs-uae", "hd0");
        when(mockedExecutor.runToolRetrieveStdout(anything(), anything(), anything(), anything(), anything())).thenResolve("Done.\n");
        const adfTools = new ADFTools(rootToolsDir);
        adfTools.setTestContext(executor);
        await adfTools.createBootableADFDiskFromDir(adfDiskName, adfRootDir, "s/*", "**/.*", ["myopt", "myopt2"]);
        let i = 0;
        let [args, , commandFilename, ,] = capture(mockedExecutor.runToolRetrieveStdout).byCallIndex(i++);
        expect(commandFilename).to.be.equal(path.join(rootToolsDir, "adfcreate"));
        expect(args.length).to.be.equal(3);
        expect(args[0]).to.be.equal("myopt");
        expect(args[1]).to.be.equal("myopt2");
        expect(args[2]).to.be.equal(adfDiskName);
        [args, , commandFilename, ,] = capture(mockedExecutor.runToolRetrieveStdout).byCallIndex(i++);
        expect(commandFilename).to.be.equal(path.join(rootToolsDir, "adfinst"));
        expect(args[0]).to.be.equal("-i");
        expect(args[1]).to.be.equal(adfDiskName);
        [args, , commandFilename, ,] = capture(mockedExecutor.runToolRetrieveStdout).byCallIndex(i++);
        expect(commandFilename).to.be.equal(path.join(rootToolsDir, "adfmakedir"));
        expect(args[0]).to.be.equal(adfDiskName);
        // tslint:disable-next-line:no-unused-expression
        expect(args[1]).to.be.equal("s");
        [args, , commandFilename, ,] = capture(mockedExecutor.runToolRetrieveStdout).byCallIndex(i);
        expect(commandFilename).to.be.equal(path.join(rootToolsDir, "adfcopy"));
        expect(args[0]).to.be.equal(adfDiskName);
         
        expect(args[1].indexOf("Startup") >= 0).to.be.true;
        expect(args[2]).to.be.equal("s");
    });
    it("Should catch an error", async function () {
        const rootToolsDir = "rootDir";
        const adfDiskName = "mydisk.adf";
        const adfRootDir = path.join(__dirname, "..", "..", "test_files", "debug", "fs-uae", "hd0");
        when(mockedExecutor.runToolRetrieveStdout(anything(), anything(), anything(), anything(), anything())).thenResolve("Not good\n");
        const adfTools = new ADFTools(rootToolsDir);
        adfTools.setTestContext(executor);
        // tslint:disable-next-line:no-unused-expression
        return expect(adfTools.createBootableADFDiskFromDir(adfDiskName, adfRootDir, "**/genc*", "**/.*", ["opts"])).to.be.rejected;
    });
    context("Boot Block", function () {
        let referenceBootBlock: Buffer;
        let binaryBootBlockData: Buffer;
        let adfTools: ADFTools;
        before(function () {
            // Automatically track and cleanup files at exit
            temp.track();
            const rootToolsDir = "rootDir";
            adfTools = new ADFTools(rootToolsDir);
            const bootBlockFileName = path.join(__dirname, "..", "..", "test_files", "bootblock", "OS13.bb");
            let fileSizeInBytes = fs.statSync(bootBlockFileName).size;
            referenceBootBlock = Buffer.alloc(fileSizeInBytes);
            let fd = fs.openSync(bootBlockFileName, 'r');
            fs.readSync(fd, referenceBootBlock, 0, fileSizeInBytes, 0);
            fs.closeSync(fd);
            const croppedBootBlockFileName = path.join(__dirname, "..", "..", "test_files", "bootblock", "OS13Crop.bb");
            fileSizeInBytes = fs.statSync(croppedBootBlockFileName).size;
            binaryBootBlockData = Buffer.alloc(fileSizeInBytes);
            fd = fs.openSync(croppedBootBlockFileName, 'r');
            fs.readSync(fd, binaryBootBlockData, 0, fileSizeInBytes, 0);
            fs.closeSync(fd);
        });
        it("Should compute a bootblock checksum", async function () {
            expect(adfTools.calculateChecksum(referenceBootBlock)).to.be.equal(0xC0200F19);
        });
        it("Should create a bootblock from a binary file", async function () {
            expect(adfTools.createBootBlock(binaryBootBlockData)).to.be.eql(referenceBootBlock);
        });
        it("Should write a bootblock file from a binary file", async function () {
            const tempDir = temp.mkdirSync("build-test");
            const outputFile = path.join(tempDir, "boot.bb");
            await adfTools.writeBootBlockFile(binaryBootBlockData, Uri.file(outputFile));
            // Read the file to check
            const fileSizeInBytes = fs.statSync(outputFile).size;
            const fileContents = Buffer.alloc(fileSizeInBytes);
            const fd = fs.openSync(outputFile, 'r');
            fs.readSync(fd, fileContents, 0, fileSizeInBytes, 0);
            fs.closeSync(fd);
            expect(fileContents).to.be.eql(referenceBootBlock);
            fs.unlinkSync(outputFile);
            fs.rmSync(tempDir, { recursive: true });
        });
        context("Custom boot block source (issue #328)", function () {
            const bootBlockSourceFile = path.join(__dirname, "..", "..", "test_files", "sources", "tutorial.s");
            const adfDiskName = "mydisk.adf";
            let tempDir: string;
            let objFile: string;
            let bbFile: string;
            beforeEach(function () {
                tempDir = temp.mkdirSync("bootblock-test");
                objFile = path.join(tempDir, "boot.o");
                bbFile = path.join(tempDir, "boot.bb");
                when(mockedExecutor.runToolRetrieveStdout(anything(), anything(), anything(), anything(), anything())).thenResolve("Done.\n");
                adfTools.setTestContext(executor);
            });
            afterEach(function () {
                fs.rmSync(tempDir, { recursive: true, force: true });
            });
            it("Should create the boot block file from the compiled binary", async function () {
                // The compiler generates the raw binary in the .o file
                fs.writeFileSync(objFile, binaryBootBlockData);
                const compiler = <VASMCompiler><unknown>{
                    buildFile: async () => [objFile, new Array<ICheckResult>()]
                };
                await adfTools.createBootableADFDiskFromDir(adfDiskName, "", "", "", ["opts"], bootBlockSourceFile, undefined, compiler);
                // The boot block file is created from the binary
                expect(fs.readFileSync(bbFile)).to.be.eql(referenceBootBlock);
                // The binary is not modified
                expect(fs.readFileSync(objFile)).to.be.eql(binaryBootBlockData);
                // The boot block is installed
                const [args, , commandFilename, ,] = capture(mockedExecutor.runToolRetrieveStdout).byCallIndex(1);
                expect(path.basename(commandFilename)).to.be.equal("adfinst");
                expect(args).to.be.eql([`--install=${bbFile}`, adfDiskName]);
            });
            it("Should report the compile errors of the boot block source", async function () {
                const error = new ICheckResult();
                error.line = 12;
                error.msg = "unknown mnemonic <foo>";
                const compiler = <VASMCompiler><unknown>{
                    buildFile: async () => [objFile, [error]]
                };
                await expect(adfTools.createBootableADFDiskFromDir(adfDiskName, "", "", "", ["opts"], bootBlockSourceFile, undefined, compiler))
                    .to.be.rejectedWith("line 12: unknown mnemonic <foo>");
                expect(fs.existsSync(bbFile)).to.be.false;
            });
        });
    });
});