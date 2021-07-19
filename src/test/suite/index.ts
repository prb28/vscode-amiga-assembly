'use strict';

import * as path from 'path';
import * as Mocha from 'mocha';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NYC = require('nyc');
import * as glob from 'glob';
import * as paths from "path";

const enableCoverage = false;//process.env.DISABLE_COVERAGE !== "true";

// Simulates the recommended config option
// extends: "@istanbuljs/nyc-config-typescript",
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require("@istanbuljs/nyc-config-typescript");
// Recommended modules, loading them here to speed up NYC init
// and minimize risk of race condition
// import 'ts-node/register';
// import 'source-map-support/register';

// Linux: prevent a weird NPE when mocha on Linux requires the window size from the TTY
// Since we are not running in a tty environment, we just implement he method statically
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tty = require('tty');
if (!tty.getWindowSize) {
    tty.getWindowSize = (): number[] => {
        return [80, 75];
    };
}

export async function run(_testsRoot: string): Promise<void> {
    let nyc;
    const testsRoot = path.resolve(__dirname, '..');
    if (enableCoverage) {
        // Setup coverage pre-test, including post-test hook to report
        nyc = new NYC({
            ...baseConfig,
            cwd: path.join(__dirname, '..', '..', '..'),
            reporter: ['text', 'lcov'],
            all: true,
            silent: false,
            instrument: true,
            hookRequire: true,
            hookRunInContext: true,
            hookRunInThisContext: true,
            include: ["out/**/*.js"],
            exclude: ["out/test/**",
                "out/gdbProxy.js",
                "out/gdbProxyWinUAE.js"],
        });
        await nyc.wrap();

        // Check the modules already loaded and warn in case of race condition
        // (ideally, at this point the require cache should only contain one file - this module)
        const myFilesRegex = /vscode-recall\/out/;
        const filterFn = myFilesRegex.test.bind(myFilesRegex);
        if (Object.keys(require.cache).filter(filterFn).length > 1) {
            console.warn('NYC initialized after modules were loaded', Object.keys(require.cache).filter(filterFn));
        }

        // Debug which files will be included/excluded
        // console.log('Glob verification', await nyc.exclude.glob(nyc.cwd));
        await nyc.createTempDirectory();
    }
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'bdd',
        reporter: 'mocha-multi-reporters',
        reporterOptions: {
            reporterEnabled: "spec, mocha-junit-reporter",
            mochaJunitReporterReporterOptions: {
                mochaFile: paths.join(_testsRoot, "..", "..", "test-results.xml")
            }
        },
        color: true,
        timeout: 180000
    });

    // Add all files to the test suite
    const files = glob.sync('**/*.test.js', { cwd: testsRoot });
    files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

    const failures: number = await new Promise(resolve => mocha.run(resolve));
    if (enableCoverage) {
        await nyc.writeCoverageFile();

        // Capture text-summary reporter's output and log it in console
        console.log(await captureStdout(nyc.report.bind(nyc)));
    }
    if (failures > 0) {
        throw new Error(`${failures} tests failed.`);
    }
}

async function captureStdout(fn: () => Promise<void>) {
    const w = process.stdout.write;
    let buffer = '';
    process.stdout.write = (s: string) => { buffer = buffer + s; return true; };
    await fn();
    process.stdout.write = w;
    return buffer;
}