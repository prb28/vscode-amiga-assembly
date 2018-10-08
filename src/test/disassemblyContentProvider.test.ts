import { expect } from 'chai';
import * as chai from 'chai';
import { mock, instance, when, anything, capture } from 'ts-mockito';
import * as chaiAsPromised from 'chai-as-promised';
import { DisassemblyContentProvider } from '../disassemblyContentProvider';
import { CancellationTokenSource, Uri } from 'vscode';
import * as vscode from 'vscode';
import { DebugProtocol } from 'vscode-debugprotocol';
import { DebugDisassembledFile } from '../debugDisassembled';
chai.use(chaiAsPromised);

class DummyDebugSession implements vscode.DebugSession {
    id: string = "1";
    type: string = "debug";
    name: string = "mydebug";
    customRequest(command: string, args?: any): Thenable<any> {
        throw new Error("Method not implemented.");
    }
}
describe("debug disassebly content provider", function () {
    // tslint:disable:no-unused-expression
    it("Should provide content to disassembly file", async function () {
        let dcp = new DisassemblyContentProvider();
        let mockedDebugSession = mock(DummyDebugSession);
        let debugSession = instance(mockedDebugSession);
        let variables = [<DebugProtocol.Variable>{
            name: "00000",
            value: "move.l a0,a1"
        }, <DebugProtocol.Variable>{
            name: "00002",
            value: "move.l a5,a6"
        }];
        let response = {
            variables: variables
        };
        when(mockedDebugSession.customRequest('disassemble', anything())).thenReturn(Promise.resolve(response));
        dcp.setTestContext(debugSession);

        // empty path
        let uri = Uri.file("");
        let tockenEmitter = new CancellationTokenSource();
        await expect(dcp.provideTextDocumentContent(uri, tockenEmitter.token)).to.be.rejected;

        // invalid path
        uri = Uri.file("xxxxxx");
        tockenEmitter = new CancellationTokenSource();
        await expect(dcp.provideTextDocumentContent(uri, tockenEmitter.token)).to.be.rejected;

        // Segment file
        let dAsmFileSeg = new DebugDisassembledFile();
        dAsmFileSeg.setSegmentId(0);
        uri = Uri.file(dAsmFileSeg.toString());
        tockenEmitter = new CancellationTokenSource();
        await expect(dcp.provideTextDocumentContent(uri, tockenEmitter.token)).to.eventually.be.equal("00000: move.l a0,a1\n00002: move.l a5,a6\n");
        const [, args] = capture(mockedDebugSession.customRequest).last();
        expect(args.segmentId).to.be.equal(dAsmFileSeg.getSegmentId());

        // address file
        let dAsmFileAddress = new DebugDisassembledFile();
        dAsmFileAddress.setStackFrameIndex(0).setAddress(10).setLength(500);
        uri = Uri.file(dAsmFileAddress.toString());
        tockenEmitter = new CancellationTokenSource();
        await expect(dcp.provideTextDocumentContent(uri, tockenEmitter.token)).to.eventually.be.equal("00000: move.l a0,a1\n00002: move.l a5,a6\n");
        const [, args2] = capture(mockedDebugSession.customRequest).last();
        expect(args2.startAddress).to.be.equal(dAsmFileAddress.getAddress());
        expect(args2.frameId).to.be.equal(dAsmFileAddress.getStackFrameIndex());
        expect(args2.length).to.be.equal(dAsmFileAddress.getLength());

        // rejection
        when(mockedDebugSession.customRequest('disassemble', anything())).thenReturn(Promise.reject(new Error("nope")));
        await expect(dcp.provideTextDocumentContent(Uri.file(dAsmFileSeg.toString()), tockenEmitter.token)).to.be.rejected;
        await expect(dcp.provideTextDocumentContent(Uri.file(dAsmFileAddress.toString()), tockenEmitter.token)).to.be.rejected;
    });
});