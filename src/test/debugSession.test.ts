import { expect } from 'chai';
import * as path from 'path';
import * as vscode from 'vscode';
import {
    defaultVasmBinaryPath, LaunchRequestArguments, prepareLaunchRequestArgs, TrimmedSourceConstantResolver
} from '../debugSession';

describe('UAE debug session launch arguments', () => {
    before(async () => {
        await vscode.extensions.getExtension('prb28.amiga-assembly')?.activate();
    });

    const launch = (extra = {}) =>
        prepareLaunchRequestArgs({ type: 'amiga-assembly', program: '/project/myprogram', ...extra } as LaunchRequestArguments);

    it('uses the vasm binary of the extension to read the source constants', () => {
        const binaryPath = defaultVasmBinaryPath();
        expect(binaryPath).to.be.a('string');
        expect(launch().vasm).to.deep.equal({ binaryPath });
    });

    it('keeps the vasm options of the launch configuration', () => {
        expect(launch({ vasm: { binaryPath: '/my/vasm', args: ['-Iinc'] } }).vasm).to.deep.equal({ binaryPath: '/my/vasm', args: ['-Iinc'] });
        expect(launch({ vasm: { args: ['-Iinc'] } }).vasm).to.deep.equal({ binaryPath: defaultVasmBinaryPath(), args: ['-Iinc'] });
    });

    it('reads a constant from a source file given by its absolute path', async () => {
        const source = path.join(__dirname, '..', '..', 'resources', 'examples', 'vscode-amiga-wks-example', 'gencop.s');
        const constants = await new TrimmedSourceConstantResolver(launch().vasm).getSourceConstants([source]);
        expect(constants).to.include({ COPPERLIST_SIZE: 1000, LINE: 100 });
    });
});
