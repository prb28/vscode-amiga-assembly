import { Socket } from 'net';
import { EventEmitter } from 'events';
import { Mutex } from 'ts-simple-mutex/build/lib/mutex';
import { GdbAmigaSysThreadId, GdbError, GdbHaltStatus, GdbRegister, GdbSignal, GdbStackFrame, GdbStackPosition, GdbThread, Segment, GdbThreadState } from './gdbProxyCore';
import { GdbBreakpoint } from './breakpointManager';
import { GdbReceivedDataManager as GdbReceivedDataManager, GdbPacketHandler } from './gdbEvents';
import { GdbPacket, GdbPacketType } from './gdbPacket';
import { StringUtils } from './stringUtils';

/**
 * Class to contact the fs-UAE GDB server.
 */
export class GdbProxy extends EventEmitter {
    // Registers Indexes
    // order of registers are assumed to be
    // d0-d7, a0-a7, sr, pc [optional fp0-fp7, control, iar]
    static readonly REGISTER_D0_INDEX = 0; // -> 0 to 7
    static readonly REGISTER_A0_INDEX = 8; // -> 8 to 15
    static readonly REGISTER_SR_INDEX = 16;
    static readonly REGISTER_PC_INDEX = 17;
    static readonly REGISTER_FP0_INDEX = 18; // -> 18 to 25
    static readonly REGISTER_CTRL_INDEX = 26;
    static readonly REGISTER_IAR_INDEX = 27;
    static readonly REGISTER_COPPER_ADDR_INDEX = 28;
    /** Kind of breakpoints */
    static readonly BREAKPOINT_KIND_ABSOLUTE_ADDR = 100;
    /** Code to set the debugger to the current frame index */
    static readonly DEFAULT_FRAME_INDEX = -1;
    /** Supported functions */
    static readonly SUPPORT_STRING = 'qSupported:QStartNoAckMode+;multiprocess+;vContSupported+;QNonStop+';
    /** Install new binaries exception message */
    static readonly BINARIES_ERROR = "Please install latest binaries from FS-UAE custom build https://github.com/prb28/vscode-amiga-assembly/releases";
    /** Unexpected return message */
    static readonly UNEXPECTED_RETURN_ERROR = "Unexpected return message for program launch command";
    /** Socket to connect */
    private socket: Socket;
    /** Current source file */
    private programFilename?: string;
    /** Segments of memory */
    private segments?: Array<Segment>;
    /** Stop on entry asked */
    private stopOnEntryRequested = false;
    /** Flag for the first stop - to install the breakpoints */
    private firstStop = true;
    /** Mutex to just have one call to gdb */
    private mutex = new Mutex({
        autoUnlockTimeoutMs: 1200,
        intervalMs: 100,
    });
    /** vCont commands are supported */
    private supportVCont = false;
    /** Created threads */
    private threads = new Map<number, GdbThread>();
    /** Created threads indexed by native ids */
    private threadsNative = new Map<string, GdbThread>();
    /** function from parent to send all pending breakpoints */
    private sendPendingBreakpointsCallback: (() => Promise<void>) | undefined = undefined;
    /** Manager for the received socket data */
    private receivedDataManager: GdbReceivedDataManager;
    /** Lock for sendPacketString function */
    private sendPacketStringLock?: any;

    /**
     * Constructor 
     * The socket is needed only for unit test mocking.
     * @param socket Socket instance created to contact the server (for unit tests)
     */
    constructor(socket?: Socket) {
        super();
        if (socket) {
            this.socket = socket;
        } else {
            this.socket = new Socket();
        }
        this.receivedDataManager = new GdbReceivedDataManager(this.defaultOnDataHandler);
    }

    /**
     * Function to connect to the server
     * @param host Server host
     * @param port Server socket port
     */
    public connect(host: string, port: number): Promise<void> {
        let self = this;
        return new Promise((resolve, reject) => {
            self.socket.connect(port, host);
            self.socket.once('connect', async () => {
                await self.sendPacketString(GdbProxy.SUPPORT_STRING).then(async data => {
                    const returnedData = data;
                    if (returnedData.indexOf("multiprocess+") >= 0) {
                        GdbThread.setSupportMultiprocess(true);
                    } else {
                        reject(new Error(GdbProxy.BINARIES_ERROR));
                    }
                    if (returnedData.indexOf("vContSupported+") >= 0) {
                        this.supportVCont = true;
                    }
                    if (returnedData.indexOf("QStartNoAckMode+") >= 0) {
                        await self.sendPacketString('QStartNoAckMode').then(_ => {
                            resolve();
                        }).catch(error => {
                            reject(error);
                        });
                    } else {
                        reject(new Error("QStartNoAckMode not active in remote debug"));
                    }
                }).catch(error => {
                    reject(error);
                });
            });
            self.socket.on('error', (err) => {
                if (this.sendPacketStringLock) {
                    this.sendPacketStringLock();
                    this.sendPacketStringLock = undefined;
                }
                self.sendEvent("error", err);
                reject(err);
            });
            self.socket.on("data", async (data) => { await this.onData(this, data); });
        });
    }

    /**
     * Method to destroy the connection.
     */
    public destroy(): void {
        this.socket.destroy();
    }

    /** Default handler for the on data event*/
    private defaultOnDataHandler = (packet: GdbPacket): boolean => {
        this.sendEvent("output", `defaultOnDataHandler (notification : ${packet.isNotification()}) : --> ${packet.getMessage()}`, undefined, undefined, undefined, 'debug');
        let consumed = false;
        switch (packet.getType()) {
            case GdbPacketType.STOP:
                this.parseStop(packet.getMessage());
                break;
            case GdbPacketType.END:
                this.sendEvent("end");
                break;
            case GdbPacketType.MINUS:
                console.error("Unsupported packet : '-'");
                this.sendEvent("error", new Error("Unsupported packet : '-'"));
                break;
            case GdbPacketType.SEGMENT:
                this.parseSegments(packet.getMessage());
                break;
            case GdbPacketType.OK:
            case GdbPacketType.PLUS:
            case GdbPacketType.UNKNOWN:
            default:
                ////console.log("Packet ignored by onData : " + packet.message);
                break;
        }
        return consumed;
    }

    /**
     * Method to precess the generics messages
     * @param proxy A GdbProxy instance
     * @param data Data to parse
     */
    private onData(proxy: GdbProxy, data: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let packets = GdbPacket.parseData(data);
            for (let packet of packets) {
                // plus packet are acknowledge - to be ignored
                if (packet.getType() !== GdbPacketType.PLUS) {
                    this.receivedDataManager.trigger(packet);
                }
            }
            resolve();
        });
    }

    /**
     * Message to load the program
     * @param programFilename Filename of the program with the local path
     * @param stopOnEntry If true we will stop on entry
     */
    public load(programFilename: string, stopOnEntry: boolean | undefined): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.programFilename !== programFilename) {
                this.programFilename = programFilename;
                let elms = this.programFilename.replace(/\\/g, '/').split('/');
                const self = this;
                // Let fs-uae terminate before sending the run command
                // TODO : check if this is necessary
                setTimeout(async function () {
                    self.stopOnEntryRequested = (stopOnEntry !== undefined) && stopOnEntry;
                    let encodedProgramName = StringUtils.convertStringToHex("dh0:" + elms[elms.length - 1]);
                    await self.sendPacketString("vRun;" + encodedProgramName + ";").then(async (message) => {
                        let type = GdbPacket.parseType(message);
                        if (type === GdbPacketType.SEGMENT) {
                            reject(new Error(GdbProxy.BINARIES_ERROR));
                        } else if (type === GdbPacketType.STOP) {
                            // Call for segments
                            await self.getQOffsets().then(async () => {
                                // Call for thread dump
                                await self.getThreadIds().then((threads) => {
                                    for (let th of threads) {
                                        self.sendEvent('threadStarted', th.getId());
                                    }
                                    self.parseStop(message).then(async (_) => {
                                        resolve();
                                    }).catch(err => {
                                        reject(err);
                                    });
                                }).catch(err => {
                                    reject(err);
                                });
                            }).catch(err => {
                                reject(err);
                            });
                        } else {
                            reject(new Error(GdbProxy.UNEXPECTED_RETURN_ERROR));
                        }
                    }).catch(err => {
                        reject(err);
                    });
                }, 100);
            } else {
                resolve();
            }
        });
    }

    public getQOffsets(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.sendPacketString('qOffsets').then(segmentReply => {
                // expected return message : TextSeg=00c03350;DataSeg=00c03350
                let segs = segmentReply.split(";");
                this.segments = new Array<Segment>();
                // The segments message begins with the keyword AS
                for (let seg of segs) {
                    let segElms = seg.split("=");
                    if (segElms.length > 1) {
                        let name = segElms[0];
                        let address = segElms[1];
                        this.segments.push(<Segment>{
                            name: name,
                            address: parseInt(address, 16),
                            size: 0,
                        });
                    }
                }
                resolve();
                this.sendEvent("segmentsUpdated", this.segments);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Calculates a checksum for the text
     * @param text Text to send
     */
    public static calculateChecksum(text: string): string {
        let cs = 0;
        let buffer = Buffer.alloc(text.length, text);
        for (let i = 0; i < buffer.length; ++i) {
            cs += buffer[i];
        }
        cs = cs % 256;
        let s = GdbProxy.formatNumber(cs);
        if (s.length < 2) {
            return "0" + s;
        } else {
            return s;
        }
    }

    /**
     * Prepares a string to be send: checksum + start char
     * @param text Text to be sent
     */
    public formatString(text: string): Buffer {
        let data = Buffer.alloc(text.length + 5);
        let offset = 0;
        data.write('$', offset++);
        data.write(text, offset);
        offset += text.length;
        data.write('#', offset++);
        data.write(GdbProxy.calculateChecksum(text), offset);
        offset += 2;
        data.writeInt8(0, offset);
        return data;
    }

    /**
     * Main send function.
     * If sends a text in the format "$mymessage#checksum"
     * @param text Text to send
     * @return a Promise with the response contents - or a rejection
     */
    public sendPacketString(text: string, expectedType?: GdbPacketType): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let dataToSend = this.formatString(text);
            if (this.socket.writable) {
                this.sendPacketStringLock = await this.mutex.capture('sendPacketString');
                let p = this.receivedDataManager.waitData(<GdbPacketHandler>{
                    handle: (packet: GdbPacket): boolean => {
                        if (packet.getType() === GdbPacketType.ERROR) {
                            reject(this.parseError(packet.getMessage()));
                        } else if ((!expectedType) || (expectedType === packet.getType())) {
                            resolve(packet.getMessage());
                            this.sendEvent("output", `${dataToSend} --> ${packet.getMessage()}`, undefined, undefined, undefined, 'debug');
                            if (this.sendPacketStringLock) {
                                this.sendPacketStringLock();
                                this.sendPacketStringLock = undefined;
                            }
                            return true;
                        }
                        return false;
                    }
                });
                this.socket.write(dataToSend);
                await p;
            } else {
                reject(new Error("Socket can't be written"));
            }
        });
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
                        let segStr = "";
                        if ((segmentId !== undefined) && (segmentId >= 0)) {
                            segStr = ',' + GdbProxy.formatNumber(segmentId);
                        }
                        message = 'Z0,' + GdbProxy.formatNumber(offset) + segStr;
                    }
                    await this.sendPacketString(message).then(function (data) {
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

    public setSendPendingBreakpointsCallback(callback: () => Promise<void>) {
        this.sendPendingBreakpointsCallback = callback;
    }

    /**
     * Sends all the pending breakpoint
     */
    public sendAllPendingBreakpoints(): Promise<void> {
        if (this.sendPendingBreakpointsCallback) {
            return this.sendPendingBreakpointsCallback();
        } else {
            return Promise.reject(new Error("send all pending breakpoints callback not set"));
        }
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
                message = 'z0,' + GdbProxy.formatNumber(offset) + ',' + GdbProxy.formatNumber(segmentId);
            } else if (offset > 0) {
                message = 'z0,' + GdbProxy.formatNumber(offset);
            } else if (exceptionMask !== undefined) {
                message = 'z1,' + GdbProxy.formatNumber(exceptionMask);
            } else {
                reject(new Error("No segments are defined or segmentId is invalid, is the debugger connected?"));
            }
            if (message) {
                await this.sendPacketString(message).then(data => {
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
                message += GdbProxy.formatNumber(num);
            } else if (pc !== null) {
                message += "pc:" + GdbProxy.formatNumber(pc);
            } else {
                reject(new Error("No arguments to select a frame"));
                return;
            }
            await this.sendPacketString(message).then(data => {
                if (data === "-1") {
                    resolve(GdbProxy.DEFAULT_FRAME_INDEX);
                } else {
                    resolve(parseInt(data.substring(1), 16));
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Retrieves the stack position for a frame
     * 
     * @param threadId Thread identifier
     * @param frameIndex Index of the frame selected
     */
    private getStackPosition(thread: GdbThread, frameIndex: number): Promise<GdbStackPosition> {
        return new Promise(async (resolve, reject) => {
            if (thread.getThreadId() === GdbAmigaSysThreadId.CPU) {
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
            } else if (thread.getThreadId() === GdbAmigaSysThreadId.COP) {
                // Retrieve the stack position from the copper
                let haltStatus = await this.getHaltStatus().catch(err => {
                    reject(err);
                });
                if (haltStatus) {
                    for (let hs of haltStatus) {
                        if ((hs.thread) && (hs.thread.getThreadId() === thread.getThreadId())) {
                            let copperValues = await this.getRegisterNumerical('copper', frameIndex).catch(err => {
                                reject(err);
                            });
                            if (copperValues) {
                                resolve(<GdbStackPosition>{
                                    index: frameIndex * 1000,
                                    stackFrameIndex: 0,
                                    segmentId: -10,
                                    offset: 0,
                                    pc: copperValues[0]
                                });
                            } else {
                                reject("No stack frame returned");
                            }
                        }
                    }
                }
            } else {
                reject(new Error("No frames for thread: " + thread.getDisplayName()));
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
            // Retrieve the current frame id
            let stackPosition = await this.getStackPosition(thread, GdbProxy.DEFAULT_FRAME_INDEX).catch(err => {
                reject(err);
            });
            if (!stackPosition) {
                return;
            }
            frames.push(stackPosition);
            if (thread.getThreadId() === GdbAmigaSysThreadId.CPU) {
                let current_frame_index = stackPosition.stackFrameIndex;
                for (let i = current_frame_index; i > 0; i--) {
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
     * Send a stop on step event for thread
     * @param thread selected thread
     */
    private sendStopOnStepEvent(thread: GdbThread) {
        for (let thId of this.threads.keys()) {
            if (thId !== thread.getId()) {
                this.sendEvent('stopOnStep', thId, true);
            }
        }
        this.sendEvent('stopOnStep', thread.getId(), false);
    }

    /**
     * Ask the debugger to step until the pc is in range
     * @param thread Thread selected
     * @param startAddress Start address for the stop range included
     * @param endAddress Start address for the stop range excluded
     */
    public async stepToRange(thread: GdbThread, startAddress: number, endAddress: number): Promise<void> {
        let message: string;
        if (this.supportVCont) {
            // TODO: Remove hack to step over... Put real addresses
            message = 'vCont;r' + GdbProxy.formatNumber(startAddress) + ',' + GdbProxy.formatNumber(endAddress) + ':' + thread.marshall();
        } else {
            // Not a real GDB command...
            message = 'n';
        }
        thread.setState(GdbThreadState.STEPPING);
        return this.sendPacketString(message, GdbPacketType.STOP).then(data => {
            this.sendStopOnStepEvent(thread);
        });
    }

    /**
     * Ask the debugger to step in
     * @param thread Thread selected
     */
    public async stepIn(thread: GdbThread): Promise<void> {
        let message: string;
        if (this.supportVCont) {
            message = 'vCont;s:' + thread.marshall();
        } else {
            message = 's';
        }
        thread.setState(GdbThreadState.STEPPING);
        return this.sendPacketString(message, GdbPacketType.STOP).then(data => {
            this.sendStopOnStepEvent(thread);
        });
    }

    /**
     * Retrieves all the register values
     */
    public registers(frameId: number | null): Promise<Array<GdbRegister>> {
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
            await this.sendPacketString('g').then(message => {
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
                registers.push({
                    name: "sr",
                    value: parseInt(v, 16)
                });
                v = message.slice(pos, pos + 8);
                let pc = parseInt(v, 16);
                registers.push({
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

    /**
     * Reads all the memory from a segment
     * @param segmentId Segment ID
     * @return String returned by the server = bytes in hexa
     */
    public getSegmentMemory(segmentId: number): Promise<string> {
        if (this.segments) {
            if (segmentId < this.segments.length) {
                const segment = this.segments[segmentId];
                return this.getMemory(segment.address, segment.size);
            } else {
                return Promise.reject(new Error(`Segment Id #${segmentId} not found`));
            }
        } else {
            return Promise.reject(new Error("No segments stored in debugger"));
        }
    }

    /**
     * Reads part of the memory
     * @param address Memory address
     * @param length Length to retrieve
     * @return String returned by the server = bytes in hexa
     */
    public getMemory(address: number, length: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this.sendPacketString("m" + GdbProxy.formatNumber(address) + ',' + GdbProxy.formatNumber(length)).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Set values to memory, from address.
     * @param address Address to write
     * @param dataToSend Data to send
     */
    public setMemory(address: number, dataToSend: string): Promise<void> {
        let size = dataToSend.length / 2;
        return new Promise((resolve, reject) => {
            this.sendPacketString("M" + GdbProxy.formatNumber(address) + ',' + size + ':' + dataToSend).then(data => {
                resolve();
            }).catch(err => { reject(err); });
        });
    }

    /**
     * Reads a register value
     * @param register Name of the register a1, a2, etc..
     */
    public getRegister(name: string, frameIndex: number | undefined): Promise<[string, number]> {
        return new Promise(async (resolve, reject) => {
            const unlock = await this.mutex.capture('selectFrame');
            let returnedFrameIndex = GdbProxy.DEFAULT_FRAME_INDEX;
            // the current frame
            if (frameIndex) {
                let sReturnedFrameIndex = await this.selectFrame(frameIndex, null).catch(err => {
                    unlock();
                    reject(err);
                });
                if (sReturnedFrameIndex) {
                    returnedFrameIndex = sReturnedFrameIndex;
                }
                if ((frameIndex !== GdbProxy.DEFAULT_FRAME_INDEX) && (sReturnedFrameIndex !== frameIndex)) {
                    unlock();
                    reject(new Error("Error during frame selection: " + frameIndex));
                    return;
                }
            }
            let regIdx = this.getRegisterIndex(name);
            if (regIdx) {
                await this.sendPacketString("p" + GdbProxy.formatNumber(regIdx)).then(data => {
                    unlock();
                    resolve([data, returnedFrameIndex]);
                }).catch(err => {
                    unlock();
                    reject(err);
                });
            } else {
                reject(new Error("No index found for register: " + name));
            }
            unlock();
        });
    }

    /**
     * Reads a register value
     * @param register Name of the register a1, a2, etc..
     */
    public getRegisterNumerical(name: string, frameIndex: number): Promise<[number, number]> {
        return new Promise(async (resolve, reject) => {
            await this.getRegister(name, frameIndex).then(values => {
                resolve([parseInt(values[0], 16), values[1]]);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Reads the thread id's
     */
    public getThreadIds(): Promise<Array<GdbThread>> {
        return new Promise(async (resolve, reject) => {
            if (this.threads.size <= 0) {
                await this.sendPacketString("qfThreadInfo").then(data => {
                    let pData = data;
                    if (pData.startsWith("m")) {
                        pData = pData.substring(1).trim();
                    }
                    if (pData.endsWith("l")) {
                        pData = pData.substring(0, pData.length - 1);
                    }
                    if (pData.endsWith(",")) {
                        pData = pData.substring(0, pData.length - 1);
                    }
                    let returnedThreads = new Array<GdbThread>();
                    for (let elm of pData.split(',')) {
                        let th = GdbThread.parse(elm);
                        returnedThreads.push(th);
                        this.threads.set(th.getId(), th);
                        this.threadsNative.set(elm, th);
                    }
                    resolve(returnedThreads);
                }).catch(err => {
                    reject(err);
                });
            } else {
                resolve(Array.from(this.threads.values()));
            }
        });
    }

    /**
     * Sends an event
     * @param event Event to send
     * @param args Arguments
     */
    public sendEvent(event: string, ...args: any[]) {
        setImmediate(_ => {
            this.emit(event, ...args);
        });
    }

    /**
     * Parse of the segment message :
     *          AS;addr;size;add2;size
     *  or      AS addr;size;add2;size
     * @param segmentReply The message containing the segments
     */
    protected parseSegments(segmentReply: string) {
        let segs = segmentReply.substring(2).split(";"); // removing "AS"
        this.segments = new Array<Segment>();
        // The segments message begins with the keyword AS
        for (let i = 1; i < segs.length - 1; i += 2) {
            let address = segs[i];
            let size = segs[i + 1];
            this.segments.push(<Segment>{
                address: parseInt(address, 16),
                size: parseInt(size, 16),
            });
        }
        this.sendEvent("segmentsUpdated", this.segments);
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
                    const continueDebugging = !this.stopOnEntryRequested;
                    if (this.firstStop === true) {
                        this.firstStop = false;
                        let rejected = false;
                        await this.sendAllPendingBreakpoints().catch(err => {
                            reject(err);
                            rejected = true;
                        });
                        if (rejected) {
                            return;
                        }
                        if (continueDebugging && currentCpuThread) {
                            // Send continue command
                            await this.continueExecution(currentCpuThread).catch(err => {
                                reject(err);
                            });
                            resolve();
                            break;
                        }
                    }
                    if (this.stopOnEntryRequested) {
                        this.stopOnEntryRequested = false;
                        this.sendEvent('stopOnEntry', currentThreadId);
                    } else if ((!continueDebugging || !this.firstStop)) {
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

    private parseHaltParameters(parameters: string): [GdbThread | undefined, Map<number, number>] {
        let map = new Map<number, number>();
        let thread;
        let elms = parameters.trim().split(';');
        for (let elm of elms) {
            let kv = elm.split(':');
            if (kv.length > 1) {
                if ("thread" === kv[0]) {
                    thread = this.threadsNative.get(kv[1]);
                } else if (kv.length > 0) {
                    map.set(parseInt(kv[0], 16), parseInt(kv[1], 16));
                }
            }
        }
        return [thread, map];
    }

    /**
     * Parses the halt status
     * ‘TAAn1:r1;n2:r2;…’
     * @param message Message to be parsed
     */
    private parseHaltStatus(message: string): GdbHaltStatus {
        // Retrieve the cause
        let sig = parseInt(message.substring(1, 3), 16);
        let parameters: string | null = null;
        if (message.length > 3) {
            parameters = message.substring(3);
        }
        let details = "";
        switch (sig) {
            case GdbSignal.GDB_SIGNAL_INT: // Interrupt
                details = "Interrupt";
                break;
            case GdbSignal.GDB_SIGNAL_ILL: // Illegal instruction
                details = "Illegal instruction";
                break;
            case GdbSignal.GDB_SIGNAL_TRAP: // Trace/breakpoint trap
                details = "Trace/breakpoint trap";
                break;
            case GdbSignal.GDB_SIGNAL_EMT: // Emulation trap
                details = "Emulation trap";
                break;
            case GdbSignal.GDB_SIGNAL_FPE: // Arithmetic exception
                details = "Arithmetic exception";
                break;
            case GdbSignal.GDB_SIGNAL_BUS: // Bus error
                details = "Bus error";
                break;
            case GdbSignal.GDB_SIGNAL_SEGV: // Segmentation fault
                details = "Segmentation fault";
                break;
            default:
                details = "Other exception";
                break;

        }
        let posString = "";
        let registersMap;
        let thread;
        if (parameters) {
            [thread, registersMap] = this.parseHaltParameters(parameters);
            let pc = registersMap.get(GdbProxy.REGISTER_PC_INDEX);
            if (pc) {
                posString = " in $" + GdbProxy.formatNumber(pc);
            }
            if (thread) {
                posString += " thread: " + thread.getDisplayName();
            }
        } else {
            registersMap = new Map<number, number>();
        }
        return <GdbHaltStatus>{
            code: sig,
            details: "Exception " + sig + posString + ": " + details,
            thread: thread,
            registers: registersMap
        };
    }

    /**
     * Ask for the status of the current stop
     */
    public async getHaltStatus(): Promise<GdbHaltStatus[]> {
        return new Promise(async (resolve, reject) => {
            let rejected = false;
            let returnedHaltStatus = new Array<GdbHaltStatus>();
            let response = await this.sendPacketString('?').catch(err => {
                reject(err);
                rejected = true;
            });
            if (response) {
                if (response.indexOf("OK") < 0) {
                    returnedHaltStatus.push(this.parseHaltStatus(response));
                    let finished = false;
                    while (!finished && !rejected) {
                        let vStoppedResponse = await this.sendPacketString('vStopped').catch(err => {
                            reject(err);
                            rejected = true;
                        });
                        if (vStoppedResponse && vStoppedResponse.indexOf("OK") < 0) {
                            returnedHaltStatus.push(this.parseHaltStatus(vStoppedResponse));
                        } else {
                            finished = true;
                        }
                    }
                }
            }
            if (!rejected) {
                resolve(returnedHaltStatus);
            }
        });
    }

    /**
     * Ask for a pause
     * 
     * @param thread Thread to pause
     */
    public async pause(thread: GdbThread): Promise<void> {
        let message: string;
        if (this.supportVCont) {
            message = 'vCont;t:' + thread.marshall();
        } else {
            // Not a real GDB command...
            message = 'vCtrlC';
        }
        thread.setState(GdbThreadState.STEPPING);
        return this.sendPacketString(message).then(data => {
            this.sendEvent('stopOnPause', thread.getId());
        });
    }

    /**
     * Continue the execution
     */
    public async continueExecution(thread: GdbThread): Promise<void> {
        let message: string;
        if (this.supportVCont) {
            message = 'vCont;c:' + thread.marshall();
        } else {
            // Not a real GDB command...
            message = 'c';
        }
        thread.setState(GdbThreadState.RUNNING);
        return this.sendPacketString(message).then(data => {
            this.sendEvent('continueThread', thread.getId(), true);
        });
    }

    /**
     * Gets the register index from it's name
     */
    public getRegisterIndex(name: string): number | null {
        if (name.length > 1) {
            let type = name.charAt(0);
            let idx = parseInt(name.charAt(1));
            if (type === 'd') {
                return idx + GdbProxy.REGISTER_D0_INDEX;
            } else if (type === 'a') {
                return idx + GdbProxy.REGISTER_A0_INDEX;
            } else if (name === 'pc') {
                return GdbProxy.REGISTER_PC_INDEX;
            } else if (name === 'sr') {
                return GdbProxy.REGISTER_SR_INDEX;
            } else if (name === 'copper') {
                return GdbProxy.REGISTER_COPPER_ADDR_INDEX;
            }
        }
        return null;
    }

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
                    await this.sendPacketString(message).then(data => {
                        resolve(data);
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
     * Returns a stored thread from it's id.
     */
    public getThread(gdbThreadId: number): GdbThread | undefined {
        return this.threads.get(gdbThreadId);
    }

    /**
     * Returns the thread with an amiga sys type
     */
    public getThreadFromSysThreadId(sysThreadId: GdbAmigaSysThreadId): GdbThread | undefined {
        for (let t of this.threads.values()) {
            if (t.getThreadId() === sysThreadId) {
                return t;
            }
        }
        return undefined;
    }

    /**
     * Returns the current CPU thread...
     */
    public getCurrentCpuThread(): GdbThread | undefined {
        return this.getThreadFromSysThreadId(GdbAmigaSysThreadId.CPU);
    }

    /**
     * Returns the current array of segments
     * @return array of segments or undefined
     */
    public getSegments(): Segment[] | undefined {
        return this.segments;
    }

    /**
     * Adds a segment retrieved from the hunk file
     * @param segment Segment to add
     * @return the start address of the segment
     */
    public addSegment(segment: Segment): number {
        if (this.segments) {
            let lastSegment = this.segments[this.segments.length - 1];
            segment.address = lastSegment.address + lastSegment.size;
            this.segments.push(segment);
            return segment.size;
        }
        return -1;
    }

    /**
     * Parsing an error message
     * @param message Error message
     */
    protected parseError(message: string): GdbError {
        let error = new GdbError(message);
        this.sendEvent('error', error);
        return error;
    }

    /**
     * Transforms an absolute offset to a segmentsId and local offset
     * @param offset Absolute offset
     * @return Array with segmentId and a local offset
     */
    public toRelativeOffset(offset: number): [number, number] {
        if (this.segments) {
            let segmentId = 0;
            for (let segment of this.segments) {
                if ((offset >= (segment.address)) && (offset <= segment.address + segment.size)) {
                    return [segmentId, offset - segment.address];
                }
                segmentId++;
            }
        }
        return [-1, offset];
    }

    /**
     * Transforms an offset in local segment coordinated to an absolute offset
     */
    public toAbsoluteOffset(segmentId: number, offset: number): number {
        if (this.segments) {
            if (segmentId < this.segments.length) {
                return this.segments[segmentId].address + offset;
            }
        }
        return offset;
    }

    /**
     * Formats a number to send
     * @param n number 
     */
    protected static formatNumber(n: number): string {
        if (n === 0) {
            return "0";
        }
        return n.toString(16);
    }
}

