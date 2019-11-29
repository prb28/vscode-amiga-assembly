import { Capstone } from "./capstone";
import { GdbProxy } from "./gdbProxy";
import { DebugExpressionHelper } from "./debugExpressionHelper";
import { StackFrame, Source } from "vscode-debugadapter";
import { DebugProtocol } from "vscode-debugprotocol";
import { CopperDisassembler } from "./copperDisassembler";
import { DebugVariableResolver } from "./debugVariableResolver";
import { MemoryLabelsRegistry } from "./customMemoryAdresses";
import { Uri } from "vscode";

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
        } else if (this.isCopper()) {
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

    public toURI(): Uri {
        // Code to replace #, it is not done by the Uri.parse
        const filename = this.toString().replace('#', '%23');
        return Uri.parse(`disassembly:${filename}`);
    }

    public static isDebugAsmFile(path: string): boolean {
        return path.endsWith(DebugDisassembledFile.DGBFILE_EXTENSION);
    }
}

export class DisassembleAddressArguments implements DebugProtocol.DisassembleArguments {
    memoryReference: string;
    offset?: number;
    instructionOffset?: number;
    instructionCount: number;
    resolveSymbols?: boolean;
    segmentId?: number;
    stackFrameIndex?: number;
    addressExpression?: string;
    copper: boolean;
    constructor(addressExpression?: string | undefined, instructionCount?: number | undefined, isCopper?: boolean | undefined) {
        this.addressExpression = addressExpression;
        if (addressExpression) {
            this.memoryReference = addressExpression;
        } else {
            this.memoryReference = "";
        }
        if (instructionCount) {
            this.instructionCount = instructionCount;
        } else {
            this.instructionCount = 100;
        }
        if (isCopper) {
            this.copper = isCopper;
        } else {
            this.copper = false;
        }
    }

    public static copy(args: DebugProtocol.DisassembleArguments, isCopper: boolean) {
        let newArgs = new DisassembleAddressArguments(args.memoryReference, args.instructionCount, isCopper);
        newArgs.offset = args.offset;
        newArgs.instructionOffset = args.instructionOffset;
        return newArgs;
    }
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

    public getStackFrame(stackFrameIndex: number, address: number, stackframeLabel: string, isCopper: boolean): Promise<StackFrame> {
        return new Promise(async (resolve, reject) => {
            let dAsmFile = new DebugDisassembledFile();
            let url: string;
            let length = 500;
            let lineNumber = 1;
            dAsmFile.setCopper(isCopper);
            // is the pc on a opened segment ?
            let [segmentId, offset] = this.gdbProxy.toRelativeOffset(address);
            if ((segmentId >= 0) && !isCopper) {
                // We have a segment
                dAsmFile.setSegmentId(segmentId);
                let returnedLineNumber = await this.getLineNumberInDisassembledSegent(segmentId, offset).catch((err) => {
                    // Nothing to do
                    lineNumber = -1;
                });
                if (returnedLineNumber || returnedLineNumber === 0) {
                    lineNumber = returnedLineNumber;
                }
            } else {
                let newAddress = address;
                if (isCopper) {
                    // Search for selected copper list
                    // Read 
                    let lineInCop1 = -1;
                    let lineInCop2 = -1;
                    let cop1Addr = await MemoryLabelsRegistry.getCopperAddress(1, this.variableResolver).catch(err => {
                        reject(err);
                    });
                    if (cop1Addr) {
                        lineInCop1 = Math.floor((address - cop1Addr + 4) / 4);
                    }
                    let cop2Addr = await MemoryLabelsRegistry.getCopperAddress(1, this.variableResolver).catch(err => {
                        reject(err);
                    });
                    if (cop2Addr) {
                        lineInCop2 = Math.floor((address - cop2Addr + 4) / 4);
                    }
                    if (cop1Addr && (lineInCop1 >= 0)) {
                        if (cop2Addr && (lineInCop2 >= 0)) {
                            if (lineInCop1 <= lineInCop2) {
                                newAddress = cop1Addr;
                                lineNumber = lineInCop1;
                            } else {
                                newAddress = cop2Addr;
                                lineNumber = lineInCop2;
                            }
                        } else {
                            newAddress = cop1Addr;
                            lineNumber = lineInCop1;
                        }
                    } else if (cop2Addr && (lineInCop2 >= 0)) {
                        newAddress = cop2Addr;
                        lineNumber = lineInCop2;
                    }
                }
                dAsmFile.setStackFrameIndex(stackFrameIndex).setAddressExpression(`\$${newAddress.toString(16)}`).setLength(length);
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
                        let [, instructions] = this.debugExpressionHelper.processOutputFromDisassembler(code, 0);
                        let line = 1;
                        for (let instr of instructions) {
                            if (instr.getNumericalAddress() === offset) {
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
    public disassembleSegment(segmentId: number): Promise<DebugProtocol.DisassembledInstruction[]> {
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

    public disassembleAddress(addressExpression: string, length: number, isCopper: boolean): Promise<DebugProtocol.DisassembledInstruction[]> {
        return new Promise(async (resolve, reject) => {
            let searchedAddress: number | void;
            if ((isCopper) && ((addressExpression === '1') || (addressExpression === '2'))) {
                // Retrieve the copper address
                searchedAddress = await MemoryLabelsRegistry.getCopperAddress(parseInt(addressExpression), this.variableResolver).catch((err) => {
                    reject(err);
                });
            } else {
                searchedAddress = await this.debugExpressionHelper.getAddressFromExpression(addressExpression, undefined, this.variableResolver).catch((err) => {
                    reject(err);
                });
            }
            if (searchedAddress || searchedAddress === 0) {
                await this.disassembleNumericalAddress(searchedAddress, length, isCopper).then(code => {
                    resolve(code);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error("Unable to resolve adress expression void returned"));
            }
        });
    }

    public disassembleNumericalAddress(searchedAddress: number, length: number, isCopper: boolean): Promise<DebugProtocol.DisassembledInstruction[]> {
        return new Promise(async (resolve, reject) => {
            const address = searchedAddress;
            if (isCopper) {
                await this.gdbProxy.getMemory(address, length).then((memory) => {
                    let startAddress = address;
                    let copDis = new CopperDisassembler(memory);
                    let instructions = copDis.disassemble();
                    let variables = new Array<DebugProtocol.DisassembledInstruction>();
                    let offset = 0;
                    for (let i of instructions) {
                        let addOffset = startAddress + offset;
                        variables.push({
                            address: addOffset.toString(16),
                            instruction: i.toString()
                        });
                        // 4 iadresses : 32b / address
                        offset += 4;
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
        });
    }

    public disassembleNumericalAddressCPU(searchedAddress: number, length: number): Promise<Array<DebugProtocol.DisassembledInstruction>> {
        return new Promise(async (resolve, reject) => {
            const address = searchedAddress;
            if (this.capstone) {
                const localCapstone = this.capstone;
                // ask for memory dump
                await this.gdbProxy.getMemory(address, length).then(async (memory) => {
                    let startAddress = address;
                    // disassemble the code 
                    await localCapstone.disassemble(memory).then((code) => {
                        let [, lines] = this.debugExpressionHelper.processOutputFromDisassembler(code, startAddress);
                        resolve(lines);
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

    public disassembleRequest(args: DisassembleAddressArguments): Promise<DebugProtocol.DisassembledInstruction[]> {
        return new Promise(async (resolve, reject) => {
            if (args.copper) {
                if (args.addressExpression && args.instructionCount) {
                    await this.disassembleAddress(args.addressExpression, args.instructionCount, args.copper).then(code => {
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
                } else if (args.addressExpression && args.instructionCount) {
                    await this.disassembleAddress(args.addressExpression, args.instructionCount, args.copper).then(code => {
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
            let instructions: void | DebugProtocol.DisassembledInstruction[];
            if (lineNumber > 0) {
                let dAsmFile = DebugDisassembledFile.fromPath(filePath);
                if (dAsmFile.isSegment()) {
                    let segmentId = dAsmFile.getSegmentId();
                    if (segmentId !== undefined) {
                        instructions = await this.disassembleSegment(segmentId).catch((err) => {
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
                        instructions = await this.disassembleAddress(address, length, dAsmFile.isCopper()).catch((err) => {
                            reject(err);
                        });
                    }
                }
                if (instructions) {
                    let searchedLN = lineNumber - 1;
                    if (searchedLN < instructions.length) {
                        resolve(parseInt(instructions[searchedLN].address, 16));
                    } else {
                        reject(new Error(`Searched line ${searchedLN} greater than file "${filePath}" length: ${instructions.length}`));
                    }
                }
            } else {
                reject(new Error(`Invalid line number: '${lineNumber}'`));
            }
        });
    }
}