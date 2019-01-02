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
        await adfTools.createBootableADFDiskFromDir(adfDiskName, adfRootDir, "s/*", "**/.*");
        let i = 0;
        let [args, , commandFilename, ,] = capture(mockedExecutor.runToolRetrieveStdout).byCallIndex(i++);
        expect(commandFilename).to.be.equal(path.join(rootToolsDir, "adfcreate"));
        expect(args[0]).to.be.equal(adfDiskName);
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
        expect(adfTools.createBootableADFDiskFromDir(adfDiskName, adfRootDir, "**/genc*", "**/.*")).to.be.rejected;
    });
});