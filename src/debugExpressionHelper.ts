import { DebugVariableResolver } from './debugVariableResolver';
import { DebugProtocol } from 'vscode-debugprotocol';
import { Calc } from './calc';
import { StringUtils } from './stringUtils';
import { ExtensionState } from './extension';

export class DebugExpressionHelper {
    public getAddressFromExpression(expression: string, frameIndex: number | undefined, variableResolver: DebugVariableResolver): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            if (expression !== null) {
                let newExpression = expression;
                // Replace all variables
                let variableRegexp = /([\$#]\{[a-zA-Z0-9_\-\.]*\})/g;
                let match;
                while (match = variableRegexp.exec(expression)) {
                    let variableExpression = match[1];
                    let variableName = variableExpression.substring(2, variableExpression.length - 1);
                    let value: string | void;
                    if (variableExpression.startsWith('$')) {
                        value = await variableResolver.getVariableValue(variableName, frameIndex).catch(err => {
                            return reject(err);
                        });
                    } else {
                        value = await variableResolver.getVariablePointedMemory(variableName, frameIndex).catch(err => {
                            return reject(err);
                        });
                    }
                    if (value) {
                        newExpression = newExpression.replace("#{", "${").replace("${" + variableName + "}", "$" + value);
                    }
                }
                // call the function to calculate the expression
                let dHnd = ExtensionState.getCurrent().getDefinitionHandler();
                dHnd.evaluateFormula(newExpression).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error("Invalid address"));
            }
        });
    }

    public processOutputFromMemoryDump(memory: string, startAddress: number, mode: string, wordLength: number, rowLength: number): [string, Array<DebugProtocol.Variable>] {
        let firstRow = "";
        let variables = new Array<DebugProtocol.Variable>();
        let chunks = StringUtils.chunk(memory.toString(), wordLength * 2);
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
                    let asciiText = StringUtils.convertToASCII(row.replace(/\s+/g, ''));
                    if (mode.indexOf('b') >= 0) {
                        if ((i === chunks.length - 1) && (rowCount < rowLength - 1)) {
                            let chuksMissing = rowLength - 1 - rowCount;
                            let padding = chuksMissing * wordLength * 2 + chuksMissing;
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
                    name: StringUtils.padStartWith0(lineAddress.toString(16), 8),
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

    public processOutputFromDisassembler(code: string, startAddress: number): [string, Array<DebugProtocol.Variable>] {
        let firstRow = "";
        let variables = new Array<DebugProtocol.Variable>();
        let lines = code.split(/\r\n|\r|\n/g);
        let i = 0;
        for (let l of lines) {
            l = l.trim();
            if (l.length > 0) {
                let elms = l.split("  ");
                if (elms.length > 2) {
                    let instructionElms = elms[2].split('\t');
                    let instuction = elms[2];
                    if (instructionElms.length > 1) {
                        instuction = instructionElms[0] + StringUtils.getEndPad(instructionElms[0], 10) + instructionElms[1];
                    }
                    let v = elms[1] + StringUtils.getEndPad(elms[1], 26) + instuction;
                    if (firstRow.length <= 0) {
                        firstRow = elms[2].replace("\t", " ");
                    }
                    let offset = parseInt(elms[0], 16);
                    let addOffset = startAddress + offset;
                    variables.push({
                        value: v,
                        name: addOffset.toString(16),
                        variablesReference: 0
                    });
                } else {
                    if (firstRow.length <= 0) {
                        firstRow = l;
                    }
                    variables.push({
                        value: l,
                        name: i.toString(),
                        variablesReference: 0
                    });
                }
                i++;
            }
        }
        return [firstRow, variables];
    }
}