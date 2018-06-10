//
// Tests of the GDB Proxy
//

import { expect } from 'chai';
import { GdbProxy } from '../gdbProxy';

describe("GdbProxy Tests", function () {
    it("Should connect to fs-UAE", async function () {
        this.timeout(6000);
        let proxy = new GdbProxy();
        proxy.connect('localhost', 6860);
        //proxy.load('sys:hello');
        await proxy.sendPacketString('QStartNoAckMode').then(function (data: any) {
            console.log(data.toString());
        });
        // add breakpoint
        await proxy.sendPacketString('Z0,0,0').then(function (data) {
            console.log(data.toString());
        });
        await proxy.sendPacketString('vRun;dh0:gencop;').then(function (data) {
            console.log(data.toString());
        });
        await proxy.sendPacketString('g').then(function (data) {
            console.log(data.toString());
        });
        await proxy.sendPacketString('mc187e0,1a0').then(function (data) {
            console.log(data.toString());
        });
        await proxy.sendPacketString('n').then(function (data) {
            console.log(data.toString());
        });

    });
    it("Should connect to fs-UAE", async function () {
        this.timeout(6000);
        let proxy = new GdbProxy();
        await proxy.connect('localhost', 6860);
        await proxy.setBreakPoint('', 0);
        await proxy.load('gencop');
        await proxy.sendPacketString('g').then(function (data) {
            console.log(data.toString());
        });
    });
    it("Should calculate the checksum", function () {
        let proxy = new GdbProxy();
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