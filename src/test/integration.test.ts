import * as Path from 'path';
import * as fs from 'fs';
import { DebugClient } from '@vscode/debugadapter-testsupport';
import { LaunchRequestArguments } from '../debugSession';
import * as vscode from 'vscode';
import { ExtensionState } from '../extension';
import * as Net from 'net';
import { DebugSession } from '../debugSession';
import temp = require('temp');
import { Uri } from 'vscode';
import { WorkspaceManager } from '../workspaceManager';
import { expect } from 'chai';
import { FileProxy } from '../fsProxy';
import path = require('path');
import { VASMCompiler } from '../vasm';
import { VLINKLinker } from '../vlink';

describe('WinUAE Integration test', () => {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..').replace(/\\+/g, '/');
    const DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'out', 'debugAdapter.js').replace(/\\+/g, '/');
    const launchArgs = <LaunchRequestArguments>{
        type: "amiga-assembly",
        request: "launch",
        name: "WinUAE Debug",
        stopOnEntry: true,
        program: "./uae/dh0/gencop",
        emulatorType: "winuae",
        remoteProgram: "SYS:gencop",
        emulatorArgs: [
        ],
    };
    let dc: DebugClient;
    let tempDir: string;

    before(async function () {
        if (process.platform === "win32") {
            // Automatically track and cleanup files at exit
            temp.track();
            // activate the extension
            const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
            if (ext) {
                await ext.activate();
            }
            // Prepare the workspace
            // create a temp dir
            tempDir = temp.mkdirSync("exampleProject");
            const workspaceManager = new WorkspaceManager();
            const context = ExtensionState.getCurrent().getExtensionContext();
            const version = ExtensionState.getCurrent().getExtensionVersion();
            if (!context) {
                expect.fail("Context not defined");
            }
            const workspaceRootDir = Uri.file(tempDir);
            await workspaceManager.createExampleWorkspace(context, version, workspaceRootDir);
            const expFile = new FileProxy(Uri.file(path.join(tempDir, "gencop.s")));
            // tslint:disable-next-line: no-unused-expression
            expect(await expFile.exists()).to.be.true;
            //build the workspace
            const vasm = ExtensionState.getCurrent().getCompiler();
            ExtensionState.getCurrent().forceBuildDir(new FileProxy(Uri.file(path.join(tempDir, "build"))));
            ExtensionState.getCurrent().setWorkspaceRootDir(workspaceRootDir);
            const vasmBuildProperties = { ...VASMCompiler.DEFAULT_BUILD_CONFIGURATION };
            const vlinkBuildProperties = { ...VLINKLinker.DEFAULT_BUILD_CONFIGURATION };
            vlinkBuildProperties.exefilename = path.join("..", "uae", "dh0", "gencop");
            await vasm.buildWorkspace(undefined, vasmBuildProperties, vlinkBuildProperties);
            launchArgs.program = path.join(tempDir, "uae", "dh0", "gencop");
            launchArgs.emulatorArgs = [];
            launchArgs.emulatorArgs.push("-s");
            launchArgs.emulatorArgs.push(`quickstart=a500,1`);
            launchArgs.emulatorArgs.push("-s");
            launchArgs.emulatorArgs.push(`filesystem=rw,dh0:${tempDir}\\uae\\dh0`);
            return new Promise<void>((resolve) => {
                this.server = Net.createServer(socket => {
                    this.session = new DebugSession();
                    this.session.setRunAsServer(true);
                    this.session.start(<NodeJS.ReadableStream>socket, socket);
                    resolve();
                }).listen(0);
                // make VS Code connect to debug server instead of launching debug adapter
                dc = new DebugClient('node', DEBUG_ADAPTER, 'amiga-assembly');
                const address = this.server.address();
                let port = 0;
                if (address instanceof Object) {
                    port = address.port;
                }
                dc.start(port).then(() => { resolve(); });
            });
        }
    });

    after(async function () {
        if (dc) {
            await dc.stop();
        }
        let i = 0;
        let deleted = false;
        while (i < 50 && !deleted) {
            try {
                fs.rmSync(tempDir, { recursive: true });
                deleted = !fs.existsSync(tempDir);
            } catch (err) {
                // do nothing
            }
            await new Promise((resolve): void => {
                setTimeout(resolve, 100);
            });
            i++;
        }
    });

    describe('complete workspace test', function () {
        if (process.platform === "win32") {
            it('should build and debug', function () {
                return Promise.all([
                    dc.configurationSequence(),
                    dc.launch(launchArgs),
                    dc.assertStoppedLocation('entry', { line: 21 })
                ]);
            });
        }
    });
});
