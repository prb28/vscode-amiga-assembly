//
// Tests of the color provider
//

import { expect } from 'chai';
import { M86kColorProvider } from '../color';
import { Color, Position, Range } from 'vscode';

// tslint:disable:no-unused-expression
describe("Color Tests", function () {
    it("Should find all the colors of a line", function () {
        let cp = new M86kColorProvider();
        let colors = cp.searchColorsInLine("    dc.w COLOR00,$0667,COLOR01,$abc ;toto", 1);
        expect(colors.length).to.be.equal(2);
        let c = colors[0];
        expect(c.color).to.be.eql(new Color(6 / 32, 6 / 32, 7 / 32, 1));
        expect(c.range).to.be.eql(new Range(new Position(1, 17), new Position(1, 22)));
        c = colors[1];
        expect(c.color).to.be.eql(new Color(10 / 32, 11 / 32, 12 / 32, 1));
        expect(c.range).to.be.eql(new Range(new Position(1, 31), new Position(1, 35)));
    });
    it("Should format a color", function () {
        let cp = new M86kColorProvider();
        let c = new Color(6 / 32, 6 / 32, 7 / 32, 1);
        expect(cp.formatColor(c, "$1000")).to.be.equal("$1667");
        c = new Color(10 / 32, 11 / 32, 12 / 32, 1);
        expect(cp.formatColor(c, "$000")).to.be.equal("$abc");
    });
});
