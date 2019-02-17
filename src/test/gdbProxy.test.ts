//
// Tests of the GDB Proxy
//

import { expect } from 'chai';
import * as chai from 'chai';
import { GdbProxy } from '../gdbProxy';
import { GdbBreakpoint, GdbRegister, GdbStackPosition, GdbStackFrame, GdbPacket, GdbPacketType, GdbError } from '../gdbProxyCore';
import { Socket } from 'net';
import { spy, verify, anyString, instance, when, anything, mock, reset } from 'ts-mockito/lib/ts-mockito';
import * as chaiAsPromised from 'chai-as-promised';
import { fail } from 'assert';

chai.use(chaiAsPromised);

function formatBuffer(text: string): Buffer {
    var data = Buffer.alloc(text.length + 5);
    let offset = 0;
    data.write('$', offset++);
    data.write(text, offset);
    offset += text.length;
    data.write('#', offset++);
    data.write(GdbProxy.calculateChecksum(text), offset);
    return data;
}
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
        str += padStartWith0(i.toString(16), 8);
    }
    return str;
}

describe("GdbProxy Tests", function () {
    context('Communication', function () {
        const RESPONSE_OK = "OK";
        const RESPONSE_ERROR = "E1";
        const RESPONSE_REGISTERS = getRegistersString();
        let socket: Socket;
        let proxy: GdbProxy;
        let spiedProxy: GdbProxy;
        let mockedSocket: Socket;
        let error = new GdbError(RESPONSE_ERROR);
        let mockedOnData: (data: Buffer) => void;

        beforeEach(function () {
            mockedSocket = mock(Socket);
            when(mockedSocket.once('connect', anything())).thenCall(async (event: string, callback: (() => void)) => {
                socket.writable = true;
                await callback();
            });
            when(mockedSocket.on('data', anything())).thenCall(async (event: string, callback: ((data: Buffer) => void)) => {
                mockedOnData = callback;
            });
            socket = instance(mockedSocket);
            proxy = new GdbProxy(socket);
            spiedProxy = spy(proxy);
        });
        afterEach(function () {
            reset(mockedSocket);
        });
        it("Should connect to fs-UAE", async function () {
            when(spiedProxy.sendPacketString(anyString())).thenResolve(RESPONSE_OK);
            await proxy.connect('localhost', 6860);
            verify(mockedSocket.connect(6860, 'localhost')).once();
            verify(spiedProxy.sendPacketString('QStartNoAckMode')).once();
        });
        it("Should send an error on connection error to fs-UAE error", async function () {
            when(spiedProxy.sendPacketString(anyString())).thenReject(error);
            await expect(proxy.connect('localhost', 6860)).to.be.rejectedWith(error);
            verify(mockedSocket.connect(6860, 'localhost')).once();
            verify(spiedProxy.sendPacketString('QStartNoAckMode')).once();
        });
        it("Should load a program and stop on entry", async function () {
            when(spiedProxy.sendPacketString('Z0,0,0')).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('vRun;dh0:myprog;')).thenResolve("AS;aef;20");
            when(spiedProxy.sendPacketString('g')).thenResolve(RESPONSE_REGISTERS);
            // connect
            when(spiedProxy.sendPacketString('QStartNoAckMode')).thenResolve(RESPONSE_OK);
            await proxy.connect('localhost', 6860);
            await proxy.load("/home/myh\\myprog", true);
            verify(spiedProxy.sendPacketString('Z0,0,0')).once();
            verify(spiedProxy.sendPacketString('vRun;dh0:myprog;')).once();
            // the stop command arrives  - should send pending breakpoints
            await mockedOnData(formatBuffer("S5;0"));
            verify(spiedProxy.sendAllPendingBreakpoints()).once();
            verify(spiedProxy.continueExecution(anything())).never();
        });
        it("Should load a program and continue if not stop on entry", async function () {
            when(spiedProxy.sendPacketString('c')).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('Z0,0,0')).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('vRun;dh0:myprog;')).thenResolve("AS;aef;20");
            when(spiedProxy.sendPacketString('g')).thenResolve(RESPONSE_REGISTERS);
            // connect
            when(spiedProxy.sendPacketString('QStartNoAckMode')).thenResolve(RESPONSE_OK);
            await proxy.connect('localhost', 6860);
            await proxy.load("/home/myh\\myprog", false);
            verify(spiedProxy.sendPacketString('Z0,0,0')).once();
            verify(spiedProxy.sendPacketString('vRun;dh0:myprog;')).once();
            // the stop command arrives  - should send pending breakpoints
            await mockedOnData(formatBuffer("S5;0"));
            verify(spiedProxy.sendAllPendingBreakpoints()).once();
            verify(spiedProxy.continueExecution(anything())).once();
        });
        it("Should load a program and reject if there is an error in breakpoint installation", async function () {
            when(spiedProxy.sendPacketString('Z0,0,0')).thenReject(error);
            await expect(proxy.load("/home/myh\\myprog", true)).to.be.rejectedWith(error);
            verify(spiedProxy.sendPacketString('Z0,0,0')).once();
            verify(spiedProxy.sendPacketString('vRun;dh0:myprog;')).never();
        });
        it("Should load a program and reject if there is an error during run command", async function () {
            when(spiedProxy.sendPacketString('Z0,0,0')).thenResolve(RESPONSE_OK);
            when(spiedProxy.sendPacketString('vRun;dh0:myprog;')).thenReject(error);
            await expect(proxy.load("/home/myh\\myprog", true)).to.be.rejectedWith(error);
            verify(spiedProxy.sendPacketString('Z0,0,0')).once();
            verify(spiedProxy.sendPacketString('vRun;dh0:myprog;')).once();
        });
        it("Should set a pending breakpoint segments are not retrieved", async function () {
            when(spiedProxy.sendPacketString('Z0,4,0')).thenResolve(RESPONSE_OK);
            await expect(proxy.setBreakPoint(0, 4)).to.eventually.eql(<GdbBreakpoint>{
                id: 0,
                segmentId: 0,
                offset: 4,
                verified: false,
                exceptionMask: undefined
            });
            verify(spiedProxy.sendPacketString('Z0,4,0')).never();
            // connect
            when(spiedProxy.sendPacketString('QStartNoAckMode')).thenResolve(RESPONSE_OK);
            await proxy.connect('localhost', 6860);
            // the run to the first stop 
            when(spiedProxy.sendPacketString(anyString())).thenResolve("AS;aef;20");
            await proxy.load("/home/myh\\myprog", true);
            // the send all breakpoints has been called
            verify(spiedProxy.sendAllPendingBreakpoints()).never();
            verify(spiedProxy.sendPacketString('Z0,4,0')).never();
            // the stop command arrives  - should send pending breakpoints
            await mockedOnData(formatBuffer("S5;0"));
            verify(spiedProxy.sendAllPendingBreakpoints()).once();
            verify(spiedProxy.sendPacketString('Z0,4,0')).once();
        });
        it("Should get an error when removing breakpoint whitout connexion", async function () {
            // Remove
            when(spiedProxy.sendPacketString('z0,5,0')).thenResolve(RESPONSE_OK);
            await expect(proxy.removeBreakPoint(0, 5)).to.be.rejected;
            verify(spiedProxy.sendPacketString('z0,5,0')).never();
        });
        context('Connexion established', function () {
            beforeEach(async function () {
                when(spiedProxy.sendPacketString('g')).thenResolve(RESPONSE_REGISTERS);
                when(spiedProxy.sendPacketString('Z0,0,0')).thenResolve(RESPONSE_OK);
                // connect
                when(spiedProxy.sendPacketString('QStartNoAckMode')).thenResolve(RESPONSE_OK);
                await proxy.connect('localhost', 6860);
                // the run to the first stop 
                when(spiedProxy.sendPacketString('vRun;dh0:myprog;')).thenResolve("AS;aef;20");
                await proxy.load("/home/myh\\myprog", true);
                // the stop command arrives  - should send pending breakpoints
                await mockedOnData(formatBuffer("S05;0"));
            });
            it("Should set a breakpoint", async function () {
                when(spiedProxy.sendPacketString('Z0,4,0')).thenResolve(RESPONSE_OK);
                await expect(proxy.setBreakPoint(0, 4)).to.eventually.eql(<GdbBreakpoint>{
                    segmentId: 0,
                    offset: 4,
                    id: 0,
                    verified: true,
                    exceptionMask: undefined
                });
                verify(spiedProxy.sendPacketString('Z0,4,0')).once();
            });
            it("Should set an exception breakpoint", async function () {
                when(spiedProxy.sendPacketString('Z1,0,0;X1,a')).thenResolve(RESPONSE_OK);
                await expect(proxy.setBreakPoint(0, 0, 10)).to.eventually.eql(<GdbBreakpoint>{
                    segmentId: 0,
                    offset: 0,
                    id: 0,
                    verified: true,
                    exceptionMask: 10
                });
                verify(spiedProxy.sendPacketString('Z1,0,0;X1,a')).once();
            });
            it("Should return an error when setting a breakpoint", async function () {
                when(spiedProxy.sendPacketString('Z0,4,0')).thenReject(error);
                await expect(proxy.setBreakPoint(0, 4)).to.be.rejectedWith(error);
                verify(spiedProxy.sendPacketString('Z0,4,0')).once();
            });
            it("Should return an error on invalid breakpoint", async function () {
                // segment 1 is invalid
                when(spiedProxy.sendPacketString('Z0,4,1')).thenResolve(RESPONSE_OK);
                await expect(proxy.setBreakPoint(1, 4)).to.be.rejected;
                verify(spiedProxy.sendPacketString('Z0,4,1')).never();
            });
            it("Should get the registers", async function () {
                let registers = await proxy.registers(null);
                for (let i = 0; i < 8; i++) {
                    expect(registers[i]).to.be.eql(<GdbRegister>{
                        name: "d" + i,
                        value: i
                    });
                }
                for (let i = 8; i < 16; i++) {
                    expect(registers[i]).to.be.eql(<GdbRegister>{
                        name: "a" + (i - 8),
                        value: i
                    });
                }
                expect(registers[16]).to.be.eql(<GdbRegister>{
                    name: "sr",
                    value: 16
                });
                expect(registers[17]).to.be.eql(<GdbRegister>{
                    name: "pc",
                    value: 17
                });
            });
            it("Should get the stack frames", async function () {
                when(spiedProxy.sendPacketString("QTFrame:-1")).thenResolve("00000001");
                let rIdx = proxy.getRegisterIndex("pc");
                expect(rIdx).not.to.be.equal(null);
                if (rIdx !== null) {
                    let pcGetRegisterMessage = "p" + rIdx.toString(16);
                    when(spiedProxy.sendPacketString(pcGetRegisterMessage)).thenResolve("0000000a");
                    when(spiedProxy.sendPacketString("QTFrame:1")).thenResolve("00000001");
                    let thread = proxy.getThread(0);
                    if (thread) {
                        return expect(proxy.stack(thread)).to.eventually.eql(<GdbStackFrame>{
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
            it("Should remove an existing breakpoint", async function () {
                // Set a breakpoint
                when(spiedProxy.sendPacketString('Z0,4,0')).thenResolve(RESPONSE_OK);
                await proxy.setBreakPoint(0, 4);
                // Remove
                when(spiedProxy.sendPacketString('z0,4,0')).thenResolve(RESPONSE_OK);
                await proxy.removeBreakPoint(0, 4);
                verify(spiedProxy.sendPacketString('z0,4,0')).once();
            });
            it("Should remove an existing exception breakpoint", async function () {
                // Set a breakpoint
                when(spiedProxy.sendPacketString('Z1,0,0;X1,a')).thenResolve(RESPONSE_OK);
                await proxy.setBreakPoint(0, 0, 10);
                // Remove
                when(spiedProxy.sendPacketString('z1,0,0')).thenResolve(RESPONSE_OK);
                await proxy.removeBreakPoint(0, 0, 10);
                verify(spiedProxy.sendPacketString('z1,0,0')).once();
            });
            it("Should get an error when removing a non existing breakpoint", async function () {
                // Set a breakpoint
                when(spiedProxy.sendPacketString('Z0,4,0')).thenResolve(RESPONSE_OK);
                await proxy.setBreakPoint(0, 4);
                // Remove
                when(spiedProxy.sendPacketString('z0,5,0')).thenResolve(RESPONSE_OK);
                await expect(proxy.removeBreakPoint(0, 5)).to.be.rejected;
                verify(spiedProxy.sendPacketString('z0,5,0')).never();
            });
            it("Should clear all breakpoints", async function () {
                // without breakpoints - it's ok
                await expect(proxy.clearBreakpoints(0)).to.fulfilled;
                // Set a breakpoint
                when(spiedProxy.sendPacketString('Z0,4,0')).thenResolve(RESPONSE_OK);
                await proxy.setBreakPoint(0, 4);
                // Remove
                when(spiedProxy.sendPacketString('z0,4,0')).thenResolve(RESPONSE_OK);
                await expect(proxy.clearBreakpoints(0)).to.fulfilled;
                verify(spiedProxy.sendPacketString('z0,4,0')).once();
            });
            it("Should get an error when clearing all breakpoint of a non existing segment", async function () {
                // Set a breakpoint
                when(spiedProxy.sendPacketString('Z0,4,0')).thenResolve(RESPONSE_OK);
                await proxy.setBreakPoint(0, 4);
                // Remove
                when(spiedProxy.sendPacketString('z0,4,0')).thenResolve(RESPONSE_OK);
                await expect(proxy.clearBreakpoints(1)).to.be.rejected;
                verify(spiedProxy.sendPacketString('z0,4,0')).never();
            });
            it("Should get an error when clearing all breakpoint and there is on brkpt error", async function () {
                // Set a breakpoint
                when(spiedProxy.sendPacketString('Z0,4,0')).thenResolve(RESPONSE_OK);
                await proxy.setBreakPoint(0, 4);
                // Remove
                when(spiedProxy.sendPacketString('z0,4,0')).thenReject(error);
                await expect(proxy.clearBreakpoints(0)).to.be.rejectedWith(error);
                verify(spiedProxy.sendPacketString('z0,4,0')).once();
            });
            it("Should step instruction", async function () {
                when(spiedProxy.sendPacketString('n')).thenResolve(RESPONSE_OK);
                let thread = proxy.getThread(0);
                if (thread) {
                    await expect(proxy.step(thread)).to.be.fulfilled;
                    verify(spiedProxy.sendPacketString('n')).once();
                } else {
                    fail("Thread not found");
                }
            });
            it("Should reject on step instruction error", async function () {
                let thread = proxy.getThread(0);
                if (thread) {
                    when(spiedProxy.sendPacketString('n')).thenReject(error);
                    await expect(proxy.step(thread)).to.be.rejectedWith(error);
                    verify(spiedProxy.sendPacketString('n')).once();
                } else {
                    fail("Thread not found");
                }
            });
            it("Should step in instruction", async function () {
                let thread = proxy.getThread(0);
                if (thread) {
                    when(spiedProxy.sendPacketString('s')).thenResolve(RESPONSE_OK);
                    await expect(proxy.stepIn(thread)).to.be.fulfilled;
                    verify(spiedProxy.sendPacketString('s')).once();
                } else {
                    fail("Thread not found");
                }
            });
            it("Should reject on step in instruction error", async function () {
                let thread = proxy.getThread(0);
                if (thread) {
                    when(spiedProxy.sendPacketString('s')).thenReject(error);
                    await expect(proxy.stepIn(thread)).to.be.rejectedWith(error);
                    verify(spiedProxy.sendPacketString('s')).once();
                } else {
                    fail("Thread not found");
                }
            });
            it("Should get memory contents", async function () {
                when(spiedProxy.sendPacketString('ma,8')).thenResolve("cccccccc");
                await expect(proxy.getMemory(10, 8)).to.eventually.equals("cccccccc");
                verify(spiedProxy.sendPacketString('ma,8')).once();
            });
            it("Should send an error if get memory contents fails", async function () {
                when(spiedProxy.sendPacketString('ma,8')).thenReject(error);
                await expect(proxy.getMemory(10, 8)).to.be.rejectedWith(error);
                verify(spiedProxy.sendPacketString('ma,8')).once();
            });
            it("Should set memory contents", async function () {
                when(spiedProxy.sendPacketString('Ma,2:8aff')).thenResolve(RESPONSE_OK);
                await expect(proxy.setMemory(10, '8aff')).to.be.fulfilled;
                verify(spiedProxy.sendPacketString('Ma,2:8aff')).once();
            });
            it("Should send an error if set memory contents fails", async function () {
                when(spiedProxy.sendPacketString('Ma,2:8aff')).thenReject(error);
                await expect(proxy.setMemory(10, '8aff')).to.be.rejectedWith(error);
                verify(spiedProxy.sendPacketString('Ma,2:8aff')).once();
            });
            it("Should continue execution", async function () {
                when(spiedProxy.sendPacketString('c')).thenResolve(RESPONSE_OK);
                let thread = proxy.getThread(0);
                if (thread) {
                    await expect(proxy.continueExecution(thread)).to.be.fulfilled;
                } else {
                    fail("Thread not found");
                }
                verify(spiedProxy.sendPacketString('c')).once();
            });
            it("Should reject continue execution error", async function () {
                when(spiedProxy.sendPacketString('c')).thenReject(error);
                let thread = proxy.getThread(0);
                if (thread) {
                    await expect(proxy.continueExecution(thread)).to.be.rejectedWith(error);
                } else {
                    fail("Thread not found");
                }
                verify(spiedProxy.sendPacketString('c')).once();
            });
            it("Should set register", async function () {
                when(spiedProxy.sendPacketString('P0=8aff')).thenResolve(RESPONSE_OK);
                await expect(proxy.setRegister('d0', '8aff')).to.be.fulfilled;
                verify(spiedProxy.sendPacketString('P0=8aff')).once();
            });
            it("Should send an error if set memory contents fails", async function () {
                when(spiedProxy.sendPacketString('P0=8aff')).thenReject(error);
                await expect(proxy.setRegister('d0', '8aff')).to.be.rejectedWith(error);
                verify(spiedProxy.sendPacketString('P0=8aff')).once();
            });
            it("Should query for halt status", async function () {
                when(spiedProxy.sendPacketString('?')).thenResolve("S05");
                await expect(proxy.getHaltStatus()).to.be.fulfilled;
                verify(spiedProxy.sendPacketString('?')).once();
            });
            it("Should query for pause", async function () {
                when(spiedProxy.sendPacketString('vCtrlC')).thenResolve(RESPONSE_OK);
                let thread = proxy.getThread(0);
                if (thread) {
                    await expect(proxy.pause(thread)).to.be.fulfilled;
                } else {
                    fail("Thread not found");
                }
                verify(spiedProxy.sendPacketString('vCtrlC')).once();
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
        it("Should parse the reponse", function () {
            let expected = [<GdbPacket>{
                message: "OK",
                type: GdbPacketType.OK
            }];
            expect(GdbProxy.parseData("$OK#9a")).to.be.eql(expected);
            expected = [<GdbPacket>{
                message: "F00000013",
                type: GdbPacketType.FRAME
            }];
            expect(GdbProxy.parseData("$F00000013#ca")).to.be.eql(expected);
            expected = [<GdbPacket>{
                message: "4ef900f8101c4ef900f8",
                type: GdbPacketType.UNKNOWN
            }];
            expect(GdbProxy.parseData("$4ef900f8101c4ef900f8#61")).to.be.eql(expected);
            // Two messages
            expected = [<GdbPacket>{
                message: "OK",
                type: GdbPacketType.OK
            }, <GdbPacket>{
                message: "S05",
                type: GdbPacketType.STOP
            }];
            expect(GdbProxy.parseData("$OK#9a$S05#b8")).to.be.eql(expected);
        });
    });
    context('GdbError', function () {
        it("Should parse a GDBerror", function () {
            let error = new GdbError("E0f");
            expect(error.errorType).to.be.equal("E0F");
            expect(error.message).to.be.equal("Error during the packet parse for command send memory");
            expect(error.name).to.be.equal("GdbError");
            error = new GdbError("X1");
            expect(error.errorType).to.be.equal("X1");
            expect(error.message).to.be.equal("Error code recieved: 'X1'");
            expect(error.name).to.be.equal("GdbError");
        });
    });
});
