//
// Tests for the debug expression helper
//

import { expect } from 'chai';
import * as chai from 'chai';
import { mock, instance, when, anyNumber, reset, anyString } from 'ts-mockito';
//import { DebugProtocol } from 'vscode-debugprotocol';
import { DebugDisassembledFile, DebugDisassembledManager, DisassembleAddressArguments } from '../debugDisassembled';
import * as chaiAsPromised from 'chai-as-promised';
import { Capstone } from '../capstone';
import { GdbProxy } from '../gdbProxy';
import { StackFrame, Source } from 'vscode-debugadapter';
import { DebugVariableResolver } from '../debugVariableResolver';
import { DummyVariableResolver } from './dummyVariableResolver';
import * as vscode from 'vscode';
import { DisassembledInstructionAdapter } from '../debugExpressionHelper';
chai.use(chaiAsPromised);

describe("debug disassembled Tests", function () {
    before(async function () {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
    });
    context("DebugDisassembledFile Tests", function () {
        // tslint:disable:no-unused-expression
        it("Should parse a correct path", function () {
            let path = DebugDisassembledFile.DGBFILE_SEG_SEPARATOR + "1." + DebugDisassembledFile.DGBFILE_EXTENSION;
            let f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.equal(1);
            expect(f.getAddressExpression()).to.be.undefined;
            expect(f.getLength()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.undefined;
            expect(f.toString()).to.be.equal(path);
            expect(f.isCopper()).to.be.false;
            path = "/foo/" + path;
            f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.equal(1);
            expect(f.getAddressExpression()).to.be.undefined;
            expect(f.getLength()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.undefined;
            expect(f.toString()).to.be.equal(path);
            expect(f.isCopper()).to.be.false;
            path = "2__$a__20." + DebugDisassembledFile.DGBFILE_EXTENSION;
            f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.equal(2);
            expect(f.getAddressExpression()).to.be.equal("$a");
            expect(f.getLength()).to.be.equal(20);
            expect(f.toString()).to.be.equal(path);
            expect(f.isCopper()).to.be.false;
            path = "2__${a_b}__20." + DebugDisassembledFile.DGBFILE_EXTENSION;
            f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.equal(2);
            expect(f.getAddressExpression()).to.be.equal("${a_b}");
            expect(f.getLength()).to.be.equal(20);
            expect(f.toString()).to.be.equal(path);
            expect(f.isCopper()).to.be.false;
            path = "/foo/" + path;
            f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.equal(2);
            expect(f.getAddressExpression()).to.be.equal("${a_b}");
            expect(f.getLength()).to.be.equal(20);
            expect(f.toString()).to.be.equal(path);
            expect(f.isCopper()).to.be.false;
            // Copper path
            path = DebugDisassembledFile.DGBFILE_COPPER_SEPARATOR + "$a__20." + DebugDisassembledFile.DGBFILE_EXTENSION;
            f = DebugDisassembledFile.fromPath(path);
            expect(f.getSegmentId()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.undefined;
            expect(f.getAddressExpression()).to.be.equal("$a");
            expect(f.getLength()).to.be.equal(20);
            expect(f.toString()).to.be.equal(path);
            expect(f.isCopper()).to.be.true;
        });
        it("Should not crash on an invalid path", function () {
            let f = DebugDisassembledFile.fromPath("");
            expect(f.getSegmentId()).to.be.undefined;
            expect(f.getAddressExpression()).to.be.undefined;
            expect(f.getLength()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.undefined;
            f = DebugDisassembledFile.fromPath(DebugDisassembledFile.DGBFILE_SEG_SEPARATOR + "1");
            expect(f.getSegmentId()).to.be.equal(1);
            expect(f.getAddressExpression()).to.be.undefined;
            expect(f.getLength()).to.be.undefined;
            expect(f.getStackFrameIndex()).to.be.undefined;
        });
        it("Should detect if it is an asm debug file", function () {
            expect(DebugDisassembledFile.isDebugAsmFile("foo.dbgasm")).to.be.true;
            expect(DebugDisassembledFile.isDebugAsmFile("foo.foo")).to.be.false;
        });
    });
    context("DebugDisassembledManager Tests", function () {
        let mockedCapstone: Capstone;
        let mockedGdbProxy: GdbProxy;
        let capstone: Capstone;
        let gdbProxy: GdbProxy;
        let mockedVariableResolver: DebugVariableResolver;
        let variableResolver: DebugVariableResolver;
        before(function () {
            mockedCapstone = mock(Capstone);
            mockedGdbProxy = mock(GdbProxy);
            capstone = instance(mockedCapstone);
            gdbProxy = instance(mockedGdbProxy);
            mockedVariableResolver = mock(DummyVariableResolver);
            //when(mockedVariableResolver.getVariableValue("pc", 1)).thenResolve("f");
            variableResolver = instance(mockedVariableResolver);
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
            const manager = new DebugDisassembledManager(gdbProxy, capstone, variableResolver);
            let stack = await manager.getStackFrame(0, 10, "my label", false);
            expect(stack).to.be.eql(<StackFrame>{
                column: 1,
                id: 0,
                line: 1,
                name: "my label",
                source: new Source("0__$a__500.dbgasm", "disassembly:///0__$a__500.dbgasm")
            });
            stack = await manager.getStackFrame(0, 2, "my label", false);
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
            let manager = new DebugDisassembledManager(gdbProxy, capstone, variableResolver);
            let stack = await manager.getStackFrame(0, 2, "my label", false);
            expect(stack.column).to.be.equal(0);
            expect(stack.id).to.be.equal(0);
            expect(stack.line).to.be.equal(0);
            expect(stack.name).to.be.equal("my label");
            expect(stack.source).to.be.undefined;
            // reject get memory
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n2: 00 00     move.l a0,a1\n");
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenReject(new Error("no no"));
            stack = await manager.getStackFrame(0, 2, "my label", false);
            expect(stack.column).to.be.equal(0);
            expect(stack.id).to.be.equal(0);
            expect(stack.line).to.be.equal(0);
            expect(stack.name).to.be.equal("my label");
            expect(stack.source).to.be.undefined;
            // Reject disassemble
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenReject(new Error("no no"));
            stack = await manager.getStackFrame(0, 2, "my label", false);
            expect(stack.column).to.be.equal(0);
            expect(stack.id).to.be.equal(0);
            expect(stack.line).to.be.equal(0);
            expect(stack.name).to.be.equal("my label");
            expect(stack.source).to.be.undefined;
            // capstone not defined
            manager = new DebugDisassembledManager(gdbProxy, undefined, variableResolver);
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n4: 00 00     move.l a0,a1\n");
            stack = await manager.getStackFrame(0, 2, "my label", false);
            expect(stack.column).to.be.equal(0);
            expect(stack.id).to.be.equal(0);
            expect(stack.line).to.be.equal(0);
            expect(stack.name).to.be.equal("my label");
            expect(stack.source).to.be.undefined;
        });
        it("Should generate an error if disassemble without capstone or arguments", async function () {
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenResolve("00000");
            let manager = new DebugDisassembledManager(gdbProxy, undefined, variableResolver);
            await expect(manager.disassembleRequest(<DisassembleAddressArguments>{ segmentId: 0 })).to.be.rejected;
            manager = new DebugDisassembledManager(gdbProxy, capstone, variableResolver);
            await expect(manager.disassembleRequest(<DisassembleAddressArguments>{})).to.be.rejected;
        });
        it("Should disassemble a segmentID", async function () {
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n4: 00 00     move.l a2,a6\n");
            const manager = new DebugDisassembledManager(gdbProxy, capstone, variableResolver);
            const instructions = await manager.disassembleRequest(<DisassembleAddressArguments>{ segmentId: 0 });
            expect(instructions.length).to.be.equal(2);
            expect(instructions[0].address).to.be.equal(DisassembledInstructionAdapter.getAddressString(0));
            expect(instructions[0].instruction).to.contain('move.l a0,a1');
            expect(instructions[1].address).to.be.equal(DisassembledInstructionAdapter.getAddressString(4));
            expect(instructions[1].instruction).to.contain('move.l a2,a6');
            // Reject get memory
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenReject(new Error("no no"));
            await expect(manager.disassembleRequest(<DisassembleAddressArguments>{ segmentId: 0 })).to.be.rejected;
            // reject disassemble
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenReject(new Error("no no"));
            await expect(manager.disassembleRequest(<DisassembleAddressArguments>{ segmentId: 0 })).to.be.rejected;
        });
        it("Should disassemble a memory address", async function () {
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n4: 00 00     move.l a2,a6\n");
            const manager = new DebugDisassembledManager(gdbProxy, capstone, variableResolver);
            const instructions = await manager.disassembleRequest(new DisassembleAddressArguments("$0", 8));
            expect(instructions.length).to.be.equal(2);
            expect(instructions[0].address).to.be.equal(DisassembledInstructionAdapter.getAddressString(0));
            expect(instructions[0].instruction).to.contain('move.l a0,a1');
            expect(instructions[1].address).to.be.equal(DisassembledInstructionAdapter.getAddressString(4));
            expect(instructions[1].instruction).to.contain('move.l a2,a6');
            // Reject get memory
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenReject(new Error("no no"));
            await expect(manager.disassembleRequest(new DisassembleAddressArguments("$0", 8))).to.be.rejected;
            // reject disassemble
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenReject(new Error("no no"));
            await expect(manager.disassembleRequest(new DisassembleAddressArguments("$0", 8))).to.be.rejected;
        });
        it("Should disassemble a copper address", async function () {
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenResolve("018005023fd3fffe6401ff01");
            const manager = new DebugDisassembledManager(gdbProxy, capstone, variableResolver);
            const instructions = await manager.disassembleRequest(new DisassembleAddressArguments("$0", 8, true));
            expect(instructions.length).to.be.equal(3);
            expect(instructions[0].address).to.be.equal('0');
            expect(instructions[0].instruction).to.contain('COLOR');
            expect(instructions[1].address).to.be.equal('4');
            expect(instructions[1].instruction).to.contain('Wait');
            expect(instructions[2].address).to.be.equal('8');
            expect(instructions[2].instruction).to.contain('Skip');
            // Reject get memory
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenReject(new Error("no no"));
            await expect(manager.disassembleRequest(new DisassembleAddressArguments("$0", 8, true))).to.be.rejected;
        });
        it("Should get an address for a line in an asm debugger editor", async function () {
            const manager = new DebugDisassembledManager(gdbProxy, capstone, variableResolver);
            let f = new DebugDisassembledFile();
            f.setSegmentId(0);
            when(mockedGdbProxy.getSegmentMemory(anyNumber())).thenResolve("00000");
            when(mockedGdbProxy.getMemory(anyNumber(), anyNumber())).thenResolve("00000");
            when(mockedCapstone.disassemble(anyString())).thenResolve("0: 00 00     move.l a0,a1\n4: 00 00     move.l a2,a6\n");
            expect(manager.getAddressForFileEditorLine(f.toString(), 2)).to.be.eventually.equals(4);
            f = new DebugDisassembledFile();
            f.setStackFrameIndex(1).setAddressExpression("$4").setLength(500);
            expect(manager.getAddressForFileEditorLine(f.toString(), 1)).to.be.eventually.equals(4);
        });
    });
});