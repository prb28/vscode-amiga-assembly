//
// Tests for the debug expression helper
//

import { expect } from 'chai';
import * as chai from 'chai';
import { mock, instance, when, anyNumber, reset, anyString } from 'ts-mockito';
//import { DebugProtocol } from 'vscode-debugprotocol';
import { DebugDisassembledFile, DebugDisassembledMananger } from '../debugDisassembled';
import * as chaiAsPromised from 'chai-as-promised';
import { Capstone } from '../capstone';
import { GdbProxy } from '../gdbProxy';
import { StackFrame, Source } from 'vscode-debugadapter';
chai.use(chaiAsPromised);

describe("debug disassebled Tests", function () {
    context("DebugDisassembledFile Tests", function () {
        // tslint:disable:no-unused-expression
        it("Should parse a correct path", function () {
            let path = DebugDisassembledFile.DGBFILE_SEG_SEPARATOR + "1." + DebugDisassembledFile.DGBFILE_EXTENSION;
            let f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.equal(1);
            expect(f.getAddress()).to.be.undefined;
            expect(f.getLength()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.undefined;
            expect(f.toString()).to.be.equal(path);
            path = "/foo/" + path;
            f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.equal(1);
            expect(f.getAddress()).to.be.undefined;
            expect(f.getLength()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.undefined;
            expect(f.toString()).to.be.equal(path);
            path = "2_$a_20." + DebugDisassembledFile.DGBFILE_EXTENSION;
            f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.equal(2);
            expect(f.getAddress()).to.be.equal(10);
            expect(f.getLength()).to.be.equal(20);
            expect(f.toString()).to.be.equal(path);
            path = "/foo/" + path;
            f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.equal(2);
            expect(f.getAddress()).to.be.equal(10);
            expect(f.getLength()).to.be.equal(20);
            expect(f.toString()).to.be.equal(path);
        });
        it("Should not crash on an invalid path", function () {
            let f = DebugDisassembledFile.fromPath("");
            expect(f.getSegmentId()).to.be.undefined;
            expect(f.getAddress()).to.be.undefined;
            expect(f.getLength()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.undefined;
            f = DebugDisassembledFile.fromPath(DebugDisassembledFile.DGBFILE_SEG_SEPARATOR + "1");
            expect(f.getSegmentId()).to.be.equal(1);
            expect(f.getAddress()).to.be.undefined;
            expect(f.getLength()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.undefined;
        });
        it("Should detect if it is an asm debug file", function () {
            expect(DebugDisassembledFile.isDebugAsmFile("foo.dbgasm")).to.be.true;
            expect(DebugDisassembledFile.isDebugAsmFile("foo.foo")).to.be.false;
        });
    });
    context("DebugDisassembledMananger Tests", function () {
        let mockedCapstone: Capstone;
        let mockedGdbProxy: GdbProxy;
        let capstone: Capstone;
        let gdbProxy: GdbProxy;
        before(function () {
            mockedCapstone = mock(Capstone);
            mockedGdbProxy = mock(GdbProxy);
            capstone = instance(mockedCapstone);
            gdbProxy = instance(mockedGdbProxy);
        });
        after(function () {
            reset(mockedCapstone);
            reset(mockedGdbProxy);
        });
        // tslint:disable:no-unused-expression
        it("Should generate a stack frame", async function () {
            when(mockedGdbProxy.toRelativeOffset(anyNumber())).thenReturn([-1, 12]).thenReturn([0, 2]);
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n2: 00 00     move.l a0,a1\n");
            let manager = new DebugDisassembledMananger(gdbProxy, capstone);
            let stack = await manager.getStackFrame(0, 10, "my label");
            expect(stack).to.be.eql(<StackFrame>{
                column: 1,
                id: 0,
                line: 1,
                name: "my label",
                source: new Source("0_$a_500.dbgasm", "disassembly:///0_$a_500.dbgasm")
            });
            stack = await manager.getStackFrame(0, 2, "my label");
            expect(stack).to.be.eql(<StackFrame>{
                column: 1,
                id: 0,
                line: 2,
                name: "my label",
                source: new Source("seg_0.dbgasm", "disassembly:///seg_0.dbgasm")
            });
        });
        it("Should generate a no file stack frame on error", async function () {
            when(mockedGdbProxy.toRelativeOffset(anyNumber())).thenReturn([0, 2]);
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n4: 00 00     move.l a0,a1\n");
            let manager = new DebugDisassembledMananger(gdbProxy, capstone);
            let stack = await manager.getStackFrame(0, 2, "my label");
            expect(stack.column).to.be.equal(0);
            expect(stack.id).to.be.equal(0);
            expect(stack.line).to.be.equal(0);
            expect(stack.name).to.be.equal("my label");
            expect(stack.source).to.be.undefined;
            // reject get memory
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n2: 00 00     move.l a0,a1\n");
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenReject(new Error("no no"));
            stack = await manager.getStackFrame(0, 2, "my label");
            expect(stack.column).to.be.equal(0);
            expect(stack.id).to.be.equal(0);
            expect(stack.line).to.be.equal(0);
            expect(stack.name).to.be.equal("my label");
            expect(stack.source).to.be.undefined;
            // Reject disassemble
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenReject("no no");
            stack = await manager.getStackFrame(0, 2, "my label");
            expect(stack.column).to.be.equal(0);
            expect(stack.id).to.be.equal(0);
            expect(stack.line).to.be.equal(0);
            expect(stack.name).to.be.equal("my label");
            expect(stack.source).to.be.undefined;
            // capstone not defined
            manager = new DebugDisassembledMananger(gdbProxy, undefined);
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n4: 00 00     move.l a0,a1\n");
            stack = await manager.getStackFrame(0, 2, "my label");
            expect(stack.column).to.be.equal(0);
            expect(stack.id).to.be.equal(0);
            expect(stack.line).to.be.equal(0);
            expect(stack.name).to.be.equal("my label");
            expect(stack.source).to.be.undefined;
        });
        it("Should generate an error if disassemble without capstone or arguments", async function () {
            let manager = new DebugDisassembledMananger(gdbProxy, undefined);
            expect(manager.disassembleRequest({ segmentId: 0 })).to.be.rejected;
            manager = new DebugDisassembledMananger(gdbProxy, capstone);
            expect(manager.disassembleRequest({})).to.be.rejected;
            expect(manager.disassembleRequest({ address: 0, length: 8 })).to.be.rejected;
        });
        it("Should disassemble a segmentID", async function () {
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n4: 00 00     move.l a2,a6\n");
            let manager = new DebugDisassembledMananger(gdbProxy, capstone);
            let variables = await manager.disassembleRequest({ segmentId: 0 });
            expect(variables.length).to.be.equal(2);
            expect(variables[0].name).to.be.equal('0');
            expect(variables[0].value).to.contain('move.l a0,a1');
            expect(variables[1].name).to.be.equal('4');
            expect(variables[1].value).to.contain('move.l a2,a6');
            // Reject get memory
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenReject(new Error("no no"));
            expect(manager.disassembleRequest({ segmentId: 0 })).to.be.rejected;
            // reject disassemble
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenReject("no no");
            expect(manager.disassembleRequest({ segmentId: 0 })).to.be.rejected;
        });
        it("Should disassemble a memory address", async function () {
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n4: 00 00     move.l a2,a6\n");
            let manager = new DebugDisassembledMananger(gdbProxy, capstone);
            let variables = await manager.disassembleRequest({ startAddress: 0, length: 8 });
            expect(variables.length).to.be.equal(2);
            expect(variables[0].name).to.be.equal('0');
            expect(variables[0].value).to.contain('move.l a0,a1');
            expect(variables[1].name).to.be.equal('4');
            expect(variables[1].value).to.contain('move.l a2,a6');
            // Reject get memory
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenReject(new Error("no no"));
            expect(manager.disassembleRequest({ startAddress: 0, length: 8 })).to.be.rejected;
            // reject disassemble
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenReject("no no");
            expect(manager.disassembleRequest({ startAddress: 0, length: 8 })).to.be.rejected;
        });
        it("Should get an address for a line in an asmdebug editor", async function () {
            let manager = new DebugDisassembledMananger(gdbProxy, capstone);
            let f = new DebugDisassembledFile();
            f.setSegmentId(0);
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n4: 00 00     move.l a2,a6\n");
            expect(manager.getAddressForFileEditorLine(f.toString(), 2)).to.be.eventually.equals(4);
            f = new DebugDisassembledFile();
            f.setStackFrameIndex(1).setAddress(4).setLength(500);
            expect(manager.getAddressForFileEditorLine(f.toString(), 1)).to.be.eventually.equals(4);
        });
    });
});