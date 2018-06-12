//
// Tests of the Amiga Hunk file Parser
//

import { expect } from 'chai';
import { HunkParser } from '../amigaHunkParser';
import * as Path from 'path';

describe("AmigaHunkFile", function () {
    it("Should open a hunk file", function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const programFilename = Path.join(PROJECT_ROOT, 'test_files', 'debug', 'fs-uae', 'hd0', 'gencop');
        let parser = new HunkParser();
        let hunks = parser.parse_file(programFilename);
        expect(hunks.length).to.be.equal(1);
        let hunk = hunks[0];
        if (hunk.symbols) {
            expect(hunk.symbols.length).to.be.equal(15);
            expect(hunk.symbols[0].name).to.be.equal("init");
            expect(hunk.symbols[0].offset).to.be.equal(0);
        } else {
            expect.fail("hunk has no symbol");
        }
        // tslint:disable-next-line:no-unused-expression
        expect(hunk.code_data).to.exist;
        // tslint:disable-next-line:no-unused-expression
        expect(hunk.line_debug_info).to.exist;
        if (hunk.line_debug_info) {
            expect(hunk.line_debug_info.length).to.be.equal(1);
            let sourceFile = hunk.line_debug_info[0];
            expect(sourceFile.lines.length).to.be.equal(106);
            expect(sourceFile.name).to.be.equal("/Users/papa/developpements/amiga/projects/helloworld/gencop.s");
        }
    });

});