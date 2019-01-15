//
// Tests for the debug expression helper
//

import { expect } from 'chai';
import { DebugExpressionHelper } from '../debugExpressionHelper';
import { mock, instance, when } from 'ts-mockito';
import * as chaiAsPromised from 'chai-as-promised';

import * as chai from 'chai';
import { DebugProtocol } from 'vscode-debugprotocol';
import { DummyVariableResolver } from './dummyVariableResolver';
import * as Path from 'path';
import * as vscode from 'vscode';
import { ExtensionState } from '../extension';
chai.use(chaiAsPromised);

// tslint:disable:no-unused-expression
describe("debug expression helper Tests", function () {
    before(async function () {
        const PROJECT_ROOT = Path.join(__dirname, '..', '..');
        const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
        const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
        // activate the extension
        let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        let state = ExtensionState.getCurrent();
        let dHnd = state.getDefinitionHandler();
        await dHnd.scanFile(vscode.Uri.file(MAIN_SOURCE));
    });
    it("Should evaluate the memory expression", function () {
        let helper = new DebugExpressionHelper();
        let mockedVariableResolver = mock(DummyVariableResolver);
        when(mockedVariableResolver.getVariableValue("pc", 1)).thenResolve("f");
        when(mockedVariableResolver.getVariableValue("copper", 1)).thenResolve("2");
        when(mockedVariableResolver.getVariableValue("testfail", 1)).thenReject(Error("No"));
        let variableResolver = instance(mockedVariableResolver);
        return Promise.all([
            expect(helper.getAddressFromExpression("#10", 1, variableResolver)).to.eventually.be.equal(10),
            expect(helper.getAddressFromExpression("$a", 1, variableResolver)).to.eventually.be.equal(10),
            expect(helper.getAddressFromExpression("%10", 1, variableResolver)).to.eventually.be.equal(2),
            expect(helper.getAddressFromExpression("@10", 1, variableResolver)).to.eventually.be.equal(8),
            expect(helper.getAddressFromExpression("#10 + $a", 1, variableResolver)).to.eventually.be.equal(20),
            expect(helper.getAddressFromExpression("#10 +${pc}+ ${copper} + ($a/2)", 1, variableResolver)).to.eventually.be.equal(32),
            expect(helper.getAddressFromExpression("${testfail} + $a", 1, variableResolver)).to.be.rejectedWith(Error, "No"),
            expect(helper.getAddressFromExpression("${pc} + $a + BPLSIZE", 1, variableResolver)).to.eventually.be.equal(0xf + 0xa + (256 * 320) / 8)
        ]);
    });
    it("Should process a memory dump", function () {
        let helper = new DebugExpressionHelper();
        let memory = "aa0000";
        let mode = "ab";
        let wordLength = 1;
        let rowLength = 1;
        let startAddress = 2;
        let variables = [<DebugProtocol.Variable>{
            "name": "00000002",
            "value": "aa | ª",
            "variablesReference": 0,
        },
        <DebugProtocol.Variable>{
            "name": "00000003",
            "value": "00 | .",
            "variablesReference": 0,
        },
        <DebugProtocol.Variable>{
            "name": "00000004",
            "value": "00 | .",
            "variablesReference": 0,
        }];
        expect(helper.processOutputFromMemoryDump(memory, startAddress, mode, wordLength, rowLength)).to.be.eql(["aa | ª", variables]);
        wordLength = 2;
        rowLength = 2;
        memory = "aa00000000c00b0000f8";
        variables = [<DebugProtocol.Variable>{
            "name": "00000002",
            "value": "aa00 0000 | ª...",
            "variablesReference": 0,
        },
        <DebugProtocol.Variable>{
            "name": "00000006",
            "value": "00c0 0b00 | ....",
            "variablesReference": 0,
        },
        <DebugProtocol.Variable>{
            "name": "0000000a",
            "value": "00f8      | ..",
            "variablesReference": 0,
        }];
        expect(helper.processOutputFromMemoryDump(memory, startAddress, mode, wordLength, rowLength)).to.be.eql(["aa00 0000 | ª...", variables]);
        wordLength = 4;
        rowLength = 4;
        variables = [<DebugProtocol.Variable>{
            "name": "00000002",
            "value": "aa000000 00c00b00 00f8          | ª.........",
            "variablesReference": 0,
        }];
        expect(helper.processOutputFromMemoryDump(memory, startAddress, mode, wordLength, rowLength)).to.be.eql(["aa000000 00c00b00 00f8          | ª.........", variables]);
        mode = "a";
        variables = [<DebugProtocol.Variable>{
            "name": "00000002",
            "value": "ª.........",
            "variablesReference": 0,
        }];
        expect(helper.processOutputFromMemoryDump(memory, startAddress, mode, wordLength, rowLength)).to.be.eql(["ª.........", variables]);
        mode = "b";
        variables = [<DebugProtocol.Variable>{
            "name": "00000002",
            "value": "aa000000 00c00b00 00f8",
            "variablesReference": 0,
        }];
        expect(helper.processOutputFromMemoryDump(memory, startAddress, mode, wordLength, rowLength)).to.be.eql(["aa000000 00c00b00 00f8", variables]);
    });
    it("Should process a disassembled code", function () {
        let helper = new DebugExpressionHelper();
        let code = " 0  90 91  sub.l\t(a1), d0";
        let startAddress = 1;
        let variables = [<DebugProtocol.Variable>{
            "name": "1",
            "value": "90 91                     sub.l     (a1), d0",
            "variablesReference": 0,
        }];
        expect(helper.processOutputFromDisassembler(code, startAddress)).to.be.eql(["sub.l (a1), d0", variables]);
        expect(helper.processOutputFromDisassembler("\n" + code + "\n" + "\n", startAddress)).to.be.eql(["sub.l (a1), d0", variables]);
        code = " 0  90 91  sub.l\t(a1), d0\n1  90 91  move.l\t(a1), d0";
        variables = [<DebugProtocol.Variable>{
            "name": "1",
            "value": "90 91                     sub.l     (a1), d0",
            "variablesReference": 0,
        }, <DebugProtocol.Variable>{
            "name": "2",
            "value": "90 91                     move.l    (a1), d0",
            "variablesReference": 0,
        }];
        expect(helper.processOutputFromDisassembler(code, startAddress)).to.be.eql(["sub.l (a1), d0", variables]);
    });
});
