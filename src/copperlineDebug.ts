import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const commonOptions = ['entryPoint', 'symbolFile', 'sourceMap', 'cwd'];
const launchOptions = [
    'args', 'config', 'rom', 'factory', 'model', 'chipset', 'cpu', 'chip', 'fast',
    'slow', 'memoryFill', 'fpu', 'stack', 'ntsc', 'detach', 'emulatorLog',
    'rtcTime', 'headless', 'noAudio', 'coverage', 'timeoutMs'
];
const attachOptions = ['controlInfo', 'address', 'token'];

export class CopperlineConfigurationProvider implements vscode.DebugConfigurationProvider {
    resolveDebugConfigurationWithSubstitutedVariables(
        folder: vscode.WorkspaceFolder | undefined,
        config: vscode.DebugConfiguration
    ): vscode.DebugConfiguration {
        if (config.emulatorType !== 'copperline') {
            return config;
        }

        const options = config.copperlineOptions ?? {};
        if (typeof options !== 'object' || Array.isArray(options)) {
            throw new Error('copperlineOptions must be an object.');
        }
        if (typeof config.program !== 'string' || !config.program.trim()) {
            throw new Error('Copperline needs a program: the local Amiga executable.');
        }
        if (config.request === 'attach' && !options.controlInfo && !(options.address && options.token)) {
            throw new Error('Copperline attach needs copperlineOptions.controlInfo, or address and token.');
        }

        const resolved = { ...config };
        delete resolved.copperlineOptions;
        // Only adapter arguments are copied; VS Code's session metadata stays intact.
        for (const key of [...commonOptions, ...(config.request === 'attach' ? attachOptions : launchOptions)]) {
            if (options[key] !== undefined) {
                resolved[key] = options[key];
            }
        }
        resolved.stopOnEntry = config.noDebug ? false : (config.stopOnEntry ?? (config.request === 'launch'));
        if (config.request === 'launch') {
            if (config.emulatorBin) {
                resolved.copperline = config.emulatorBin;
            }
            if (config.emulatorArgs) {
                resolved.extraArgs = config.emulatorArgs;
            }
        }
        if (resolved.cwd || folder) {
            resolved.cwd = path.resolve(folder?.uri.fsPath ?? process.cwd(), resolved.cwd ?? '.');
        }
        return resolved;
    }
}

// copperline-ctl ships in the same folder as copperline, so emulatorBin is enough to find it.
function adapterBesideEmulator(emulatorBin: unknown): string {
    if (typeof emulatorBin !== 'string' || !emulatorBin.trim()) {
        return 'copperline-ctl';
    }
    const dir = path.dirname(emulatorBin);
    if (dir === '.' && !/^\.[\\/]/.test(emulatorBin)) {
        return 'copperline-ctl'; // bare command name: both are looked up on PATH
    }
    const ext = path.extname(emulatorBin).toLowerCase() === '.exe' ? '.exe' : '';
    return path.join(dir, `copperline-ctl${ext}`);
}

function executableExists(command: string): boolean {
    const isPath = path.isAbsolute(command) || /[\\/]/.test(command);
    const candidates = isPath
        ? [command]
        : (process.env.PATH ?? '').split(path.delimiter).filter(Boolean).map((dir) => path.join(dir, command));
    const exts = process.platform === 'win32' && !path.extname(command)
        ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT').split(';').concat('')
        : [''];
    return candidates.some((candidate) => exts.some((ext) => {
        try {
            return fs.statSync(candidate + ext).isFile();
        } catch {
            return false;
        }
    }));
}

/**
 * Throws a user-facing error when the copperline-ctl adapter cannot be found,
 * so VS Code shows an error dialog instead of the session dying silently.
 */
export function checkCopperlineAdapterExists(adapter: vscode.DebugAdapterExecutable): void {
    if (!executableExists(adapter.command)) {
        throw new Error(
            `Copperline debug adapter not found: '${adapter.command}'. ` +
            "Install Copperline and set 'emulatorBin' (or 'copperlineAdapter') in your launch configuration."
        );
    }
}

export function createCopperlineDebugAdapter(config: vscode.DebugConfiguration): vscode.DebugAdapterExecutable {
    const command = config.copperlineAdapter ?? adapterBesideEmulator(config.emulatorBin);
    if (typeof command !== 'string' || !command.trim()) {
        throw new Error('copperlineAdapter must name the copperline-ctl executable (without --dap).');
    }
    return new vscode.DebugAdapterExecutable(command, ['--dap'], { cwd: config.cwd });
}
