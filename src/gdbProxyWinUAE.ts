import { GdbAmigaSysThreadIdWinUAE, GdbHaltStatus, GdbRegister, GdbSignal, GdbStackFrame, GdbStackPosition, GdbThread, Segment } from './gdbProxyCore';
import { GdbBreakpoint, GdbBreakpointAccessType } from './breakpointManager';
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
        this.setConnected();
        await this.getQOffsets();
        // Call for thread dump
        const threads = await this.getThreadIds();
        for (const th of threads) {
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
            const elms = this.programFilename.replace(/\\/g, '/').split('/');
            // Let fs-uae terminate before sending the run command
            // TODO : check if this is necessary
            await new Promise<void>((resolve, reject) => setTimeout(async () => {
                this.stopOnEntryRequested = (stopOnEntry !== undefined) && stopOnEntry;
                const encodedProgramName = StringUtils.convertStringToHex("dh0:" + elms[elms.length - 1]);
                // Call for segments
                try {
                    const message = await this.sendPacketString("vRun;" + encodedProgramName + ";", GdbPacketType.STOP);
                    await this.initProgram(stopOnEntry);
                    await this.parseStop(message);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }, 100));
        }
    }

    public async getQOffsets(): Promise<void> {
        const segmentReply = await this.sendPacketString('qOffsets', GdbPacketType.UNKNOWN);
        // expected return message : TextSeg=00c03350;DataSeg=00c03350
        const segs = segmentReply.split(";");
        this.segments = new Array<Segment>();
        // The segments message begins with the keyword AS
        let segIdx = 0;
        for (const seg of segs) {
            segIdx++;
            let name: string;
            let address: string;
            const segElms = seg.split("=");
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
    public async setBreakpoint(breakpoint: GdbBreakpoint): Promise<void> {
        const segmentId = breakpoint.segmentId;
        const offset = breakpoint.offset;
        const exceptionMask = breakpoint.exceptionMask;
        const accessType = breakpoint.accessType;
        const size = breakpoint.size;
        if (!this.socket.writable) {
            throw new Error("The Gdb connection is not opened");
        } else {
            await this.waitConnected();
            if (this.segments && (segmentId !== undefined) && (segmentId >= this.segments.length)) {
                throw new Error("Invalid breakpoint segment id: " + segmentId);
            } else if ((offset >= 0) || exceptionMask) {
                let message: string;
                if (exceptionMask) {
                    const expMskHex = GdbProxy.formatNumber(exceptionMask);
                    const expMskHexSz = GdbProxy.formatNumber(expMskHex.length);
                    message = "Z1,0,0;X" + expMskHexSz + "," + expMskHex;
                } else if (size && size > 0 && accessType) {
                    let code: number;
                    switch (accessType) {
                        case GdbBreakpointAccessType.READ:
                            code = 2;
                            break;
                        case GdbBreakpointAccessType.WRITE:
                            code = 3;
                            break;
                        case GdbBreakpointAccessType.READWRITE:
                            code = 4;
                            break;
                    }
                    // Data breakpoint
                    message = `Z${code},${GdbProxy.formatNumber(offset)},${GdbProxy.formatNumber(size)}`;
                } else {
                    let offsetStr = "";
                    if ((segmentId !== undefined) && (segmentId >= 0)) {
                        offsetStr = GdbProxy.formatNumber(this.toAbsoluteOffset(segmentId, offset));
                    } else {
                        offsetStr = GdbProxy.formatNumber(offset);
                    }
                    message = 'Z0,' + offsetStr;
                }
                await this.sendPacketString(message, GdbPacketType.OK);
                breakpoint.verified = true;
                breakpoint.message = undefined;
                this.sendEvent("breakpointValidated", breakpoint);
            } else {
                throw new Error("Invalid breakpoint offset");
            }
        }
    }


    /**
     * Ask for a breakpoint removal
     * @param breakpoint breakpoint to remove
     */
    public async removeBreakpoint(breakpoint: GdbBreakpoint): Promise<void> {
        const segmentId = breakpoint.segmentId;
        const offset = breakpoint.offset;
        const exceptionMask = breakpoint.exceptionMask;
        const accessType = breakpoint.accessType;
        const size = breakpoint.size;
        let message: string | undefined = undefined;
        await this.waitConnected();
        if (this.segments && (segmentId !== undefined) && (segmentId < this.segments.length)) {
            message = 'z0,' + GdbProxy.formatNumber(this.toAbsoluteOffset(segmentId, offset));
        } else if (offset > 0) {
            if (size && size > 0 && accessType) {
                let code: number;
                switch (accessType) {
                    case GdbBreakpointAccessType.READ:
                        code = 2;
                        break;
                    case GdbBreakpointAccessType.WRITE:
                        code = 3;
                        break;
                    case GdbBreakpointAccessType.READWRITE:
                        code = 4;
                        break;
                }
                // Data breakpoint
                message = `z${code},${GdbProxy.formatNumber(offset)}`;
            } else {
                message = 'z0,' + GdbProxy.formatNumber(offset);
            }
        } else if (exceptionMask !== undefined) {
            message = 'z1,' + GdbProxy.formatNumber(exceptionMask);
        } else {
            throw new Error("No segments are defined or segmentId is invalid, is the debugger connected?");
        }
        await this.sendPacketString(message, GdbPacketType.OK);
    }

    /**
     * Ask the frame index for pc offset
     */
    public async selectFrame(num: number | null, pc: number | null): Promise<number> {
        try {
            let message = "QTFrame:";
            if (num !== null) {
                if (num < 0) {
                    message += "ffffffff";
                    await this.sendPacketString(message, GdbPacketType.OK);
                    return GdbProxy.DEFAULT_FRAME_INDEX;
                } else {
                    message += GdbProxy.formatNumber(num);
                }
            } else if (pc !== null) {
                message += "pc:" + GdbProxy.formatNumber(pc);
            } else {
                throw new Error("No arguments to select a frame");
            }
            const data = await this.sendPacketString(message, GdbPacketType.FRAME);
            if (data === "F-1") {
                // No frame found
                return GdbProxy.DEFAULT_FRAME_INDEX;
            } else {
                let v = data.substring(1);
                const tPos = v.indexOf("T");
                if (tPos >= 0) {
                    v = v.substring(0, tPos);
                }
                return parseInt(v, 16);
            }
        } catch (err) {
            return GdbProxy.DEFAULT_FRAME_INDEX;
        }
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
    public async getFramesCount(thread: GdbThread): Promise<number> {
        if (thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.CPU) {
            const message = "qTStatus";
            const data = await this.sendPacketString(message, GdbPacketType.QTSTATUS);
            const frameCountPosition = data.indexOf("tframes");
            if (frameCountPosition > 0) {
                let endFrameCountPosition = data.indexOf(";", frameCountPosition);
                if (endFrameCountPosition <= 0) {
                    endFrameCountPosition = data.length;
                }
                const v = data.substring(frameCountPosition + 8, endFrameCountPosition);
                return parseInt(v, 16);
            }
        }
        return 1;
    }

    /**
     * Retrieves the stack position for a frame
     * 
     * @param threadId Thread identifier
     * @param frameIndex Index of the frame selected
     */
    protected async getStackPosition(thread: GdbThread, frameIndex: number): Promise<GdbStackPosition> {
        if (thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.CPU) {
            // Get the current frame
            const values = await this.getRegisterNumerical('pc', frameIndex);
            if (values) {
                const pc = values[0];
                const [segmentId, offset] = this.toRelativeOffset(pc);
                return <GdbStackPosition>{
                    index: frameIndex,
                    stackFrameIndex: values[1] + 1,
                    segmentId: segmentId,
                    offset: offset,
                    pc: pc
                };
            } else {
                throw new Error("Error retrieving stack frame for index " + frameIndex + ": pc not retrieved");
            }
        } else if (thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.COP) {
            // Retrieve the stack position from the copper
            const haltStatus = await this.getHaltStatus();
            if (haltStatus) {
                const registersValues = await this.registers(null, thread);
                if (registersValues) {
                    let copperPcValue = 0;
                    for (const v of registersValues) {
                        if (v.name === 'pc') {
                            copperPcValue = v.value;
                            break;
                        }
                    }
                    return <GdbStackPosition>{
                        index: frameIndex * 1000,
                        stackFrameIndex: 1,
                        segmentId: -10,
                        offset: 0,
                        pc: copperPcValue
                    };
                } else {
                    throw new Error("No stack frame returned");
                }
            }
        }
        throw new Error("No frames for thread: " + this.getThreadDisplayName(thread));
    }

    /**
     * Gets the current stack frame
     * 
     * @param thread Thread identifier
     */
    public async stack(thread: GdbThread): Promise<GdbStackFrame> {
        const unlock = await this.mutex.capture('stack');
        try {
            const frames = new Array<GdbStackPosition>();
            // Retrieve the current frame
            let stackPosition = await this.getStackPosition(thread, GdbProxy.DEFAULT_FRAME_INDEX);
            frames.push(stackPosition);
            if (thread.getThreadId() === GdbAmigaSysThreadIdWinUAE.CPU) {
                // Retrieve the current frame count
                const stackSize = await this.getFramesCount(thread);
                for (let i = stackSize - 1; i >= 0; i--) {
                    try {
                        stackPosition = await this.getStackPosition(thread, i);
                        frames.push(stackPosition);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
            return <GdbStackFrame>{
                frames: frames,
                count: frames.length
            };
        } finally {
            unlock();
        }
    }

    /**
     * Retrieves all the register values
     */
    public async registers(frameId: number | null, thread: GdbThread | null): Promise<Array<GdbRegister>> {
        const unlock = await this.mutex.capture('selectFrame');
        try {
            if (frameId !== null) {
                // sets the current frameId
                await this.selectFrame(frameId, null);
            }
            let command = 'g';
            if (thread !== null) {
                command = 'Hg' + thread.getThreadId();
            }
            const message = await this.sendPacketString(command, GdbPacketType.UNKNOWN);
            let registers = new Array<GdbRegister>();
            let pos = 0;
            let letter = 'd';
            let v = "";
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 8; i++) {
                    const name = letter + i;
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
            const sr = parseInt(v, 16);
            registers.push({
                name: "sr",
                value: sr
            });
            registers = registers.concat(GdbProxy.getSRDetailedValues(sr));
            v = message.slice(pos, pos + 8);
            const pc = parseInt(v, 16);
            registers.unshift({
                name: "pc",
                value: pc
            });
            return registers;
        } finally {
            unlock();
        }
    }

    protected async parseStop(message: string): Promise<void> {
        const haltStatus = this.parseHaltStatus(message);
        const currentCpuThread = this.getCurrentCpuThread();
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
                break;
            case GdbSignal.GDB_SIGNAL_EMT: // Emulation trap -> copper breakpoint
                // Exception reached
                this.sendEvent('stopOnBreakpoint', currentThreadId);
                break;
            default:
                // Exception reached
                this.sendEvent('stopOnException', haltStatus, currentThreadId);
                break;
        }
    }

    /**
     * Ask for the status of the current stop
     */
    public async getHaltStatus(): Promise<GdbHaltStatus[]> {
        const returnedHaltStatus = new Array<GdbHaltStatus>();
        const response = await this.sendPacketString('?', GdbPacketType.STOP);
        if (response.indexOf("OK") < 0) {
            returnedHaltStatus.push(this.parseHaltStatus(response));
        }
        return returnedHaltStatus;
    }

    /**
     * Sets tha value of a register
     * @param name Name of the register
     * @param value New value of the register
     */
    public async setRegister(name: string, value: string): Promise<string> {
        // Verify that the value is an hex
        const valueRegExp = /[a-z\d]{1,8}/i;
        if (valueRegExp.test(value)) {
            const regIdx = this.getRegisterIndex(name);
            if (regIdx !== null) {
                const message = "P" + regIdx.toString(16) + "=" + value;
                const response = await this.sendPacketString(message, null);
                if (response && response.indexOf("OK") >= 0) {
                    return value;
                } else {
                    throw new Error("Error setting the register value");
                }
            } else {
                throw new Error("Invalid register name: " + name);
            }
        } else {
            throw new Error("The value must be a hex string with at most 8 digits");
        }
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

