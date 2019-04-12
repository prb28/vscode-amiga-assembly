// The module 'chai' provides assertion methods from node
import { expect } from 'chai';
import { ExpressionDataGenerator, ExpressionDataVariable, OutputDataType } from '../expressionDataGenerator';

describe("Expression data generator", function () {
    it("should generate a line expression data", function () {
        let expVar = new ExpressionDataVariable("x", 1, 10, 1);
        let expDGen = new ExpressionDataGenerator("x+2", expVar);
        expect(expDGen.eval()).to.be.eql([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
    it("should throw an exception on invalid function", function () {
        let expVar = new ExpressionDataVariable("x", 1, 10, 1);
        let expDGen = new ExpressionDataGenerator("x/2)", expVar);
        expect(() => expDGen.eval()).to.throw("Parsing error at 3: Unmatched paren");
    });
    it("should throw an exception on eval runtime", function () {
        let expVar = new ExpressionDataVariable("x", 0, 10, 1);
        let expDGen = new ExpressionDataGenerator("foo(x)", expVar);
        expect(() => expDGen.eval()).to.throw();
    });
    it("should generate a sinus expression data", function () {
        let expVar = new ExpressionDataVariable("x", 0, 5, 1);
        let expDGen = new ExpressionDataGenerator("round(sin(x*pi/180)*pow(2,14))", expVar);
        let values = expDGen.eval();
        for (let x = 0; x <= 5; x++) {
            let p = Math.pow(2, 14);
            let s = Math.sin(x * Math.PI / 180);
            let v = Math.round(s * p);
            expect(values[x]).to.be.equal(v);
        }
    });
    it("should generate a string output", function () {
        let expVar = new ExpressionDataVariable("x", 0, 3, 1);
        let expDGen = new ExpressionDataGenerator("round(sin(x*pi/180)*pow(2,14))", expVar);
        let output = expDGen.evalString(OutputDataType.WORD, 1);
        let expected = "dc.w 0\ndc.w 286\ndc.w 572\ndc.w 857";
        expect(output).to.be.equal(expected);
    });
});