import * as path from 'path';

import {
    downloadAndUnzipVSCode,
    runTests
} from '@vscode/test-electron';
import { TestOptions } from '@vscode/test-electron/out/runTest';

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to the extension test runner script
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        const vscodeExecutablePath = await downloadAndUnzipVSCode('stable');

        // Download VS Code, unzip it and run the integration test
        await runTests(<TestOptions>{
            // Use the specified `code` executable
            vscodeExecutablePath,
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: ["--disable-extensions", "--disable-workspace-trust"]
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();