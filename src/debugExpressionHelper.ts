import { DebugVariableResolver } from './debugVariableResolver';
import { DebugProtocol } from 'vscode-debugprotocol';
import { Calc } from './calc';

export class DebugExpressionHelper {
    private calc = new Calc();
    public getAddressFromExpression(expression: string, frameIndex: number | undefined, variableResolver: DebugVariableResolver): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            if (expression !== null) {
                let newExpression = expression;
                // Replace all variables
                let variableRegexp = /\$\{([a-zA-Z0-9_\-\.]*)\}/g;
                let match;
                while (match = variableRegexp.exec(expression)) {
                    let variableName = match[1];
                    let value = await variableResolver.getVariableValue(variableName, frameIndex).catch(err => {
                        return reject(err);
                    });
                    if (value) {
                        newExpression = newExpression.replace("${" + variableName + "}", "$" + value);
                    }
                }
                resolve(this.calc.calculate(newExpression));
            } else {
                reject(new Error("Invalid address"));
            }
        });
    }

    public processOutputFromMemoryDump(memory: string, startAddress: number, mode: string, wordLength: number, rowLength: number): [string, Array<DebugProtocol.Variable>] {
        let firstRow = "";
        let variables = new Array<DebugProtocol.Variable>();
        let chunks = this.chunk(memory.toString(), wordLength * 2);
        let i = 0;
        let rowCount = 0;
        let row = "";
        while (i < chunks.length) {
            if (rowCount > 0) {
                row += " ";
            }
            row += chunks[i];
            if ((rowCount >= rowLength - 1) || (i === chunks.length - 1)) {
                if (mode.indexOf('a') >= 0) {
                    let asciiText = this.convertToASCII(row.replace(/\s+/g, ''));
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
                    name: this.padStartWith0(startAddress.toString(16), 8),
                    variablesReference: 0
                });
                if (firstRow.length <= 0) {
                    firstRow = row;
                }
                startAddress += rowCount * wordLength;
                rowCount = 0;
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
                        instuction = instructionElms[0] + this.getEndPad(instructionElms[0], 10) + instructionElms[1];
                    }
                    let v = elms[1] + this.getEndPad(elms[1], 26) + instuction;
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

    /**
     * Padding on start of string
     * @param stringToPad String to pad
     * @param targetLength Length targetted
     * @return Padding string
     */
    public padStartWith0(stringToPad: string, targetLength: number): string {
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        let padString = '0';
        if (stringToPad.length > targetLength) {
            return stringToPad;
        }
        else {
            targetLength = targetLength - stringToPad.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + stringToPad;
        }
    }

    /**
	 * Getting the pad of the good size at the end of string
	 * @param stringToPad String to pad
	 * @param targetLength Length targetted
	 * @return Padding string
	 */
    public getEndPad(stringToPad: string, targetLength: number): string {
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        let padString = ' ';
        if (stringToPad.length > targetLength) {
            return '';
        }
        else {
            targetLength = targetLength - stringToPad.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength);
        }
    }

    private chunk(str: string, n: number): string[] {
        let ret = [];
        let maxCount = str.length - n - 1;
        let i;
        for (i = 0; i < maxCount; i += n) {
            ret.push(str.substring(i, n + i));
        }
        if ((str.length - i) > 0) {
            ret.push(str.substring(i));
        }
        return ret;
    }
    private convertToASCII(memory: string): string {
        let asciiContents = "";
        var chunks = this.chunk(memory, 2);
        for (let c of chunks) {
            let i = parseInt(c, 16);
            if ((i < 32) || (i > 176)) {
                asciiContents += ".";
            } else {
                asciiContents += String.fromCharCode(i);
            }
        }
        return asciiContents;
    }

}