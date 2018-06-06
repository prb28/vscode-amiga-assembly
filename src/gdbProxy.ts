import { Socket } from 'net';
//import { readFileSync } from 'fs';
import { EventEmitter } from 'events';
//import { resolve } from 'dns';

export interface GdbBreakpoint {
    id: number;
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

export class GdbProxy extends EventEmitter {
    // Socket to connect
    private socket: Socket;
    /** Host name */
    private host?: string;
    /** Socket port */
    private port?: number;
    /** Current source file */
    private programFilename?: string;

    constructor() {
        super();
        this.socket = new Socket();
    }

    public connect(host: string, port: number): void {
        this.host = host;
        this.port = port;
        this.socket.connect(this.port, this.host);
        this.socket.on("connect", () => this.emit("connect"));
        this.socket.on("data", this.onData);
    }
    public destroy(): void {
        this.socket.destroy();
    }

    private onData(data: any) {
        console.log(data.toString());
        // TODO : Parse the return and send an event
    }

    public load(programFilename: string) {
        if (this.programFilename !== programFilename) {
            this.programFilename = programFilename;
            //this.programFilename = readFileSync(this._sourceFile).toString().split('\n');
            this.sendPacketString('vRun;dh0:hello;');
        }
    }

    public calculateChecksum(text: string): string {
        let cs = 0;
        var buffer = new Buffer(text);
        for (let i = 0; i < buffer.length; ++i) {
            cs += buffer[i];
        }
        cs = cs % 256;
        return cs.toString(16);
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
        return this.sendPacketString('Z0,0,0').then(function (data) {
            console.log(data.toString());
            return <GdbBreakpoint>{ verified: false, line, id: 0 };
        });
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

    // private sendEvent(event: string, ...args: any[]) {
    //     setImmediate(_ => {
    //         this.emit(event, ...args);
    //     });
    // }
}