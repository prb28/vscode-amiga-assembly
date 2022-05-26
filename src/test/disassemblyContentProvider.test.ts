// import { expect } from "chai";
import * as chai from 'chai';
import { mock, instance, when, anything } from '@johanblumenberg/ts-mockito';
import * as chaiAsPromised from 'chai-as-promised';
import { DisassemblyContentProvider } from '../disassemblyContentProvider';
import { Uri } from 'vscode';
import * as vscode from 'vscode';
import { expect } from 'chai';
chai.use(chaiAsPromised);

class DummyDebugSession implements vscode.DebugSession {
    workspaceFolder: vscode.WorkspaceFolder | undefined;
    configuration = <vscode.DebugConfiguration>{};
    id = '1';
    type = 'debug';
    name = 'mydebug';
    customRequest(command: string, args?: any): Thenable<any> {
        throw new Error('Method not implemented.');
    }
    getDebugProtocolBreakpoint(): Thenable<
        vscode.DebugProtocolBreakpoint | undefined
    > {
        return Promise.resolve(undefined);
    }
}

describe('debug disassembly content provider', function () {
    it('Should provide content to disassembly file', async function () {
        const dcp = new DisassemblyContentProvider();
        const mockedDebugSession = mock(DummyDebugSession);
        const debugSession = instance(mockedDebugSession);
        const response = {
            content: 'example content',
        };
        when(
            mockedDebugSession.customRequest('disassembledFileContents', anything())
        ).thenReturn(Promise.resolve(response));
        dcp.setTestContext(debugSession);
        const uri = Uri.file('disassembly:example.dbgasm');
        await expect(
            dcp.provideTextDocumentContent(uri)
        ).to.eventually.be.equal(response.content);
    });
});
