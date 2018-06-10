import { Socket } from 'net';
//import { readFileSync } from 'fs';
import { EventEmitter } from 'events';
//import { resolve } from 'dns';

export interface GdbBreakpoint {
    id: number;
    file: string;
    line: number;
    verified: boolean;
}

export interface GdbStackPosition {
    index: number;
    name: string;
    file: string;
    line: number;
}

export interface GdbStackFrame {
    frames: Array<GdbStackPosition>;
    count: number;
}

export interface GdbRegister {
    name: string;
    value: string;
}

export interface Segment {
    address: number;
    size: number;
}

export class GdbProxy extends EventEmitter {
    // Socket to connect
    private socket: Socket;
    /** Host name */
    //private host?: string;
    /** Socket port */
    //private port?: number;
    /** Current source file */
    private programFilename?: string;
    /** Segmentes of memory */
    private segments?: Array<Segment>;
    /** Breakpoints selected */
    private breakPoints = new Array<GdbBreakpoint>();
    /** Pending breakpoint no yet sent to debuger */
    private pendingBreakpoints: Array<GdbBreakpoint> | null = null;

    constructor() {
        super();
        this.socket = new Socket();
    }

    public connect(host: string, port: number): Promise<void> {
        //this.host = host;
        //this.port = port;
        let self = this;
        return new Promise((resolve, reject) => {
            self.socket.connect(port, host);
            self.socket.once('connect', () => {
                return self.sendPacketString('QStartNoAckMode').then(function (data: any) {
                    if (self.pendingBreakpoints) {
                        let pending = self.pendingBreakpoints;
                        self.pendingBreakpoints = null;
                        let promises: Promise<GdbBreakpoint>[] = pending.map(bp => {
                            return self.setBreakPoint(bp.file, bp.line);
                        });
                        Promise.all(promises).then(() => {
                            self.sendEvent("connect");
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            });
            self.socket.once('error', (err) => {
                self.sendEvent("error", err);
                reject(err);
            });
            self.socket.on("data", (data) => { this.onData(this, data); });
        });
    }
    public destroy(): void {
        this.socket.destroy();
    }

    private onData(proxy: GdbProxy, data: any) {
        let message = proxy.extractPacket(data.toString());
        console.log(data.toString());
        if (message.startsWith("AS")) {
            proxy.parseSegments(message);
        } else if (message.startsWith("E")) {
            proxy.parseError(message);
        } else if (message.startsWith("S")) {
            proxy.parseStop(message);
        } else if (message.startsWith("W")) {
            proxy.sendEvent("end");
        }
    }

    public load(programFilename: string) {
        if (this.programFilename !== programFilename) {
            this.programFilename = programFilename;
            let elms = this.programFilename.replace('\\', '/').split('/');
            this.sendPacketString("vRun;dh0:" + elms[elms.length - 1] + ";");
        }
    }

    public calculateChecksum(text: string): string {
        let cs = 0;
        var buffer = new Buffer(text);
        for (let i = 0; i < buffer.length; ++i) {
            cs += buffer[i];
        }
        cs = cs % 256;
        let s = cs.toString(16);
        if (s.length < 2) {
            return "0" + s;
        } else {
            return s;
        }
    }

    public sendPacketString(text: string): Promise<any> {
        return new Promise((resolve, reject) => {
            var data = new Buffer(text.length + 5);
            let offset = 0;
            data.write('$', offset++);
            data.write(text, offset);
            offset += text.length;
            data.write('#', offset++);
            data.write(this.calculateChecksum(text), offset);
            offset += 2;
            data.writeInt8(0, offset);
            console.log(data.toString());
            this.socket.write(data);
            this.socket.once('data', (data) => {
                resolve(data);
                if (data.toString().endsWith('exit')) {
                    this.socket.destroy();
                }
            });
            this.socket.once('error', (err) => {
                reject(err);
            });
        });
    }

    public setBreakPoint(path: string, line: number): Promise<GdbBreakpoint> {
        let self = this;
        if (this.socket.writable) {
            return this.sendPacketString('Z0,0,0').then(function (data) {
                console.log(data.toString());
                let bp = <GdbBreakpoint>{ verified: false, line, id: 0 };
                self.breakPoints.push(bp);
                return bp;
            });
        } else {
            let bp = <GdbBreakpoint>{ verified: false, line, id: 0 };
            if (!this.pendingBreakpoints) {
                this.pendingBreakpoints = new Array<GdbBreakpoint>();
            }
            this.pendingBreakpoints.push(bp);
            return Promise.resolve(bp);
        }
    }

    public clearBreakpoints(path: string) {

    }

    public stack(): Promise<GdbStackFrame> {
        return this.sendPacketString("").then(data => {
            const frames = new Array<GdbStackPosition>();
            return {
                frames: frames,
                count: frames.length
            };
        });
    }

    public continue() {
        // TODO : continue
        this.sendPacketString('n');
    }

    public step() {
        this.sendPacketString('n');
    }

    public registers(): Promise<Array<GdbRegister>> {
        return this.sendPacketString('g').then(data => {
            let dataStr = data.toString();
            let registers = new Array<GdbRegister>();
            let pos = 0;
            let letter = 'd';
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 6; i++) {
                    let v = dataStr.slice(pos, pos + 8);
                    registers.push({
                        name: letter + i,
                        value: v
                    });
                    pos += 8;
                }
                letter = 'a';
            }
            return registers;
        });
    }

    /**
     * Sends an event
     * @param event Event to send
     * @param args Arguments
     */
    private sendEvent(event: string, ...args: any[]) {
        setImmediate(_ => {
            this.emit(event, ...args);
        });
    }

    /**
     * Parse of the segment message :
     *          AS;addr;size;add2;size
     * @param segmentReply The message containing the segments
     */
    protected parseSegments(segmentReply: string) {
        let segs = segmentReply.split(";");
        this.segments = new Array<Segment>();
        // The segments message begins with the keyword AS
        for (let i = 1; i < segs.length - 2; i += 2) {
            let address = segs[i];
            let size = segs[i + 1];
            this.segments.push(<Segment>{
                address: parseInt(address),
                size: parseInt(size),
            });
        }
        this.sendEvent("segmentsUpdated");
    }

    protected parseStop(message: string) {
        // Retrieve the cause
        let sid = message.split(';')[0];
        let n = parseInt(sid, 16);
        switch (n) {
            case 5:
                // A breakpoint has been reached
                this.sendEvent('stopOnBreakpoint');
            default:
                break;

        }
    }

    protected extractPacket(message: string): string {
        if (message.startsWith('$')) {
            let pos = message.indexOf('#');
            if (pos > 0) {
                return message.substring(1, pos);
            }
        }
        return message;
    }

    /**
     * Parsing an error message
     * @param message Error message
     */
    protected parseError(message: string) {
        this.sendEvent('error', message);
    }
}

