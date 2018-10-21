import { Capstone } from "./capstone";
import { GdbProxy } from "./gdbProxy";
import { DebugExpressionHelper } from "./debugExpressionHelper";
import { StackFrame, Source } from "vscode-debugadapter";
import { DebugProtocol } from "vscode-debugprotocol";
import { CopperDisassembler } from "./copperDisassembler";
import { DebugVariableResolver } from "./debugVariableResolver";

export class DebugDisassembledFile {
    public static readonly DGBFILE_SEG_SEPARATOR = "seg_";
    public static readonly DGBFILE_COPPER_SEPARATOR = "copper_";
    public static readonly DGBFILE_EXTENSION = "dbgasm";

    private segmentId: number | undefined;
    private stackFrameIndex: number | undefined;
    private addressExpression: string | undefined;
    private length: number | undefined;
    private copper: boolean = false;
    private path = "";

    public setSegmentId(segmentId: number): DebugDisassembledFile {
        this.segmentId = segmentId;
        return this;
    }

    public getSegmentId(): number | undefined {
        return this.segmentId;
    }

    public setStackFrameIndex(stackFrameIndex: number): DebugDisassembledFile {
        this.stackFrameIndex = stackFrameIndex;
        return this;
    }

    public getStackFrameIndex(): number | undefined {
        return this.stackFrameIndex;
    }

    public setAddressExpression(addressExpression: string): DebugDisassembledFile {
        this.addressExpression = addressExpression;
        return this;
    }

    public getAddressExpression(): string | undefined {
        return this.addressExpression;
    }

    public setLength(length: number): DebugDisassembledFile {
        this.length = length;
        return this;
    }

    public getLength(): number | undefined {
        return this.length;
    }

    public isSegment(): boolean {
        return this.segmentId !== undefined;
    }

    public setCopper(isCopper: boolean): DebugDisassembledFile {
        this.copper = isCopper;
        return this;
    }

    public isCopper(): boolean {
        return this.copper;
    }

    public toString(): string {
        if (this.isSegment()) {
            return `${this.path}${DebugDisassembledFile.DGBFILE_SEG_SEPARATOR}${this.segmentId}.${DebugDisassembledFile.DGBFILE_EXTENSION}`;
        }
        if (this.isCopper()) {
            return `${this.path}${DebugDisassembledFile.DGBFILE_COPPER_SEPARATOR}${this.addressExpression}__${this.length}.${DebugDisassembledFile.DGBFILE_EXTENSION}`;
        } else {
            return `${this.path}${this.stackFrameIndex}__${this.addressExpression}__${this.length}.${DebugDisassembledFile.DGBFILE_EXTENSION}`;
        }
    }

    public static fromPath(path: string): DebugDisassembledFile {
        let localPath = path;
        let dAsmFile = new DebugDisassembledFile();
        let lastSepPos = localPath.lastIndexOf('/');
        if (lastSepPos >= 0) {
            localPath = localPath.substring(lastSepPos + 1);
            dAsmFile.path = path.substring(0, lastSepPos + 1);
        }
        let indexOfExt = localPath.lastIndexOf(DebugDisassembledFile.DGBFILE_EXTENSION);
        if (indexOfExt > 0) {
            localPath = localPath.substring(0, indexOfExt - 1);
        }
        const segLabelPos = localPath.indexOf(DebugDisassembledFile.DGBFILE_SEG_SEPARATOR);
        const copperLabelPos = localPath.indexOf(DebugDisassembledFile.DGBFILE_COPPER_SEPARATOR);
        if (segLabelPos >= 0) {
            const segId = parseInt(localPath.substring(segLabelPos + 4));
            dAsmFile.setSegmentId(segId);
        } else if (copperLabelPos >= 0) {
            const pathParts = localPath.substring(DebugDisassembledFile.DGBFILE_COPPER_SEPARATOR.length).split('__');
            if (pathParts.length > 1) {
                let address = pathParts[0];
                let length = parseInt(pathParts[1]);
                dAsmFile.setAddressExpression(address).setLength(length).setCopper(true);
            }
        } else {
            const pathParts = localPath.split('__');
            if (pathParts.length > 1) {
                let stackFrameIndex = parseInt(pathParts[0]);
                let address = pathParts[1];
                let length = parseInt(pathParts[2]);
                dAsmFile.setStackFrameIndex(stackFrameIndex).setAddressExpression(address).setLength(length);
            }
        }
        return dAsmFile;
    }

    public static isDebugAsmFile(path: string): boolean {
        return path.endsWith(DebugDisassembledFile.DGBFILE_EXTENSION);
    }
}

export interface DisassembleAddressArguments {
    segmentId: number | undefined;
    stackFrameIndex: number | undefined;
    addressExpression: string | undefined;
    length: number | undefined;
    copper: boolean;
}

export class DebugDisassembledMananger {
    /** Tool to disassemble */
    private capstone?: Capstone;

    /** Proxy to Gdb */
    private gdbProxy: GdbProxy;

    /** Helper class to deal with the debug expressions */
    private debugExpressionHelper = new DebugExpressionHelper();

    /** To evualate adresses and symbols */
    private variableResolver: DebugVariableResolver;

    public constructor(gdbProxy: GdbProxy, capstone: Capstone | undefined, variableResolver: DebugVariableResolver) {
        this.capstone = capstone;
        this.gdbProxy = gdbProxy;
        this.variableResolver = variableResolver;
    }

    public getStackFrame(stackFrameIndex: number, address: number, stackframeLabel: string): Promise<StackFrame> {
        return new Promise(async (resolve, reject) => {
            let dAsmFile = new DebugDisassembledFile();
            let url: string;
            let length = 500;
            let lineNumber = 1;
            // is the pc on a opened segment ?
            let [segmentId, offset] = this.gdbProxy.toRelativeOffset(address);
            if (segmentId >= 0) {
                // We have a segment
                dAsmFile.setSegmentId(segmentId);
                let returnedLineNumber = await this.getLineNumberInDisassembledSegent(segmentId, offset).catch((err) => {
                    // Nothing to do
                    lineNumber = -1;
                });
                if (returnedLineNumber !== undefined) {
                    lineNumber = returnedLineNumber;
                }
            } else {
                dAsmFile.setStackFrameIndex(stackFrameIndex).setAddressExpression(`\$${address.toString(16)}`).setLength(length);
            }
            url = `disassembly:///${dAsmFile}`;
            if (lineNumber >= 0) {
                resolve(new StackFrame(stackFrameIndex, stackframeLabel, new Source(dAsmFile.toString(), url), lineNumber, 1));
            } else {
                resolve(new StackFrame(stackFrameIndex, stackframeLabel));
            }
        });
    }

    public getLineNumberInDisassembledSegent(segmentId: number, offset: number): Promise<number> {
        return new Promise(async (resolve, reject) => {
            if (this.capstone) {
                let memory = await this.gdbProxy.getSegmentMemory(segmentId).catch((err) => {
                    reject(err);
                    return;
                });
                if (memory) {
                    // disassemble the code 
                    await this.capstone.disassemble(memory).then((code) => {
                        let [, variables] = this.debugExpressionHelper.processOutputFromDisassembler(code, 0);
                        let offsetString = offset.toString(16);
                        let line = 1;
                        for (let v of variables) {
                            if (v.name === offsetString) {
                                resolve(line);
                                return;
                            }
                            line++;
                        }
                        reject(new Error(`Cannot retrive line for segement ${segmentId}, offset ${offset}: line not found`));
                    }).catch((err) => {
                        reject(err);
                    });
                }
            } else {
                reject(new Error(`Cannot retrive line for segement ${segmentId}, offset ${offset} : capstone is not defined`));
            }
        });
    }
    public disassembleSegment(segmentId: number): Promise<DebugProtocol.Variable[]> {
        return new Promise(async (resolve, reject) => {
            if (this.capstone) {
                const localCapstone = this.capstone;
                // ask for memory dump
                this.gdbProxy.getSegmentMemory(segmentId).then((memory) => {
                    let startAddress = this.gdbProxy.toAbsoluteOffset(segmentId, 0);
                    // disassemble the code 
                    localCapstone.disassemble(memory).then((code) => {
                        let [, variables] = this.debugExpressionHelper.processOutputFromDisassembler(code, startAddress);
                        resolve(variables);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject(new Error("Capstone has not been defined"));
            }
        });
    }

    public disassembleAddress(addressExpression: string, length: number, isCopper: boolean): Promise<DebugProtocol.Variable[]> {
        return new Promise(async (resolve, reject) => {
            const address = await this.debugExpressionHelper.getAddressFromExpression(addressExpression, undefined, this.variableResolver).catch((err) => {
                reject(err);
            });
            if (address !== undefined) {
                if (isCopper) {
                    await this.gdbProxy.getMemory(address, length).then((memory) => {
                        let startAddress = address;
                        let copDis = new CopperDisassembler(memory);
                        let instructions = copDis.disassemble();
                        let variables = new Array<DebugProtocol.Variable>();
                        let offset = 0;
                        for (let i of instructions) {
                            let addOffset = startAddress + offset;
                            variables.push({
                                value: i.toString(),
                                name: addOffset.toString(16),
                                variablesReference: 0
                            });
                            offset += 2;
                        }
                        resolve(variables);
                    }).catch((err) => {
                        reject(err);
                    });
                } else if (this.capstone) {
                    const localCapstone = this.capstone;
                    // ask for memory dump
                    await this.gdbProxy.getMemory(address, length).then(async (memory) => {
                        let startAddress = address;
                        // disassemble the code 
                        await localCapstone.disassemble(memory).then((code) => {
                            let [, variables] = this.debugExpressionHelper.processOutputFromDisassembler(code, startAddress);
                            resolve(variables);
                        }).catch((err) => {
                            reject(err);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    reject(new Error("Capstone has not been defined"));
                }
            } else {
                reject(new Error("Unable to resolve adress expression void returned"));
            }
        });
    }

    public disassembleRequest(args: DisassembleAddressArguments): Promise<DebugProtocol.Variable[]> {
        return new Promise(async (resolve, reject) => {
            if (args.copper) {
                if (args.addressExpression && args.length) {
                    await this.disassembleAddress(args.addressExpression, args.length, args.copper).then(code => {
                        resolve(code);
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    reject(new Error(`Unable to disassemble; invalid parameters ${args}`));
                }
            } else if (this.capstone) {
                if (args.segmentId !== undefined) {
                    await this.disassembleSegment(args.segmentId).then(code => {
                        resolve(code);
                    }).catch((err) => {
                        reject(err);
                    });
                } else if (args.addressExpression && args.length) {
                    await this.disassembleAddress(args.addressExpression, args.length, args.copper).then(code => {
                        resolve(code);
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    reject(new Error(`Unable to disassemble; invalid parameters ${args}`));
                }
            } else {
                reject(new Error("Capstone cstool must be configured in the settings"));
            }
        });
    }

    public getAddressForFileEditorLine(filePath: string, lineNumber: number): Promise<number> {
        return new Promise(async (resolve, reject) => {
            if (lineNumber > 0) {
                let dAsmFile = DebugDisassembledFile.fromPath(filePath);
                if (dAsmFile.isSegment()) {
                    let segmentId = dAsmFile.getSegmentId();
                    if (segmentId !== undefined) {
                        await this.disassembleSegment(segmentId).then(variables => {
                            let searchedLN = lineNumber - 1;
                            if (searchedLN < variables.length) {
                                resolve(parseInt(variables[searchedLN].name, 16));
                            } else {
                                reject(new Error(`Searched line ${searchedLN} greater than file "${filePath}" length: ${variables.length}`));
                            }
                        }).catch((err) => {
                            reject(err);
                        });
                    } else {
                        reject(new Error(`SegmentId undefined in path ${filePath}`));
                    }
                } else {
                    // Path from outside segments
                    let address = dAsmFile.getAddressExpression();
                    let length = dAsmFile.getLength();
                    if ((address !== undefined) && (length !== undefined)) {
                        await this.disassembleAddress(address, length, false).then(variables => {
                            let searchedLN = lineNumber - 1;
                            if (searchedLN < variables.length) {
                                resolve(parseInt(variables[searchedLN].name, 16));
                            } else {
                                reject(new Error(`Searched line ${searchedLN} greater than file "${filePath}" length: ${variables.length}`));
                            }
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                }
            } else {
                reject(new Error(`Invalid line number: '${lineNumber}'`));
            }
        });
    }
}