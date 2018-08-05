import { Socket } from 'net';
import { EventEmitter } from 'events';
import { Mutex } from 'ts-simple-mutex/build';

/** Interface for a breakpoint */
export interface GdbBreakpoint {
    /** Indetifier */
    id: number;
    /** Id for the segment */
    segmentId: number;
    /** Offset relative to the segment*/
    offset: number;
    /** if true the breakpoint is verified */
    verified: boolean;
    /** exception mask : if present it is an exception breakpoint */
    exceptionMask?: number;
}

/** Stackframe position */
export interface GdbStackPosition {
    /** Index of the positions */
    index: number;
    /** Segment identifier */
    segmentId: number;
    /** Offset relative to the segment*/
    offset: number;
}

/** StackFrame */
export interface GdbStackFrame {
    frames: Array<GdbStackPosition>;
    count: number;
}

/** Register value */
export interface GdbRegister {
    name: string;
    value: number;
}

/** Memory segment */
export interface Segment {
    address: number;
    size: number;
}

/** Type of the message packet */
export enum GdbPacketType {
    ERROR,
    REGISTER,
    MEMORY,
    SEGMENT,
    END,
    STOP,
    UNKNOWN,
    OK,
    PLUS,
    MINUS
}

/** Packet sent by the debugging server */
export interface GdbPacket {
    type: GdbPacketType;
    command?: string;
    message: string;
}

/** Halt signal */
export enum GdbSignal {
    // Interrupt
    GDB_SIGNAL_INT = 2,
    // Illegal instruction
    GDB_SIGNAL_ILL = 4,
    // Trace/breakpoint trap
    GDB_SIGNAL_TRAP = 5,
    // Emulation trap
    GDB_SIGNAL_EMT = 7,
    // Arithmetic exception
    GDB_SIGNAL_FPE = 8,
    // Bus error
    GDB_SIGNAL_BUS = 10,
    // Segmentation fault
    GDB_SIGNAL_SEGV = 11

}

/** Status for the current halt */
export interface GdbHaltStatus {
    code: number;
    details: string;
}

/**
 * Class to contact the fs-UAE GDB server.
 */
export class GdbProxy extends EventEmitter {
    // Socket to connect
    private socket: Socket;
    // break point id counter
    private nextBreakPointId = 0;
    /** Current source file */
    private programFilename?: string;
    /** Segmentes of memory */
    private segments?: Array<Segment>;
    /** Breakpoints selected */
    private breakPoints = new Array<GdbBreakpoint>();
    /** Pending breakpoint no yet sent to debuger */
    private pendingBreakpoints: Array<GdbBreakpoint> | null = null;
    /** Current frames */
    private frames = new Array<GdbStackPosition>();
    /** Stop on entry asked */
    private stopOnEntryRequested = false;
    /** Flag for the first stop - to install the breakpoints */
    private firstStop = true;
    /** Map of the last register values */
    private lastRegisters = new Map<string, string>();
    /** Mutex to just have one call to gdb */
    private mutex = new Mutex({
        autoUnlockTimeoutMs: 1200,
        intervalMs: 100,
    });

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
            self.socket.once('connect', () => {
                self.sendPacketString('QStartNoAckMode').then(data => {
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
            self.socket.on('error', (err) => {
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

    /**
     * Parses the type of the packet
     * @param message packet message to parse
     */
    protected static parseType(message: string): GdbPacketType {
        if (message.startsWith("OK")) {
            return GdbPacketType.OK;
        } else if (message.startsWith("+")) {
            return GdbPacketType.PLUS;
        } else if (message.startsWith("AS")) {
            return GdbPacketType.SEGMENT;
        } else if (message.startsWith("E")) {
            return GdbPacketType.ERROR;
        } else if ((message.startsWith("S") || (message.startsWith("T")))) {
            return GdbPacketType.STOP;
        } else if (message.startsWith("W")) {
            return GdbPacketType.END;
        } else if (message.startsWith("-")) {
            return GdbPacketType.MINUS;
        }
        return GdbPacketType.UNKNOWN;
    }

    /**
     * Extracts the contents of the packet
     * @param message Packet message to parse
     */
    protected static extractPacket(message: string): string {
        if (message.startsWith('$')) {
            let pos = message.indexOf('#');
            if (pos > 0) {
                return message.substring(1, pos);
            }
        }
        return message;
    }

    /**
     * Parses the data recieved.
     * @param data DAta to parse
     */
    protected static parseData(data: any): GdbPacket[] {
        let s = data.toString();
        let parsedData = new Array<GdbPacket>();
        if (s === '+') {
            parsedData.push(<GdbPacket>{
                type: GdbPacketType.PLUS,
                message: s
            });
        } else {
            let messageRegexp = /\$([\sa-z\d;:/\\.]+)\#[\da-f]{2}/gi;
            let match;
            while (match = messageRegexp.exec(s)) {
                let message = GdbProxy.extractPacket(match[1]);
                parsedData.push(<GdbPacket>{
                    type: GdbProxy.parseType(message),
                    message: message
                });
            }
        }
        // TODO: check the checksum and and to resend the message if it is not verified
        return parsedData;
    }

    /**
     * Method to precess the generics messages
     * @param proxy A GdbProxy istance
     * @param data Data to parse
     */
    private onData(proxy: GdbProxy, data: any): Promise<void> {
        //console.log("<---" + data.toString());
        return new Promise(async (resolve, reject) => {
            for (let packet of GdbProxy.parseData(data)) {
                switch (packet.type) {
                    case GdbPacketType.ERROR:
                        await this.parseError(packet.message);
                        break;
                    case GdbPacketType.STOP:
                        await this.parseStop(packet.message);
                        break;
                    case GdbPacketType.END:
                        await this.sendEvent("end");
                        break;
                    case GdbPacketType.MINUS:
                        // TODO: Send last message
                        console.error("Unsupported packet : '-'");
                        proxy.sendEvent("error", new Error("Unsupported packet : '-'"));
                        break;
                    case GdbPacketType.SEGMENT:
                        this.parseSegments(packet.message);
                        break;
                    case GdbPacketType.OK:
                    case GdbPacketType.PLUS:
                        break;
                    case GdbPacketType.UNKNOWN:
                    default:
                        ////console.log("Packet ignored by onData : " + packet.message);
                        break;
                }
            }
            resolve();
        });
    }

    /**
     * Check if the reponse has an error
     * @param data The data to check
     * @return True if it has an error
     */
    protected responseHasNoError(data: any): boolean {
        let packets = GdbProxy.parseData(data);
        for (let packet of packets) {
            if (packet.type === GdbPacketType.ERROR) {
                return false;
            }
        }
        return true;
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
                let elms = this.programFilename.replace('\\', '/').split('/');
                this.sendPacketString("Z0,0,0").then(async data => {
                    let self = this;
                    // Let fs-uae terminate before sending the run command
                    // TODO : check if this is necessary
                    await setTimeout(async function () {
                        self.stopOnEntryRequested = (stopOnEntry !== undefined) && stopOnEntry;
                        await self.sendPacketString("vRun;dh0:" + elms[elms.length - 1] + ";").then((message) => {
                            let type = GdbProxy.parseType(message);
                            if (type === GdbPacketType.SEGMENT) {
                                self.parseSegments(message);
                            } else {
                                console.error("Unexpected return message for program lauch command");
                            }
                            resolve();
                        }).catch(err => {
                            reject(err);
                        });
                    }, 100);
                }).catch(err => {
                    reject(err);
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Calculates a checksum for the text
     * @param text Text to send
     */
    public static calculateChecksum(text: string): string {
        let cs = 0;
        var buffer = new Buffer(text);
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
     * Main send function.
     * If sends a text in the format "$mymessage#checksum"
     * @param text Text to send
     * @return a Promise with the response contents - or a rejection
     */
    public sendPacketString(text: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            var data = new Buffer(text.length + 5);
            let offset = 0;
            data.write('$', offset++);
            data.write(text, offset);
            offset += text.length;
            data.write('#', offset++);
            data.write(GdbProxy.calculateChecksum(text), offset);
            offset += 2;
            data.writeInt8(0, offset);
            //console.log(" --->" + data.toString());
            const unlock = await this.mutex.capture('key');
            this.socket.write(data);
            this.socket.once('data', (data) => {
                unlock();
                let packets = GdbProxy.parseData(data);
                let firstMessage = null;
                for (let packet of packets) {
                    if (packet.type === GdbPacketType.ERROR) {
                        reject(new Error(packet.message));
                    } else if (!firstMessage) {
                        firstMessage = packet.message;
                    }
                }
                if (firstMessage) {
                    resolve(firstMessage);
                } else {
                    reject(new Error("Invalid message : '" + data.toString() + "'"));
                }
            });
            this.socket.once('error', (err) => {
                unlock();
                reject(err);
            });
        });
    }

    /**
     * Ask for a new breakpoint
     * @param segmentId Identifier of the segment
     * @param offset Offset in segment coordinated
     * @return Promise with a breakpoint
     */
    public setBreakPoint(segmentId: number, offset: number, exceptionMask?: number): Promise<GdbBreakpoint> {
        let self = this;
        if (((this.segments) || ((segmentId === 0) && (offset === 0))) && (this.socket.writable)) {
            if (this.segments && (segmentId >= this.segments.length)) {
                return Promise.reject(new Error("Invalid breakpoint segment id: " + segmentId));
            } else {
                let message: string;
                if (exceptionMask) {
                    let expMskHex = GdbProxy.formatNumber(exceptionMask);
                    let expMskHexSz = GdbProxy.formatNumber(expMskHex.length);
                    message = 'Z1,' + GdbProxy.formatNumber(offset) + ',' + GdbProxy.formatNumber(segmentId) + ";X" + expMskHexSz + "," + expMskHex;
                } else {
                    message = 'Z0,' + GdbProxy.formatNumber(offset) + ',' + GdbProxy.formatNumber(segmentId);
                }
                return this.sendPacketString(message).then(function (data) {
                    let bp = <GdbBreakpoint>{
                        verified: true,
                        segmentId: segmentId,
                        offset: offset,
                        id: self.nextBreakPointId++,
                        exceptionMask: exceptionMask
                    };
                    self.breakPoints.push(bp);
                    self.sendEvent("breakpointValidated", bp);
                    return bp;
                });
            }
        } else {
            let bp = <GdbBreakpoint>{
                verified: false,
                segmentId: segmentId,
                offset: offset,
                id: self.nextBreakPointId++,
                exceptionMask: exceptionMask
            };
            if (!this.pendingBreakpoints) {
                this.pendingBreakpoints = new Array<GdbBreakpoint>();
            }
            this.pendingBreakpoints.push(bp);
            //console.log("Breakpoint added to pending: " + segmentId + "," + offset);
            return Promise.resolve(bp);
        }
    }

    /**
     * Sends all the pending breakpoint
     */
    public sendAllPendingBreakpoints(): Promise<GdbBreakpoint[]> {
        return new Promise(async (resolve, reject) => {
            if ((this.pendingBreakpoints) && this.pendingBreakpoints.length > 0) {
                let pending = this.pendingBreakpoints;
                this.pendingBreakpoints = new Array<GdbBreakpoint>();
                let breakpoints: GdbBreakpoint[] = [];
                for (let bp of pending) {
                    await this.setBreakPoint(bp.segmentId, bp.offset, bp.exceptionMask).then(bp => {
                        breakpoints.push(bp);
                    });
                }
                resolve(breakpoints);
            } else {
                resolve([]);
            }
        });
    }

    /**
     * Ask for a breakpoint removal
     * @param segmentId Id of the segment
     * @param offset Offset in local coordinates
     */
    public removeBreakPoint(segmentId: number, offset: number, exceptionMask?: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (this.segments && (segmentId < this.segments.length)) {
                // Look for the breakpoint in the current list
                let breakpoint = null;
                let pos = 0;
                for (let bp of this.breakPoints) {
                    if ((bp.segmentId === segmentId) && (bp.offset === offset) && (bp.exceptionMask === exceptionMask)) {
                        breakpoint = bp;
                        break;
                    }
                    pos++;
                }
                if (breakpoint) {
                    this.breakPoints.splice(pos, 1);
                    let code = 0;
                    if (exceptionMask) {
                        code = 1;
                    }
                    await this.sendPacketString('z' + code + ',' + GdbProxy.formatNumber(offset) + ',' + GdbProxy.formatNumber(segmentId)).then(data => { resolve(); });
                } else {
                    reject(new Error("Breakpoint not found"));
                }
            } else {
                reject(new Error("No segments are define or segmentId is invalid, is the debugger connected?"));
            }
        });
    }

    /**
     * Clear all the breakpoints for a segment
     * @param segmentId Id of the segment
     */
    public clearBreakpoints(segmentId: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (this.breakPoints.length > 0) {
                if (this.segments && (segmentId < this.segments.length)) {
                    let keep = new Array<GdbBreakpoint>();
                    let bp = this.breakPoints.pop();
                    while (bp) {
                        if (bp.segmentId === segmentId) {
                            await this.sendPacketString('z0,' + GdbProxy.formatNumber(bp.offset) + ',' + GdbProxy.formatNumber(bp.segmentId)).catch(err => {
                                reject(err);
                            });
                        } else {
                            keep.push(bp);
                        }
                        bp = this.breakPoints.pop();
                    }
                    this.breakPoints = keep;
                    resolve();
                } else {
                    reject(new Error("No segments are define, is the debugger connected?"));
                }
            } else {
                // there are no breakpoints to remove
                resolve();
            }
        });
    }

    /**
     * Gets the current stack frame
     */
    public stack(): Promise<GdbStackFrame> {
        return new Promise((resolve, reject) => {
            return this.registers().then(() => {
                resolve(<GdbStackFrame>{
                    frames: this.frames,
                    count: this.frames.length
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Ask the debbuger to step 
     */
    public step(): Promise<void> {
        return this.sendPacketString('n').then(data => { return; });
    }

    /**
     * Ask the debbuger to step in
     */
    public stepIn(): Promise<void> {
        return this.sendPacketString('s').then(data => { return; });
    }

    /**
     * Retrieves all the register values
     */
    public registers(): Promise<Array<GdbRegister>> {
        this.lastRegisters.clear();
        return this.sendPacketString('g').then(message => {
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
                    this.lastRegisters.set(name, v);
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
            this.lastRegisters.set("sr", v);
            v = message.slice(pos, pos + 8);
            pos += 8;
            let pc = parseInt(v, 16);
            registers.push({
                name: "pc",
                value: pc
            });
            this.lastRegisters.set("pc", v);
            this.frames = [];
            let [segmentId, offset] = this.toRelativeOffset(pc);
            this.frames.push(<GdbStackPosition>{
                index: 1,
                segmentId: segmentId,
                offset: offset,
            });
            return registers;
        });
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
    public getRegister(register: string): (string | undefined) {
        return this.lastRegisters.get(register);
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
                // TODO the segments should be in hex --- modify in fs-uae
                address: parseInt(address, 16),
                size: parseInt(size, 16),
            });
        }
        this.sendEvent("segmentsUpdated", this.segments);
    }

    protected parseStop(message: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let haltStatus = this.parseHaltStatus(message);
            switch (haltStatus.code) {
                case GdbSignal.GDB_SIGNAL_TRAP: // Trace/breakpoint trap
                    // A breakpoint has been reached
                    await this.registers().then(async (registers: Array<GdbRegister>) => {
                        const continueDebugging = !this.stopOnEntryRequested;
                        if (this.firstStop === true) {
                            this.firstStop = false;
                            await this.sendAllPendingBreakpoints().then(async () => {
                                if (continueDebugging) {
                                    // Send continue command
                                    await this.continueExecution();
                                    resolve();
                                }
                            }).catch(err => {
                                reject(err);
                            });
                        }
                        if (this.stopOnEntryRequested) {
                            this.stopOnEntryRequested = false;
                            this.sendEvent('stopOnEntry');
                        } else if (!continueDebugging || !this.firstStop) {
                            this.sendEvent('stopOnBreakpoint');
                        }
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                    break;
                default:
                    // Exception reached
                    this.sendEvent('stopOnException', haltStatus);
                    resolve();
                    break;
            }
        });
    }

    private parseHaltParameters(parameters: string): Map<string, string> {
        let map = new Map<string, string>();
        let elms = parameters.split(';');
        for (let elm of elms) {
            let kv = elm.split(':');
            if (kv.length > 0) {
                map.set(kv[0], kv[1]);
            }
        }
        return map;
    }

    private getPcFromHaltParameters(parameters: string): string | undefined {
        let map = this.parseHaltParameters(parameters);
        return map.get('00');
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
        if (parameters) {
            let pc = this.getPcFromHaltParameters(parameters);
            if (pc) {
                posString = " in $" + pc;
            }
        }
        return <GdbHaltStatus>{ code: sig, details: "Exception " + sig + posString + ": " + details };
    }

    /**
     * Ask for the status of the current stop
     */
    public getHaltStatus(): Promise<GdbHaltStatus> {
        return this.sendPacketString('?').then(message => {
            return this.parseHaltStatus(message);
        });
    }

    /**
     * Ask for a pause
     */
    public pause(): Promise<void> {
        return this.sendPacketString('vCtrlC').then(() => {
            return;
        });
    }

    /**
     * Continue the execution
     */
    public continueExecution(): Promise<void> {
        return this.sendPacketString('c').then(data => { return; });
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
                return this.sendPacketString("P" + name + "=" + value).then(data => { resolve(data); }).catch(err => { reject(err); });
            } else {
                reject(new Error("The value must be a hex string with at most 8 digits"));
            }
        });
    }

    /**
     * Returns the current array of segments
     * @return array of segments or undefined
     */
    public getSegments(): Segment[] | undefined {
        return this.segments;
    }

    /**
     * Parsing an error message
     * @param message Error message
     */
    protected parseError(message: string) {
        this.sendEvent('error', new Error(message));
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
        return n.toString(16);
    }

}

