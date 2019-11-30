import { expect } from 'chai';
import * as chai from 'chai';
import { mock, instance, when, anything, capture } from 'ts-mockito';
import * as chaiAsPromised from 'chai-as-promised';
import { DisassemblyContentProvider } from '../disassemblyContentProvider';
import { CancellationTokenSource, Uri } from 'vscode';
import * as vscode from 'vscode';
import { DebugDisassembledFile } from '../debugDisassembled';
import { DisassembledInstructionAdapter } from '../debugExpressionHelper';
chai.use(chaiAsPromised);

class DummyDebugSession implements vscode.DebugSession {
    workspaceFolder: vscode.WorkspaceFolder | undefined;
    configuration = <vscode.DebugConfiguration>{};
    id: string = "1";
    type: string = "debug";
    name: string = "mydebug";
    customRequest(command: string, args?: any): Thenable<any> {
        throw new Error("Method not implemented.");
    }
}
describe("debug disassembly content provider", function () {
    // tslint:disable:no-unused-expression
    it("Should provide content to disassembly file", async function () {
        let dcp = new DisassemblyContentProvider();
        let mockedDebugSession = mock(DummyDebugSession);
        let debugSession = instance(mockedDebugSession);
        let instructions = [DisassembledInstructionAdapter.createNumerical(0, "move.l a0,a1"), DisassembledInstructionAdapter.createNumerical(2, "move.l a5,a6")];
        let response = {
            instructions: instructions
        };
        when(mockedDebugSession.customRequest('disassembleInner', anything())).thenReturn(Promise.resolve(response));
        dcp.setTestContext(debugSession);

        // empty path
        let uri = Uri.file("");
        let tokenEmitter = new CancellationTokenSource();
        await expect(dcp.provideTextDocumentContent(uri, tokenEmitter.token)).to.be.rejected;

        // invalid path
        uri = Uri.file("xxxxxx");
        tokenEmitter = new CancellationTokenSource();
        await expect(dcp.provideTextDocumentContent(uri, tokenEmitter.token)).to.be.rejected;

        // Segment file
        let dAsmFileSeg = new DebugDisassembledFile();
        dAsmFileSeg.setSegmentId(0);
        uri = Uri.file(dAsmFileSeg.toString());
        tokenEmitter = new CancellationTokenSource();
        let zero = DisassembledInstructionAdapter.getAddressString(0);
        let two = DisassembledInstructionAdapter.getAddressString(2);
        await expect(dcp.provideTextDocumentContent(uri, tokenEmitter.token)).to.eventually.be.equal(`${zero}: move.l a0,a1\n${two}: move.l a5,a6\n`);
        const [, args] = capture(mockedDebugSession.customRequest).last();
        expect(args.segmentId).to.be.equal(dAsmFileSeg.getSegmentId());

        // address file
        let dAsmFileAddress = new DebugDisassembledFile();
        dAsmFileAddress.setStackFrameIndex(0).setAddressExpression("$a").setLength(500);
        uri = Uri.file(dAsmFileAddress.toString());
        tokenEmitter = new CancellationTokenSource();
        await expect(dcp.provideTextDocumentContent(uri, tokenEmitter.token)).to.eventually.be.equal(`${zero}: move.l a0,a1\n${two}: move.l a5,a6\n`);
        const [, args2] = capture(mockedDebugSession.customRequest).last();
        expect(args2.addressExpression).to.be.equal(dAsmFileAddress.getAddressExpression());
        expect(args2.stackFrameIndex).to.be.equal(dAsmFileAddress.getStackFrameIndex());
        expect(args2.instructionCount).to.be.equal(dAsmFileAddress.getLength());

        // rejection
        when(mockedDebugSession.customRequest('disassembleInner', anything())).thenReturn(Promise.reject(new Error("nope")));
        await expect(dcp.provideTextDocumentContent(Uri.file(dAsmFileSeg.toString()), tokenEmitter.token)).to.be.rejected;
        await expect(dcp.provideTextDocumentContent(Uri.file(dAsmFileAddress.toString()), tokenEmitter.token)).to.be.rejected;
    });
});