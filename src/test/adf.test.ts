//
// For ADFTools class
//
import { expect } from 'chai';
import * as chai from 'chai';
import { ADFTools } from '../adf';
import * as chaiAsPromised from 'chai-as-promised';
import * as path from 'path';
import { ExecutorHelper } from '../execHelper';
import { instance, when, anything, mock, capture, reset } from 'ts-mockito/lib/ts-mockito';
import * as fs from 'fs';
import * as temp from 'temp';
import { Uri } from 'vscode';

chai.use(chaiAsPromised);
describe("ADFTools test", function () {
    let mockedExecutor: ExecutorHelper;
    let executor: ExecutorHelper;
    beforeEach(function () {
        mockedExecutor = mock(ExecutorHelper);
        executor = instance(mockedExecutor);
    });
    afterEach(function () {
        reset(mockedExecutor);
    });
    it("Should create a bootable disk", async function () {
        let rootToolsDir = __dirname;
        let adfDiskName = "mydisk.adf";
        let adfRootDir = path.join(__dirname, "..", "..", "test_files", "debug", "fs-uae", "hd0");
        when(mockedExecutor.runToolRetrieveStdout(anything(), anything(), anything(), anything(), anything())).thenResolve("Done.\n");
        let adfTools = new ADFTools(rootToolsDir);
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
        [args, , commandFilename, ,] = capture(mockedExecutor.runToolRetrieveStdout).byCallIndex(i++);
        expect(commandFilename).to.be.equal(path.join(rootToolsDir, "adfcopy"));
        expect(args[0]).to.be.equal(adfDiskName);
        // tslint:disable-next-line:no-unused-expression
        expect(args[1].indexOf("Startup") >= 0).to.be.true;
        expect(args[2]).to.be.equal("s");
    });
    it("Should catch an error", async function () {
        let rootToolsDir = "rootDir";
        let adfDiskName = "mydisk.adf";
        let adfRootDir = path.join(__dirname, "..", "..", "test_files", "debug", "fs-uae", "hd0");
        when(mockedExecutor.runToolRetrieveStdout(anything(), anything(), anything(), anything(), anything())).thenResolve("Not good\n");
        let adfTools = new ADFTools(rootToolsDir);
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
            let rootToolsDir = "rootDir";
            adfTools = new ADFTools(rootToolsDir);
            let bootBlockFileName = path.join(__dirname, "..", "..", "test_files", "bootblock", "OS13.bb");
            let fileSizeInBytes = fs.statSync(bootBlockFileName).size;
            referenceBootBlock = Buffer.alloc(fileSizeInBytes);
            let fd = fs.openSync(bootBlockFileName, 'r');
            fs.readSync(fd, referenceBootBlock, 0, fileSizeInBytes, 0);

            let croppedBootBlockFileName = path.join(__dirname, "..", "..", "test_files", "bootblock", "OS13Crop.bb");
            fileSizeInBytes = fs.statSync(croppedBootBlockFileName).size;
            binaryBootBlockData = Buffer.alloc(fileSizeInBytes);
            fd = fs.openSync(croppedBootBlockFileName, 'r');
            fs.readSync(fd, binaryBootBlockData, 0, fileSizeInBytes, 0);
        });
        it("Should compute a bootblock checksum", async function () {
            expect(adfTools.calculateChecksum(referenceBootBlock)).to.be.equal(0xC0200F19);
        });
        it("Should create a bootblock from a binary file", async function () {
            expect(adfTools.createBootBlock(binaryBootBlockData)).to.be.eql(referenceBootBlock);
        });
        it("Should write a bootblock file from a binary file", async function () {
            let tempDir = temp.mkdirSync("build-test");
            let outputFile = path.join(tempDir, "boot.bb");
            await adfTools.writeBootBlockFile(binaryBootBlockData, Uri.file(outputFile));
            // Read the file to check
            let fileSizeInBytes = fs.statSync(outputFile).size;
            let fileContents = Buffer.alloc(fileSizeInBytes);
            let fd = fs.openSync(outputFile, 'r');
            fs.readSync(fd, fileContents, 0, fileSizeInBytes, 0);
            expect(fileContents).to.be.eql(referenceBootBlock);
        });
    });
});