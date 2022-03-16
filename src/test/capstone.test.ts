//
// For the capstone disassembler
//
import { expect } from 'chai';
import * as chai from 'chai';
import { Capstone } from '../capstone';
import * as chaiAsPromised from 'chai-as-promised';
import * as Path from 'path';
import { ExecutorHelper } from '../execHelper';
import { instance, when, anything, mock, capture, reset } from '@johanblumenberg/ts-mockito';
import { extensions, Uri } from 'vscode';
import { ConfigurationHelper } from '../configurationHelper';
import { fail } from 'assert';

chai.use(chaiAsPromised);
describe("Capstone test", function () {
    let mockedExecutor: ExecutorHelper;
    let executor: ExecutorHelper;
    before(async function () {
        // activate the extension
        const ext = extensions.getExtension('prb28.amiga-assembly');
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
    it("Should disassemble a buffer", async function () {
        const conf = ConfigurationHelper.retrieveStringPropertyInDefaultConf('cstool');
        if (conf) {
            const capstone = new Capstone(conf);
            let code = await capstone.disassemble('9091');
            code = code.replace("\r", "");
            return expect(code).to.be.equal("\n 0  90 91  sub.l\t(a1), d0\n");
        } else {
            fail("capstone not defined");
        }
    });
    it("Should disassemble a big buffer", async function () {
        const intructionsLength = 1000;
        const buffer = Buffer.alloc(intructionsLength * 4);
        buffer.fill("9091");
        const conf = ConfigurationHelper.retrieveStringPropertyInDefaultConf('cstool');
        if (conf) {
            const capstone = new Capstone(conf);
            const code = await capstone.disassemble(buffer.toString());
            const lines = code.split("\n");
            expect(lines.length).to.be.equal(intructionsLength + 2);
            expect(lines[5].replace("\r", "")).to.be.equal(" 8  90 91  sub.l\t(a1), d0");
        } else {
            fail("capstone not defined");
        }
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