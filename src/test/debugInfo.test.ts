//
// Tests of the Amiga Hunk file Parser
//

import { expect } from 'chai';
import { DebugInfo } from '../debugInfo';
import * as Path from 'path';
import { FileProxy } from '../fsProxy';
import { Uri } from 'vscode';

describe("Debug Info", function () {
    it("Should find the segment address", async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'gencop');
        const sourceRootPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
        const sourceFilename = Path.join(sourceRootPath, 'gencop.s');
        let pathReplacements = new Map<string, string>();
        pathReplacements.set("/Users/papa/developpements/amiga/projects/helloworld", sourceRootPath);
        let di = new DebugInfo(pathReplacements);
        await di.loadInfo(Uri.file(programFilename));
        expect(await di.getAddressSeg(sourceFilename, 32)).to.be.eql([0, 0]);
        expect(await di.getAddressSeg(sourceFilename, 33)).to.be.eql([0, 4]);
    });
    it("Should resolve the line number", async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'gencop');
        const sourceRootPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
        let pathReplacements = new Map<string, string>();
        pathReplacements.set("/Users/papa/developpements/amiga/projects/helloworld", sourceRootPath);
        let di = new DebugInfo(pathReplacements);
        await expect(di.loadInfo(Uri.file(programFilename))).to.be.eventually.equal(true);
        await expect(di.resolveFileLine(0, 4)).to.be.eventually.eql([FileProxy.normalize(sourceRootPath + Path.sep + "gencop.s"), 33, "              clr.l      d0                      ; les registres sont des long - il faut les nettoyer avec un .l"]);
    });
    it("Should return all segments from a file", async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'gencop');
        const sourceRootPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
        const sourceFilename = Path.join(sourceRootPath, 'gencop.s');
        let pathReplacements = new Map<string, string>();
        pathReplacements.set("/Users/papa/developpements/amiga/projects/helloworld", sourceRootPath);
        let di = new DebugInfo(pathReplacements);
        await expect(di.loadInfo(Uri.file(programFilename))).to.be.eventually.equal(true);
        await expect(di.getAllSegmentIds(sourceFilename)).to.be.eventually.eql([0]);
    });
    it("Should raise an error if the file is not found", async function () {
        let di = new DebugInfo();
        await expect(di.loadInfo(Uri.file("nothere"))).to.be.eventually.equal(false);
    });
    it("Should compare filenames", function () {
        let di = new DebugInfo();
        // tslint:disable-next-line:no-unused-expression
        expect(di.areSameSourceFileNames("b", "b")).to.be.true;
        // tslint:disable-next-line:no-unused-expression
        expect(di.areSameSourceFileNames("/b/c", "/b/C")).to.be.false;
        // tslint:disable-next-line:no-unused-expression       
        expect(di.areSameSourceFileNames("./c", "/b/c")).to.be.true;
    });
    it("Should resolve the line number of a C file", async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'hello-vbcc');
        const sourceRootPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
        let pathReplacements = new Map<string, string>();
        let di = new DebugInfo(pathReplacements, [sourceRootPath]);
        await expect(di.loadInfo(Uri.file(programFilename))).to.be.eventually.equal(true);
        await expect(di.resolveFileLine(0, 1024)).to.be.eventually.eql([FileProxy.normalize(sourceRootPath + Path.sep + "hello.c"), 9, "        printf(\"10 * %d = %d\\n\", i, mul_by_ten(i));"]);
    });
    it("Should find the segment address for a C file", async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'hello-vbcc');
        const sourceRootPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
        const sourceFilename = Path.join(sourceRootPath, 'hello.c');
        let pathReplacements = new Map<string, string>();
        let di = new DebugInfo(pathReplacements, [sourceRootPath]);
        await di.loadInfo(Uri.file(programFilename));
        await expect(di.getAddressSeg(sourceFilename, 9)).to.be.eventually.eql([0, 986]);
        // Without path
        await expect(di.getAddressSeg('hello.c', 9)).to.be.eventually.eql([0, 986]);
    });

});