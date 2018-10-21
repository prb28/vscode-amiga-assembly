import { HoverRegister, HoverRegistersManager } from "./parser";
import { StringUtils } from "./stringUtils";

/** Type of copper instruction */
export enum CopperIntructionType {
    MOVE,
    WAIT,
    SKIP
}

/**
 * Copper instruction
 */
export class CopperInstruction {
    public instructionType: CopperIntructionType;
    public first: number;
    public second: number;
    public constructor(instructionType: CopperIntructionType, first: number, second: number) {
        this.instructionType = instructionType;
        this.first = first;
        this.second = second;
    }
    static parse(instructionString: string): CopperInstruction {
        // Split in two parts
        let firstStr = instructionString.substring(0, 4);
        let secondStr = instructionString.substring(4);
        let first = parseInt(firstStr, 16);
        let second = parseInt(secondStr, 16);
        if (first & 0x0001) {
            // This is a wait or skip
            if (second & 0x0001) {
                return new CopperSkip(first, second);
            } else {
                return new CopperWait(first, second);
            }
        } else {
            return new CopperMove(first, second);
        }
    }
    public getAsmInstruction(): string {
        return `dc.w \$${this.format(this.first)},\$${this.format(this.second)}`;
    }
    protected getPaddedAsmInstruction(): string {
        let inst = this.getAsmInstruction();
        let pad = " ".repeat(20 - inst.length);
        return inst + pad;
    }
    protected format(value: number): string {
        return StringUtils.padStartWith0(value.toString(16), 4);
    }
}

export class CopperMove extends CopperInstruction {
    static hoverRegistersManager = new HoverRegistersManager();
    /*DA = destination address */
    public DA: number;
    /*  RD = RAM data to be moved to destination register */
    public RD: number;
    /** Understandable label */
    public label: string | undefined;
    constructor(first: number, second: number) {
        super(CopperIntructionType.MOVE, first, second);
        this.DA = first & 0x01fe;
        this.RD = second;
        let register = `DFF${this.DA.toString(16)}`;
        let hr: HoverRegister | undefined = CopperMove.hoverRegistersManager.registersByAddress.get(register);
        if (hr) {
            this.label = hr.name;
        }
    }
    public toString(): string {
        let l: string;
        if (this.label) {
            l = this.label;
        } else {
            l = `\$${this.format(this.DA)}`;
        }
        let inst = this.getPaddedAsmInstruction();
        let value = `\$${this.format(this.RD)}`;
        return `${inst}; ${l} := ${value}`;
    }
}
export class CopperCondition extends CopperInstruction {
    /** Vertical beam position unmasked */
    public VP: number;
    /** Horizontal beam position unmasked */
    public HP: number;
    /**  blitter-finished disable */
    public BFD: number;
    /** Vertical enable comparison (mask bit) */
    public VE: number;
    /** Horizontal enable comparison (mask bit) */
    public HE: number;
    /** Vertical beam position */
    public vertical: number;
    /** Horizontal beam position */
    public horizontal: number;
    constructor(instructionType: CopperIntructionType, first: number, second: number) {
        super(instructionType, first, second);
        this.VP = (first >> 8);
        this.HP = first & 0x00fe;
        this.BFD = (second & 0x8000) >> 15;
        this.VE = (second | 0x8000) >> 8;
        this.HE = second & 0x00fe;
        this.vertical = this.VP & this.VE;
        this.horizontal = this.HP & this.HE;
    }
}
export class CopperWait extends CopperCondition {
    constructor(first: number, second: number) {
        super(CopperIntructionType.WAIT, first, second);
    }
    public toString(): string {
        let inst = this.getPaddedAsmInstruction();
        if (this.isEnd()) {
            return `${inst}; End of Copperlist`;
        } else {
            return `${inst}; Wait for vpos >= 0x${this.vertical.toString(16)} and hpos >= 0x${this.horizontal.toString(16)}`;
        }
    }
    public isEnd(): boolean {
        return ((this.first === 0xffff) && (this.second === 0xfffe));
    }
}
export class CopperSkip extends CopperCondition {
    constructor(first: number, second: number) {
        super(CopperIntructionType.SKIP, first, second);
    }
    public toString(): string {
        let inst = this.getPaddedAsmInstruction();
        return `${inst}; Skip if vpos >= 0x${this.vertical.toString(16)} and hpos >= 0x${this.horizontal.toString(16)}`;
    }
}

/**
 * Copper list disassembler
 */
export class CopperDisassembler {
    copperList = new Array<CopperInstruction>();
    constructor(memory: string) {
        this.parse(memory);
    }

    private parse(memory: string) {
        if (memory.length >= 8) {
            // Split the string in blocs of 8 characters
            for (let i = 8; i <= memory.length; i += 8) {
                let instruction = CopperInstruction.parse(memory.substring(i - 8, i));
                this.copperList.push(instruction);
                if ((instruction instanceof CopperWait) && (instruction.isEnd())) {
                    break;
                }
            }
        } else {
            throw new Error("Memory bloc too short to parse (8 characters minimum)");
        }
    }
    public disassemble(): Array<CopperInstruction> {
        return this.copperList;
    }
    public toString(): string {
        return this.copperList.join('\n');
    }
}