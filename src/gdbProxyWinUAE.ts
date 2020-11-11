import { GdbAmigaSysThreadIdWinUAE, GdbHaltStatus, GdbRegister, GdbSignal, GdbStackFrame, GdbStackPosition, GdbThread, Segment } from './gdbProxyCore';
import { GdbBreakpoint } from './breakpointManager';
import { GdbPacketType } from './gdbPacket';
import { StringUtils } from './stringUtils';
import { GdbProxy } from './gdbProxy';

/**
 * Class to contact the fs-UAE GDB server.
 */
export class GdbProxyWinUAE extends GdbProxy {
    /**
     * Message to initialize the program
     * @param stopOnEntry If true we will stop on entry
     */
    public async initProgram(stopOnEntry: boolean | undefined): Promise<void> {
        await this.getQOffsets();
        // Call for thread dump
        let threads = await this.getThreadIds();
        for (let th of threads) {
            this.sendEvent('threadStarted', th.getId());
        }
    }

    /**
     * Message to load the program
     * @param programFilename Filename of the program with the local path
     * @param stopOnEntry If true we will stop on entry
     */
    public async load(programFilename: string, stopOnEntry: boolean | undefined): Promise<void> {
        if (this.programFilename !== programFilename) {
            this.programFilename = programFilename;
            let elms = this.programFilename.replace(/\\/g, '/').split('/');
            const self = this;
            // Let fs-uae terminate before sending the run command
            // TODO : check if this is necessary
            await new Promise(resolve => setTimeout(async function () {
                self.stopOnEntryRequested = (stopOnEntry !== undefined) && stopOnEntry;
                let encodedProgramName = StringUtils.convertStringToHex("dh0:" + elms[elms.length - 1]);
                let message = await self.sendPacketString("vRun;" + encodedProgramName + ";", GdbPacketType.STOP);
                // Call for segments
                await self.initProgram(stopOnEntry);
                await self.parseStop(message);
            }, 100));
        }
    }

    public async getQOffsets(): Promise<void> {
        let segmentReply = await this.sendPacketString('qOffsets', GdbPacketType.UNKNOWN);
        // expected return message : TextSeg=00c03350;DataSeg=00c03350
        let segs = segmentReply.split(";");
        this.segments = new Array<Segment>();
        // The segments message begins with the keyword AS
        let segIdx = 0;
        for (let seg of segs) {
            segIdx++;
            let name: string;
            let address: string;
            let segElms = seg.split("=");
            if (segElms.length > 1) {
                name = segElms[0];
                address = segElms[1];
            } else {
                name = `Segment${segIdx}`;
                address = segElms[0];
            }
            this.segments.push(<Segment>{
                name: name,
                address: parseInt(address, 16),
                size: 0,
            });
        }
        this.sendEvent("segmentsUpdated", this.segments);
    }


    /**
     * Ask for a new breakpoint
     * @param breakpoint breakpoint to add
     * @return Promise with a breakpoint
     */
    public setBreakpoint(breakpoint: GdbBreakpoint): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let segmentId = breakpoint.segmentId;
            let offset = breakpoint.offset;
            let exceptionMask = breakpoint.exceptionMask;
            let self = this;
            if (!this.socket.writable) {
                reject(new Error("The Gdb connection is not opened"));
            } else {
                if (this.segments && (segmentId !== undefined) && (segmentId >= this.segments.length)) {
                    reject(new Error("Invalid breakpoint segment id: " + segmentId));
                    return;
                } else if ((offset >= 0) || exceptionMask) {
                    let message: string;
                    if (exceptionMask) {
                        let expMskHex = GdbProxy.formatNumber(exceptionMask);
                        let expMskHexSz = GdbProxy.formatNumber(expMskHex.length);
                        message = "Z1,0,0;X" + expMskHexSz + "," + expMskHex;
                    } else {
                        let offsetStr = "";
                        if ((segmentId !== undefined) && (segmentId >= 0)) {
                            offsetStr = GdbProxy.formatNumber(this.toAbsoluteOffset(segmentId, offset));
                        } else {
                            offsetStr = GdbProxy.formatNumber(offset);
                        }
                        message = 'Z0,' + offsetStr;
                    }
                    await this.sendPacketString(message, GdbPacketType.OK).then(function (data) {
                        breakpoint.verified = true;
                        breakpoint.message = undefined;
                        self.sendEvent("breakpointValidated", breakpoint);
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    reject(new Error("Invalid breakpoint offset"));
                }
            }
        });
    }


    /**
     * Ask for a breakpoint removal
     * @param breakpoint breakpoint to remove
     */
    public removeBreakpoint(breakpoint: GdbBreakpoint): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let segmentId = breakpoint.segmentId;
            let offset = breakpoint.offset;
            let exceptionMask = breakpoint.exceptionMask;
            let message: string | undefined = undefined;
            if (this.segments && (segmentId !== undefined) && (segmentId < this.segments.length)) {
                message = 'z0,' + GdbProxy.formatNumber(this.toAbsoluteOffset(segmentId, offset));
            } else if (offset > 0) {
                message = 'z0,' + GdbProxy.formatNumber(offset);
            } else if (exceptionMask !== undefined) {
                message = 'z1,' + GdbProxy.formatNumber(exceptionMask);
            } else {
                reject(new Error("No segments are defined or segmentId is invalid, is the debugger connected?"));
            }
            if (message) {
                await this.sendPacketString(message, GdbPacketType.OK).then(data => {
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            }
        });
    }

    /**
     * Ask the frame index for pc offset
     */
    public selectFrame(num: number | null, pc: number | null): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let message = "QTFrame:";
            if (num !== null) {
                if (num < 0) {
                    message += "ffffffff";
                    await this.sendPacketString(message, GdbPacketType.OK).catch(err => {
                        reject(err);
                    });
                    resolve(GdbProxy.DEFAULT_FRAME_INDEX);
                    return;
                } else {
                    message += GdbProxy.formatNumber(num);
                }
            } else if (pc !== null) {
                message += "pc:" + GdbProxy.formatNumber(pc);
            } else {
                reject(new Error("No arguments to select a frame"));
                return;
            }
            await this.sendPacketString(message, GdbPacketType.FRAME).then(data => {
                if (data === "F-1") {
                    // No frame found
                    resolve(GdbProxy.DEFAULT_FRAME_INDEX);
                } else {
                    let v = data.substring(1);
                    let tPos = v.indexOf("T");
                    if (tPos >= 0) {
                        v = v.substring(0, tPos);
                    }
                    resolve(parseInt(v, 16));
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Retrieves the thread display name
     * 
     * @param threadId Thread identifier
     * @return name
     */
    public getThreadDisplayName(thread: GdbThread): string {
        return thread.getDisplayName(true);
    }

    /**
     * Ask the frames count
     * @param threadId Thread identifier
     */
    public getFramesCount(thread: GdbThread): Promise<number> {
        return new Promise(async (resolve, reject) => {
            if (thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.CPU) {
                let message = "qTStatus";
                await this.sendPacketString(message, GdbPacketType.QTSTATUS).then(data => {
                    let frameCountPosition = data.indexOf("tframes");
                    if (frameCountPosition > 0) {
                        let endFrameCountPosition = data.indexOf(";", frameCountPosition);
                        if (endFrameCountPosition <= 0) {
                            endFrameCountPosition = data.length;
                        }
                        let v = data.substring(frameCountPosition + 8, endFrameCountPosition);
                        resolve(parseInt(v, 16));
                    }
                }).catch(err => {
                    reject(err);
                });
            } else {
                resolve(1);
            }
        });
    }

    /**
     * Retrieves the stack position for a frame
     * 
     * @param threadId Thread identifier
     * @param frameIndex Index of the frame selected
     */
    protected getStackPosition(thread: GdbThread, frameIndex: number): Promise<GdbStackPosition> {
        return new Promise(async (resolve, reject) => {
            if (thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.CPU) {
                // Get the current frame
                let values = await this.getRegisterNumerical('pc', frameIndex).catch(err => {
                    reject(err);
                });
                if (values) {
                    let pc = values[0];
                    let [segmentId, offset] = this.toRelativeOffset(pc);
                    resolve(<GdbStackPosition>{
                        index: frameIndex,
                        stackFrameIndex: values[1],
                        segmentId: segmentId,
                        offset: offset,
                        pc: pc
                    });
                } else {
                    reject(new Error("Error retrieving stack frame for index " + frameIndex + ": pc not retrieved"));
                }
            } else if (thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.COP) {
                // Retrieve the stack position from the copper
                let haltStatus = await this.getHaltStatus().catch(err => {
                    reject(err);
                });
                if (haltStatus) {
                    let registersValues = await this.registers(null, thread).catch(err => {
                        reject(err);
                    });
                    if (registersValues) {
                        let copperPcValue = 0;
                        for (let v of registersValues) {
                            if (v.name === 'pc') {
                                copperPcValue = v.value;
                                break;
                            }
                        }
                        resolve(<GdbStackPosition>{
                            index: frameIndex * 1000,
                            stackFrameIndex: 0,
                            segmentId: -10,
                            offset: 0,
                            pc: copperPcValue
                        });
                    } else {
                        reject("No stack frame returned");
                    }
                }
            } else {
                reject(new Error("No frames for thread: " + this.getThreadDisplayName(thread)));
            }
        });
    }

    /**
     * Gets the current stack frame
     * 
     * @param thread Thread identifier
     */
    public stack(thread: GdbThread): Promise<GdbStackFrame> {
        return new Promise(async (resolve, reject) => {
            let frames = new Array<GdbStackPosition>();
            // Retrieve the current frame
            let stackPosition = await this.getStackPosition(thread, GdbProxy.DEFAULT_FRAME_INDEX).catch(err => {
                reject(err);
            });
            if (stackPosition === undefined) {
                return;
            }
            frames.push(stackPosition);
            if (thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.CPU) {
                // Retrieve the current frame count
                let stackSize = await this.getFramesCount(thread).catch(err => {
                    reject(err);
                });
                if (stackSize === undefined) {
                    return;
                }
                for (let i = stackSize - 1; i >= 0; i--) {
                    stackPosition = await this.getStackPosition(thread, i).catch(err => {
                        reject(err);
                    });
                    if (!stackPosition) {
                        return;
                    }
                    frames.push(stackPosition);
                }
            }
            resolve(<GdbStackFrame>{
                frames: frames,
                count: frames.length
            });
        });
    }

    /**
     * Retrieves all the register values
     */
    public registers(frameId: number | null, thread: GdbThread | null): Promise<Array<GdbRegister>> {
        return new Promise(async (resolve, reject) => {
            const unlock = await this.mutex.capture('selectFrame');
            if (frameId !== null) {
                // sets the current frameId
                await this.selectFrame(frameId, null).catch(err => {
                    unlock();
                    reject(err);
                    return;
                });
            }
            let command = 'g';
            if (thread !== null) {
                command = 'Hg' + thread.getThreadId();
            }
            await this.sendPacketString(command, GdbPacketType.UNKNOWN).then(message => {
                unlock();
                //console.trace("register : " + data.toString());
                let registers = new Array<GdbRegister>();
                let pos = 0;
                let letter = 'd';
                let v = "";
                for (let j = 0; j < 2; j++) {
                    for (let i = 0; i < 8; i++) {
                        let name = letter + i;
                        v = message.slice(pos, pos + 8);
                        registers.push({
                            name: name,
                            value: parseInt(v, 16)
                        });
                        pos += 8;
                    }
                    letter = 'a';
                }
                v = message.slice(pos, pos + 8);
                pos += 8;
                let sr = parseInt(v, 16);
                registers.push({
                    name: "sr",
                    value: sr
                });
                for (let i = 0; i < GdbProxy.SR_LABELS.length; i++) {
                    let label = GdbProxy.SR_LABELS[i];
                    if (label !== null) {
                        let mask = 1 << (15 - i);
                        let b = sr & mask;
                        let vb = 0;
                        if (b) {
                            vb = 1;
                        }
                        registers.push({
                            name: label,
                            value: vb
                        });
                    }
                }

                v = message.slice(pos, pos + 8);
                let pc = parseInt(v, 16);
                registers.unshift({
                    name: "pc",
                    value: pc
                });
                resolve(registers);
            }).catch(err => {
                unlock();
                reject(err);
            });
        });
    }

    protected parseStop(message: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let haltStatus = this.parseHaltStatus(message);
            let currentCpuThread = this.getCurrentCpuThread();
            let currentThreadId = -1;
            if (haltStatus.thread) {
                currentThreadId = haltStatus.thread.getId();
            } else if (currentCpuThread) {
                currentThreadId = currentCpuThread.getId();
            }
            switch (haltStatus.code) {
                case GdbSignal.GDB_SIGNAL_TRAP: // Trace/breakpoint trap
                    // A breakpoint has been reached
                    if (this.stopOnEntryRequested) {
                        this.stopOnEntryRequested = false;
                        this.sendEvent('stopOnEntry', currentThreadId);
                    } else {
                        this.sendEvent('stopOnBreakpoint', currentThreadId);
                    }
                    resolve();
                    break;
                case GdbSignal.GDB_SIGNAL_EMT: // Emulation trap -> copper breakpoint
                    // Exception reached
                    this.sendEvent('stopOnBreakpoint', currentThreadId);
                    resolve();
                    break;
                default:
                    // Exception reached
                    this.sendEvent('stopOnException', haltStatus, currentThreadId);
                    resolve();
                    break;
            }
        });
    }

    /**
     * Ask for the status of the current stop
     */
    public async getHaltStatus(): Promise<GdbHaltStatus[]> {
        return new Promise(async (resolve, reject) => {
            let rejected = false;
            let returnedHaltStatus = new Array<GdbHaltStatus>();
            let response = await this.sendPacketString('?', GdbPacketType.STOP).catch(err => {
                reject(err);
                rejected = true;
            });
            if (response) {
                if (response.indexOf("OK") < 0) {
                    returnedHaltStatus.push(this.parseHaltStatus(response));
                }
            }
            if (!rejected) {
                resolve(returnedHaltStatus);
            }
        });
    }

    // /**
    //  * Continue the execution
    //  */
    // public async continueExecution(thread: GdbThread): Promise<void> {
    //     let message: string;
    //     if (this.supportVCont) {
    //         message = 'vCont;c:' + thread.marshall();
    //     } else {
    //         // Not a real GDB command...
    //         message = 'c';
    //     }
    //     thread.setState(GdbThreadState.RUNNING);
    //     this.sendPacketString(message);
    //     this.sendEvent('continueThread', thread.getId(), true);
    // }

    /**
     * Sets tha value of a register
     * @param name Name of the register
     * @param value New value of the register
     */
    public setRegister(name: string, value: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            // Verify that the value is an hex
            let valueRegExp = /[a-z\d]{1,8}/i;
            if (valueRegExp.test(value)) {
                let regIdx = this.getRegisterIndex(name);
                if (regIdx !== null) {
                    let message = "P" + regIdx.toString(16) + "=" + value;
                    await this.sendPacketString(message, GdbPacketType.OK).then(data => {
                        resolve(value);
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    reject(new Error("Invalid register name: " + name));
                }
            } else {
                reject(new Error("The value must be a hex string with at most 8 digits"));
            }
        });
    }


    /**
     * Returns the current CPU thread...
     */
    public getCurrentCpuThread(): GdbThread | undefined {
        return this.getThreadFromSysThreadId(GdbAmigaSysThreadIdWinUAE.CPU);
    }

    /**
     * Checks if it is a CPU thread
     * @param thread Thread to test
     * @return true if it is a CPU thread
     */
    public isCPUThread(thread: GdbThread): boolean {
        return thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.CPU;
    }

    /**
     * Checks if it is a copper thread
     * @param thread Thread to test
     * @return true if it is a copper thread
     */
    public isCopperThread(thread: GdbThread): boolean {
        return thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.COP;
    }
}

