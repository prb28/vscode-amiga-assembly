//
// Robustness tests of the formatter:
// - invariants checked on real sources (only whitespaces change, idempotence, same assembled binary)
// - parsing of edge case lines
//

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as cp from 'child_process';
import { expect } from 'chai';
import { fail } from 'assert';
import { TextEdit, CancellationTokenSource } from 'vscode';
import { M68kFormatter } from '../formatter';
import { ASMDocument, ASMLine } from '../parser';
import { DocumentFormatterConfiguration } from '../formatterConfiguration';
import { DummyTextDocument } from './dummy';
import { ExtensionState } from '../extension';

/** Formatter configurations to check */
const CONFIGURATIONS: Array<[string, DocumentFormatterConfiguration]> = [
    ["spaces", new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 0, 0, false, 4)],
    ["tabs", new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 0, 0, true, 4)],
    ["preferred positions", new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 12, 40, false, 4)],
    ["space after comma", new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 0, 0, false, 4, true)],
];

/**
 * Applies the edits to the lines (edits are only on a single line and do not overlap)
 */
function applyEdits(lines: Array<string>, edits: Array<TextEdit>): Array<string> {
    const result = [...lines];
    const sorted = [...edits].sort((a, b) => (a.range.start.line - b.range.start.line) || (b.range.start.character - a.range.start.character));
    for (const edit of sorted) {
        expect(edit.range.isSingleLine, "an edit must be on a single line").to.be.true;
        const line = result[edit.range.start.line];
        result[edit.range.start.line] = line.substring(0, edit.range.start.character) + edit.newText + line.substring(edit.range.end.character);
    }
    return result;
}

/**
 * Formats the lines with the configuration
 */
function formatLines(lines: Array<string>, configuration: DocumentFormatterConfiguration): Array<string> {
    const document = new DummyTextDocument();
    for (const line of lines) {
        document.addLine(line);
    }
    const asmDocument = new ASMDocument();
    asmDocument.parse(document, configuration);
    const edits = new M68kFormatter().computeEdits(asmDocument, configuration, new CancellationTokenSource().token);
    return applyEdits(lines, edits);
}

/**
 * Words of the line: the formatter may change the whitespaces between the words, never inside a word.
 * The formatter aligns the assignments and separates the comment from the code,
 * so the spaces around "=" and before the comment (first ";" outside quotes) are normalized.
 * With the spaceAfterComma option, the spaces after the commas of the code are ignored.
 */
function words(line: string, configuration: DocumentFormatterConfiguration): string {
    let quote: string | undefined = undefined;
    let code = line;
    let comment = "";
    for (let i = 0; i < line.length; i++) {
        const c = line.charAt(i);
        if (quote) {
            if (c === quote) {
                quote = undefined;
            }
        } else if (c === "\"" || c === "'") {
            quote = c;
        } else if (c === ";") {
            code = line.substring(0, i);
            comment = line.substring(i);
            break;
        }
    }
    // a label ending with colons may be glued to the instruction
    code = code.replace(/^(\s*[^\s:;"'=]+::?)/, "$1 ").replace(/\s*=\s*/g, " = ");
    if (configuration.spaceAfterComma) {
        code = code.replace(/,\s+/g, ",");
    }
    return (code + " " + comment).trim().split(/\s+/).join(" ");
}

/**
 * Lists the source files used for the invariants checks
 */
function listSourceFiles(root: string): Array<string> {
    const files = new Array<string>();
    const folders = [path.join(root, "test_files"), path.join(root, "resources", "examples", "vscode-amiga-wks-example")];
    for (const folder of folders) {
        for (const f of fs.readdirSync(folder)) {
            if (f.endsWith(".s")) {
                files.push(path.join(folder, f));
            }
        }
    }
    return files;
}

/**
 * Assembles a file with vasm, in an object file: the undefined symbols are allowed (externals)
 * @return the binary or undefined if the file does not assemble
 */
function assemble(vasm: string, file: string, includeDirs: Array<string>, extraArgs: Array<string> = []): Buffer | undefined {
    const output = file + ".o";
    const args = ["-Fhunk", "-quiet", "-m68080", "-o", output, ...extraArgs];
    for (const dir of includeDirs) {
        args.push("-I" + dir);
    }
    args.push(file);
    const r = cp.spawnSync(vasm, args, { encoding: "latin1" });
    if (r.status !== 0 || !fs.existsSync(output)) {
        return undefined;
    }
    const binary = fs.readFileSync(output);
    fs.rmSync(output, { force: true });
    return binary;
}

/**
 * Edge cases: line to parse and expected fields
 */
interface EdgeCase {
    issue?: string;
    line: string;
    label?: string;
    instruction?: string;
    data?: string;
    comment?: string;
    variable?: string;
    operator?: string;
    value?: string;
}

const EDGE_CASES: Array<EdgeCase> = [
    // Labels
    { line: "    local:  nop", label: "local", instruction: "nop" },
    { line: "label::  rts", label: "label", instruction: "rts" },
    { line: "label:move.l d0,d1", label: "label", instruction: "move.l", data: "d0,d1" },
    { line: ".loop  dbf d0,.loop", label: ".loop", instruction: "dbf", data: "d0,.loop" },
    { line: "1$:  bra.s 1$", label: "1$", instruction: "bra.s", data: "1$" },
    { issue: "#369", line: "@local  rts", label: "@local", instruction: "rts" },
    { line: "name\\@  rts", label: "name\\@", instruction: "rts" },
    { issue: "#179", line: "Move:  bsr Move", label: "Move", instruction: "bsr", data: "Move" },
    { issue: "#179", line: "Stop  stop #$2000", label: "Stop", instruction: "stop", data: "#$2000" },
    { line: "mylabel  ; comment", label: "mylabel", comment: "; comment" },
    { line: "averyveryveryveryveryverylonglabelname  move.l d0,d1", label: "averyveryveryveryveryverylonglabelname", instruction: "move.l", data: "d0,d1" },
    { line: "label\tmove.l\td0,d1\t;comment", label: "label", instruction: "move.l", data: "d0,d1", comment: ";comment" },
    // Macros
    { line: "MyMacro  macro", label: "MyMacro", instruction: "macro" },
    { line: "  macro MyMacro", instruction: "macro", data: "MyMacro" },
    { line: "  WAITBLIT.w  d0", instruction: "WAITBLIT.w", data: "d0" },
    { issue: "#98", line: "  MyMacro \\1,\\2 ; comment", instruction: "MyMacro", data: "\\1,\\2", comment: "; comment" },
    { line: "  endm", instruction: "endm" },
    // Data
    { issue: "#83", line: "  dc.b \"a;b\",0 ; comment", instruction: "dc.b", data: "\"a;b\",0", comment: "; comment" },
    { line: "  dc.b 'a;b',0 ; comment", instruction: "dc.b", data: "'a;b',0", comment: "; comment" },
    { line: "  dc.b 'it''s',0", instruction: "dc.b", data: "'it''s',0" },
    { issue: "#267", line: "  lea $dff000, a5 ; comment", instruction: "lea", data: "$dff000, a5", comment: "; comment" },
    // Directives
    { issue: "#355", line: "  if FOO>1", instruction: "if", data: "FOO>1" },
    { line: "  else", instruction: "else" },
    { line: "  endc", instruction: "endc" },
    { issue: "#363", line: "  rseven", instruction: "rseven" },
    { line: "Offset  rs.w 1", label: "Offset", instruction: "rs.w", data: "1" },
    // Assignments
    { issue: "#43", line: "CONST=5", variable: "CONST", operator: "=", value: "5" },
    { issue: "#352", line: "len = *-table", variable: "len", operator: "=", value: "*-table" },
    { issue: "#37", line: "CUSTOM  equ $dff000 ; comment", variable: "CUSTOM", operator: "equ", value: "$dff000", comment: "; comment" },
    { line: "PI fequ.s 3.14", variable: "PI", operator: "fequ.s", value: "3.14" },
    { issue: "#354", line: "TESTMODE:: = 2", variable: "TESTMODE", operator: "=", value: "2" },
    { issue: "#354", line: "EXPORTED::=2 ; comment", variable: "EXPORTED", operator: "=", value: "2", comment: "; comment" },
    { issue: "#354", line: "WITHCOLON: equ $dff000", variable: "WITHCOLON", operator: "equ", value: "$dff000" },
    { line: "equal equ 1", variable: "equal", operator: "equ", value: "1" },
];

// tslint:disable:no-unused-expression
describe("Formatter robustness Tests", function () {
    let extensionPath = "";
    before(async function () {
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
            extensionPath = ext.extensionPath;
            ASMLine.init(await ExtensionState.getCurrent().getLanguage());
        } else {
            fail("Extension no loaded");
        }
    });

    context("Invariants on the source files", function () {
        for (const [confName, configuration] of CONFIGURATIONS) {
            it(`Should only change the spaces between words and be idempotent (${confName})`, function () {
                const errors = new Array<string>();
                for (const file of listSourceFiles(extensionPath)) {
                    const lines = fs.readFileSync(file, "latin1").split(/\r?\n/);
                    const formatted = formatLines(lines, configuration);
                    for (let i = 0; i < lines.length; i++) {
                        if (words(lines[i], configuration) !== words(formatted[i], configuration)) {
                            errors.push(`${path.basename(file)}:${i + 1} content changed: '${lines[i]}' => '${formatted[i]}'`);
                        }
                    }
                    const formattedTwice = formatLines(formatted, configuration);
                    for (let i = 0; i < lines.length; i++) {
                        if (formatted[i] !== formattedTwice[i]) {
                            errors.push(`${path.basename(file)}:${i + 1} not idempotent: '${formatted[i]}' => '${formattedTwice[i]}'`);
                        }
                    }
                }
                expect(errors, errors.join("\n")).to.be.empty;
            });
        }
        it("Should assemble to the same binary once formatted", function () {
            this.timeout(60000);
            const vasm = path.join(extensionPath, "resources", "bin", process.platform, "vasmm68k_mot" + (process.platform === "win32" ? ".exe" : ""));
            if (!fs.existsSync(vasm)) {
                this.skip();
            }
            const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "fmt-"));
            // Empty stubs for the includes that are not in the repository (the symbols become externals)
            const stubDir = path.join(tmpDir, "stub");
            fs.mkdirSync(path.join(stubDir, "libraries"), { recursive: true });
            for (const stub of ["dos.i", "dos_lib.i"]) {
                fs.writeFileSync(path.join(stubDir, "libraries", stub), "");
            }
            const formattedDir = path.join(tmpDir, "formatted");
            fs.mkdirSync(formattedDir);
            const errors = new Array<string>();
            let assembledCount = 0;
            let spacesCheckedCount = 0;
            try {
                for (const file of listSourceFiles(extensionPath)) {
                    const includeDirs = [path.dirname(file), path.join(extensionPath, "resources", "examples", "vscode-amiga-wks-example", "include"), stubDir];
                    const original = assemble(vasm, file, includeDirs);
                    if (!original) {
                        continue;
                    }
                    assembledCount++;
                    const lines = fs.readFileSync(file, "latin1").split(/\r?\n/);
                    for (const [confName, configuration] of CONFIGURATIONS) {
                        // blanks in the operands are only allowed with the -spaces option,
                        // this option may break the sources (and the includes) using comments without ";"
                        const extraArgs = configuration.spaceAfterComma ? ["-spaces"] : [];
                        const reference = configuration.spaceAfterComma ? assemble(vasm, file, includeDirs, extraArgs) : original;
                        if (!reference) {
                            continue;
                        }
                        spacesCheckedCount += configuration.spaceAfterComma ? 1 : 0;
                        const formattedFile = path.join(formattedDir, path.basename(file));
                        fs.writeFileSync(formattedFile, formatLines(lines, configuration).join("\n"), "latin1");
                        const formatted = assemble(vasm, formattedFile, includeDirs, extraArgs);
                        if (!formatted) {
                            errors.push(`${path.basename(file)} (${confName}): does not assemble once formatted`);
                        } else if (!reference.equals(formatted)) {
                            errors.push(`${path.basename(file)} (${confName}): binary differs once formatted`);
                        }
                    }
                }
            } finally {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
            expect(assembledCount, "some source files could not be assembled").to.be.equal(listSourceFiles(extensionPath).length);
            expect(spacesCheckedCount, "no source file could be assembled with -spaces").to.be.greaterThan(0);
            expect(errors, errors.join("\n")).to.be.empty;
        });
    });

    context("Space after comma (#267)", function () {
        const cases: Array<[string, string]> = [
            ["$dff000,a5", "$dff000, a5"],
            ["$dff000,   a5", "$dff000, a5"],
            ["$dff000, a5", "$dff000, a5"],
            ["(a0,d0.w),d1", "(a0,d0.w), d1"],
            ["d0,-(sp)", "d0, -(sp)"],
            ["d0{0:8},d1", "d0{0:8}, d1"],
            ["\"a,b\",'c,d',0", "\"a,b\", 'c,d', 0"],
            ["\\1,\\2", "\\1, \\2"],
            ["d0,", "d0,"],
            ["#1", "#1"],
        ];
        for (const [data, expected] of cases) {
            it(`Should format '${data}' to '${expected}'`, function () {
                expect(ASMDocument.addSpaceAfterCommas(data)).to.be.equal(expected);
            });
        }
        it("Should format a document with a space after the commas", function () {
            const configuration = new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 0, 0, false, 4, true);
            const formatted = formatLines(["start  lea $dff000,a5 ; custom", "  move.l (a0,d0.w),d1 ; read"], configuration);
            expect(formatted).to.be.eql([
                "start  lea       $dff000, a5      ; custom",
                "       move.l    (a0,d0.w), d1    ; read"]);
        });
        it("Should not change the commas without the option", function () {
            const configuration = new DocumentFormatterConfiguration(2, 4, 4, 1, 1, 0, 0, false, 4);
            const formatted = formatLines(["  lea $dff000,a5"], configuration);
            expect(formatted).to.be.eql(["  lea    $dff000,a5"]);
        });
    });

    context("Edge cases", function () {
        for (const edgeCase of EDGE_CASES) {
            const title = `Should parse '${edgeCase.line}'` + (edgeCase.issue ? ` (${edgeCase.issue})` : "");
            it(title, function () {
                const asmLine = new ASMLine(edgeCase.line);
                const actual = {
                    label: asmLine.label.replace(/:+$/, ""),
                    instruction: asmLine.instruction,
                    data: asmLine.data,
                    comment: asmLine.comment,
                    variable: asmLine.variable,
                    operator: asmLine.operator,
                    value: asmLine.value,
                };
                const expected = {
                    label: edgeCase.label ?? "",
                    instruction: edgeCase.instruction ?? "",
                    data: edgeCase.data ?? "",
                    comment: edgeCase.comment ?? "",
                    variable: edgeCase.variable ?? "",
                    operator: edgeCase.operator ?? "",
                    value: edgeCase.value ?? "",
                };
                expect(actual).to.be.eql(expected);
            });
        }
        for (const [confName, configuration] of CONFIGURATIONS) {
            it(`Should format the edge cases keeping the words and idempotent (${confName})`, function () {
                const lines = EDGE_CASES.map(e => e.line);
                const formatted = formatLines(lines, configuration);
                const formattedTwice = formatLines(formatted, configuration);
                const errors = new Array<string>();
                for (let i = 0; i < lines.length; i++) {
                    if (words(lines[i], configuration) !== words(formatted[i], configuration)) {
                        errors.push(`content changed: '${lines[i]}' => '${formatted[i]}'`);
                    }
                    if (formatted[i] !== formattedTwice[i]) {
                        errors.push(`not idempotent: '${formatted[i]}' => '${formattedTwice[i]}'`);
                    }
                }
                expect(errors, errors.join("\n")).to.be.empty;
            });
        }
    });
});
