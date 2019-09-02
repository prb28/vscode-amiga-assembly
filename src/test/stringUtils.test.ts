//
// Tests of the string utils class
//

import { expect } from 'chai';
import { StringUtils } from '../stringUtils';

describe("String Utils tests", function () {
    it("Should transform a hex string to an array", function () {
        let hexString = "0a0f";
        let buffer = StringUtils.hexToBytes(hexString);
        expect(buffer.length).to.be.equal(2);
        expect(buffer[0]).to.be.equal(10);
        expect(buffer[1]).to.be.equal(15);
    });
    it("Should transform a hex string to a base64", function () {
        let hexString = "0a0f";
        let buffer = StringUtils.hexToBase64(hexString);
        expect(buffer).to.be.equal("Cg8=");
    });
    it("Should transform an array to a hex string", function () {
        let buffer = [10, 15];
        let str = StringUtils.bytesToHex(buffer);
        expect(str).to.be.eql("0a0f");
    });
    it("Should convert a ascii string to hex buffer", function () {
        let str = "abc";
        expect(StringUtils.convertStringToHex(str)).to.be.equal("616263");
    });
    it("Should pad a string", function () {
        let str = "abc";
        expect(StringUtils.padEnd(str, 5)).to.be.equal("abc  ");
        expect(StringUtils.padStart(str, 5)).to.be.equal("  abc");
        expect(StringUtils.padEnd(str, 5, "X")).to.be.equal("abcXX");
        expect(StringUtils.padStart(str, 5, "X")).to.be.equal("XXabc");
    });
});