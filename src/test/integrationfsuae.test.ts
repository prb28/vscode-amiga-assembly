import * as Path from 'path';
import { DebugClient } from '@vscode/debugadapter-testsupport';
import { DebugSession, LaunchRequestArguments } from '../debugSession';
import * as vscode from 'vscode';
import { ExtensionState } from '../extension';
import * as Net from 'net';
import temp = require('temp');
import { Uri } from 'vscode';
import { WorkspaceManager } from '../workspaceManager';
import { expect } from 'chai';
import { FileProxy } from '../fsProxy';
import path = require('path');
import { VASMCompiler } from '../vasm';
import { VLINKLinker } from '../vlink';

describe('FS-UAE Integration test', () => {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..').replace(/\\+/g, '/');
    const DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'out', 'debugAdapter.js').replace(/\\+/g, '/');
    const launchArgs = <LaunchRequestArguments>{
        type: "amiga-assembly",
        request: "launch",
        name: "FSUAE Debug",
        stopOnEntry: true,
        emulatorType: "fs-uae",
        program: "./uae/dh0/gencop",
        emulatorArgs: [
            "--hard_drive_0=./uae/dh0/",
            "--automatic_input_grab=0"
        ]
    };
    let dc: DebugClient;
    let tempDir: string;

    before(async function () {
        // Automatically track and cleanup files at exit
        temp.track();
        if (process.platform === "win32") {
            launchArgs.emulator = launchArgs.emulator + ".exe";
        }
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        // Wait for downloads
        await vscode.commands.executeCommand('amiga-assembly.download-binaries');
        console.log("Waiting download");
        await ExtensionState.getCurrent().getBinariesManager().waitDownloadEnd();
        console.log("Waiting download END");

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
        ExtensionState.getCurrent().getBinariesManager();
        ExtensionState.getCurrent().setWorkspaceRootDir(workspaceRootDir);
        const vasmBuildProperties = { ...VASMCompiler.DEFAULT_BUILD_CONFIGURATION };
        const vlinkBuildProperties = { ...VLINKLinker.DEFAULT_BUILD_CONFIGURATION };
        vlinkBuildProperties.exefilename = path.join("..", "uae", "dh0", "gencop");
        await vasm.buildWorkspace(undefined, vasmBuildProperties, vlinkBuildProperties);
        launchArgs.program = path.join(tempDir, "uae", "dh0", "gencop");
        launchArgs.emulatorArgs = [
            "--automatic_input_grab=0",
            "--chip_memory=1024",
            `--hard_drive_0=${tempDir}/uae/dh0`,
            "--joystick_port_1=none",
            "--amiga_model=A1200",
            "--slow_memory=1792"
        ]

        launchArgs.options = [];

        return new Promise<void>((resolve) => {
            this.server = Net.createServer(socket => {
                this.session = new DebugSession();
                this.session.setRunAsServer(true);
                this.session.start(<NodeJS.ReadableStream>socket, socket);
                resolve();
            }).listen(0);
            // make VS Code connect to debug server instead of launching debug adapter
            dc = new DebugClient('node', DEBUG_ADAPTER, 'winuae');
            const address: any = this.server.address();
            let port = 0;
            if (address instanceof Object) {
                port = address.port;
            }
            dc.start(port).then(() => { resolve(); });
        });
    });

    after(async function () {
        if (dc) {
            await dc.stop();
        }
    });

    describe('complete workspace test', function () {
        it('should build and debug', function () {
            return Promise.all([
                dc.configurationSequence(),
                dc.launch(launchArgs),
                dc.assertStoppedLocation('entry', { line: 20 })
            ]);
        });
    });
});
