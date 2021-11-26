//
// Tests of the GDB Proxy
//

import { expect } from 'chai';
import * as chai from 'chai';
import { GdbProxy } from '../gdbProxy';
import { GdbRegister, GdbStackPosition, GdbStackFrame, GdbError, GdbHaltStatus, GdbAmigaSysThreadIdFsUAE, GdbThread } from '../gdbProxyCore';
import { Socket } from 'net';
import { spy, verify, instance, when, anything, mock, reset } from '@johanblumenberg/ts-mockito';
import * as chaiAsPromised from 'chai-as-promised';
import { fail } from 'assert';
import { GdbBreakpoint } from '../breakpointManager';
import { StringUtils } from '../stringUtils';

chai.use(chaiAsPromised);

function padStartWith0(stringToPad: string, targetLength: number): string {
    targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
    let padString = '0';
    if (stringToPad.length > targetLength) {
        return stringToPad;
    }
    else {
        targetLength = targetLength - stringToPad.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + stringToPad;
    }
}
function getRegistersString(): string {
    let str = "";
    for (let i = 0; i < 18; i++) {
        let v = i;
        if (i === 16) {
            v = 43690;
        }
        str += padStartWith0(v.toString(16), 8);
    }
    return str;
}

function createBreakpoint(breakpointId: number, segmentId: number | undefined, offset: number, exceptionMask?: number): GdbBreakpoint {
    return <GdbBreakpoint>{
        id: breakpointId,
        segmentId: segmentId,
        offset: offset,
        exceptionMask: exceptionMask,
        verified: false
    };
}

describe("GdbProxy Tests", function () {
    const supportRequest = GdbProxy.SUPPORT_STRING;
    const supportedReply = "multiprocess+;vContSupported+;QStartNoAckMode+;QNonStop+";
    const vRunRequest = 'vRun;' + StringUtils.convertStringToHex("dh0:myprog") + ';';
    const vContCRequest = `vCont;c:p${GdbThread.DEFAULT_PROCESS_ID}.f`;
    const vContRRequest = `vCont;r0,0:p${GdbThread.DEFAULT_PROCESS_ID}.f`;
    const vContSRequest = `vCont;s:p${GdbThread.DEFAULT_PROCESS_ID}.f`;
    const vContTRequest = `vCont;t:p${GdbThread.DEFAULT_PROCESS_ID}.f`;
    const vThreadInfoResponse = `mp0${GdbThread.DEFAULT_PROCESS_ID}.07,p0${GdbThread.DEFAULT_PROCESS_ID}.0f,l`;
    const dummyStopResponse = `T05;swbreak:;thread:p0${GdbThread.DEFAULT_PROCESS_ID}.0f;0e:00c00b00;0f:00c14e18;10:00000000;11:00c034c2;1e:00005860`;

    context('Communication', function () {
        const RESPONSE_OK = "OK";
        const RESPONSE_REGISTERS = getRegistersString();
        let socket: Socket;
        let proxy: GdbProxy;
        let spiedProxy: GdbProxy;
        let mockedSocket: Socket;
        const error = new GdbError("E1");
        let mockedOnData: (data: Buffer) => void;
        before(() => {
            GdbThread.setSupportMultiprocess(true);
        });
        beforeEach(function () {
            mockedSocket = mock(Socket);
            socket = instance(mockedSocket);
            const fConnect = function (event: string, callback: (() => Socket)): Socket {
                when(mockedSocket.writable).thenReturn(true);
                callback();
                return socket;
            };
            when(mockedSocket.once('connect', anything())).thenCall(fConnect);
            const fData = function (event: string, callback: ((data: Buffer) => void)): Socket {
                mockedOnData = callback;
                return socket;
            };
            when(mockedSocket.on('data', anything())).thenCall(fData);
            proxy = new GdbProxy(socket);
            spiedProxy = spy(proxy);
        });
        afterEach(function () {
            reset(mockedSocket);
            reset(spiedProxy);
        });
        it("Should connect to fs-UAE", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
            when(spiedProxy.sendPacketString("QStartNoAckMode", anything())).thenResolve(RESPONSE_OK);
            await proxy.connect('localhost', 6860);
            verify(mockedSocket.connect(6860, 'localhost')).once();
        });
        it("Should generate an error on support request", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenReject(error);
            when(spiedProxy.sendPacketString("QStartNoAckMode", anything())).thenResolve(RESPONSE_OK);
            await expect(proxy.connect('localhost', 6860)).to.be.rejectedWith(error);
            verify(mockedSocket.connect(6860, 'localhost')).once();
        });
        it("Should send an error on QStartNoAckMode not active", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve("multiprocess+;vContSupported+");
            await expect(proxy.connect('localhost', 6860)).to.be.rejected;
        });
        it("Should send an error on connection error to fs-UAE error", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
            when(spiedProxy.sendPacketString("QStartNoAckMode", anything())).thenReject(error);
            await expect(proxy.connect('localhost', 6860)).to.be.rejectedWith(error);
            verify(mockedSocket.connect(6860, 'localhost')).once();
            verify(spiedProxy.sendPacketString('QStartNoAckMode', anything())).once();
        });
        it("Should load a program and stop on entry", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
            when(spiedProxy.sendPacketString('QStartNoAckMode', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('Z0,0,0', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString(vRunRequest, anything())).thenResolve(dummyStopResponse);
            when(spiedProxy.sendPacketString('qOffsets', anything())).thenResolve("TextSeg=aef");
            when(spiedProxy.sendPacketString('g', anything())).thenResolve(RESPONSE_REGISTERS);
            when(spiedProxy.sendPacketString('qfThreadInfo', anything())).thenResolve(vThreadInfoResponse);
            // callback for all pending breakpoint send function
            proxy.setSendPendingBreakpointsCallback((): Promise<void> => {
                return new Promise((resolve, _) => { resolve(); });
            });
            await proxy.connect('localhost', 6860);
            await proxy.load("/home/myh\\myprog", true);
            verify(spiedProxy.sendPacketString(vRunRequest, anything())).once();
            // the stop command arrives  - should send pending breakpoints
            mockedOnData(proxy.formatString("S5;0"));
            verify(spiedProxy.sendAllPendingBreakpoints()).once();
            verify(spiedProxy.continueExecution(anything())).never();
        });
        it("Should load a program and continue if not stop on entry", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
            when(spiedProxy.sendPacketString('QStartNoAckMode', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('qfThreadInfo', anything())).thenResolve(vThreadInfoResponse);
            when(spiedProxy.sendPacketString('Z0,0,0', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString(vRunRequest, anything())).thenResolve(dummyStopResponse);
            when(spiedProxy.sendPacketString('qOffsets', anything())).thenResolve("TextSeg=aef;DataSeg=1000");
            when(spiedProxy.sendPacketString(vContCRequest, anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('g', anything())).thenResolve(RESPONSE_REGISTERS);
            // callback for all pending breakpoint send function
            proxy.setSendPendingBreakpointsCallback((): Promise<void> => {
                return new Promise((resolve, _) => { resolve(); });
            });
            await proxy.connect('localhost', 6860);
            await proxy.load("/home/myh\\myprog", false);
            verify(spiedProxy.sendPacketString(vRunRequest, anything())).once();
            // the stop command arrives  - should send pending breakpoints
            mockedOnData(proxy.formatString("S5;0"));
            verify(spiedProxy.sendAllPendingBreakpoints()).once();
            verify(spiedProxy.continueExecution(anything())).once();
        });
        it("Should generate an error with an old fs-uae protocol", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
            when(spiedProxy.sendPacketString('QStartNoAckMode', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('qfThreadInfo', anything())).thenResolve(vThreadInfoResponse);
            when(spiedProxy.sendPacketString(vRunRequest, anything())).thenResolve("AS;aef;20");
            await expect(proxy.load("/home/myh\\myprog", true)).to.be.rejectedWith(GdbProxy.BINARIES_ERROR);
            verify(spiedProxy.sendPacketString(vRunRequest, anything())).once();
        });
        it("Should generate an error with on expected return message", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
            when(spiedProxy.sendPacketString('QStartNoAckMode', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('qfThreadInfo', anything())).thenResolve(vThreadInfoResponse);
            when(spiedProxy.sendPacketString(vRunRequest, anything())).thenResolve("notExpected");
            await expect(proxy.load("/home/myh\\myprog", true)).to.be.rejectedWith(GdbProxy.UNEXPECTED_RETURN_ERROR);
            verify(spiedProxy.sendPacketString(vRunRequest, anything())).once();
        });
        it("Should generate an error with on threadInfo error", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
            when(spiedProxy.sendPacketString('QStartNoAckMode', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('qfThreadInfo', anything())).thenResolve(vThreadInfoResponse);
            when(spiedProxy.sendPacketString(vRunRequest, anything())).thenResolve(dummyStopResponse);
            when(spiedProxy.sendPacketString('qOffsets', anything())).thenReject(error);
            await expect(proxy.load("/home/myh\\myprog", true)).to.be.rejectedWith(error);
            verify(spiedProxy.sendPacketString(vRunRequest, anything())).once();
        });
        it("Should load a program and reject if there is an error during run command", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
            when(spiedProxy.sendPacketString('QStartNoAckMode', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('qfThreadInfo', anything())).thenResolve(vThreadInfoResponse);
            when(spiedProxy.sendPacketString('Z0,0,0', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString(vRunRequest, anything())).thenReject(error);
            await expect(proxy.load("/home/myh\\myprog", true)).to.be.rejectedWith(error);
            verify(spiedProxy.sendPacketString(vRunRequest, anything())).once();
        });
        it("Should reject breakpoint when not connected", async function () {
            when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
            when(spiedProxy.sendPacketString('QStartNoAckMode', anything())).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('qfThreadInfo', anything())).thenResolve(vThreadInfoResponse);
            when(spiedProxy.sendPacketString('Z0,4,0', anything())).thenResolve(RESPONSE_OK);
            const bp = createBreakpoint(0, undefined, 4);
            await expect(proxy.setBreakpoint(bp)).to.be.rejected;
            verify(spiedProxy.sendPacketString('Z0,4,0', anything())).never();
        });
        it("Should get an error when removing breakpoint without connection", async function () {
            when(spiedProxy.waitConnected()).thenResolve();
            when(spiedProxy.sendPacketString('z0,5,0', anything())).thenResolve(RESPONSE_OK);
            const bp = createBreakpoint(0, 0, 5);
            await expect(proxy.removeBreakpoint(bp)).to.be.rejected;
            verify(spiedProxy.sendPacketString('z0,5,0', anything())).never();
        });
        context('Connection established', function () {
            beforeEach(async function () {
                when(spiedProxy.sendPacketString(supportRequest, anything())).thenResolve(supportedReply);
                when(spiedProxy.sendPacketString('QStartNoAckMode', anything())).thenResolve(RESPONSE_OK);
                when(spiedProxy.sendPacketString('qfThreadInfo', anything())).thenResolve(vThreadInfoResponse);
                when(spiedProxy.sendPacketString('Z0,0,0', anything())).thenResolve(RESPONSE_OK);
                when(spiedProxy.sendPacketString(vRunRequest, anything())).thenResolve(dummyStopResponse);
                when(spiedProxy.sendPacketString('qOffsets', anything())).thenResolve("TextSeg=aef");
                when(spiedProxy.sendPacketString(vContCRequest, anything())).thenResolve(RESPONSE_OK);
                when(spiedProxy.sendPacketString('g', anything())).thenResolve(RESPONSE_REGISTERS);
                proxy.setSendPendingBreakpointsCallback((): Promise<void> => {
                    return new Promise((resolve, _) => { resolve(); });
                });
                // connect
                await proxy.connect('localhost', 6860);
                await proxy.load("/home/myh\\myprog", true);
                // the stop command arrives  - should send pending breakpoints
                mockedOnData(proxy.formatString("S05;0"));
            });
            it("Should accept a breakpoint", async function () {
                when(spiedProxy.sendPacketString('Z0,4,0', anything())).thenResolve(RESPONSE_OK);
                when(spiedProxy.sendPacketString('Z0,4', anything())).thenResolve(RESPONSE_OK);
                let bp = createBreakpoint(0, undefined, 4);
                await expect(proxy.setBreakpoint(bp)).to.not.be.rejected;
                verify(spiedProxy.sendPacketString('Z0,4', anything())).once();
                bp = createBreakpoint(0, 0, 4);
                await expect(proxy.setBreakpoint(bp)).to.not.be.rejected;
                verify(spiedProxy.sendPacketString('Z0,4,0', anything())).once();
            });
            it("Should set an exception breakpoint", async function () {
                when(spiedProxy.sendPacketString('Z1,0,0;X1,a', anything())).thenResolve(RESPONSE_OK);
                const bp = createBreakpoint(0, undefined, 0, 10);
                await expect(proxy.setBreakpoint(bp)).to.not.be.rejected;
                verify(spiedProxy.sendPacketString('Z1,0,0;X1,a', anything())).once();
            });
            it("Should reject breakpoint when has invalid values", async function () {
                let bp = createBreakpoint(0, undefined, -1);
                await expect(proxy.setBreakpoint(bp)).to.be.rejected;
                // with segments
                await proxy.load("/home/myh\\myprog", false);
                bp = createBreakpoint(0, 28, 0);
                await expect(proxy.setBreakpoint(bp)).to.be.rejected;
            });
            it("Should return an error when setting a breakpoint", async function () {
                when(spiedProxy.sendPacketString('Z0,4,0', anything())).thenReject(error);
                const bp = createBreakpoint(0, 0, 4);
                await expect(proxy.setBreakpoint(bp)).to.be.rejectedWith(error);
                verify(spiedProxy.sendPacketString('Z0,4,0', anything())).once();
            });
            it("Should return an error on invalid breakpoint", async function () {
                // segment 1 is invalid
                when(spiedProxy.sendPacketString('Z0,4,1', anything())).thenResolve(RESPONSE_OK);
                const bp = createBreakpoint(0, 1, 4);
                await expect(proxy.setBreakpoint(bp)).to.be.rejected;
                verify(spiedProxy.sendPacketString('Z0,4,1', anything())).never();
            });
            it("Should get the registers", async function () {
                const registers = await proxy.registers(null, null);
                let pos = 0;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "pc",
                    value: 17
                });
                pos += 1;
                for (let i = 0; i < 8; i++) {
                    expect(registers[pos + i]).to.be.eql(<GdbRegister>{
                        name: "d" + i,
                        value: i
                    });
                }
                for (let i = 8; i < 16; i++) {
                    expect(registers[pos + i]).to.be.eql(<GdbRegister>{
                        name: "a" + (i - 8),
                        value: i
                    });
                }
                pos += 16;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "sr",
                    value: 43690
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_T1",
                    value: 1
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_T0",
                    value: 0
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_S",
                    value: 1
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_M",
                    value: 0
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_intmask",
                    value: 2
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_X",
                    value: 0
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_N",
                    value: 1
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_Z",
                    value: 0
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_V",
                    value: 1
                });
                pos += 1;
                expect(registers[pos]).to.be.eql(<GdbRegister>{
                    name: "SR_C",
                    value: 0
                });
            });
            it("Should get the stack frames", async function () {
                when(spiedProxy.sendPacketString("QTFrame:-1", anything())).thenResolve("00000001");
                const rIdx = proxy.getRegisterIndex("pc");
                expect(rIdx).not.to.be.equal(null);
                if (rIdx !== null) {
                    const pcGetRegisterMessage = "p" + rIdx.toString(16);
                    when(spiedProxy.sendPacketString(pcGetRegisterMessage, anything())).thenResolve("0000000a");
                    when(spiedProxy.sendPacketString("QTFrame:1", anything())).thenResolve("00000001");
                    const thread = proxy.getCurrentCpuThread();
                    if (thread) {
                        const stack = await proxy.stack(thread);
                        expect(stack).to.be.eql(<GdbStackFrame>{
                            frames: [<GdbStackPosition>{
                                index: -1,
                                segmentId: -1,
                                offset: 10,
                                pc: 10,
                                stackFrameIndex: 1
                            }, <GdbStackPosition>{
                                index: 1,
                                segmentId: -1,
                                offset: 10,
                                pc: 10,
                                stackFrameIndex: 1
                            }],
                            count: 2
                        });
                    } else {
                        fail("Thread not found");
                    }
                }
            });
            it("Should get the copper stack frame", async function () {
                when(spiedProxy.sendPacketString("QTFrame:-1", anything())).thenResolve("00000001");
                const rIdx = proxy.getRegisterIndex("copper");
                expect(rIdx).not.to.be.equal(null);
                if (rIdx !== null) {
                    const pcGetRegisterMessage = "p" + rIdx.toString(16);
                    when(spiedProxy.sendPacketString(pcGetRegisterMessage, anything())).thenResolve("0000000a");
                    when(spiedProxy.sendPacketString("QTFrame:1", anything())).thenResolve("00000001");
                    const regIndex = GdbProxy.REGISTER_COPPER_ADDR_INDEX.toString(16);
                    when(spiedProxy.sendPacketString(`p${regIndex}`, anything())).thenResolve("00000001");
                    when(spiedProxy.sendPacketString('?', anything())).thenResolve(`T05;swbreak:;thread:p0${GdbThread.DEFAULT_PROCESS_ID}.0f;0e:00c00b00;0f:00c14e18;10:00000000;11:00c034c2;1e:00005860`);
                    when(spiedProxy.sendPacketString('vStopped', anything())).thenResolve(`T05;swbreak:;thread:p0${GdbThread.DEFAULT_PROCESS_ID}.07;0e:00c00b00;0f:00c14e18;10:00000000;11:00c034c2;1e:00005860`).thenResolve(RESPONSE_OK);
                    const thread = proxy.getThreadFromSysThreadId(GdbAmigaSysThreadIdFsUAE.COP);
                    if (thread) {
                        return expect(proxy.stack(thread)).to.eventually.eql(<GdbStackFrame>{
                            frames: [<GdbStackPosition>{
                                index: -1000,
                                offset: 0,
                                pc: 1,
                                segmentId: -10,
                                stackFrameIndex: 0,
                            }],
                            count: 1
                        });
                    } else {
                        fail("Thread not found");
                    }
                }
            });
            it("Should raise error on get the copper stack frame", async function () {
                when(spiedProxy.sendPacketString("QTFrame:-1", anything())).thenResolve("00000001");
                const rIdx = proxy.getRegisterIndex("copper");
                expect(rIdx).not.to.be.equal(null);
                if (rIdx !== null) {
                    const pcGetRegisterMessage = "p" + rIdx.toString(16);
                    when(spiedProxy.sendPacketString(pcGetRegisterMessage, anything())).thenResolve("0000000a");
                    when(spiedProxy.sendPacketString("QTFrame:1", anything())).thenResolve("00000001");
                    const regIndex = GdbProxy.REGISTER_COPPER_ADDR_INDEX.toString(16);
                    when(spiedProxy.sendPacketString(`p${regIndex}`, anything())).thenReject(new Error("nope"));
                    when(spiedProxy.sendPacketString('?', anything())).thenResolve(`T05;swbreak:;thread:p0${GdbThread.DEFAULT_PROCESS_ID}.0f;0e:00c00b00;0f:00c14e18;10:00000000;11:00c034c2;1e:00005860`);
                    when(spiedProxy.sendPacketString('vStopped', anything())).thenResolve(`T05;swbreak:;thread:p0${GdbThread.DEFAULT_PROCESS_ID}.07;0e:00c00b00;0f:00c14e18;10:00000000;11:00c034c2;1e:00005860`).thenResolve(RESPONSE_OK);
                    const thread = proxy.getThreadFromSysThreadId(GdbAmigaSysThreadIdFsUAE.COP);
                    if (thread) {
                        return expect(proxy.stack(thread)).to.be.rejected;
                    } else {
                        fail("Thread not found");
                    }
                }
            });
            it("Should remove an existing breakpoint", async function () {
                // Set a breakpoint
                when(spiedProxy.sendPacketString('Z0,4,0', anything())).thenResolve(RESPONSE_OK);
                const bp = createBreakpoint(0, 0, 4);
                await proxy.setBreakpoint(bp);
                // Remove
                when(spiedProxy.sendPacketString('z0,4,0', anything())).thenResolve(RESPONSE_OK);
                await proxy.removeBreakpoint(bp);
                verify(spiedProxy.sendPacketString('z0,4,0', anything())).once();
            });
            it("Should remove an existing exception breakpoint", async function () {
                // Set a breakpoint
                when(spiedProxy.sendPacketString('Z1,0,0;X1,a', anything())).thenResolve(RESPONSE_OK);
                const bp = createBreakpoint(0, undefined, 0, 10);
                await proxy.setBreakpoint(bp);
                // Remove
                when(spiedProxy.sendPacketString('z1,a', anything())).thenResolve(RESPONSE_OK);
                await proxy.removeBreakpoint(bp);
                verify(spiedProxy.sendPacketString('z1,a', anything())).once();
            });
            it("Should reject on error removing a breakpoint", async function () {
                const bp = createBreakpoint(1, undefined, -5);
                await expect(proxy.removeBreakpoint(bp)).to.be.rejected;
            });
            it("Should step instruction", async function () {
                when(spiedProxy.sendPacketString(vContRRequest, anything())).thenResolve(RESPONSE_OK);
                const thread = proxy.getCurrentCpuThread();
                if (thread) {
                    await expect(proxy.stepToRange(thread, 0, 0)).to.be.fulfilled;
                    verify(spiedProxy.sendPacketString(vContRRequest, anything())).once();
                } else {
                    fail("Thread not found");
                }
            });
            it("Should reject on step instruction error", async function () {
                const thread = proxy.getCurrentCpuThread();
                if (thread) {
                    when(spiedProxy.sendPacketString(vContRRequest, anything())).thenReject(error);
                    await expect(proxy.stepToRange(thread, 0, 0)).to.be.rejectedWith(error);
                } else {
                    fail("Thread not found");
                }
            });
            it("Should step in instruction", async function () {
                const thread = proxy.getCurrentCpuThread();
                if (thread) {
                    when(spiedProxy.sendPacketString(vContSRequest, anything())).thenResolve(RESPONSE_OK);
                    await expect(proxy.stepIn(thread)).to.be.fulfilled;
                    verify(spiedProxy.sendPacketString(vContSRequest, anything())).once();
                } else {
                    fail("Thread not found");
                }
            });
            it("Should reject on step in instruction error", async function () {
                const thread = proxy.getCurrentCpuThread();
                if (thread) {
                    when(spiedProxy.sendPacketString(vContSRequest, anything())).thenReject(error);
                    await expect(proxy.stepIn(thread)).to.be.rejectedWith(error);
                } else {
                    fail("Thread not found");
                }
            });
            it("Should get memory contents", async function () {
                when(spiedProxy.sendPacketString('ma,8', anything())).thenResolve("cccccccc");
                await expect(proxy.getMemory(10, 8)).to.eventually.equals("cccccccc");
                verify(spiedProxy.sendPacketString('ma,8', anything())).once();
            });
            it("Should send an error if get memory contents fails", async function () {
                when(spiedProxy.sendPacketString('ma,8', anything())).thenReject(error);
                await expect(proxy.getMemory(10, 8)).to.be.rejectedWith(error);
                verify(spiedProxy.sendPacketString('ma,8', anything())).once();
            });
            it("Should set memory contents", async function () {
                when(spiedProxy.sendPacketString('Ma,2:8aff', anything())).thenResolve(RESPONSE_OK);
                await expect(proxy.setMemory(10, '8aff')).to.be.fulfilled;
                verify(spiedProxy.sendPacketString('Ma,2:8aff', anything())).once();
            });
            it("Should send an error if set memory contents fails", async function () {
                when(spiedProxy.sendPacketString('Ma,2:8aff', anything())).thenReject(error);
                await expect(proxy.setMemory(10, '8aff')).to.be.rejectedWith(error);
                verify(spiedProxy.sendPacketString('Ma,2:8aff', anything())).once();
            });
            it("Should continue execution", async function () {
                when(spiedProxy.sendPacketString(vContCRequest, anything())).thenResolve(RESPONSE_OK);
                const thread = proxy.getCurrentCpuThread();
                if (thread) {
                    await expect(proxy.continueExecution(thread)).to.be.fulfilled;
                } else {
                    fail("Thread not found");
                }
                verify(spiedProxy.sendPacketString(vContCRequest, anything(), anything())).once();
            });
            it("Should reject continue execution error", async function () {
                when(spiedProxy.sendPacketString(vContCRequest, anything(), anything())).thenReject(error);
                const thread = proxy.getCurrentCpuThread();
                if (thread) {
                    await expect(proxy.continueExecution(thread)).to.be.rejectedWith(error);
                } else {
                    fail("Thread not found");
                }
            });
            it("Should set register", async function () {
                when(spiedProxy.sendPacketString('P0=8aff', anything())).thenResolve(RESPONSE_OK);
                await expect(proxy.setRegister('d0', '8aff')).to.be.fulfilled;
                verify(spiedProxy.sendPacketString('P0=8aff', anything())).once();
            });
            it("Should send an error if set memory contents fails", async function () {
                when(spiedProxy.sendPacketString('P0=8aff', anything())).thenReject(error);
                await expect(proxy.setRegister('d0', '8aff')).to.be.rejectedWith(error);
                verify(spiedProxy.sendPacketString('P0=8aff', anything())).once();
            });
            it("Should query for halt status", async function () {
                when(spiedProxy.sendPacketString('?', anything())).thenResolve(`T05;swbreak:;thread:p0${GdbThread.DEFAULT_PROCESS_ID}.0f;0e:00c00b00;0f:00c14e18;10:00000000;11:00c034c2;1e:00005860`);
                when(spiedProxy.sendPacketString('vStopped', anything())).thenResolve(`T05;swbreak:;thread:p0${GdbThread.DEFAULT_PROCESS_ID}.07;0e:00c00b00;0f:00c14e18;10:00000000;11:00c034c2;1e:00005860`).thenResolve(RESPONSE_OK);
                const haltStatus: GdbHaltStatus[] = await proxy.getHaltStatus();
                expect(haltStatus.length).to.be.equal(2);
                expect(haltStatus[0].code).to.be.equal(5);
                // tslint:disable-next-line: no-unused-expression
                expect(haltStatus[0].thread).not.to.be.undefined;
                if (haltStatus[0].thread) {
                    expect(haltStatus[0].thread.getThreadId()).to.be.equal(GdbAmigaSysThreadIdFsUAE.CPU);
                }
                expect(haltStatus[1].code).to.be.equal(5);
                // tslint:disable-next-line: no-unused-expression
                expect(haltStatus[1].thread).not.to.be.undefined;
                if (haltStatus[1].thread) {
                    expect(haltStatus[1].thread.getThreadId()).to.be.equal(GdbAmigaSysThreadIdFsUAE.COP);
                }
                verify(spiedProxy.sendPacketString('?', anything())).once();
                verify(spiedProxy.sendPacketString('vStopped', anything())).twice();
            });
            it("Should query for pause", async function () {
                when(spiedProxy.sendPacketString(vContTRequest, anything())).thenResolve(RESPONSE_OK);
                const thread = proxy.getCurrentCpuThread();
                if (thread) {
                    await expect(proxy.pause(thread)).to.be.fulfilled;
                } else {
                    fail("Thread not found");
                }
                verify(spiedProxy.sendPacketString(vContTRequest, anything())).once();
            });
        });
    });

    context('Tools', function () {
        it("Should calculate the checksum", function () {
            expect(GdbProxy.calculateChecksum("QStartNoAckMode")).to.be.equal("b0");
            expect(GdbProxy.calculateChecksum("OK")).to.be.equal("9a");
            expect(GdbProxy.calculateChecksum("Z0,0,0")).to.be.equal("42");
            expect(GdbProxy.calculateChecksum("vRun;dh0:hello;")).to.be.equal("6b");
            expect(GdbProxy.calculateChecksum("g")).to.be.equal("67");
            expect(GdbProxy.calculateChecksum("mc187e0,1a0")).to.be.equal("f3");
            expect(GdbProxy.calculateChecksum("n")).to.be.equal("6e");
            expect(GdbProxy.calculateChecksum("")).to.be.equal("00");
        });
        it("Should get the detailed value of the SR register", function () {
            let registers = GdbProxy.getSRDetailedValues(0);
            let i = 0;
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_T1", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_T0", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_S", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_M", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_intmask", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_X", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_N", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_Z", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_V", value: 0 });
            expect(registers[i]).to.been.eql(<GdbRegister>{ name: "SR_C", value: 0 });
            registers = GdbProxy.getSRDetailedValues(0b1010111110101010);
            i = 0;
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_T1", value: 1 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_T0", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_S", value: 1 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_M", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_intmask", value: 7 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_X", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_N", value: 1 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_Z", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_V", value: 1 });
            expect(registers[i]).to.been.eql(<GdbRegister>{ name: "SR_C", value: 0 });
            registers = GdbProxy.getSRDetailedValues(0b0101001110010101);
            i = 0;
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_T1", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_T0", value: 1 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_S", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_M", value: 1 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_intmask", value: 3 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_X", value: 1 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_N", value: 0 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_Z", value: 1 });
            expect(registers[i++]).to.been.eql(<GdbRegister>{ name: "SR_V", value: 0 });
            expect(registers[i]).to.been.eql(<GdbRegister>{ name: "SR_C", value: 1 });
        });
    });
    context('GdbError', function () {
        it("Should parse a GDBError", function () {
            let error = new GdbError("E0f");
            expect(error.errorType).to.be.equal("E0F");
            expect(error.message).to.be.equal("Error during the packet parse for command send memory");
            expect(error.name).to.be.equal("GdbError");
            error = new GdbError("X1");
            expect(error.errorType).to.be.equal("X1");
            expect(error.message).to.be.equal("Error code received: 'X1'");
            expect(error.name).to.be.equal("GdbError");
        });
    });
});
