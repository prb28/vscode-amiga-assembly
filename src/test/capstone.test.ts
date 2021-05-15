//
// For the capstone disassembler
//
import { expect } from 'chai';
import * as chai from 'chai';
import { Capstone } from '../capstone';
import * as chaiAsPromised from 'chai-as-promised';
import * as Path from 'path';
import { ExecutorHelper } from '../execHelper';
import { instance, when, anything, mock, capture, reset } from 'ts-mockito/lib/ts-mockito';
import { Uri } from 'vscode';

chai.use(chaiAsPromised);
describe("Capstone test", function () {
    let mockedExecutor: ExecutorHelper;
    let executor: ExecutorHelper;
    beforeEach(function () {
        mockedExecutor = mock(ExecutorHelper);
        executor = instance(mockedExecutor);
    });
    afterEach(function () {
        reset(mockedExecutor);
    });
    it("Should disassemble a buffer", function () {
        when(mockedExecutor.runToolRetrieveStdout(anything(), anything(), anything(), anything(), anything())).thenResolve(" 0  90 91  sub.l\t(a1), d0\n");
        const capstone = new Capstone('cstool');
        capstone.setTestContext(executor);
        return expect(capstone.disassemble('9091')).to.be.eventually.equal(" 0  90 91  sub.l\t(a1), d0\n");
    });
    it("Should disassemble a file", async function () {
        when(mockedExecutor.runToolRetrieveStdout(anything(), anything(), anything(), anything(), anything())).thenResolve(" 0  90 91  sub.l\t(a1), d0\n");
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'gencop');
        const capstone = new Capstone('cstool');
        capstone.setTestContext(executor);

        return capstone.disassembleFile(Uri.file(programFilename)).then((data) => {
            expect(data).to.be.equal(" 0  90 91  sub.l\t(a1), d0\n\n");
            const [args, , , ,] = capture(mockedExecutor.runToolRetrieveStdout).last();
            expect(args[0]).to.be.equal("m68k");
            expect(args[1].substring(0, 4)).to.be.equal("2c78");
        });
    });
});