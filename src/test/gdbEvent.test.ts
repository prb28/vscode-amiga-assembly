//
// Tests for the gdb data management
//

import { GdbReceivedDataManager, GdbPacketHandler } from '../gdbEvents';
import { GdbPacket, GdbPacketType } from '../gdbPacket';
import { expect } from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);


// tslint:disable:no-unused-expression
describe("gdbEvents Tests", function () {
    it("Should manage and consume an event", function () {
        let triggered1 = false;
        let triggered2 = false;
        const packet = new GdbPacket(GdbPacketType.OK, "OK");
        const manager = new GdbReceivedDataManager();
        manager.OnData.on((): boolean => {
            triggered1 = true;
            return true;
        });
        manager.OnData.on((): boolean => {
            triggered2 = true;
            return true;
        });
        manager.trigger(packet);
        expect(triggered1).to.be.true;
        expect(triggered2).to.be.false;
        triggered1 = false;
        manager.trigger(packet);
        expect(triggered1).to.be.false;
        expect(triggered2).to.be.true;
        triggered1 = false;
        triggered2 = false;
        manager.trigger(packet);
        expect(triggered1).to.be.false;
        expect(triggered2).to.be.false;
    });
    it("Should use the default handler", function () {
        let triggered1 = false;
        let triggered2 = false;
        const packet = <GdbPacket>{};
        const manager = new GdbReceivedDataManager((): boolean => {
            triggered2 = true;
            return true;
        });
        manager.OnData.on((): boolean => {
            triggered1 = true;
            return true;
        });
        manager.trigger(packet);
        expect(triggered1).to.be.true;
        expect(triggered2).to.be.false;
        triggered1 = false;
        manager.trigger(packet);
        expect(triggered1).to.be.false;
        expect(triggered2).to.be.true;
    });
    it("Should work with promises", async function () {
        let triggered1 = false;
        let triggered2 = false;
        const packet = new GdbPacket(GdbPacketType.OK, "OK");
        const manager = new GdbReceivedDataManager();
        const handler1 = <GdbPacketHandler>{
            handle: (packet: GdbPacket): boolean => {
                triggered1 = true;
                return true;
            }
        };
        const handler2 = <GdbPacketHandler>{
            handle: (packet: GdbPacket): boolean => {
                triggered2 = true;
                return true;
            }
        };
        const p1 = manager.waitData(handler1);
        const p2 = manager.waitData(handler2);
        manager.trigger(packet);
        await expect(p1).to.be.fulfilled;
        expect(triggered1).to.be.true;
        expect(triggered2).to.be.false;
        manager.trigger(packet);
        await expect(p2).to.be.fulfilled;
        expect(triggered2).to.be.true;
    });

});