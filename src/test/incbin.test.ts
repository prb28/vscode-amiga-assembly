//
// Issue #370: binary files included with "incbin" are not loaded.
// Builds sources with the bundled vasm through the extension build (VASMCompiler.buildFile)
// and checks that the binary data is in the object file.
//

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { expect } from 'chai';
import { fail } from 'assert';
import { spy, when, reset } from '@johanblumenberg/ts-mockito';
import { VASMCompiler } from '../vasm';
import { FileProxy } from '../fsProxy';
import { ExtensionState } from '../extension';

// Data unlikely to be found elsewhere in a hunk object file
const BINARY_DATA = Buffer.from("INCBIN#370-DATA!");

describe("Incbin Tests", function () {
    let vasm = "";
    let tmpDir = "";
    let buildDir = "";
    let compiler: VASMCompiler;
    let spiedCompiler: VASMCompiler;
    let spiedExtensionState: ExtensionState;
    before(async function () {
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (!ext) {
            fail("Extension no loaded");
        }
        await ext.activate();
        vasm = path.join(ext.extensionPath, "resources", "bin", process.platform, "vasmm68k_mot" + (process.platform === "win32" ? ".exe" : ""));
        if (!fs.existsSync(vasm)) {
            this.skip();
        }
        // Workspace with a space in the path
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "incbin "));
        buildDir = path.join(tmpDir, "build");
        fs.mkdirSync(path.join(tmpDir, "src", "data"), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, "src", "inc"), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, "gfx"), { recursive: true });
        fs.mkdirSync(path.join(tmpDir, "my data"), { recursive: true });
        for (const dir of [["src", "data"], ["src", "inc"], ["gfx"], ["my data"]]) {
            fs.writeFileSync(path.join(tmpDir, ...dir, "bin.dat"), BINARY_DATA);
        }
        compiler = new VASMCompiler();
        spiedCompiler = spy(compiler);
        when(spiedCompiler.getWorkspaceRootDirs()).thenReturn([vscode.Uri.file(tmpDir)]);
        when(spiedCompiler.getBuildDir()).thenReturn(new FileProxy(vscode.Uri.file(buildDir)));
        spiedExtensionState = spy(ExtensionState.getCurrent());
        when(spiedExtensionState.getBuildDir()).thenReturn(new FileProxy(vscode.Uri.file(buildDir)));
    });
    after(function () {
        if (spiedCompiler) {
            reset(spiedCompiler);
        }
        if (spiedExtensionState) {
            reset(spiedExtensionState);
        }
        if (tmpDir) {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });

    /**
     * Builds the source in the workspace with the extension build
     * @return the object file content
     */
    async function build(relativePath: string, source: string): Promise<Buffer> {
        const file = path.join(tmpDir, relativePath);
        fs.writeFileSync(file, source);
        const [objFilename, results] = await compiler.buildFile(VASMCompiler.DEFAULT_BUILD_CONFIGURATION, vscode.Uri.file(file), false);
        expect(results.map((r) => r.msg), "build errors").to.be.empty;
        expect(objFilename).to.not.be.null;
        return fs.readFileSync(objFilename as string);
    }

    const cases: Array<[string, string, string]> = [
        ["a path relative to the source file", "src/rel.s", 'incbin "data/bin.dat"'],
        ["a path relative to the workspace root", "src/root.s", 'incbin "gfx/bin.dat"'],
        ["a path without quotes", "src/noquote.s", 'incbin data/bin.dat'],
        ["a path with backslashes", "src/backslash.s", 'incbin "data\\bin.dat"'],
        ["a path with a space", "src/space.s", 'incbin "../my data/bin.dat"'],
        ["an incdir directory", "src/incdir.s", 'incdir "gfx/"\n incbin "bin.dat"'],
    ];
    for (const [name, sourcePath, directive] of cases) {
        it(`Should load the binary file with ${name}`, async function () {
            const obj = await build(sourcePath, ` section data,data\nstart:\n ${directive}\n`);
            expect(obj.includes(BINARY_DATA), obj.toString("latin1")).to.be.true;
        });
    }
    it("Should load the binary file with an absolute path", async function () {
        const binFile = path.join(tmpDir, "gfx", "bin.dat");
        const obj = await build("src/absolute.s", ` section data,data\nstart:\n incbin "${binFile}"\n`);
        expect(obj.includes(BINARY_DATA)).to.be.true;
    });
    it("Should load the binary file from an included file with a path relative to the main source file", async function () {
        fs.writeFileSync(path.join(tmpDir, "src", "inc", "gfx.i"), ' incbin "inc/bin.dat"\n');
        const obj = await build("src/nested.s", ' section data,data\nstart:\n include "inc/gfx.i"\n');
        expect(obj.includes(BINARY_DATA)).to.be.true;
    });
    it("Should report an error for a path relative to the included file (not searched by vasm)", async function () {
        fs.writeFileSync(path.join(tmpDir, "src", "inc", "gfx-rel.i"), ' incbin "bin.dat"\n');
        const file = path.join(tmpDir, "src", "nested-rel.s");
        fs.writeFileSync(file, ' section data,data\nstart:\n include "inc/gfx-rel.i"\n');
        const [, results] = await compiler.buildFile(VASMCompiler.DEFAULT_BUILD_CONFIGURATION, vscode.Uri.file(file), false);
        expect(results.map((r) => r.msg).join("\n")).to.contain("could not open <bin.dat>");
    });
});
