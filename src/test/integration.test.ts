import * as Path from 'path';
import { DebugClient } from 'vscode-debugadapter-testsupport/lib/main';
import { LaunchRequestArguments } from '../fsUAEDebug';
import * as vscode from 'vscode';
import { ExtensionState } from '../extension';
import * as Net from 'net';
import { WinUAEDebugSession } from '../winUAEDebug';
import temp = require('temp');

describe('Integration test', () => {
    //let tempDir: string;
    const PROJECT_ROOT = Path.join(__dirname, '..', '..').replace(/\\+/g, '/');
    const DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'out', 'debugAdapter.js').replace(/\\+/g, '/');
    const DATA_ROOT = Path.join(PROJECT_ROOT, 'test_files', 'debug').replace(/\\+/g, '/');
    //const FSUAE_ROOT = Path.join(DATA_ROOT, 'fs-uae').replace(/\\+/g, '/');
    //const UAE_DRIVE = Path.join(FSUAE_ROOT, 'hd0').replace(/\\+/g, '/');
    //const SOURCE_FILE_NAME = Path.join(DATA_ROOT, 'gencop.s').replace(/\\+/g, '/');
    const launchArgs = <LaunchRequestArguments>{
        type: "winuae",
        request: "launch",
        name: "WinUAE Debug",
        stopOnEntry: true,
        serverName: "localhost",
        serverPort: 2345,
        startEmulator: true,
        emulator: "${config:amiga-assembly.binDir}/winuae.exe",
        emulatorWorkingDir: "${config:amiga-assembly.binDir}",
        program: "${workspaceFolder}/${command:AskForProgramName}",
        options: [
            "-s",
            "debugging_trigger=SYS:${command:AskForProgramName}",
            "-s",
            "filesystem=rw,dh0:${workspaceFolder}\\uae\\dh0",
            "-s",
            "debugging_features=gdbserver"
        ],
        preLaunchTask: "amigaassembly: build",
        sourceFileMap: {
            "C:\\Users\\paulr\\workspace\\amiga\\projects\\vscode-amiga-wks-example": DATA_ROOT
        }
    };
    let dc: DebugClient;

    before(async function () {
        // Automatically track and cleanup files at exit
        temp.track();
        //tempDir = temp.mkdirSync("tmpDirBinaries");
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
            await ExtensionState.getCurrent().getLanguage();
            // download the binaries
            //await vscode.commands.executeCommand("amiga-assembly.download-binaries");
        }
        // Prepare the workspace

        return new Promise<void>((resolve) => {
            this.server = Net.createServer(socket => {
                this.session = new WinUAEDebugSession();
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
                dc.assertStoppedLocation('entry', { line: 32 })
            ]);
        });
    });
});