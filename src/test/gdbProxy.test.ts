//
// Tests of the GDB Proxy
//

import { expect } from 'chai';
import { GdbProxy } from '../gdbProxy';
import { Socket } from 'net';
import { spy, verify, anyString, instance, when, anything, mock, anyNumber } from 'ts-mockito';

describe("GdbProxy Tests", function () {
    const RESPONSE_OK = "$OK#9a";
    const REPONSE_OK_BUF = new Buffer(RESPONSE_OK);
    const RESPONSE_ERROR = "$E1#9a";
    const REPONSE_ERROR_BUF = new Buffer(RESPONSE_ERROR);
    it.only("Should connect to fs-UAE", async function () {
        let mockedSocket = mock(Socket);
        when(mockedSocket.once('connect', anything())).thenCall(async (event: string, callback: (() => void)) => {
            await callback();
        });
        let socket = instance(mockedSocket);
        let proxy = new GdbProxy(socket);
        let spiedProxy = spy(proxy);
        when(spiedProxy.sendPacketString(anyString())).thenResolve(REPONSE_OK_BUF);
        await proxy.connect('localhost', 6860);
        verify(mockedSocket.connect(6860, 'localhost')).once();
        verify(spiedProxy.sendPacketString('QStartNoAckMode')).once();
    });
    it.only("Should send an error on connect to fs-UAE error", async function () {
        let mockedSocket = mock(Socket);
        when(mockedSocket.once('connect', anything())).thenCall(async (event: string, callback: (() => void)) => {
            await callback();
        });
        let socket = instance(mockedSocket);
        let proxy = new GdbProxy(socket);
        let spiedProxy = spy(proxy);
        when(spiedProxy.sendPacketString(anyString())).thenResolve(REPONSE_ERROR_BUF);
        await proxy.connect('localhost', 6860);
        verify(mockedSocket.connect(6860, 'localhost')).once();
        verify(spiedProxy.sendPacketString('QStartNoAckMode')).once();
    });
    // it("Should connect to fs-UAE", async function () {
    //     this.timeout(6000);
    //     let proxy = new GdbProxy();
    //     await proxy.connect('localhost', 6860);
    //     await proxy.setBreakPoint(0, 0);
    //     await proxy.load('gencop', true);
    //     await proxy.sendPacketString('g').then(function (data) {
    //         console.log(data.toString());
    //     });
    // });
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