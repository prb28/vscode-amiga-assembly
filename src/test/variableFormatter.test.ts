import { expect } from "chai";
import { VariableFormatter } from "../variableFormatter";

describe("Variable Formatter Tests", function () {
    it("Should format a variable", function () {
        expect(VariableFormatter.DECIMAL_FORMATTER.format(10)).to.be.equal('10');
        expect(VariableFormatter.HEXADECIMAL_FORMATTER.format(10)).to.be.equal('0x0000000a');
        expect(VariableFormatter.BINARY_FORMATTER.format(10)).to.be.equal('0b00000000000000000000000000001010');
        expect(VariableFormatter.ADDRESS_FORMATTER.format(10)).to.be.equal('$a');
    });
});