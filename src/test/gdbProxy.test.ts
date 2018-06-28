//
// Tests of the GDB Proxy
//

import { expect } from 'chai';
import * as chai from 'chai';
import { GdbProxy } from '../gdbProxy';
import { Socket } from 'net';
import { spy, verify, anyString, instance, when, anything, mock } from 'ts-mockito';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe("GdbProxy Tests", function () {
    context('Communication', function () {

        const RESPONSE_OK = "OK";
        const RESPONSE_ERROR = "E1";
        let socket: Socket;
        let proxy: GdbProxy;
        let spiedProxy: GdbProxy;
        let mockedSocket: Socket;
        let error = new Error(RESPONSE_ERROR);

        beforeEach(function () {
            mockedSocket = mock(Socket);
            when(mockedSocket.once('connect', anything())).thenCall(async (event: string, callback: (() => void)) => {
                await callback();
            });
            socket = instance(mockedSocket);
            proxy = new GdbProxy(socket);
            spiedProxy = spy(proxy);
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
        it("Should load a program", async function () {
            when(spiedProxy.sendPacketString(anyString())).thenResolve(RESPONSE_OK);
            await proxy.load("/home/myh\\myprog", true);
            verify(spiedProxy.sendPacketString('Z0,0,0')).once();
            verify(spiedProxy.sendPacketString('vRun;dh0:myprog;')).once();
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
    });

    context('Tools', function () {
        it("Should calculate the checksum", function () {
            let proxy = new GdbProxy(undefined);
            expect(proxy.calculateChecksum("QStartNoAckMode")).to.be.equal("b0");
            expect(proxy.calculateChecksum("OK")).to.be.equal("9a");
            expect(proxy.calculateChecksum("Z0,0,0")).to.be.equal("42");
            expect(proxy.calculateChecksum("vRun;dh0:hello;")).to.be.equal("6b");
            expect(proxy.calculateChecksum("g")).to.be.equal("67");
            expect(proxy.calculateChecksum("mc187e0,1a0")).to.be.equal("f3");
            expect(proxy.calculateChecksum("n")).to.be.equal("6e");
            expect(proxy.calculateChecksum("")).to.be.equal("00");
        });
    });
});    