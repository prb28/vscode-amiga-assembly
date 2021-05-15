//
// Tests of the string utils class
//

import { expect } from 'chai';
import { StringUtils } from '../stringUtils';

describe("String Utils tests", function () {
    it("Should transform a hex string to an array", function () {
        const hexString = "0a0f";
        const buffer = StringUtils.hexToBytes(hexString);
        expect(buffer.length).to.be.equal(2);
        expect(buffer[0]).to.be.equal(10);
        expect(buffer[1]).to.be.equal(15);
    });
    it("Should transform a hex string to a base64", function () {
        const hexString = "0a0f";
        const buffer = StringUtils.hexToBase64(hexString);
        expect(buffer).to.be.equal("Cg8=");
    });
    it("Should transform an array to a hex string", function () {
        const buffer = [10, 15];
        const str = StringUtils.bytesToHex(buffer);
        expect(str).to.be.eql("0a0f");
    });
    it("Should convert a ascii string to hex buffer", function () {
        const str = "abc";
        expect(StringUtils.convertStringToHex(str)).to.be.equal("616263");
    });
    it("Should convert a number to ascii string", function () {
        expect(StringUtils.convertInt32ToASCII(0x0)).to.be.equal("....");
        expect(StringUtils.convertInt32ToASCII(0x60006162)).to.be.equal("`.ab");
        expect(StringUtils.convertInt32ToASCII(0x6385FF00)).to.be.equal("c.ÿ.");
    });
    it("Should convert a hex string containing an utf8 string to utf8 string", function () {
        expect(StringUtils.convertHexUTF8StringToUTF8("C385E282AC")).to.be.equal("Å€");
    });
    it("Should pad a string", function () {
        const str = "abc";
        expect(StringUtils.padEnd(str, 5)).to.be.equal("abc  ");
        expect(StringUtils.padStart(str, 5)).to.be.equal("  abc");
        expect(StringUtils.padEnd(str, 5, "X")).to.be.equal("abcXX");
        expect(StringUtils.padStart(str, 5, "X")).to.be.equal("XXabc");
    });
});