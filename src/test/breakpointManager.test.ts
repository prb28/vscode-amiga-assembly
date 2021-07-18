import { expect } from 'chai';
import { BreakpointManager, GdbBreakpoint } from '../breakpointManager';
import { when, mock, anything, instance, spy, verify, resetCalls, reset } from 'ts-mockito/lib/ts-mockito';
import { GdbProxy } from '../gdbProxy';
import { DebugDisassembledManager } from '../debugDisassembled';
import { DebugInfo } from '../debugInfo';
import * as chaiAsPromised from 'chai-as-promised';
import { DebugProtocol } from 'vscode-debugprotocol';
import * as chai from 'chai';
chai.use(chaiAsPromised);

describe('Breakpoint Manager', () => {
    const err = new Error("not Good");
    const SOURCE_PATH = "/my/source.s";
    const DIS_NAME = "cop_xx_xx.dbgasm";
    const DIS_PATH = `disassemble://${DIS_NAME}`;
    let bpManager: BreakpointManager;
    let spiedBpManager: BreakpointManager;
    let mockedGdbProxy: GdbProxy;
    let mockedDebugDisassembledManager: DebugDisassembledManager;
    let mockedDebugInfo: DebugInfo;
    beforeEach(function () {
        mockedGdbProxy = mock(GdbProxy);
        mockedDebugDisassembledManager = mock(DebugDisassembledManager);
        mockedDebugInfo = mock(DebugInfo);
        bpManager = new BreakpointManager(instance(mockedGdbProxy), instance(mockedDebugDisassembledManager));
    });
    afterEach(function () {
        reset(mockedGdbProxy);
        reset(mockedDebugInfo);
        reset(mockedDebugDisassembledManager);
    });
    context('Spied bpManager', () => {
        beforeEach(function () {
            spiedBpManager = spy(bpManager);
        });
        context('Source breakpoint', () => {
            const sourceLine = 1;
            const source = <DebugProtocol.Source>{
                path: SOURCE_PATH,
            };
            const bp = <GdbBreakpoint>{
                id: 1,
                source: source,
                line: sourceLine
            };
            const segId = 1;
            const offset = 2;
            context('Source existing', () => {
                beforeEach(function () {
                    when(mockedDebugInfo.getAddressSeg(SOURCE_PATH, sourceLine)).thenResolve([segId, offset]);
                });
                context('has debug info', () => {
                    beforeEach(function () {
                        bpManager.setDebugInfo(instance(mockedDebugInfo));
                    });
                    it('should add a breakpoint', async function () {
                        when(mockedGdbProxy.setBreakpoint(anything())).thenResolve();
                        const rBp = await bpManager.setBreakpoint(bp);
                        expect(rBp.id).to.be.equal(bp.id);
                        expect(rBp.segmentId).to.be.equal(segId);
                        expect(rBp.offset).to.be.equal(offset);
                    });
                    it('should react on proxy error', async function () {
                        when(mockedGdbProxy.setBreakpoint(anything())).thenReject(err);
                        await expect(bpManager.setBreakpoint(bp)).to.be.rejectedWith(err);
                        verify(spiedBpManager.addPendingBreakpoint(anything(), anything())).once();
                    });
                    it('should remove the breakpoints', async function () {
                        when(mockedGdbProxy.setBreakpoint(anything())).thenResolve();
                        // tslint:disable-next-line: no-unused-expression
                        await expect(bpManager.setBreakpoint(bp)).to.be.fulfilled;
                        // error while removing
                        when(mockedGdbProxy.removeBreakpoint(anything())).thenReject(err);
                        await expect(bpManager.clearBreakpoints(source)).to.be.rejected;

                        resetCalls(mockedGdbProxy);
                        when(mockedGdbProxy.removeBreakpoint(anything())).thenResolve();
                        // clean on other source
                        // tslint:disable-next-line: no-unused-expression
                        await expect(bpManager.clearBreakpoints(<DebugProtocol.Source>{ path: "/other/source.s" })).to.be.fulfilled;
                        verify(mockedGdbProxy.removeBreakpoint(anything())).never();

                        // tslint:disable-next-line: no-unused-expression
                        await expect(bpManager.clearBreakpoints(source)).to.be.fulfilled;
                        verify(mockedGdbProxy.removeBreakpoint(anything())).once();
                    });

                });
                it('should reject if there is no debug info', async function () {
                    await expect(bpManager.setBreakpoint(bp)).to.be.rejected;
                    verify(spiedBpManager.addPendingBreakpoint(anything(), anything())).once();
                });
            });
            context('Segment or offset not resolved', () => {
                beforeEach(function () {
                    when(mockedDebugInfo.getAddressSeg(SOURCE_PATH, sourceLine)).thenReturn();
                });
                it('should reject if the segment or offset not resolved', async function () {
                    await expect(bpManager.setBreakpoint(bp)).to.be.rejected;
                    verify(spiedBpManager.addPendingBreakpoint(anything(), anything())).once();
                });
            });
        });
        context('Address breakpoint', () => {
            const sourceLine = 1;
            const bp = <GdbBreakpoint>{
                id: 1,
                source: <DebugProtocol.Source>{
                    name: DIS_NAME,
                    path: DIS_PATH
                },
                line: sourceLine
            };
            const address = 123;
            context('Source existing', () => {
                beforeEach(function () {
                    when(mockedDebugDisassembledManager.getAddressForFileEditorLine(DIS_NAME, sourceLine)).thenResolve(address);
                });
                it('should add a breakpoint', async function () {
                    when(mockedGdbProxy.setBreakpoint(anything())).thenResolve();
                    const rBp = await bpManager.setBreakpoint(bp);
                    expect(rBp.id).to.be.equal(bp.id);
                    // tslint:disable-next-line: no-unused-expression
                    expect(rBp.segmentId).to.be.undefined;
                    expect(rBp.offset).to.be.equal(address);
                });
                it('should react on proxy error', async function () {
                    when(mockedGdbProxy.setBreakpoint(anything())).thenReject(err);
                    await expect(bpManager.setBreakpoint(bp)).to.be.rejectedWith(err);
                    verify(spiedBpManager.addPendingBreakpoint(anything(), anything())).once();
                });
            });
            context('Address not resolved', () => {
                beforeEach(function () {
                    when(mockedDebugDisassembledManager.getAddressForFileEditorLine(DIS_NAME, sourceLine)).thenReject(err);
                });
                it('should reject if the segment or offset not resolved', async function () {
                    await expect(bpManager.setBreakpoint(bp)).to.be.rejectedWith(err);
                    verify(spiedBpManager.addPendingBreakpoint(anything(), anything())).once();
                });
            });
        });
        it('should reject if the breakpoint is incomplete', async function () {
            const bp = <GdbBreakpoint>{};
            await expect(bpManager.setBreakpoint(bp)).to.be.rejected;
            verify(spiedBpManager.addPendingBreakpoint(anything(), anything())).once();
        });
    });
    it('should send all pending breakpoints', async function () {
        const sourceLine = 1;
        const bp = <GdbBreakpoint>{
            id: 1,
            source: <DebugProtocol.Source>{
                path: SOURCE_PATH,
            },
            line: sourceLine
        };
        const segId = 1;
        const offset = 2;
        bpManager.setDebugInfo(instance(mockedDebugInfo));
        when(mockedDebugInfo.getAddressSeg(SOURCE_PATH, sourceLine)).thenResolve([segId, offset]);
        when(mockedGdbProxy.setBreakpoint(anything())).thenReject(err);
        bpManager.addPendingBreakpoint(bp);
        expect(bpManager.getPendingBreakpoints().length).to.be.equal(1);
        await expect(bpManager.sendAllPendingBreakpoint()).to.be.fulfilled;
        expect(bpManager.getPendingBreakpoints().length).to.be.equal(1);
        // case ok
        when(mockedGdbProxy.setBreakpoint(anything())).thenResolve();
        await expect(bpManager.sendAllPendingBreakpoint()).to.be.fulfilled;
        expect(bpManager.getPendingBreakpoints().length).to.be.equal(0);
    });
});