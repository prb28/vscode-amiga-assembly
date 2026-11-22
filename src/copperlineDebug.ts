import { DebugProtocol } from '@vscode/debugprotocol';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as winston from 'winston';
import { memoryFormatsFromSettings } from './debugSession';

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
        const memoryFormats = copperlineMemoryFormats();
        if (memoryFormats) {
            resolved.memoryFormats = memoryFormats;
        }
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

/**
 * The display.memoryFormat settings as the adapter's memoryFormats argument: the dumps a hover
 * and a Watch entry on a label show, in the shape the UAE adapter takes. A field that parses to
 * NaN (a format without a length) is dropped, so the adapter keeps its own default for it.
 */
function copperlineMemoryFormats(): Record<string, object> | undefined {
    const formats: Record<string, object> = {};
    for (const [kind, format] of Object.entries(memoryFormatsFromSettings())) {
        formats[kind] = Object.fromEntries(
            Object.entries(format).filter(([, value]) => typeof value !== 'number' || Number.isFinite(value))
        );
    }
    return Object.keys(formats).length ? formats : undefined;
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

/** Instructions the DISASSEMBLED MEMORY view shows from the PC, as in a UAE session. */
const DISASSEMBLED_MEMORY_INSTRUCTIONS = 25;

export type ShowDisassembledMemory = (instructions: DebugProtocol.DisassembledInstruction[]) => Thenable<unknown>;

const showDisassembledMemory: ShowDisassembledMemory = (instructions) =>
    vscode.commands.executeCommand('disassembledMemory.setDisassembledMemory', instructions);

/**
 * Fills the DISASSEMBLED MEMORY view at each stop of a Copperline session. A UAE session fills it
 * from inside its inline adapter; copperline-ctl is an external adapter, so the view is filled
 * from its replies to the standard stackTrace and disassemble requests.
 */
export class CopperlineDisassembledMemoryTracker implements vscode.DebugAdapterTracker {
    /** Counts stops, so that a late reply for an earlier stop cannot replace a later one. */
    private stops = 0;
    /** The PC the view was last filled from; a stop at the same PC keeps it, as in a UAE session. */
    private shownPc?: string;

    constructor(
        private readonly session: vscode.DebugSession,
        private readonly show: ShowDisassembledMemory = showDisassembledMemory
    ) { }

    onDidSendMessage(message: DebugProtocol.ProtocolMessage): void {
        if (message.type !== 'event' || (message as DebugProtocol.Event).event !== 'stopped') {
            return;
        }
        const stop = ++this.stops;
        const threadId = (message as DebugProtocol.StoppedEvent).body?.threadId ?? 1;
        this.update(stop, threadId).catch((error) => {
            // The session may have resumed or ended before the replies came back.
            winston.debug(`Copperline DISASSEMBLED MEMORY not updated: ${error}`);
        });
    }

    private async update(stop: number, threadId: number): Promise<void> {
        const trace: DebugProtocol.StackTraceResponse['body'] | undefined =
            await this.session.customRequest('stackTrace', { threadId, levels: 1 });
        const pc = trace?.stackFrames?.[0]?.instructionPointerReference;
        if (stop !== this.stops || !pc || pc === this.shownPc) {
            return;
        }
        const disassembly: DebugProtocol.DisassembleResponse['body'] | undefined =
            await this.session.customRequest('disassemble', {
                memoryReference: pc,
                instructionCount: DISASSEMBLED_MEMORY_INSTRUCTIONS,
            });
        if (stop !== this.stops || !disassembly) {
            return;
        }
        this.shownPc = pc;
        await this.show(disassembly.instructions);
    }
}

export class CopperlineDebugAdapterTrackerFactory implements vscode.DebugAdapterTrackerFactory {
    createDebugAdapterTracker(session: vscode.DebugSession): vscode.DebugAdapterTracker | undefined {
        if (session.configuration.emulatorType !== 'copperline') {
            return undefined;
        }
        return new CopperlineDisassembledMemoryTracker(session);
    }
}
