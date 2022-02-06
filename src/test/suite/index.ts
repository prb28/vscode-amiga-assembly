'use strict';

import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
import * as paths from "path";

// Linux: prevent a weird NPE when mocha on Linux requires the window size from the TTY
// Since we are not running in a tty environment, we just implement he method statically
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tty = require('tty');
if (!tty.getWindowSize) {
    tty.getWindowSize = (): number[] => {
        return [80, 75];
    };
}

export async function run(): Promise<void> {
    const testsRoot = path.resolve(__dirname, '..');
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'bdd',
        reporter: 'mocha-multi-reporters',
        reporterOptions: {
            reporterEnabled: "spec, mocha-junit-reporter",
            mochaJunitReporterReporterOptions: {
                mochaFile: paths.join(__dirname, "..", "..", "..", "test-results.xml")
            }
        },
        color: true,
        timeout: 180000
    });

    // Add all files to the test suite
    const files = glob.sync('**/*.test.js', { cwd: testsRoot });
    files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

    const failures: number = await new Promise(resolve => mocha.run(resolve));
    if (failures > 0) {
        throw new Error(`${failures} tests failed.`);
    }
}