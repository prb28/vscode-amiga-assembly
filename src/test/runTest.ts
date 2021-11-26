import * as path from 'path';
import * as cp from 'child_process';

import {
    downloadAndUnzipVSCode,
    resolveCliPathFromVSCodeExecutablePath,
    runTests
} from 'vscode-test';
import { TestOptions } from 'vscode-test/out/runTest';

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to the extension test runner script
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        const vscodeExecutablePath = await downloadAndUnzipVSCode('stable');
        const cliPath = resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);

        // Use cp.spawn / cp.exec for custom setup
        cp.spawnSync(cliPath, ['--install-extension', 'mindaro-dev.file-downloader'], {
            encoding: 'utf-8',
            stdio: 'inherit'
        });
        // Download VS Code, unzip it and run the integration test
        await runTests(<TestOptions>{
            // Use the specified `code` executable
            vscodeExecutablePath,
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: ["--disable-workspace-trust", "--trace-deprecation"]
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();