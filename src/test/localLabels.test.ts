//
// Issue #369: local labels starting with "@".
// - behavior of the bundled vasm: the same local label name is defined in two scopes (after two global labels)
// - quick fix converting them to "." local labels
// - symbols of the "@" local labels
//

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as cp from 'child_process';
import { expect } from 'chai';
import { fail } from 'assert';
import { CodeActionKind, Diagnostic, Range, TextEdit } from 'vscode';
import { ASMLine } from '../parser';
import { SymbolFile } from '../symbols';
import { M68kLocalLabelsCodeActionProvider } from '../localLabels';
import { ExtensionState } from '../extension';
import { DummyTextDocument } from './dummy';

/**
 * Source with the local label `<prefix>loop` defined in two scopes
 */
function sourceWithLocalLabels(prefix: string): string {
    return [
        "first:",
        `${prefix}loop  dbf d0,${prefix}loop`,
        "        rts",
        "second:",
        `${prefix}loop  dbf d0,${prefix}loop`,
        "        rts",
        ""
    ].join("\n");
}

/**
 * Source with "@" local labels and edge cases: strings, comments, octal values, macro unique labels, expressions
 */
const SOURCE_WITH_EDGE_CASES = [
    "; @loop in a comment",
    "WAIT    macro",
    "wait\\@: btst #6,$dff002",
    "        bne.s wait\\@",
    "        endm",
    "first:",
    "@loop:  dbf d0,@loop ; @loop",
    "        move.w #@17,d1",
    "        dc.b '@loop',0",
    "        dc.w @end-@loop",
    "@end    rts",
    "second:",
    "@loop   dbf d0,@loop",
    "        bra.s @end",
    "@end:   rts",
    ""
].join("\n");

const CONVERTED_EDGE_CASES = [
    "; @loop in a comment",
    "WAIT    macro",
    "wait\\@: btst #6,$dff002",
    "        bne.s wait\\@",
    "        endm",
    "first:",
    ".loop:  dbf d0,.loop ; @loop",
    "        move.w #@17,d1",
    "        dc.b '@loop',0",
    "        dc.w .end-.loop",
    ".end    rts",
    "second:",
    ".loop   dbf d0,.loop",
    "        bra.s .end",
    ".end:   rts",
    ""
].join("\n");

function createDocument(source: string): DummyTextDocument {
    const document = new DummyTextDocument();
    for (const line of source.split("\n")) {
        document.addLine(line);
    }
    return document;
}

/**
 * Applies the edits to the source (edits are only on a single line and do not overlap)
 */
function applyEdits(source: string, edits: Array<TextEdit>): string {
    const lines = source.split("\n");
    const sorted = [...edits].sort((a, b) => (a.range.start.line - b.range.start.line) || (b.range.start.character - a.range.start.character));
    for (const edit of sorted) {
        const line = lines[edit.range.start.line];
        lines[edit.range.start.line] = line.substring(0, edit.range.start.character) + edit.newText + line.substring(edit.range.end.character);
    }
    return lines.join("\n");
}

function convert(source: string): string {
    return applyEdits(source, M68kLocalLabelsCodeActionProvider.computeEdits(createDocument(source)));
}

describe("Local labels Tests", function () {
    let vasm = "";
    let tmpDir = "";
    before(async function () {
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (!ext) {
            fail("Extension no loaded");
        }
        await ext.activate();
        ASMLine.init(await ExtensionState.getCurrent().getLanguage());
        vasm = path.join(ext.extensionPath, "resources", "bin", process.platform, "vasmm68k_mot" + (process.platform === "win32" ? ".exe" : ""));
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "local-"));
    });
    after(function () {
        if (tmpDir) {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });

    /**
     * Assembles the source with vasm
     * @return the exit status and the output of vasm
     */
    function assemble(source: string, extraArgs: Array<string> = []): [number | null, string] {
        const file = path.join(tmpDir, "local.s");
        fs.writeFileSync(file, source);
        const r = cp.spawnSync(vasm, ["-Fhunk", "-quiet", "-o", file + ".o", ...extraArgs, file], { encoding: "latin1" });
        return [r.status, r.stdout + r.stderr];
    }

    context("vasm", function () {
        before(function () {
            if (!fs.existsSync(vasm)) {
                this.skip();
            }
        });
        it("Should assemble the '.' local labels defined in two scopes", function () {
            const [status, output] = assemble(sourceWithLocalLabels("."));
            expect(status, output).to.be.equal(0);
        });
        for (const options of [[], ["-devpac"], ["-phxass"]]) {
            it(`Should report the '@' local labels defined in two scopes as redefined (${options.join(" ") || "default options"})`, function () {
                const [status, output] = assemble(sourceWithLocalLabels("@"), options);
                expect(status, output).to.not.be.equal(0);
                expect(output).to.contain("label <@loop> redefined");
            });
        }
        it("Should assemble the '@' local labels once converted", function () {
            const [status, output] = assemble(convert(SOURCE_WITH_EDGE_CASES));
            expect(status, output).to.be.equal(0);
        });
    });

    context("Quick fix", function () {
        it("Should convert the '@' local labels definitions and references", function () {
            expect(convert(sourceWithLocalLabels("@"))).to.be.equal(sourceWithLocalLabels("."));
        });
        it("Should only convert the '@' local labels (not the strings, comments, octal values and macro unique labels)", function () {
            expect(convert(SOURCE_WITH_EDGE_CASES)).to.be.equal(CONVERTED_EDGE_CASES);
        });
        it("Should not convert an '@' reference without a matching label", function () {
            const source = "start:  bra.s @missing\n";
            expect(convert(source)).to.be.equal(source);
        });
        it("Should provide the quick fix on the vasm redefined '@' label error", function () {
            const document = createDocument(sourceWithLocalLabels("@"));
            const range = new Range(4, 0, 4, 5);
            const diagnostic = new Diagnostic(range, "label <@loop> redefined");
            const actions = new M68kLocalLabelsCodeActionProvider().provideCodeActions(document, range, { diagnostics: [diagnostic], only: undefined, triggerKind: vscode.CodeActionTriggerKind.Invoke });
            expect(actions).to.have.lengthOf(1);
            expect(actions[0].kind).to.be.equal(CodeActionKind.QuickFix);
            expect(actions[0].diagnostics).to.be.eql([diagnostic]);
            expect(actions[0].edit?.get(document.uri)).to.have.lengthOf(4);
        });
        it("Should not provide the quick fix on other errors", function () {
            const document = createDocument(sourceWithLocalLabels("@"));
            const range = new Range(4, 0, 4, 5);
            const diagnostic = new Diagnostic(range, "label <loop> redefined");
            const actions = new M68kLocalLabelsCodeActionProvider().provideCodeActions(document, range, { diagnostics: [diagnostic], only: undefined, triggerKind: vscode.CodeActionTriggerKind.Invoke });
            expect(actions).to.be.empty;
        });
    });

    context("Symbols", function () {
        it("Should scope the '@' local labels to their parent label", function () {
            const file = new SymbolFile(vscode.Uri.file("/local.s"));
            file.readDocument(createDocument(sourceWithLocalLabels("@")));
            const labels = file.getLabels();
            expect(labels.map((l) => l.getLabel())).to.be.eql(["first", "first@loop", "second", "second@loop"]);
            expect(labels[1].isLocalLabel()).to.be.true;
            expect(labels[1].getLocalName()).to.be.equal("loop");
            expect(labels[1].getParent()).to.be.equal("first");
            expect(labels[0].getChildren().map((l) => l.getLabel())).to.be.eql(["first@loop"]);
        });
        it("Should not take a macro unique label as a local label", function () {
            const file = new SymbolFile(vscode.Uri.file("/local.s"));
            file.readDocument(createDocument(SOURCE_WITH_EDGE_CASES));
            const macroLabel = file.getLabels().find((l) => l.getLabel().startsWith("wait"));
            expect(macroLabel?.getLabel()).to.be.equal("wait\\@");
            expect(macroLabel?.isLocalLabel()).to.be.false;
        });
        it("Should refer to the '@' local labels in the data", function () {
            const asmLine = new ASMLine("        dc.w @end-@loop");
            expect(asmLine.getSymbolFromData().map(([s]) => s)).to.be.eql(["@end", "@loop"]);
        });
    });
});
