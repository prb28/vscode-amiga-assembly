//
// Tests of the calculator integration
//

import { expect } from 'chai';
import { Calc } from '../calc';
//import { Color, Position, Range } from 'vscode';

// tslint:disable:no-unused-expression
describe("Calc Tests", function () {
    it("Should calculate an expression with all kind of numbers", function () {
        let c = new Calc();
        expect(c.calculate("3+2")).to.be.equal(5);
        expect(c.calculate("3+#2+$a+%100")).to.be.equal(19);
    });
    it("Should format a result", function () {
        let c = new Calc();
        expect(c.formatResult("3+2", 5)).to.be.equal("3+2=#5/$5/%101");
        expect(c.formatResult(null, 2145)).to.be.equal("#2145/$861/%100001100001");
        expect(c.formatResult("$1000+$100", 4352)).to.be.equal("$1000+$100=#4352/$1100/%1000100000000");
    });
});
