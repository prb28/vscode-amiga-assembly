import { GdbPacket, GdbPacketType } from "../gdbPacket";
import { expect } from "chai";

describe("GdbPacket Tests", function () {
    it("Should parse the reponse", function () {
        let expected = [new GdbPacket(GdbPacketType.OK, "OK")];
        expect(GdbPacket.parseData("$OK#9a")).to.be.eql(expected);
        expected = [new GdbPacket(GdbPacketType.FRAME, "F00000013")];
        expect(GdbPacket.parseData("$F00000013#ca")).to.be.eql(expected);
        expected = [new GdbPacket(GdbPacketType.UNKNOWN, "4ef900f8101c4ef900f8")];
        expect(GdbPacket.parseData("$4ef900f8101c4ef900f8#61")).to.be.eql(expected);
        // Two messages
        expected = [new GdbPacket(GdbPacketType.OK, "OK"), new GdbPacket(GdbPacketType.STOP, "S05")];
        expect(GdbPacket.parseData("$OK#9a$S05#b8")).to.be.eql(expected);
    });
});