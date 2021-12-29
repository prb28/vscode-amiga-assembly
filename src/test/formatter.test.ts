//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as vscode from 'vscode';
import { expect } from 'chai';
import { M68kFormatter } from '../formatter';
import { ASMDocument } from '../parser';
import { TextEdit, Range, Position, CancellationTokenSource } from 'vscode';
import { DummyFormattingOptions, DummyTextDocument, DummyWorkspaceConfiguration } from './dummy';
import { DocumentFormatterConfiguration } from '../formatterConfiguration';
import { fail } from 'assert';
import { ConfigurationHelper } from '../configurationHelper';

function getEditsForLine(line: string, enableTabs = false): TextEdit[] {
    const f = new M68kFormatter();
    const document = new DummyTextDocument();
    document.addLine(line);
    const conf = new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 0, 0, enableTabs, 4);
    const asmDocument = new ASMDocument();
    asmDocument.parse(document, conf);
    //asmDocument.maxLabelSize = 9;
    //asmDocument.maxInstructionSize = 7;
    //asmDocument.maxDataSize = 11;
    return f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[0], conf);
}

function getEditsForLineOnType(line: string, enableTabs = false): TextEdit[] {
    const f = new M68kFormatter();
    const document = new DummyTextDocument();
    document.addLine(line);
    const conf = new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 0, 0, enableTabs, 4);
    const asmDocument = new ASMDocument();
    asmDocument.parse(document, conf);
    asmDocument.maxLabelSize = 9;
    asmDocument.maxInstructionSize = 7;
    asmDocument.maxDataSize = 11;
    const asmLine = asmDocument.asmLinesArray[0];
    return f.computeEditsForLineOnType(asmDocument, asmLine, conf, asmLine.end);
}

// tslint:disable:no-unused-expression
describe("Formatter Tests", function () {
    before(async () => {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        } else {
            fail("Extension no loaded");
        }
    });
    it("Should format a full line", function () {
        const lineToFormat = ".mylabel\t   move.l #mempos,d1        ; mycomment   ";
        let edits = getEditsForLine(lineToFormat);
        let i = 0;
        // Expected : ".mylabel  move.l    #mempos,d1    ; mycomment"
        // Expected : "0         10        20            34"
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 29), new Position(0, 37)), " ".repeat(4)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 18), new Position(0, 19)), " ".repeat(4)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 8), new Position(0, 12)), " ".repeat(2)));
        // With tabs enabled
        edits = getEditsForLine(lineToFormat, true);
        i = 0;
        // Expected : ".mylabel\tmove.l\t#mempos,d1\t\t; mycomment"
        // Expected : ".mylabel    move.l      #mempos,d1      ; mycomment"
        //            "0   1   2   3   4   5   6   7   8   9   0   1   |   |   "
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 29), new Position(0, 37)), "\t\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 18), new Position(0, 19)), "\t\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 8), new Position(0, 12)), "\t"));
    });
    it("Should format a full line without comment", function () {
        const lineToFormat = "\t   move.l #mempos,d1        ; mycomment   ";
        let edits = getEditsForLine(lineToFormat);
        let i = 0;
        // Expected : "  move.l    #mempos,d1   ; mycomment"
        // Expected :    2         12           25
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 21), new Position(0, 29)), " ".repeat(4)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 10), new Position(0, 11)), " ".repeat(4)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(2)));
        edits = getEditsForLine(lineToFormat, true);
        i = 0;
        // Expected : "    move.l      #mempos,d1      ; mycomment"
        //            "0   1   2   3   4   5   6   7   8   9   0   1   |   |   "
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 21), new Position(0, 29)), "\t\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 10), new Position(0, 11)), "\t\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), "\t"));
    });
    it("Should format a line with instruction and data", function () {
        const edits = getEditsForLine("\t   move.l #mempos,d1     ");
        let i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 10), new Position(0, 11)), " ".repeat(4)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(2)));
    });
    it("Should format a line with only an instruction", function () {
        const edits = getEditsForLine("\t   rts      ");
        let i = 0;
        expect(edits.length).to.be.equal(1);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 4)), " ".repeat(2)));
    });
    it("Should format a line without data", function () {
        const edits = getEditsForLine(".mylabel\t   rts        ; my comment");
        let i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 15), new Position(0, 23)), " ".repeat(8)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 8), new Position(0, 12)), " ".repeat(2)));
    });
    it("Should format a line on typing with a label", function () {
        const edits = getEditsForLineOnType(".mylabel ");
        expect(edits.length).to.be.equal(0);
    });
    it("Should format a line on typing with an instruction", function () {
        const edits = getEditsForLineOnType("\t   move.l ");
        expect(edits[0]).to.be.eql(TextEdit.insert(new Position(0, 10), " ".repeat(4)));

    });
    it("Should format a line on typing with a full", function () {
        const edits = getEditsForLineOnType(".mylabel\t   move.l #mempos,d1        ; my comment");
        let i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 29), new Position(0, 37)), " ".repeat(4)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 18), new Position(0, 19)), " ".repeat(4)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 8), new Position(0, 12)), " ".repeat(2)));
    });
    it("Should add pad to the end of a string", function () {
        const f = new M68kFormatter();
        expect(f.getEndPad("aa", 0, 10, false, 0)).to.be.equal(" ".repeat(8));
        expect(f.getEndPad("aaaa", 0, 3, false, 0)).to.be.equal(" ");
        expect(f.getEndPad("aaaa", 0, 10, true, 4)).to.be.equal("\t\t");
        expect(f.getEndPad("aa", 0, 10, true, 4)).to.be.equal("\t\t\t");
        expect(f.getEndPad("aaaa", 4, 4, true, 4)).to.be.equal("\t"); // When it's filled : at least one space
        expect(f.getEndPad("aaaa", 6, 11, true, 4)).to.be.equal("\t");
    });
    it("Should retrieve 0 for a negative property", function () {
        const conf = new DummyWorkspaceConfiguration();
        expect(ConfigurationHelper.retrieveNumberProperty(conf, 'testconf', 12)).to.be.equal(12);
        conf.update('testconf', -1);
        expect(conf.has('testconf')).to.be.true;
        expect(ConfigurationHelper.retrieveNumberProperty(conf, 'testconf', 12)).to.be.equal(0);
        conf.update('testconf', 5);
        expect(ConfigurationHelper.retrieveNumberProperty(conf, 'testconf', 12)).to.be.equal(5);
    });
    describe("OnTypeFormattingEditProvider", function () {
        it("Should return no editing command on a empty document", function () {
            const f = new M68kFormatter();
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 1);
            const ch = "";
            const options = new DummyFormattingOptions();
            const tokenEmitter = new CancellationTokenSource();
            const results = f.provideOnTypeFormattingEdits(document, position, ch, options, tokenEmitter.token);
            if ((results) && (results instanceof Array)) {
                expect(results.length).to.be.equal(0);
            }
        });
        it("Should return an insert spaces command after an instruction", function () {
            const f = new M68kFormatter();
            const document = new DummyTextDocument();
            const ch = "";
            const options = new DummyFormattingOptions();
            const tokenEmitter = new CancellationTokenSource();
            document.addLine("\t   move.l #mempos,d1        ; mycomment   ");
            document.addLine("   rts ");
            const position: Position = new Position(1, 7);
            const edits = f.provideOnTypeFormattingEdits(document, position, ch, options, tokenEmitter.token);
            expect(edits).to.not.be.undefined;
            if (edits instanceof Array) {
                expect(edits.length).to.be.equal(1);
                expect(edits[0]).to.be.eql(TextEdit.insert(new Position(1, 6), " ".repeat(7)));
            }
        });
    });
    it("Should format an assignment", function () {
        const f = new M68kFormatter();
        const document = new DummyTextDocument();
        document.addLine("myvar2  equ 28  ;comment");
        document.addLine("foo = 43");
        document.addLine("SC_W_P      = W");
        // expected
        //myvar2 equ 28 ;comment
        //foo      = 43
        //SC_W_P   = W
        const asmDocument = new ASMDocument();
        let conf = new DocumentFormatterConfiguration(1, 1, 4, 1, 1, 0, 0, false, 4);
        asmDocument.parse(document, conf);
        let edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[0], conf);
        let i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 14), new Position(0, 16)), " "));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 11), new Position(0, 12)), " "));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 6), new Position(0, 8)), " "));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[1], conf);
        i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(1, 5), new Position(1, 6)), " "));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(1, 3), new Position(1, 4)), " ".repeat(6)));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[2], conf);
        i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(2, 13), new Position(2, 14)), " "));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(2, 6), new Position(2, 12)), " ".repeat(3)));
        // Test with tabs
        // expected
        //myvar2\tequ\t28\t;comment
        //foo\t\t=\t43
        //SC_W\t=\tW
        conf = new DocumentFormatterConfiguration(1, 1, 4, 1, 1, 0, 0, true, 4);
        asmDocument.parse(document, conf);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[0], conf);
        i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 14), new Position(0, 16)), "\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 11), new Position(0, 12)), "\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 6), new Position(0, 8)), "\t"));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[1], conf);
        i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(1, 5), new Position(1, 6)), "\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(1, 3), new Position(1, 4)), "\t\t"));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[2], conf);
        i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(2, 13), new Position(2, 14)), "\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(2, 6), new Position(2, 12)), "\t"));
    });
    it("Should format with preferred sizes", function () {
        const f = new M68kFormatter();
        const document = new DummyTextDocument();
        document.addLine("label: move #1,a0 ;comment");
        document.addLine("labelbiggerthanpreferred dc.b #2,#3,#4,#5,#6,#6,#6,#6,#6,#6,#6,#6,#6,#6,#6 ;comment too far");
        document.addLine(" rts ; my comment");
        document.addLine("labelbiggert: dc.b #2 ; my comment");
        document.addLine("labelxxxxx: move #1,a0 ;comment");
        document.addLine("labelxxxxxx: move #1,a0 ;comment");
        document.addLine("V = 3 ;comment");
        // expected
        //label:     move    #1,a0     ;comment
        //labelbiggerthanpreferred dc.b #2,#3,#4,#5,#6,#6,#6,#6,#6,#6,#6,#6,#6,#6,#6 ;comment too far
        //           rts               ; my comment
        //labelbiggert: dc.b #2 ; my comment
        //labelxxxxx: move #1,a0 ;comment
        //labelxxxxxx: move #1,a0 ;comment
        //V = 3                        ;comment
        let asmDocument = new ASMDocument();
        let conf = new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 12, 30, false, 4);
        asmDocument.parse(document, conf);
        let edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[0], conf);
        let i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 17), new Position(0, 18)), " ".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 11), new Position(0, 12)), " ".repeat(4)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 6), new Position(0, 7)), " ".repeat(6)));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[1], conf);
        expect(edits.length).to.be.equal(0);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[2], conf);
        i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(2, 4), new Position(2, 5)), " ".repeat(15)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(2, 0), new Position(2, 1)), " ".repeat(12)));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[3], conf);
        expect(edits.length).to.be.equal(0);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[4], conf);
        expect(edits.length).to.be.equal(0);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[5], conf);
        expect(edits.length).to.be.equal(0);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[6], conf);
        i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(6, 5), new Position(6, 6)), " ".repeat(25)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(6, 3), new Position(6, 4)), " "));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(6, 1), new Position(6, 2)), " "));
        // With tabs
        asmDocument = new ASMDocument();
        conf = new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 12, 30, true, 4);
        asmDocument.parse(document, conf);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[0], conf);
        i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 17), new Position(0, 18)), "\t\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 11), new Position(0, 12)), "\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 6), new Position(0, 7)), "\t\t"));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[1], conf);
        expect(edits.length).to.be.equal(0);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[2], conf);
        i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(2, 4), new Position(2, 5)), "\t".repeat(5)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(2, 0), new Position(2, 1)), "\t".repeat(3)));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[3], conf);
        expect(edits.length).to.be.equal(0);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[4], conf);
        expect(edits.length).to.be.equal(0);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[5], conf);
        expect(edits.length).to.be.equal(0);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[6], conf);
        i = 0;
        expect(edits.length).to.be.equal(3);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(6, 5), new Position(6, 6)), "\t".repeat(6)));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(6, 3), new Position(6, 4)), "\t"));
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(6, 1), new Position(6, 2)), "\t"));
    });
    it("Should format a macro", function () {
        const f = new M68kFormatter();
        const document = new DummyTextDocument();
        document.addLine("        macro         some_macro");
        document.addLine("        \\1.b          \\2,d0");
        document.addLine("        endm");
        document.addLine("some_label:");
        document.addLine("        some_macro    or,d1");
        // expected
        //        macro         some_macro
        //        \1.b          \2,d0
        //        endm
        //some_label:
        //        some_macro    or,d1
        const asmDocument = new ASMDocument();
        const conf = new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 0, 0, false, 4);
        asmDocument.parse(document, conf);
        let edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[0], conf);
        let i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(0, 13), new Position(0, 22)), " ".repeat(9)));
        expect(edits[i]).to.be.eql(TextEdit.replace(new Range(new Position(0, 0), new Position(0, 8)), " ".repeat(2)));
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[1], conf);
        expect(edits.length).to.be.equal(1);
        edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[4], conf);
        i = 0;
        expect(edits.length).to.be.equal(2);
        expect(edits[i++]).to.be.eql(TextEdit.replace(new Range(new Position(4, 18), new Position(4, 22)), " ".repeat(4)));
        expect(edits[i]).to.be.eql(TextEdit.replace(new Range(new Position(4, 0), new Position(4, 8)), " ".repeat(2)));
    });
    it("Should allow opcode names in labels", function () {
        const f = new M68kFormatter();
        const document = new DummyTextDocument();
        document.addLine(".end:");
        const asmDocument = new ASMDocument();
        const conf = new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 0, 0, false, 4);
        asmDocument.parse(document, conf);
        let edits = f.computeEditsForLine(asmDocument, asmDocument.asmLinesArray[0], conf);
        expect(edits.length).to.be.equal(0);
    });
});

