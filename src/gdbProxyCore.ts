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
    /** Index of the position */
    index: number;
    /** Index of the stack frame */
    stackFrameIndex: number;
    /** Segment identifier */
    segmentId: number;
    /** Offset relative to the segment*/
    offset: number;
    /** Pc of the frame */
    pc: number;
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
    FRAME,
    MINUS
}

/** Information for threads in emulator */
export class GdbThread {
    private static supportMultiprocess = false;
    private static nextId = 0;
    private id: number;
    private processId: number;
    private threadId: number;
    public constructor(processId: number, threadId: number) {
        this.id = GdbThread.getNextId();
        this.processId = processId;
        this.threadId = threadId;
    }
    public marshall(): string {
        return this.processId.toString(16) + '.' + this.threadId.toString(16);
    }
    public static parse(value: string): GdbThread {
        let pth = value.split('.');
        let pId = 0;
        let tId = 0;
        if (pth.length > 1) {
            pId = parseInt(pth[0], 16);
            tId = parseInt(pth[1], 16);
        } else {
            tId = parseInt(pth[0], 16);
        }
        return new GdbThread(pId, tId);
    }
    /**
     * Constructs the name of a thread
     */
    public getDisplayName(): string {
        let name: string;
        if (this.processId === 0) {
            switch (this.threadId) {
                case GdbAmigaSysThreadId.AUD0:
                    name = 'audio 0';
                    break;
                case GdbAmigaSysThreadId.AUD1:
                    name = 'audio 1';
                    break;
                case GdbAmigaSysThreadId.AUD2:
                    name = 'audio 2';
                    break;
                case GdbAmigaSysThreadId.AUD3:
                    name = 'audio 3';
                    break;
                case GdbAmigaSysThreadId.BLT:
                    name = 'blitter';
                    break;
                case GdbAmigaSysThreadId.BPL:
                    name = 'bit-plane';
                    break;
                case GdbAmigaSysThreadId.COP:
                    name = 'copper';
                    break;
                case GdbAmigaSysThreadId.CPU:
                    name = 'cpu';
                    break;
                case GdbAmigaSysThreadId.DSK:
                    name = 'disk';
                    break;
                case GdbAmigaSysThreadId.SPR:
                    name = 'sprite';
                    break;
                default:
                    name = this.threadId.toString();
                    break;
            }
        } else {
            if (GdbThread.supportMultiprocess) {
                name = this.processId + "." + this.threadId;
            } else {
                name = this.threadId.toString();
            }
        }
        return name;
    }
    public getProcessId() {
        return this.processId;
    }
    public getThreadId() {
        return this.threadId;
    }
    public getId(): number {
        return this.id;
    }
    private static getNextId(): number {
        return GdbThread.nextId++;
    }
    public static setSupportMultiprocess(supportMultiprocess: boolean) {
        GdbThread.supportMultiprocess = supportMultiprocess;
    }
}

export class GdbError extends Error {
    public errorType: string;
    constructor(errorType: string) {
        super();
        this.errorType = errorType.toUpperCase();
        this.name = "GdbError";
        this.createMessage();
    }
    private createMessage() {
        switch (this.errorType) {
            case 'E09':
                this.message = "Packet not supported";
                break;
            case 'E0F':
                this.message = "Error during the packet parse for command send memory";
                break;
            case 'E10':
                this.message = "Unknown register";
                break;
            case 'E11':
                this.message = "Invalid Frame Id";
                break;
            case 'E12':
                this.message = "Invalid memory location";
                break;
            case 'E20':
                this.message = "Error during the packet parse for command set memory";
                break;
            case 'E21':
                this.message = "Missing end packet for a set memory message";
                break;
            case 'E22':
                this.message = "Address not safe for a set memory command";
                break;
            case 'E25':
                this.message = "Error during the packet parse for command set register";
                break;
            case 'E26':
                this.message = "Error during set registed - not supported register name";
                break;
            case 'E30':
                this.message = "Error during the packet parse for command get register";
                break;
            case 'E31':
                this.message = "Error during the vCont packet parse";
                break;
            default:
                this.message = "Error code recieved: '" + this.errorType + "'";
                break;
        }
    }
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

/** System Threads numbers (DMA) */
export enum GdbAmigaSysThreadId {
    AUD0 = 0,			// Thread id designating AUDIO 0 interrupt
    AUD1 = 1,			// Thread id designating AUDIO 1 interrupt
    AUD2 = 2,			// Thread id designating AUDIO 2 interrupt
    AUD3 = 3,			// Thread id designating AUDIO 3 interrupt
    DSK = 4,			// Thread id designating DISK interrupt
    SPR = 5,			// Thread id designating SPRITE interrupt
    BLT = 6,			// Thread id designating BLITTER interrupt
    COP = 7,			// Thread id designating COPPER interrupt
    BPL = 8,			// Thread id designating BIT-PLANE interrupt
    CPU = 0xf,			// Thread id designating default cpu execution
}

/** Status for the current halt */
export interface GdbHaltStatus {
    code: number;
    details: string;
    registers: Map<number, number>;
    thread: GdbThread | undefined;
}
