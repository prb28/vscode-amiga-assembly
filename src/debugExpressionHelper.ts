import { DebugVariableResolver } from './debugVariableResolver';
import { DebugProtocol } from 'vscode-debugprotocol';
import { StringUtils } from './stringUtils';
import { ExtensionState } from './extension';

export class DebugExpressionHelper {
    public async getAddressFromExpression(expression: string, frameIndex: number | undefined, variableResolver: DebugVariableResolver): Promise<number> {
        if (expression !== null) {
            let newExpression = expression;
            // Replace all variables
            const variableRegexp = /([$#]\{[a-zA-Z0-9_\-.]*\})/g;
            let match = variableRegexp.exec(expression);
            while (match) {
                const variableExpression = match[1];
                const variableName = variableExpression.substring(2, variableExpression.length - 1);
                let value: string | void;
                if (variableExpression.startsWith('$')) {
                    value = await variableResolver.getVariableValue(variableName, frameIndex);
                } else {
                    value = await variableResolver.getVariablePointedMemory(variableName, frameIndex);
                }
                if (value) {
                    newExpression = newExpression.replace("#{", "${").replace("${" + variableName + "}", "$" + value);
                }
                match = variableRegexp.exec(expression)
            }
            // call the function to calculate the expression
            const dHnd = ExtensionState.getCurrent().getDefinitionHandler();
            return dHnd.evaluateFormula(newExpression);
        } else {
            throw new Error("Invalid address");
        }
    }

    public processOutputFromMemoryDump(memory: string, startAddress: number, mode: string, wordLength: number, rowLength: number): [string, Array<DebugProtocol.Variable>] {
        let firstRow = "";
        const variables = new Array<DebugProtocol.Variable>();
        const chunks = StringUtils.chunk(memory.toString(), wordLength * 2);
        let i = 0;
        let rowCount = 0;
        let row = "";
        let nextAddress = startAddress;
        let lineAddress = startAddress;
        while (i < chunks.length) {
            if (rowCount > 0) {
                row += " ";
            }
            row += chunks[i];
            nextAddress += chunks[i].length / 2;
            if ((rowCount >= rowLength - 1) || (i === chunks.length - 1)) {
                if (mode.indexOf('a') >= 0) {
                    const asciiText = StringUtils.convertHexStringToASCII(row.replace(/\s+/g, ''), 2);
                    if (mode.indexOf('b') >= 0) {
                        if ((i === chunks.length - 1) && (rowCount < rowLength - 1)) {
                            const chunksMissing = rowLength - 1 - rowCount;
                            const padding = chunksMissing * wordLength * 2 + chunksMissing;
                            for (let j = 0; j < padding; j++) {
                                row += " ";
                            }
                        }
                        row += " | ";
                    } else {
                        row = "";
                    }
                    row += asciiText;
                }
                variables.push({
                    value: row,
                    name: StringUtils.padStart(lineAddress.toString(16), 8, "0"),
                    variablesReference: 0
                });
                if (firstRow.length <= 0) {
                    firstRow = row;
                }
                rowCount = 0;
                lineAddress = nextAddress;
                row = "";
            } else {
                rowCount++;
            }
            i++;
        }
        return [firstRow, variables];
    }

    public processVariablesFromDisassembler(code: string, startAddress: number): [string, Array<DebugProtocol.Variable>] {
        const variables = new Array<DebugProtocol.Variable>();
        const [firstRow, instructions] = this.processOutputFromDisassembler(code, startAddress);
        for (const instruction of instructions) {
            let ib = instruction.instructionBytes;
            if (!ib) {
                ib = "";
            }
            variables.push({
                value: ib + StringUtils.createPad(ib, 26) + instruction.instruction,
                name: instruction.address,
                variablesReference: 0
            });
        }
        return [firstRow, variables];
    }

    public processOutputFromDisassembler(code: string, startAddress: number): [string, Array<DisassembledInstructionAdapter>] {
        let firstRow = "";
        const disassembledLines = new Array<DisassembledInstructionAdapter>();
        const lines = code.split(/\r\n|\r|\n/g);
        let i = 0;
        for (let l of lines) {
            l = l.trim();
            if (l.length > 0) {
                const elms = l.split("  ");
                if (elms.length > 2) {
                    const instructionElms = elms[2].split('\t');
                    let instruction = elms[2];
                    if (instructionElms.length > 1) {
                        instruction = instructionElms[0] + StringUtils.createPad(instructionElms[0], 10) + instructionElms[1];
                    }
                    const offset = parseInt(elms[0], 16);
                    const addOffset = startAddress + offset;
                    const dInstr = DisassembledInstructionAdapter.createNumerical(addOffset, instruction);
                    dInstr.line = i;
                    dInstr.instructionBytes = elms[1];
                    dInstr.column = 0;
                    disassembledLines.push(dInstr);
                    if (firstRow.length <= 0) {
                        firstRow = elms[2].replace("\t", " ");
                    }
                } else {
                    const dInstr = DisassembledInstructionAdapter.createNumerical(i, l);
                    dInstr.line = i;
                    dInstr.instructionBytes = l;
                    dInstr.column = 0;
                    disassembledLines.push(dInstr);
                    if (firstRow.length <= 0) {
                        firstRow = l;
                    }
                }
                i++;
            }
        }
        return [firstRow, disassembledLines];
    }
}


export class DisassembledInstructionAdapter implements DebugProtocol.DisassembledInstruction {
    public address: string;
    public instructionBytes?: string;
    public instruction: string;
    public symbol?: string;
    public location?: DebugProtocol.Source;
    public line?: number;
    public column?: number;
    public endLine?: number;
    public endColumn?: number;
    private constructor(address: string, instruction: string) {
        this.address = address;
        this.instruction = instruction;
    }
    public static createNumerical(address: number, instruction: string): DisassembledInstructionAdapter {
        const addr = DisassembledInstructionAdapter.getAddressString(address);
        return new DisassembledInstructionAdapter(addr, instruction);
    }
    public static createString(address: string, instruction: string): DisassembledInstructionAdapter {
        return new DisassembledInstructionAdapter(address, instruction);
    }
    public getNumericalAddress(): number {
        if (this.address.startsWith("0x")) {
            return parseInt(this.address.substring(2), 16);
        } else {
            return parseInt(this.address);
        }
    }
    public static getAddressString(address: number): string {
        return "0x" + StringUtils.padStart(address.toString(16), 8, "0");
    }
}