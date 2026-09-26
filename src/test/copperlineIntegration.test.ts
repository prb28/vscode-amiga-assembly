import { expect } from 'chai';
import { ChildProcess, execFileSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { DebugProtocol } from '@vscode/debugprotocol';

// Opt in with COPPERLINE_INTEGRATION=1; the normal suite needs no Copperline install.
describe('Copperline integration', function () {
    this.timeout(120000);
    let directory: string;
    let program: string;
    let source: string;
    let emulator: ChildProcess | undefined;
    let session: vscode.DebugSession | undefined;
    let tracker: vscode.Disposable;
    let sessionListener: vscode.Disposable;
    let terminationListener: vscode.Disposable;
    const terminated = new Set<string>();
    const events: DebugProtocol.Event[] = [];
    const breakpoints: vscode.Breakpoint[] = [];
    const adapter = process.env.COPPERLINE_CTL ?? 'copperline-ctl';
    const binary = process.env.COPPERLINE_BIN ?? 'copperline';

    async function until<T>(read: () => T | undefined, description: string): Promise<T> {
        const deadline = Date.now() + 90000;
        while (Date.now() < deadline) {
            const value = read();
            if (value !== undefined) return value;
            await new Promise(resolve => setTimeout(resolve, 25));
        }
        throw new Error(`Timed out waiting for ${description}: ${JSON.stringify(events)}`);
    }

    function stopped(after = 0): Promise<DebugProtocol.Event> {
        return until(() => events.slice(after).find(event => event.event === 'stopped'), 'a stopped event');
    }

    before(async function () {
        if (process.env.COPPERLINE_INTEGRATION !== '1') this.skip();
        await vscode.extensions.getExtension('prb28.amiga-assembly')?.activate();
        directory = fs.mkdtempSync(path.join(os.tmpdir(), 'copperline debug '));
        program = path.join(directory, 'program');
        source = path.join(directory, 'program.s');
        fs.writeFileSync(source, '    section code,code\nstart:\n    moveq #1,d0\n    addq.l #1,d0\n    addq.l #1,d0\nloop:\n    bra.s loop\n');
        const assembler = process.env.VASM ?? path.resolve(__dirname, '../../resources/bin', process.platform, `vasmm68k_mot${process.platform === 'win32' ? '.exe' : ''}`);
        execFileSync(assembler, ['-Fhunkexe', '-linedebug', '-o', program, source]);
        tracker = vscode.debug.registerDebugAdapterTrackerFactory('amiga-assembly', {
            createDebugAdapterTracker(debugSession) {
                if (debugSession.configuration.emulatorType !== 'copperline') return undefined;
                return { onDidSendMessage(message: DebugProtocol.Event) {
                    if (message.type === 'event') events.push(message);
                } };
            }
        });
        sessionListener = vscode.debug.onDidStartDebugSession(started => {
            if (started.configuration.emulatorType === 'copperline') session = started;
        });
        terminationListener = vscode.debug.onDidTerminateDebugSession(ended => terminated.add(ended.id));
    });

    afterEach(async () => {
        if (session) {
            await vscode.debug.stopDebugging(session);
            session = undefined;
        }
        if (emulator) {
            const child = emulator;
            emulator = undefined;
            if (child.exitCode === null && child.signalCode === null) {
                const exited = new Promise<void>(resolve => child.once('exit', () => resolve()));
                child.kill('SIGKILL');
                await exited;
            }
        }
        vscode.debug.removeBreakpoints(breakpoints.splice(0));
        events.length = 0;
    });

    after(() => {
        tracker?.dispose();
        sessionListener?.dispose();
        terminationListener?.dispose();
        if (directory) fs.rmSync(directory, { recursive: true, force: true });
    });

    function configuration(request: string, copperlineOptions = {}): vscode.DebugConfiguration {
        return { type: 'amiga-assembly', request, name: `Copperline ${request} test`,
            emulatorType: 'copperline', program, copperlineAdapter: adapter,
            emulatorBin: binary, stopOnEntry: true, copperlineOptions };
    }

    async function startEmulator() {
        const controlInfo = path.join(directory, 'control.json');
        fs.rmSync(controlInfo, { force: true });
        emulator = spawn(binary, ['--factory', '--noaudio', '--control', ':0', '--control-info', controlInfo, '--run', program], { cwd: directory, stdio: 'ignore' });
        const info = await until(() => {
            try { return JSON.parse(fs.readFileSync(controlInfo, 'utf8')) as { listen: string; token: string }; }
            catch { return undefined; }
        }, 'control endpoint');
        return { controlInfo, ...info };
    }

    it('launches through VS Code, binds source breakpoints, steps and reads memory', async () => {
        const breakpoint = new vscode.SourceBreakpoint(new vscode.Location(vscode.Uri.file(source), new vscode.Position(3, 0)));
        breakpoints.push(breakpoint);
        vscode.debug.addBreakpoints([breakpoint]);
        expect(await vscode.debug.startDebugging(undefined, configuration('launch', {
            factory: true, headless: true, cwd: directory,
            sourceMap: { '/unused/build/path': '${userHome}' }
        }))).to.equal(true);
        await stopped();
        expect(session).not.to.equal(undefined);
        expect(session!.configuration.sourceMap['/unused/build/path']).to.equal(os.homedir());
        const first: DebugProtocol.StackTraceResponse['body'] = await session!.customRequest('stackTrace', { threadId: 1 });
        expect(first.stackFrames[0].line).to.equal(3);
        expect(fs.realpathSync(first.stackFrames[0].source!.path!)).to.equal(fs.realpathSync(source));

        let cursor = events.length;
        await session!.customRequest('continue', { threadId: 1 });
        const hit = await stopped(cursor);
        expect(hit.body.reason).to.equal('breakpoint');
        const stack: DebugProtocol.StackTraceResponse['body'] = await session!.customRequest('stackTrace', { threadId: 1 });
        expect(stack.stackFrames[0].line).to.equal(4);
        const scopes: DebugProtocol.ScopesResponse['body'] = await session!.customRequest('scopes', { frameId: stack.stackFrames[0].id });
        const registers = scopes.scopes.find(scope => scope.name === 'Registers');
        expect(registers).not.to.equal(undefined);
        const vars: DebugProtocol.VariablesResponse['body'] = await session!.customRequest('variables', { variablesReference: registers!.variablesReference });
        expect(vars.variables.some(variable => variable.name.toLowerCase() === 'd0')).to.equal(true);
        const memory: DebugProtocol.ReadMemoryResponse['body'] = await session!.customRequest('readMemory', { memoryReference: stack.stackFrames[0].instructionPointerReference, count: 2 });
        expect(Buffer.from(memory!.data!, 'base64').length).to.equal(2);
        const disassembly: DebugProtocol.DisassembleResponse['body'] = await session!.customRequest('disassemble', { memoryReference: stack.stackFrames[0].instructionPointerReference, instructionCount: 2 });
        expect(disassembly!.instructions.length).to.equal(2);

        cursor = events.length;
        await session!.customRequest('next', { threadId: 1 });
        await stopped(cursor);
        const stepped: DebugProtocol.StackTraceResponse['body'] = await session!.customRequest('stackTrace', { threadId: 1 });
        expect(stepped.stackFrames[0].line).to.equal(5);
        const screenshot = path.join(directory, 'launch.png');
        await session!.customRequest('evaluate', { expression: `!capture.screenshot ${JSON.stringify({ path: screenshot })}`, context: 'repl' });
        expect(fs.statSync(screenshot).size).to.be.greaterThan(100);
        const id = session!.id;
        await vscode.debug.stopDebugging(session);
        session = undefined;
        await until(() => terminated.has(id) ? true : undefined, 'launch termination');
    });

    for (const connection of ['controlInfo', 'address']) {
        it(`attaches with ${connection} and leaves the emulator alive on disconnect`, async () => {
            const info = await startEmulator();
            const { controlInfo } = info;
            const options = connection === 'controlInfo' ? { controlInfo } : { address: info.listen, token: info.token };
            expect(await vscode.debug.startDebugging(undefined, configuration('attach', options))).to.equal(true);
            await stopped();
            const stack: DebugProtocol.StackTraceResponse['body'] = await session!.customRequest('stackTrace', { threadId: 1 });
            expect(stack.stackFrames[0].line).to.equal(3);
            const id = session!.id;
            await vscode.debug.stopDebugging(session);
            session = undefined;
            await until(() => terminated.has(id) ? true : undefined, 'attach termination');
            expect(emulator!.exitCode).to.equal(null);
            expect(emulator!.signalCode).to.equal(null);
            const status = JSON.parse(execFileSync(adapter, ['--info', controlInfo, 'status'], { encoding: 'utf8' }));
            expect(status.result.state).to.equal('paused');
        });
    }

    it('runs to a source breakpoint when attach omits stopOnEntry', async () => {
        const breakpoint = new vscode.SourceBreakpoint(new vscode.Location(vscode.Uri.file(source), new vscode.Position(6, 0)));
        breakpoints.push(breakpoint);
        vscode.debug.addBreakpoints([breakpoint]);
        const { controlInfo } = await startEmulator();
        const config = configuration('attach', { controlInfo });
        delete config.stopOnEntry;
        expect(await vscode.debug.startDebugging(undefined, config)).to.equal(true);
        const hit = await stopped();
        expect(hit.body.reason).to.equal('breakpoint');
        const stack: DebugProtocol.StackTraceResponse['body'] = await session!.customRequest('stackTrace', { threadId: 1 });
        expect(stack.stackFrames[0].line).to.equal(7);
    });
});
