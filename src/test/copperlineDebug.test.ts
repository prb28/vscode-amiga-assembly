import { expect } from 'chai';
import * as path from 'path';
import * as vscode from 'vscode';
import { DebugProtocol } from '@vscode/debugprotocol';
import {
    CopperlineConfigurationProvider, CopperlineDebugAdapterTrackerFactory, CopperlineDisassembledMemoryTracker,
    createCopperlineDebugAdapter
} from '../copperlineDebug';
import { ConfigurationHelper } from '../configurationHelper';
import { LaunchRequestArguments, prepareLaunchRequestArgs } from '../debugSession';
import { InlineDebugAdapterFactory } from '../extension';

describe('Copperline debug configuration', () => {
    const provider = new CopperlineConfigurationProvider();
    const config = (extra = {}): vscode.DebugConfiguration => ({
        type: 'amiga-assembly', request: 'launch', name: 'Copperline',
        emulatorType: 'copperline', program: '/project/myprogram', ...extra
    });
    const resolve = (extra = {}) => provider.resolveDebugConfigurationWithSubstitutedVariables(undefined, config(extra));

    for (const emulatorType of [undefined, 'fs-uae', 'winuae']) {
        it(`leaves ${emulatorType ?? 'default UAE'} configurations untouched`, () => {
            const original = config({ emulatorType });
            expect(provider.resolveDebugConfigurationWithSubstitutedVariables(undefined, original)).to.equal(original);
        });
    }

    it('maps launch options without losing VS Code fields or mutating the input', () => {
        const options = { model: 'A1200', fast: '8M', factory: true, headless: true, args: ['hello world'], sourceMap: { '/build': '/project' } };
        const original = config({ emulatorBin: '/Tools/Copperline/copperline', emulatorArgs: ['--rtc-frozen'], copperlineOptions: options, preLaunchTask: 'build', __sessionId: '123' });
        const resolved = provider.resolveDebugConfigurationWithSubstitutedVariables(undefined, original);
        expect(resolved).to.include({ copperline: original.emulatorBin, preLaunchTask: 'build', __sessionId: '123', stopOnEntry: true, model: 'A1200', fast: '8M', factory: true, headless: true });
        expect(resolved.extraArgs).to.deep.equal(['--rtc-frozen']);
        expect(resolved.args).to.deep.equal(['hello world']);
        expect(resolved.sourceMap).to.deep.equal(options.sourceMap);
        expect(resolved).not.to.have.property('copperlineOptions');
        expect(original.copperlineOptions).to.equal(options);
        expect(original).not.to.have.property('model');
    });

    it('does not let nested options overwrite the session or program', () => {
        const resolved = resolve({ copperlineOptions: { type: 'other', request: 'attach', program: 'other', emulatorType: 'winuae', debugServer: 1234 } });
        expect(resolved).to.include({ type: 'amiga-assembly', request: 'launch', program: '/project/myprogram', emulatorType: 'copperline' });
        expect(resolved).not.to.have.property('debugServer');
    });

    for (const request of ['launch', 'attach']) {
        it(`preserves ${request} stopOnEntry defaults and explicit values`, () => {
            const options = { request, copperlineOptions: { controlInfo: '/session.json' } };
            expect(resolve(options).stopOnEntry).to.equal(request === 'launch');
            for (const stopOnEntry of [true, false]) {
                expect(resolve({ ...options, stopOnEntry }).stopOnEntry).to.equal(stopOnEntry);
                expect(resolve({ ...options, stopOnEntry, noDebug: true }).stopOnEntry).to.equal(false);
            }
        });
    }

    it('uses the attach default with an address and token', () => {
        const resolved = resolve({ request: 'attach', copperlineOptions: { address: '127.0.0.1:1234', token: 'test-token' } });
        expect(resolved.stopOnEntry).to.equal(false);
    });

    it('uses the selected workspace folder, including a relative working directory', () => {
        const folder = { uri: vscode.Uri.file(path.resolve('second-workspace')), name: 'second', index: 1 };
        expect(provider.resolveDebugConfigurationWithSubstitutedVariables(folder, config()).cwd).to.equal(folder.uri.fsPath);
        const resolved = provider.resolveDebugConfigurationWithSubstitutedVariables(folder, config({ copperlineOptions: { cwd: 'build' } }));
        expect(resolved.cwd).to.equal(path.join(folder.uri.fsPath, 'build'));
    });

    it('maps control-info attach options and keeps launch settings out', () => {
        const resolved = resolve({ request: 'attach', emulatorBin: '/emulator', emulatorArgs: ['--factory'], copperlineOptions: { controlInfo: '/session.json', symbolFile: '/program.elf', sourceMap: { '/old': '/new' }, headless: true } });
        expect(resolved).to.include({ controlInfo: '/session.json', symbolFile: '/program.elf' });
        expect(resolved).not.to.have.property('copperline');
        expect(resolved).not.to.have.property('extraArgs');
        expect(resolved).not.to.have.property('headless');
    });

    it('maps an address and token for attach', () => {
        const resolved = resolve({ request: 'attach', copperlineOptions: { address: '127.0.0.1:1234', token: 'test-token' } });
        expect(resolved).to.include({ address: '127.0.0.1:1234', token: 'test-token' });
    });

    it('rejects attach without a complete connection description', () => {
        for (const copperlineOptions of [{}, { address: '127.0.0.1:1234' }, { token: 'test-token' }]) {
            expect(() => resolve({ request: 'attach', copperlineOptions })).to.throw('Copperline attach needs');
        }
    });

    it('rejects a missing program or malformed options', () => {
        expect(() => resolve({ program: '' })).to.throw('Copperline needs a program');
        expect(() => resolve({ copperlineOptions: [] })).to.throw('copperlineOptions must be an object');
        expect(() => resolve({ copperlineOptions: 'bad' })).to.throw('copperlineOptions must be an object');
    });

    it('starts the adapter directly with --dap and preserves executable paths with spaces', () => {
        const defaultAdapter = createCopperlineDebugAdapter(resolve());
        expect(defaultAdapter.command).to.equal('copperline-ctl');
        expect(defaultAdapter.args).to.deep.equal(['--dap']);
        const command = path.join(path.resolve('Tools with spaces'), 'copperline-ctl');
        const cwd = path.resolve('workspace');
        const adapter = createCopperlineDebugAdapter(resolve({ copperlineAdapter: command, copperlineOptions: { cwd } }));
        expect(adapter.command).to.equal(command);
        expect(adapter.args).to.deep.equal(['--dap']);
        expect(adapter.options?.cwd).to.equal(cwd);
        expect(() => createCopperlineDebugAdapter(resolve({ copperlineAdapter: '' }))).to.throw('copperlineAdapter must name');
    });

    it('finds copperline-ctl beside emulatorBin unless copperlineAdapter overrides it', () => {
        const dir = path.resolve('Tools with spaces');
        const beside = (bin: string, extra = {}) => createCopperlineDebugAdapter(resolve({ emulatorBin: bin, ...extra })).command;
        expect(beside(path.join(dir, 'copperline'))).to.equal(path.join(dir, 'copperline-ctl'));
        expect(beside(path.join(dir, 'copperline.exe'))).to.equal(path.join(dir, 'copperline-ctl.exe'));
        expect(beside('copperline')).to.equal('copperline-ctl');
        expect(beside(path.join(dir, 'copperline'), { copperlineAdapter: '/other/copperline-ctl' })).to.equal('/other/copperline-ctl');
    });

    it('selects an executable adapter only for the Copperline target', () => {
        const factory = new InlineDebugAdapterFactory();
        // Any existing file works as the adapter: only its presence is checked.
        const copperlineAdapter = __filename;
        const descriptor = (type: string, emulatorType?: string) => factory.createDebugAdapterDescriptor({ type, configuration: config({ type, emulatorType, copperlineAdapter }) } as vscode.DebugSession);
        expect(descriptor('amiga-assembly', 'copperline')).to.be.instanceOf(vscode.DebugAdapterExecutable);
        for (const type of ['amiga-assembly', 'fs-uae', 'winuae']) {
            expect(descriptor(type)).to.be.instanceOf(vscode.DebugAdapterInlineImplementation);
        }
        expect(descriptor('fs-uae', 'copperline')).to.be.instanceOf(vscode.DebugAdapterInlineImplementation);
    });

    it('reports a missing adapter instead of failing silently', () => {
        const factory = new InlineDebugAdapterFactory();
        const missing = path.join(path.resolve('does not exist'), 'copperline-ctl');
        const session = { type: 'amiga-assembly', configuration: config({ copperlineAdapter: missing }) } as vscode.DebugSession;
        expect(() => factory.createDebugAdapterDescriptor(session)).to.throw('Copperline debug adapter not found');
    });
});

describe('Copperline memory formats', () => {
    const provider = new CopperlineConfigurationProvider();
    const resolve = (request = 'launch') => provider.resolveDebugConfigurationWithSubstitutedVariables(undefined, {
        type: 'amiga-assembly', request, name: 'Copperline', emulatorType: 'copperline', program: '/project/myprogram',
        copperlineOptions: { controlInfo: '/session.json' }
    });
    const settings = ['display.memoryFormat.hover', 'display.memoryFormat.watch'];
    const setFormat = (key: string, value: string | undefined) =>
        ConfigurationHelper.getDefaultConfiguration(null).update(key, value, vscode.ConfigurationTarget.Global);
    // The defaults of the display.memoryFormat settings: 'm ${symbol},24,2,4' and 'm ${symbol},104,2,4'.
    const hover = { length: 24, wordLength: 2, rowLength: 4, mode: 'ab' };
    const watch = { length: 104, wordLength: 2, rowLength: 4, mode: 'ab' };

    afterEach(async () => {
        for (const key of settings) {
            await setFormat(key, undefined);
        }
    });

    for (const request of ['launch', 'attach']) {
        it(`passes the hover and watch settings to ${request}`, () => {
            expect(resolve(request).memoryFormats).to.deep.equal({ hover, watch });
        });
    }

    it('parses the settings as the UAE launch does', async () => {
        await setFormat('display.memoryFormat.hover', 'm ${symbol},32,4,8,b');
        const uae = prepareLaunchRequestArgs({ type: 'amiga-assembly', program: '/project/myprogram' } as LaunchRequestArguments);
        expect(uae.memoryFormats).to.deep.equal({ hover: { length: 32, wordLength: 4, rowLength: 8, mode: 'b' }, watch });
        expect(resolve().memoryFormats).to.deep.equal(uae.memoryFormats);
    });

    it('leaves out a setting that is empty or fails to parse', async () => {
        await setFormat('display.memoryFormat.hover', '');
        expect(resolve().memoryFormats).to.deep.equal({ watch });
        await setFormat('display.memoryFormat.watch', 'xyz');
        expect(resolve()).not.to.have.property('memoryFormats');
    });

    it('drops a missing length so the adapter keeps its default', async () => {
        await setFormat('display.memoryFormat.watch', 'm ${symbol}');
        expect(resolve().memoryFormats).to.deep.equal({ hover, watch: { wordLength: 2, rowLength: 4, mode: 'ab' } });
    });
});

describe('Copperline DISASSEMBLED MEMORY', () => {
    type Request = { command: string; args: unknown };
    type Reply = (command: string, args: unknown) => Promise<unknown>;

    const instructions = (address: string): DebugProtocol.DisassembledInstruction[] => [
        { address, instruction: 'MOVEQ #$1,D0 ; 4 cyc', instructionBytes: '7001' },
        { address: `${address}+2`, instruction: 'ADDQ.L #$1,D0 ; 8 cyc', instructionBytes: '5280' }
    ];
    // Replies as copperline-ctl would, at the PC pcs() returns.
    const replyAt = (pcs: () => string | undefined): Reply => async (command, args) => {
        if (command === 'stackTrace') {
            return { stackFrames: [{ id: 1, name: 'start', line: 3, column: 0, instructionPointerReference: pcs() }] };
        }
        return { instructions: instructions((args as DebugProtocol.DisassembleArguments).memoryReference) };
    };
    const stopped = (threadId?: number): DebugProtocol.StoppedEvent => ({
        seq: 1, type: 'event', event: 'stopped', body: { reason: 'step', threadId }
    });
    // Lets the replies of the fake session, and what they trigger, run.
    const settle = () => new Promise(resolve => setImmediate(resolve));

    function tracker(reply: Reply) {
        const requests: Request[] = [];
        const shown: DebugProtocol.DisassembledInstruction[][] = [];
        const session = {
            type: 'amiga-assembly', configuration: { emulatorType: 'copperline' },
            customRequest: (command: string, args: unknown) => {
                requests.push({ command, args });
                return reply(command, args);
            }
        } as unknown as vscode.DebugSession;
        const instance = new CopperlineDisassembledMemoryTracker(session, async (lines) => {
            shown.push(lines);
        });
        return { instance, requests, shown };
    }

    it('creates a tracker only for Copperline sessions', () => {
        const factory = new CopperlineDebugAdapterTrackerFactory();
        for (const emulatorType of ['copperline', 'fs-uae', 'winuae', undefined]) {
            const session = { type: 'amiga-assembly', configuration: { emulatorType } } as unknown as vscode.DebugSession;
            const created = factory.createDebugAdapterTracker(session);
            if (emulatorType === 'copperline') {
                expect(created).to.be.instanceOf(CopperlineDisassembledMemoryTracker);
            } else {
                expect(created).to.equal(undefined);
            }
        }
    });

    it('disassembles 25 instructions from the PC at a stop', async () => {
        const { instance, requests, shown } = tracker(replyAt(() => '0x00c00000'));
        instance.onDidSendMessage(stopped());
        await settle();
        expect(requests).to.deep.equal([
            { command: 'stackTrace', args: { threadId: 1, levels: 1 } },
            { command: 'disassemble', args: { memoryReference: '0x00c00000', instructionCount: 25 } }
        ]);
        expect(shown).to.deep.equal([instructions('0x00c00000')]);
    });

    it('asks for the thread the stop names', async () => {
        const { instance, requests } = tracker(replyAt(() => '0x00c00000'));
        instance.onDidSendMessage(stopped(2));
        await settle();
        expect(requests[0]).to.deep.equal({ command: 'stackTrace', args: { threadId: 2, levels: 1 } });
    });

    it('ignores other events and responses', async () => {
        const { instance, requests } = tracker(replyAt(() => '0x00c00000'));
        instance.onDidSendMessage({ seq: 1, type: 'event', event: 'continued', body: { threadId: 1 } } as DebugProtocol.ContinuedEvent);
        instance.onDidSendMessage({ seq: 2, type: 'event', event: 'output', body: { output: 'stopped' } } as DebugProtocol.OutputEvent);
        instance.onDidSendMessage({ seq: 3, type: 'response', request_seq: 1, success: true, command: 'stopped' } as DebugProtocol.Response);
        await settle();
        expect(requests).to.deep.equal([]);
    });

    it('disassembles again only when the PC moves', async () => {
        let pc = '0x00c00000';
        const { instance, requests, shown } = tracker(replyAt(() => pc));
        instance.onDidSendMessage(stopped(1));
        await settle();
        instance.onDidSendMessage(stopped(1));
        await settle();
        pc = '0x00c00002';
        instance.onDidSendMessage(stopped(1));
        await settle();
        expect(requests.map(request => request.command)).to.deep.equal(['stackTrace', 'disassemble', 'stackTrace', 'stackTrace', 'disassemble']);
        expect(shown).to.deep.equal([instructions('0x00c00000'), instructions('0x00c00002')]);
    });

    it('keeps the latest stop when an earlier reply arrives late', async () => {
        let releaseFirst: () => void = () => undefined;
        const firstReply = new Promise<void>(resolve => { releaseFirst = resolve; });
        let stops = 0;
        const quick = replyAt(() => stops === 1 ? '0x00c00000' : '0x00c00010');
        const { instance, shown } = tracker(async (command, args) => {
            if (command === 'stackTrace' && ++stops === 1) {
                await firstReply;
            }
            return quick(command, args);
        });
        instance.onDidSendMessage(stopped(1));
        instance.onDidSendMessage(stopped(1));
        await settle();
        releaseFirst();
        await settle();
        expect(shown).to.deep.equal([instructions('0x00c00010')]);
    });

    it('leaves the view alone when a request fails or the frame has no PC', async () => {
        const failing = tracker(async () => { throw new Error('not stopped'); });
        failing.instance.onDidSendMessage(stopped(1));
        await settle();
        expect(failing.shown).to.deep.equal([]);

        const noPc = tracker(replyAt(() => undefined));
        noPc.instance.onDidSendMessage(stopped(1));
        await settle();
        expect(noPc.requests.map(request => request.command)).to.deep.equal(['stackTrace']);
        expect(noPc.shown).to.deep.equal([]);
    });
});
