import { expect } from 'chai';
import * as path from 'path';
import * as vscode from 'vscode';
import { CopperlineConfigurationProvider, createCopperlineDebugAdapter } from '../copperlineDebug';
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

    it('selects an executable adapter only for the Copperline target', () => {
        const factory = new InlineDebugAdapterFactory();
        const descriptor = (type: string, emulatorType?: string) => factory.createDebugAdapterDescriptor({ type, configuration: config({ type, emulatorType }) } as vscode.DebugSession);
        expect(descriptor('amiga-assembly', 'copperline')).to.be.instanceOf(vscode.DebugAdapterExecutable);
        for (const type of ['amiga-assembly', 'fs-uae', 'winuae']) {
            expect(descriptor(type)).to.be.instanceOf(vscode.DebugAdapterInlineImplementation);
        }
        expect(descriptor('fs-uae', 'copperline')).to.be.instanceOf(vscode.DebugAdapterInlineImplementation);
    });
});
