//
// Tests of the Amiga Hunk file Parser
//

import { expect } from 'chai';
import { DebugInfo } from '../debugInfo';
import * as Path from 'path';

describe("Debug Info", function () {
    it("Should find the segment address", function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'gencop');
        const sourceRootPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
        const sourceFilename = Path.join(sourceRootPath, 'gencop.s');
        let pathReplacements = new Map<string, string>();
        pathReplacements.set("/Users/papa/developpements/amiga/projects/helloworld", sourceRootPath);
        let di = new DebugInfo(pathReplacements);
        di.loadInfo(programFilename);
        expect(di.getAddressSeg(sourceFilename, 32)).to.be.eql([0, 0]);
        expect(di.getAddressSeg(sourceFilename, 33)).to.be.eql([0, 4]);
    });
    it("Should resolve the line number", function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'gencop');
        const sourceRootPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
        let pathReplacements = new Map<string, string>();
        pathReplacements.set("/Users/papa/developpements/amiga/projects/helloworld", sourceRootPath);
        let di = new DebugInfo(pathReplacements);
        expect(di.loadInfo(programFilename)).to.be.equal(true);
        expect(di.resolveFileLine(0, 4)).to.be.eql([sourceRootPath + "/gencop.s", 33, "              clr.l      d0                      ; les registres sont des long - il faut les nettoyer avec un .l"]);
    });
    it("Should return all segments from a file", function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'gencop');
        const sourceRootPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
        const sourceFilename = Path.join(sourceRootPath, 'gencop.s');
        let pathReplacements = new Map<string, string>();
        pathReplacements.set("/Users/papa/developpements/amiga/projects/helloworld", sourceRootPath);
        let di = new DebugInfo(pathReplacements);
        expect(di.loadInfo(programFilename)).to.be.equal(true);
        expect(di.getAllSegmentIds(sourceFilename)).to.be.eql([0]);
    });
    it("Should raise an error if the file is not found", function () {
        let di = new DebugInfo();
        expect(di.loadInfo("nothere")).to.be.equal(false);
    });
});