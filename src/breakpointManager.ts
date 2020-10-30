import { Mutex } from "ts-simple-mutex";
import { DebugProtocol } from "vscode-debugprotocol";
import { DebugDisassembledFile, DebugDisassembledManager } from "./debugDisassembled";
import { DebugInfo } from "./debugInfo";
import { GdbProxy } from "./gdbProxy";

/**
 * Class to contact the fs-UAE GDB server.
 */
export class BreakpointManager {
    // Default selection mask for exception : each bit is a exception code
    static readonly DEFAULT_EXCEPTION_MASK = 0b1111111000000010000011110000000000000000011111111111100;
    /** Proxy to Gdb */
    private gdbProxy: GdbProxy;
    /** Breakpoints selected */
    private breakpoints = new Array<GdbBreakpoint>();
    /** Pending breakpoint no yet sent to debugger */
    private pendingBreakpoints = new Array<GdbBreakpoint>();
    /** Debug information for the loaded program */
    private debugInfo?: DebugInfo;
    /** Manager of disassembled code */
    private debugDisassembledManager: DebugDisassembledManager;
    /** Next breakpoint id */
    private nextBreakpointId = 0;
    /** Temporary breakpoints arrays */
    private temporaryBreakpointArrays = new Array<GdbTemporaryBreakpointArray>();
    /** Mutex to just have one call to gdb */
    protected mutex = new Mutex({
        autoUnlockTimeoutMs: 1200,
        intervalMs: 100,
    });
    /** Lock for breakpoint management function */
    protected breakpointLock?: any;

    public constructor(gdbProxy: GdbProxy, debugDisassembledManager: DebugDisassembledManager) {
        this.gdbProxy = gdbProxy;
        this.debugDisassembledManager = debugDisassembledManager;
        this.gdbProxy.setSendPendingBreakpointsCallback(this.sendAllPendingBreakpoint);
    }

    public setDebugInfo(debugInfo: DebugInfo) {
        this.debugInfo = debugInfo;
    }

    public addPendingBreakpoint(breakpoint: GdbBreakpoint, err?: Error) {
        breakpoint.verified = false;
        if (err) {
            breakpoint.message = err.message;
        }
        this.pendingBreakpoints.push(breakpoint);
    }

    private fillBreakpointWithSegAddress(debugBp: GdbBreakpoint, path: string, line: number): Promise<boolean> {
        return new Promise(async (resolve, _reject) => {
            if (this.debugInfo) {
                let values = await this.debugInfo.getAddressSeg(path, line);
                if (values) {
                    debugBp.segmentId = values[0];
                    debugBp.offset = values[1];
                    resolve(true);
                }
            }
            resolve(false);
        });
    }

    public checkPendingBreakpointsAddresses(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (this.debugInfo) {
                for (let debugBp of this.pendingBreakpoints) {
                    if (debugBp.source && debugBp.line) {
                        const path = <string>debugBp.source.path;
                        if (!DebugDisassembledFile.isDebugAsmFile(path)) {
                            await this.fillBreakpointWithSegAddress(debugBp, path, debugBp.line);
                        }
                    }
                }
            }
            resolve();
        });
    }

    public setBreakpoint(debugBp: GdbBreakpoint): Promise<GdbBreakpoint> {
        return new Promise(async (resolve, reject) => {
            if (debugBp.source && debugBp.line && (debugBp.id !== undefined)) {
                debugBp.verified = false;
                const path = <string>debugBp.source.path;

                if (!DebugDisassembledFile.isDebugAsmFile(path)) {
                    if (this.debugInfo) {
                        if (await this.fillBreakpointWithSegAddress(debugBp, path, debugBp.line)) {
                            await this.gdbProxy.setBreakpoint(debugBp).then(() => {
                                this.breakpoints.push(debugBp);
                                resolve(debugBp);
                            }).catch((err) => {
                                this.addPendingBreakpoint(debugBp, err);
                                reject(err);
                            });
                        } else {
                            let err = new Error("Segment offset not resolved");
                            this.addPendingBreakpoint(debugBp, err);
                            reject(err);
                        }
                    } else {
                        let err = new Error("Debug information not resolved retrieved");
                        this.addPendingBreakpoint(debugBp, err);
                        reject(err);
                    }
                } else {
                    const name = <string>debugBp.source.name;
                    await this.debugDisassembledManager.getAddressForFileEditorLine(name, debugBp.line).then(async address => {
                        debugBp.segmentId = undefined;
                        debugBp.offset = address;
                        await this.gdbProxy.setBreakpoint(debugBp).then(() => {
                            this.breakpoints.push(debugBp);
                            resolve(debugBp);
                        }).catch((err) => {
                            this.addPendingBreakpoint(debugBp, err);
                            reject(err);
                        });
                    }).catch((err) => {
                        this.addPendingBreakpoint(debugBp, err);
                        reject(err);
                    });
                }
            } else {
                let err = new Error("Breakpoint info incomplete");
                this.addPendingBreakpoint(debugBp, err);
                reject(err);
            }
        });
    }

    public createBreakpoint(source: DebugProtocol.Source, line: number): GdbBreakpoint {
        return <GdbBreakpoint>{
            id: this.nextBreakpointId++,
            line: line,
            source: source,
            verified: false
        };
    }

    public createTemporaryBreakpoint(address: number): GdbBreakpoint {
        return <GdbBreakpoint>{
            id: this.nextBreakpointId++,
            segmentId: undefined,
            offset: address,
            temporary: true,
            verified: false
        };
    }

    public addTemporaryBreakpointArray(temporaryBreakpointArray: GdbTemporaryBreakpointArray): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.temporaryBreakpointArrays.push(temporaryBreakpointArray);
            for (let debugBp of temporaryBreakpointArray.breakpoints) {
                await this.gdbProxy.setBreakpoint(debugBp).then(() => {
                    this.breakpoints.push(debugBp);
                }).catch((err) => {
                    reject(err);
                });
            }
            resolve();
        });
    }

    public removeTemporaryBreakpointArray(temporaryBreakpointArray: GdbTemporaryBreakpointArray): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.breakpointLock = await this.mutex.capture('breakpointLock');
            for (let debugBp of temporaryBreakpointArray.breakpoints) {
                await this.gdbProxy.removeBreakpoint(debugBp);
                this.breakpoints = this.breakpoints.filter(item => item.offset !== debugBp.offset);
            }
            this.temporaryBreakpointArrays = this.temporaryBreakpointArrays.filter(item => item !== temporaryBreakpointArray);
            if (this.breakpointLock) {
                this.breakpointLock();
                this.breakpointLock = undefined;
            }
            resolve();
        });
    }

    public createTemporaryBreakpointArray(offsets: Array<number>): GdbTemporaryBreakpointArray {
        let tempArray = new GdbTemporaryBreakpointArray();
        for (let addr of offsets) {
            let debugBp = this.createTemporaryBreakpoint(addr);
            tempArray.addBreakpoint(debugBp);
        }
        return tempArray;
    }

    public checkTemporaryBreakpoints(pc: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let arraysToRemove = new Array<GdbTemporaryBreakpointArray>();
            for (let tempArray of this.temporaryBreakpointArrays) {
                for (let bp of tempArray.breakpoints) {
                    if (bp.offset === pc) {
                        arraysToRemove.push(tempArray);
                    }
                }
            }
            for (let tempArray of arraysToRemove) {
                await this.removeTemporaryBreakpointArray(tempArray).catch(err => {
                    reject(err);
                });
            }
            resolve();
        });
    }


    public createExceptionBreakpoint(): GdbBreakpoint {
        return <GdbBreakpoint>{
            id: this.nextBreakpointId++,
            exceptionMask: BreakpointManager.DEFAULT_EXCEPTION_MASK,
            verified: false
        };
    }

    public sendAllPendingBreakpoint = (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            this.breakpointLock = await this.mutex.capture('breakpointLock');
            if ((this.pendingBreakpoints) && this.pendingBreakpoints.length > 0) {
                let pending = this.pendingBreakpoints;
                this.pendingBreakpoints = new Array<GdbBreakpoint>();
                for (let bp of pending) {
                    await this.setBreakpoint(bp).catch(() => {
                        //nothing to do - the breakpoint was already added to the pending list
                    });
                }
            }
            if (this.breakpointLock) {
                this.breakpointLock();
                this.breakpointLock = undefined;
            }
            resolve();
        });
    }

    /**
     * Ask for an exception breakpoint
     */
    public setExceptionBreakpoint(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let breakpoint = this.createExceptionBreakpoint();
            await this.gdbProxy.setBreakpoint(breakpoint).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Ask to remove an exception breakpoint
     */
    public removeExceptionBreakpoint(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.breakpointLock = await this.mutex.capture('breakpointLock');
            let breakpoint = this.createExceptionBreakpoint();
            await this.gdbProxy.removeBreakpoint(breakpoint).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
            if (this.breakpointLock) {
                this.breakpointLock();
                this.breakpointLock = undefined;
            }
        });
    }

    private isSameSource(source: DebugProtocol.Source, other: DebugProtocol.Source): boolean {
        let path = source.path;
        if (path) {
            return ((source.path === other.path) ||
                (DebugDisassembledFile.isDebugAsmFile(path) && source.name === other.name));
        }
        return source.path === other.path;
    }

    public clearBreakpoints(source: DebugProtocol.Source): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let hasError = false;
            let remainingBreakpoints = new Array<GdbBreakpoint>();
            this.breakpointLock = await this.mutex.capture('breakpointLock');
            for (let bp of this.breakpoints) {
                if (bp.source && this.isSameSource(bp.source, source)) {
                    await this.gdbProxy.removeBreakpoint(bp).catch(err => {
                        remainingBreakpoints.push(bp);
                        hasError = true;
                    });
                } else {
                    remainingBreakpoints.push(bp);
                }
            }
            this.breakpoints = remainingBreakpoints;
            if (this.breakpointLock) {
                this.breakpointLock();
                this.breakpointLock = undefined;
            }
            if (hasError) {
                reject(new Error("Some breakpoints cannot be removed"));
            } else {
                resolve();
            }
        });
    }

    public getPendingBreakpoints(): Array<GdbBreakpoint> {
        return this.pendingBreakpoints;
    }
}

/** Interface for a breakpoint */
export interface GdbBreakpoint extends DebugProtocol.Breakpoint {
    /** Id for the segment if undefined it is an absolute offset*/
    segmentId?: number;
    /** Offset relative to the segment*/
    offset: number;
    /** exception mask : if present it is an exception breakpoint */
    exceptionMask?: number;
    /** if true it a temporary breakpoint */
    temporary?: boolean;
}

/**
 * Class to store connected temporary breakpoints
 */
export class GdbTemporaryBreakpointArray {
    public breakpoints = new Array<GdbBreakpoint>();

    /**
     * Adds a breakpoint to the array
     * @param breakpoint Breakpoint to add
     */
    public addBreakpoint(breakpoint: GdbBreakpoint) {
        this.breakpoints.push(breakpoint);
    }
}
