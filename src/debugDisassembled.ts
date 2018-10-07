import { Capstone } from "./capstone";
import { GdbProxy } from "./gdbProxy";
import { DebugExpressionHelper } from "./debugExpressionHelper";
import { StackFrame, Source } from "vscode-debugadapter";
import { DebugProtocol } from "vscode-debugprotocol";

export class DebugDisassembledFile {
    public static readonly DGBFILE_SEG_SEPARATOR = "seg_";
    public static readonly DGBFILE_EXTENSION = "dbgasm";

    private segmentId: number | undefined;
    private stackFrameIndex: number | undefined;
    private address: number | undefined;
    private length: number | undefined;
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

    public setAddress(address: number): DebugDisassembledFile {
        this.address = address;
        return this;
    }

    public getAddress(): number | undefined {
        return this.address;
    }

    public setLength(length: number): DebugDisassembledFile {
        this.length = length;
        return this;
    }

    public getLength(): number | undefined {
        return this.length;
    }

    public isSegment() {
        return this.segmentId !== undefined;
    }

    public toString(): string {
        if (this.isSegment()) {
            return `${this.path}${DebugDisassembledFile.DGBFILE_SEG_SEPARATOR}${this.segmentId}.${DebugDisassembledFile.DGBFILE_EXTENSION}`;
        }
        let addressHex = "0";
        if (this.address) {
            addressHex = this.address.toString(16);
        }
        return `${this.path}${this.stackFrameIndex}_\$${addressHex}_${this.length}.${DebugDisassembledFile.DGBFILE_EXTENSION}`;
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
        if (segLabelPos >= 0) {
            const segId = parseInt(localPath.substring(segLabelPos + 4));
            dAsmFile.setSegmentId(segId);
        } else {
            const pathParts = localPath.split('_');
            let stackFrameIndex = -1;
            let address = 0;
            let length = 100;
            if (pathParts.length > 1) {
                stackFrameIndex = parseInt(pathParts[0]);
                address = parseInt(pathParts[1].substring(1), 16);
                length = parseInt(pathParts[2]);
                dAsmFile.setStackFrameIndex(stackFrameIndex).setAddress(address).setLength(length);
            }
        }
        return dAsmFile;
    }

    public static isDebugAsmFile(path: string): boolean {
        return path.endsWith(DebugDisassembledFile.DGBFILE_EXTENSION);
    }
}

export class DebugDisassembledMananger {
    /** Tool to disassemble */
    private capstone?: Capstone;

    /** Proxy to Gdb */
    private gdbProxy: GdbProxy;

    /** Helper class to deal with the debug expressions */
    private debugExpressionHelper = new DebugExpressionHelper();


    public constructor(gdbProxy: GdbProxy, capstone: Capstone | undefined) {
        this.capstone = capstone;
        this.gdbProxy = gdbProxy;
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
                dAsmFile.setStackFrameIndex(stackFrameIndex).setAddress(address).setLength(length);
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

    public disassembleAddress(address: number, length: number): Promise<DebugProtocol.Variable[]> {
        return new Promise(async (resolve, reject) => {
            if (this.capstone) {
                const localCapstone = this.capstone;
                // ask for memory dump
                this.gdbProxy.getMemory(address, length).then((memory) => {
                    let startAddress = address;
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

    public disassembleRequest(args: any): Promise<DebugProtocol.Variable[]> {
        return new Promise(async (resolve, reject) => {
            if (this.capstone) {
                if (args.segmentId !== undefined) {
                    await this.disassembleSegment(args.segmentId).then(code => {
                        resolve(code);
                    }).catch((err) => {
                        reject(err);
                    });
                } else if (args.startAddress !== undefined) {
                    await this.disassembleAddress(args.startAddress, args.length).then(code => {
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
                    let address = dAsmFile.getAddress();
                    let length = dAsmFile.getLength();
                    if ((address !== undefined) && (length !== undefined)) {
                        await this.disassembleAddress(address, length).then(variables => {
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