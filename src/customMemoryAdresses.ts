import { DebugVariableResolver } from "./debugVariableResolver";

/**
 * Memory Labels extracted from UAE emulator
 * UAE - The Un*x Amiga Emulator
 * Routines for labelling amiga internals.
 */

export interface MemoryLabel {
    name: string;
    adr: number;
}

export interface CustomData {
    name: string;
    adr: number;
    rw?: number;
    special?: number;
}

export class MemoryLabelsRegistry {
    public static readonly intLabels: Array<MemoryLabel> = [
        <MemoryLabel>{ name: "Reset:SSP", adr: 0x0000 },
        <MemoryLabel>{ name: "EXECBASE", adr: 0x0004 },
        <MemoryLabel>{ name: "BUS ERROR", adr: 0x0008 },
        <MemoryLabel>{ name: "ADR ERROR", adr: 0x000C },
        <MemoryLabel>{ name: "ILLEG OPC", adr: 0x0010 },
        <MemoryLabel>{ name: "DIV BY 0", adr: 0x0014 },
        <MemoryLabel>{ name: "CHK", adr: 0x0018 },
        <MemoryLabel>{ name: "TRAPV", adr: 0x001C },
        <MemoryLabel>{ name: "PRIVIL VIO", adr: 0x0020 },
        <MemoryLabel>{ name: "TRACE", adr: 0x0024 },
        <MemoryLabel>{ name: "LINEA EMU", adr: 0x0028 },
        <MemoryLabel>{ name: "LINEF EMU", adr: 0x002C },
        <MemoryLabel>{ name: "INT Uninit", adr: 0x003C },
        <MemoryLabel>{ name: "INT Unjust", adr: 0x0060 },
        <MemoryLabel>{ name: "Lvl 1 Int", adr: 0x0064 },
        <MemoryLabel>{ name: "Lvl 2 Int", adr: 0x0068 },
        <MemoryLabel>{ name: "Lvl 3 Int", adr: 0x006C },
        <MemoryLabel>{ name: "Lvl 4 Int", adr: 0x0070 },
        <MemoryLabel>{ name: "Lvl 5 Int", adr: 0x0074 },
        <MemoryLabel>{ name: "Lvl 6 Int", adr: 0x0078 },
        <MemoryLabel>{ name: "NMI", adr: 0x007C }];
    public static readonly trap_labels = [
        <MemoryLabel>{ name: "TRAP 00", adr: 0x0080 },
        <MemoryLabel>{ name: "TRAP 01", adr: 0x0084 },
        <MemoryLabel>{ name: "TRAP 02", adr: 0x0088 },
        <MemoryLabel>{ name: "TRAP 03", adr: 0x008C },
        <MemoryLabel>{ name: "TRAP 04", adr: 0x0090 },
        <MemoryLabel>{ name: "TRAP 05", adr: 0x0094 },
        <MemoryLabel>{ name: "TRAP 06", adr: 0x0098 },
        <MemoryLabel>{ name: "TRAP 07", adr: 0x009C },
        <MemoryLabel>{ name: "TRAP 08", adr: 0x00A0 },
        <MemoryLabel>{ name: "TRAP 09", adr: 0x00A4 },
        <MemoryLabel>{ name: "TRAP 10", adr: 0x00A8 },
        <MemoryLabel>{ name: "TRAP 11", adr: 0x00AC },
        <MemoryLabel>{ name: "TRAP 12", adr: 0x00B0 },
        <MemoryLabel>{ name: "TRAP 13", adr: 0x00B4 },
        <MemoryLabel>{ name: "TRAP 14", adr: 0x00B8 },
        <MemoryLabel>{ name: "TRAP 15", adr: 0x00BC }];
    public static readonly memLabels = [
        <MemoryLabel>{ name: "CIAB PRA", adr: 0xBFD000 },
        <MemoryLabel>{ name: "CIAB PRB", adr: 0xBFD100 },
        <MemoryLabel>{ name: "CIAB DDRA", adr: 0xBFD200 },
        <MemoryLabel>{ name: "CIAB DDRB", adr: 0xBFD300 },
        <MemoryLabel>{ name: "CIAB TALO", adr: 0xBFD400 },
        <MemoryLabel>{ name: "CIAB TAHI", adr: 0xBFD500 },
        <MemoryLabel>{ name: "CIAB TBLO", adr: 0xBFD600 },
        <MemoryLabel>{ name: "CIAB TBHI", adr: 0xBFD700 },
        <MemoryLabel>{ name: "CIAB TDLO", adr: 0xBFD800 },
        <MemoryLabel>{ name: "CIAB TDMD", adr: 0xBFD900 },
        <MemoryLabel>{ name: "CIAB TDHI", adr: 0xBFDA00 },
        <MemoryLabel>{ name: "CIAB SDR", adr: 0xBFDC00 },
        <MemoryLabel>{ name: "CIAB ICR", adr: 0xBFDD00 },
        <MemoryLabel>{ name: "CIAB CRA", adr: 0xBFDE00 },
        <MemoryLabel>{ name: "CIAB CRB", adr: 0xBFDF00 },
        <MemoryLabel>{ name: "CIAA PRA", adr: 0xBFE001 },
        <MemoryLabel>{ name: "CIAA PRB", adr: 0xBFE101 },
        <MemoryLabel>{ name: "CIAA DDRA", adr: 0xBFE201 },
        <MemoryLabel>{ name: "CIAA DDRB", adr: 0xBFE301 },
        <MemoryLabel>{ name: "CIAA TALO", adr: 0xBFE401 },
        <MemoryLabel>{ name: "CIAA TAHI", adr: 0xBFE501 },
        <MemoryLabel>{ name: "CIAA TBLO", adr: 0xBFE601 },
        <MemoryLabel>{ name: "CIAA TBHI", adr: 0xBFE701 },
        <MemoryLabel>{ name: "CIAA TDLO", adr: 0xBFE801 },
        <MemoryLabel>{ name: "CIAA TDMD", adr: 0xBFE901 },
        <MemoryLabel>{ name: "CIAA TDHI", adr: 0xBFEA01 },
        <MemoryLabel>{ name: "CIAA SDR", adr: 0xBFEC01 },
        <MemoryLabel>{ name: "CIAA ICR", adr: 0xBFED01 },
        <MemoryLabel>{ name: "CIAA CRA", adr: 0xBFEE01 },
        <MemoryLabel>{ name: "CIAA CRB", adr: 0xBFEF01 },
        <MemoryLabel>{ name: "CLK S1", adr: 0xDC0000 },
        <MemoryLabel>{ name: "CLK S10", adr: 0xDC0004 },
        <MemoryLabel>{ name: "CLK MI1", adr: 0xDC0008 },
        <MemoryLabel>{ name: "CLK MI10", adr: 0xDC000C },
        <MemoryLabel>{ name: "CLK H1", adr: 0xDC0010 },
        <MemoryLabel>{ name: "CLK H10", adr: 0xDC0014 },
        <MemoryLabel>{ name: "CLK D1", adr: 0xDC0018 },
        <MemoryLabel>{ name: "CLK D10", adr: 0xDC001C },
        <MemoryLabel>{ name: "CLK MO1", adr: 0xDC0020 },
        <MemoryLabel>{ name: "CLK MO10", adr: 0xDC0024 },
        <MemoryLabel>{ name: "CLK Y1", adr: 0xDC0028 },
        <MemoryLabel>{ name: "CLK Y10", adr: 0xDC002E },
        <MemoryLabel>{ name: "CLK WEEK", adr: 0xDC0030 },
        <MemoryLabel>{ name: "CLK CD", adr: 0xDC0034 },
        <MemoryLabel>{ name: "CLK CE", adr: 0xDC0038 },
        <MemoryLabel>{ name: "CLK CF", adr: 0xDC003C }];

    /* This table was generated from the list of AGA chip names in
    * AGA.guide available on aminet. It could well have errors in it. */

    public static readonly customData: Array<CustomData> = [
        <CustomData>{ name: "BLTDDAT", adr: 0xdff000 }, /* Blitter dest. early read (dummy address) */
        <CustomData>{ name: "DMACONR", adr: 0xdff002, rw: 1 }, /* Dma control (and blitter status) read */
        <CustomData>{ name: "VPOSR", adr: 0xdff004, rw: 1 }, /* Read vert most sig. bits (and frame flop */
        <CustomData>{ name: "VHPOSR", adr: 0xdff006, rw: 1 }, /* Read vert and horiz position of beam */
        <CustomData>{ name: "DSKDATR", adr: 0xdff008 }, /* Disk data early read (dummy address) */
        <CustomData>{ name: "JOY0DAT", adr: 0xdff00A, rw: 1 }, /* Joystick-mouse 0 data (vert,horiz) */
        <CustomData>{ name: "JOT1DAT", adr: 0xdff00C, rw: 1 }, /* Joystick-mouse 1 data (vert,horiz) */
        <CustomData>{ name: "CLXDAT", adr: 0xdff00E, rw: 1 }, /* Collision data reg. (read and clear) */
        <CustomData>{ name: "ADKCONR", adr: 0xdff010, rw: 1 }, /* Audio,disk control register read */
        <CustomData>{ name: "POT0DAT", adr: 0xdff012, rw: 1 }, /* Pot counter pair 0 data (vert,horiz) */
        <CustomData>{ name: "POT1DAT", adr: 0xdff014, rw: 1 }, /* Pot counter pair 1 data (vert,horiz) */
        <CustomData>{ name: "POTGOR", adr: 0xdff016, rw: 1 }, /* Pot pin data read */
        <CustomData>{ name: "SERDATR", adr: 0xdff018, rw: 1 }, /* Serial port data and status read */
        <CustomData>{ name: "DSKBYTR", adr: 0xdff01A, rw: 1 }, /* Disk data byte and status read */
        <CustomData>{ name: "INTENAR", adr: 0xdff01C, rw: 1 }, /* Interrupt enable bits read */
        <CustomData>{ name: "INTREQR", adr: 0xdff01E, rw: 1 }, /* Interrupt request bits read */
        <CustomData>{ name: "DSKPTH", adr: 0xdff020, rw: 2, special: 1 }, /* Disk pointer (high 5 bits) */
        <CustomData>{ name: "DSKPTL", adr: 0xdff022, rw: 2, special: 2 }, /* Disk pointer (low 15 bits) */
        <CustomData>{ name: "DSKLEN", adr: 0xdff024, rw: 2, special: 0 }, /* Disk lentgh */
        <CustomData>{ name: "DSKDAT", adr: 0xdff026 }, /* Disk DMA data write */
        <CustomData>{ name: "REFPTR", adr: 0xdff028 }, /* Refresh pointer */
        <CustomData>{ name: "VPOSW", adr: 0xdff02A, rw: 2, special: 0 }, /* Write vert most sig. bits(and frame flop) */
        <CustomData>{ name: "VHPOSW", adr: 0xdff02C, rw: 2, special: 0 }, /* Write vert and horiz pos of beam */
        <CustomData>{ name: "COPCON", adr: 0xdff02e, rw: 2, special: 0 }, /* Coprocessor control reg (CDANG) */
        <CustomData>{ name: "SERDAT", adr: 0xdff030, rw: 2, special: 0 }, /* Serial port data and stop bits write */
        <CustomData>{ name: "SERPER", adr: 0xdff032, rw: 2, special: 0 }, /* Serial port period and control */
        <CustomData>{ name: "POTGO", adr: 0xdff034, rw: 2, special: 0 }, /* Pot count start,pot pin drive enable data */
        <CustomData>{ name: "JOYTEST", adr: 0xdff036, rw: 2, special: 0 }, /* Write to all 4 joystick-mouse counters at once */
        <CustomData>{ name: "STREQU", adr: 0xdff038, rw: 2, special: 0 }, /* Strobe for horiz sync with VB and EQU */
        <CustomData>{ name: "STRVBL", adr: 0xdff03A, rw: 2, special: 0 }, /* Strobe for horiz sync with VB (vert blank) */
        <CustomData>{ name: "STRHOR", adr: 0xdff03C, rw: 2, special: 0 }, /* Strobe for horiz sync */
        <CustomData>{ name: "STRLONG", adr: 0xdff03E, rw: 2, special: 0 }, /* Strobe for identification of long horiz line */
        <CustomData>{ name: "BLTCON0", adr: 0xdff040, rw: 2, special: 0 }, /* Blitter control reg 0 */
        <CustomData>{ name: "BLTCON1", adr: 0xdff042, rw: 2, special: 0 }, /* Blitter control reg 1 */
        <CustomData>{ name: "BLTAFWM", adr: 0xdff044, rw: 2, special: 0 }, /* Blitter first word mask for source A */
        <CustomData>{ name: "BLTALWM", adr: 0xdff046, rw: 2, special: 0 }, /* Blitter last word mask for source A */
        <CustomData>{ name: "BLTCPTH", adr: 0xdff048, rw: 2, special: 1 }, /* Blitter pointer to source C (high 5 bits) */
        <CustomData>{ name: "BLTCPTL", adr: 0xdff04A, rw: 2, special: 2 }, /* Blitter pointer to source C (low 15 bits) */
        <CustomData>{ name: "BLTBPTH", adr: 0xdff04C, rw: 2, special: 1 }, /* Blitter pointer to source B (high 5 bits) */
        <CustomData>{ name: "BLTBPTL", adr: 0xdff04E, rw: 2, special: 2 }, /* Blitter pointer to source B (low 15 bits) */
        <CustomData>{ name: "BLTAPTH", adr: 0xdff050, rw: 2, special: 1 }, /* Blitter pointer to source A (high 5 bits) */
        <CustomData>{ name: "BLTAPTL", adr: 0xdff052, rw: 2, special: 2 }, /* Blitter pointer to source A (low 15 bits) */
        <CustomData>{ name: "BPTDPTH", adr: 0xdff054, rw: 2, special: 1 }, /* Blitter pointer to destn  D (high 5 bits) */
        <CustomData>{ name: "BLTDPTL", adr: 0xdff056, rw: 2, special: 2 }, /* Blitter pointer to destn  D (low 15 bits) */
        <CustomData>{ name: "BLTSIZE", adr: 0xdff058, rw: 2, special: 0 }, /* Blitter start and size (win/width,height) */
        <CustomData>{ name: "BLTCON0L", adr: 0xdff05A, rw: 2, special: 4 }, /* Blitter control 0 lower 8 bits (minterms) */
        <CustomData>{ name: "BLTSIZV", adr: 0xdff05C, rw: 2, special: 4 }, /* Blitter V size (for 15 bit vert size) */
        <CustomData>{ name: "BLTSIZH", adr: 0xdff05E, rw: 2, special: 4 }, /* Blitter H size & start (for 11 bit H size) */
        <CustomData>{ name: "BLTCMOD", adr: 0xdff060, rw: 2, special: 0 }, /* Blitter modulo for source C */
        <CustomData>{ name: "BLTBMOD", adr: 0xdff062, rw: 2, special: 0 }, /* Blitter modulo for source B */
        <CustomData>{ name: "BLTAMOD", adr: 0xdff064, rw: 2, special: 0 }, /* Blitter modulo for source A */
        <CustomData>{ name: "BLTDMOD", adr: 0xdff066, rw: 2, special: 0 }, /* Blitter modulo for destn  D */
        <CustomData>{ name: "Unknown", adr: 0xdff068 }, /* Unknown or Unused */
        <CustomData>{ name: "Unknown", adr: 0xdff06a }, /* Unknown or Unused */
        <CustomData>{ name: "Unknown", adr: 0xdff06c }, /* Unknown or Unused */
        <CustomData>{ name: "Unknown", adr: 0xdff06e }, /* Unknown or Unused */
        <CustomData>{ name: "BLTCDAT", adr: 0xdff070, rw: 2, special: 0 }, /* Blitter source C data reg */
        <CustomData>{ name: "BLTBDAT", adr: 0xdff072, rw: 2, special: 0 }, /* Blitter source B data reg */
        <CustomData>{ name: "BLTADAT", adr: 0xdff074, rw: 2, special: 0 }, /* Blitter source A data reg */
        <CustomData>{ name: "BLTDDAT", adr: 0xdff076, rw: 2, special: 0 }, /* Blitter destination reg */
        <CustomData>{ name: "SPRHDAT", adr: 0xdff078 }, /* Ext logic UHRES sprite pointer and data identifier */
        <CustomData>{ name: "BPLHDAT", adr: 0xdff07A }, /* Ext logic UHRES bit plane identifier */
        <CustomData>{ name: "LISAID", adr: 0xdff07C, rw: 1, special: 8 }, /* Chip revision level for Denise/Lisa */
        <CustomData>{ name: "DSKSYNC", adr: 0xdff07E, rw: 2 }, /* Disk sync pattern reg for disk read */
        <CustomData>{ name: "COP1LCH", adr: 0xdff080, rw: 2, special: 1 }, /* Coprocessor first location reg (high 5 bits) */
        <CustomData>{ name: "COP1LCL", adr: 0xdff082, rw: 2, special: 2 }, /* Coprocessor first location reg (low 15 bits) */
        <CustomData>{ name: "COP2LCH", adr: 0xdff084, rw: 2, special: 1 }, /* Coprocessor second reg (high 5 bits) */
        <CustomData>{ name: "COP2LCL", adr: 0xdff086, rw: 2, special: 2 }, /* Coprocessor second reg (low 15 bits) */
        <CustomData>{ name: "COPJMP1", adr: 0xdff088, rw: 2 }, /* Coprocessor restart at first location */
        <CustomData>{ name: "COPJMP2", adr: 0xdff08A, rw: 2 }, /* Coprocessor restart at second location */
        <CustomData>{ name: "COPINS", adr: 0xdff08C }, /* Coprocessor inst fetch identify */
        <CustomData>{ name: "DIWSTRT", adr: 0xdff08E, rw: 2 }, /* Display window start (upper left vert-hor pos) */
        <CustomData>{ name: "DIWSTOP", adr: 0xdff090, rw: 2 }, /* Display window stop (lower right vert-hor pos) */
        <CustomData>{ name: "DDFSTRT", adr: 0xdff092, rw: 2 }, /* Display bit plane data fetch start.hor pos */
        <CustomData>{ name: "DDFSTOP", adr: 0xdff094, rw: 2 }, /* Display bit plane data fetch stop.hor pos */
        <CustomData>{ name: "DMACON", adr: 0xdff096, rw: 2 }, /* DMA control write (clear or set) */
        <CustomData>{ name: "CLXCON", adr: 0xdff098, rw: 2 }, /* Collision control */
        <CustomData>{ name: "INTENA", adr: 0xdff09A, rw: 2 }, /* Interrupt enable bits (clear or set bits) */
        <CustomData>{ name: "INTREQ", adr: 0xdff09C, rw: 2 }, /* Interrupt request bits (clear or set bits) */
        <CustomData>{ name: "ADKCON", adr: 0xdff09E, rw: 2 }, /* Audio,disk,UART,control */
        <CustomData>{ name: "AUD0LCH", adr: 0xdff0A0, rw: 2, special: 1 }, /* Audio channel 0 location (high 5 bits) */
        <CustomData>{ name: "AUD0LCL", adr: 0xdff0A2, rw: 2, special: 2 }, /* Audio channel 0 location (low 15 bits) */
        <CustomData>{ name: "AUD0LEN", adr: 0xdff0A4, rw: 2 }, /* Audio channel 0 lentgh */
        <CustomData>{ name: "AUD0PER", adr: 0xdff0A6, rw: 2 }, /* Audio channel 0 period */
        <CustomData>{ name: "AUD0VOL", adr: 0xdff0A8, rw: 2 }, /* Audio channel 0 volume */
        <CustomData>{ name: "AUD0DAT", adr: 0xdff0AA, rw: 2 }, /* Audio channel 0 data */
        <CustomData>{ name: "Unknown", adr: 0xdff0AC }, /* Unknown or Unused */
        <CustomData>{ name: "Unknown", adr: 0xdff0AE }, /* Unknown or Unused */
        <CustomData>{ name: "AUD1LCH", adr: 0xdff0B0, rw: 2, special: 1 }, /* Audio channel 1 location (high 5 bits) */
        <CustomData>{ name: "AUD1LCL", adr: 0xdff0B2, rw: 2, special: 2 }, /* Audio channel 1 location (low 15 bits) */
        <CustomData>{ name: "AUD1LEN", adr: 0xdff0B4, rw: 2 }, /* Audio channel 1 lentgh */
        <CustomData>{ name: "AUD1PER", adr: 0xdff0B6, rw: 2 }, /* Audio channel 1 period */
        <CustomData>{ name: "AUD1VOL", adr: 0xdff0B8, rw: 2 }, /* Audio channel 1 volume */
        <CustomData>{ name: "AUD1DAT", adr: 0xdff0BA, rw: 2 }, /* Audio channel 1 data */
        <CustomData>{ name: "Unknown", adr: 0xdff0BC }, /* Unknown or Unused */
        <CustomData>{ name: "Unknown", adr: 0xdff0BE }, /* Unknown or Unused */
        <CustomData>{ name: "AUD2LCH", adr: 0xdff0C0, rw: 2, special: 1 }, /* Audio channel 2 location (high 5 bits) */
        <CustomData>{ name: "AUD2LCL", adr: 0xdff0C2, rw: 2, special: 2 }, /* Audio channel 2 location (low 15 bits) */
        <CustomData>{ name: "AUD2LEN", adr: 0xdff0C4, rw: 2 }, /* Audio channel 2 lentgh */
        <CustomData>{ name: "AUD2PER", adr: 0xdff0C6, rw: 2 }, /* Audio channel 2 period */
        <CustomData>{ name: "AUD2VOL", adr: 0xdff0C8, rw: 2 }, /* Audio channel 2 volume */
        <CustomData>{ name: "AUD2DAT", adr: 0xdff0CA, rw: 2 }, /* Audio channel 2 data */
        <CustomData>{ name: "Unknown", adr: 0xdff0CC }, /* Unknown or Unused */
        <CustomData>{ name: "Unknown", adr: 0xdff0CE }, /* Unknown or Unused */
        <CustomData>{ name: "AUD3LCH", adr: 0xdff0D0, rw: 2, special: 1 }, /* Audio channel 3 location (high 5 bits) */
        <CustomData>{ name: "AUD3LCL", adr: 0xdff0D2, rw: 2, special: 2 }, /* Audio channel 3 location (low 15 bits) */
        <CustomData>{ name: "AUD3LEN", adr: 0xdff0D4, rw: 2 }, /* Audio channel 3 lentgh */
        <CustomData>{ name: "AUD3PER", adr: 0xdff0D6, rw: 2 }, /* Audio channel 3 period */
        <CustomData>{ name: "AUD3VOL", adr: 0xdff0D8, rw: 2 }, /* Audio channel 3 volume */
        <CustomData>{ name: "AUD3DAT", adr: 0xdff0DA, rw: 2 }, /* Audio channel 3 data */
        <CustomData>{ name: "Unknown", adr: 0xdff0DC }, /* Unknown or Unused */
        <CustomData>{ name: "Unknown", adr: 0xdff0DE }, /* Unknown or Unused */
        <CustomData>{ name: "BPL1PTH", adr: 0xdff0E0, rw: 2, special: 1 }, /* Bit plane pointer 1 (high 5 bits) */
        <CustomData>{ name: "BPL1PTL", adr: 0xdff0E2, rw: 2, special: 2 }, /* Bit plane pointer 1 (low 15 bits) */
        <CustomData>{ name: "BPL2PTH", adr: 0xdff0E4, rw: 2, special: 1 }, /* Bit plane pointer 2 (high 5 bits) */
        <CustomData>{ name: "BPL2PTL", adr: 0xdff0E6, rw: 2, special: 2 }, /* Bit plane pointer 2 (low 15 bits) */
        <CustomData>{ name: "BPL3PTH", adr: 0xdff0E8, rw: 2, special: 1 }, /* Bit plane pointer 3 (high 5 bits) */
        <CustomData>{ name: "BPL3PTL", adr: 0xdff0EA, rw: 2, special: 2 }, /* Bit plane pointer 3 (low 15 bits) */
        <CustomData>{ name: "BPL4PTH", adr: 0xdff0EC, rw: 2, special: 1 }, /* Bit plane pointer 4 (high 5 bits) */
        <CustomData>{ name: "BPL4PTL", adr: 0xdff0EE, rw: 2, special: 2 }, /* Bit plane pointer 4 (low 15 bits) */
        <CustomData>{ name: "BPL5PTH", adr: 0xdff0F0, rw: 2, special: 1 }, /* Bit plane pointer 5 (high 5 bits) */
        <CustomData>{ name: "BPL5PTL", adr: 0xdff0F2, rw: 2, special: 2 }, /* Bit plane pointer 5 (low 15 bits) */
        <CustomData>{ name: "BPL6PTH", adr: 0xdff0F4, rw: 2, special: 1 | 8 }, /* Bit plane pointer 6 (high 5 bits) */
        <CustomData>{ name: "BPL6PTL", adr: 0xdff0F6, rw: 2, special: 2 | 8 }, /* Bit plane pointer 6 (low 15 bits) */
        <CustomData>{ name: "BPL7PTH", adr: 0xdff0F8, rw: 2, special: 1 | 8 }, /* Bit plane pointer 7 (high 5 bits) */
        <CustomData>{ name: "BPL7PTL", adr: 0xdff0FA, rw: 2, special: 2 | 8 }, /* Bit plane pointer 7 (low 15 bits) */
        <CustomData>{ name: "BPL8PTH", adr: 0xdff0FC, rw: 2, special: 1 | 8 }, /* Bit plane pointer 8 (high 5 bits) */
        <CustomData>{ name: "BPL8PTL", adr: 0xdff0FE, rw: 2, special: 2 | 8 }, /* Bit plane pointer 8 (low 15 bits) */
        <CustomData>{ name: "BPLCON0", adr: 0xdff100, rw: 2 }, /* Bit plane control reg (misc control bits) */
        <CustomData>{ name: "BPLCON1", adr: 0xdff102, rw: 2 }, /* Bit plane control reg (scroll val PF1,PF2) */
        <CustomData>{ name: "BPLCON2", adr: 0xdff104, rw: 2 }, /* Bit plane control reg (priority control) */
        <CustomData>{ name: "BPLCON3", adr: 0xdff106, rw: 2 | 8 }, /* Bit plane control reg (enhanced features) */
        <CustomData>{ name: "BPL1MOD", adr: 0xdff108, rw: 2 }, /* Bit plane modulo (odd planes,or active- fetch lines if bitplane scan-doubling is enabled */
        <CustomData>{ name: "BPL2MOD", adr: 0xdff10A, rw: 2 }, /* Bit plane modulo (even planes or inactive- fetch lines if bitplane scan-doubling is enabled */
        <CustomData>{ name: "BPLCON4", adr: 0xdff10C, rw: 2 | 8 }, /* Bit plane control reg (bitplane and sprite masks) */
        <CustomData>{ name: "CLXCON2", adr: 0xdff10e, rw: 2 | 8 }, /* Extended collision control reg */
        <CustomData>{ name: "BPL1DAT", adr: 0xdff110, rw: 2 }, /* Bit plane 1 data (parallel to serial con- vert) */
        <CustomData>{ name: "BPL2DAT", adr: 0xdff112, rw: 2 }, /* Bit plane 2 data (parallel to serial con- vert) */
        <CustomData>{ name: "BPL3DAT", adr: 0xdff114, rw: 2 }, /* Bit plane 3 data (parallel to serial con- vert) */
        <CustomData>{ name: "BPL4DAT", adr: 0xdff116, rw: 2 }, /* Bit plane 4 data (parallel to serial con- vert) */
        <CustomData>{ name: "BPL5DAT", adr: 0xdff118, rw: 2 }, /* Bit plane 5 data (parallel to serial con- vert) */
        <CustomData>{ name: "BPL6DAT", adr: 0xdff11a, rw: 2 }, /* Bit plane 6 data (parallel to serial con- vert) */
        <CustomData>{ name: "BPL7DAT", adr: 0xdff11c, rw: 2 | 8 }, /* Bit plane 7 data (parallel to serial con- vert) */
        <CustomData>{ name: "BPL8DAT", adr: 0xdff11e, rw: 2 | 8 }, /* Bit plane 8 data (parallel to serial con- vert) */
        <CustomData>{ name: "SPR0PTH", adr: 0xdff120, rw: 2, special: 1 }, /* Sprite 0 pointer (high 5 bits) */
        <CustomData>{ name: "SPR0PTL", adr: 0xdff122, rw: 2, special: 2 }, /* Sprite 0 pointer (low 15 bits) */
        <CustomData>{ name: "SPR1PTH", adr: 0xdff124, rw: 2, special: 1 }, /* Sprite 1 pointer (high 5 bits) */
        <CustomData>{ name: "SPR1PTL", adr: 0xdff126, rw: 2, special: 2 }, /* Sprite 1 pointer (low 15 bits) */
        <CustomData>{ name: "SPR2PTH", adr: 0xdff128, rw: 2, special: 1 }, /* Sprite 2 pointer (high 5 bits) */
        <CustomData>{ name: "SPR2PTL", adr: 0xdff12A, rw: 2, special: 2 }, /* Sprite 2 pointer (low 15 bits) */
        <CustomData>{ name: "SPR3PTH", adr: 0xdff12C, rw: 2, special: 1 }, /* Sprite 3 pointer (high 5 bits) */
        <CustomData>{ name: "SPR3PTL", adr: 0xdff12E, rw: 2, special: 2 }, /* Sprite 3 pointer (low 15 bits) */
        <CustomData>{ name: "SPR4PTH", adr: 0xdff130, rw: 2, special: 1 }, /* Sprite 4 pointer (high 5 bits) */
        <CustomData>{ name: "SPR4PTL", adr: 0xdff132, rw: 2, special: 2 }, /* Sprite 4 pointer (low 15 bits) */
        <CustomData>{ name: "SPR5PTH", adr: 0xdff134, rw: 2, special: 1 }, /* Sprite 5 pointer (high 5 bits) */
        <CustomData>{ name: "SPR5PTL", adr: 0xdff136, rw: 2, special: 2 }, /* Sprite 5 pointer (low 15 bits) */
        <CustomData>{ name: "SPR6PTH", adr: 0xdff138, rw: 2, special: 1 }, /* Sprite 6 pointer (high 5 bits) */
        <CustomData>{ name: "SPR6PTL", adr: 0xdff13A, rw: 2, special: 2 }, /* Sprite 6 pointer (low 15 bits) */
        <CustomData>{ name: "SPR7PTH", adr: 0xdff13C, rw: 2, special: 1 }, /* Sprite 7 pointer (high 5 bits) */
        <CustomData>{ name: "SPR7PTL", adr: 0xdff13E, rw: 2, special: 2 }, /* Sprite 7 pointer (low 15 bits) */
        <CustomData>{ name: "SPR0POS", adr: 0xdff140, rw: 2 }, /* Sprite 0 vert-horiz start pos data */
        <CustomData>{ name: "SPR0CTL", adr: 0xdff142, rw: 2 }, /* Sprite 0 position and control data */
        <CustomData>{ name: "SPR0DATA", adr: 0xdff144, rw: 2 }, /* Sprite 0 image data register A */
        <CustomData>{ name: "SPR0DATB", adr: 0xdff146, rw: 2 }, /* Sprite 0 image data register B */
        <CustomData>{ name: "SPR1POS", adr: 0xdff148, rw: 2 }, /* Sprite 1 vert-horiz start pos data */
        <CustomData>{ name: "SPR1CTL", adr: 0xdff14A, rw: 2 }, /* Sprite 1 position and control data */
        <CustomData>{ name: "SPR1DATA", adr: 0xdff14C, rw: 2 }, /* Sprite 1 image data register A */
        <CustomData>{ name: "SPR1DATB", adr: 0xdff14E, rw: 2 }, /* Sprite 1 image data register B */
        <CustomData>{ name: "SPR2POS", adr: 0xdff150, rw: 2 }, /* Sprite 2 vert-horiz start pos data */
        <CustomData>{ name: "SPR2CTL", adr: 0xdff152, rw: 2 }, /* Sprite 2 position and control data */
        <CustomData>{ name: "SPR2DATA", adr: 0xdff154, rw: 2 }, /* Sprite 2 image data register A */
        <CustomData>{ name: "SPR2DATB", adr: 0xdff156, rw: 2 }, /* Sprite 2 image data register B */
        <CustomData>{ name: "SPR3POS", adr: 0xdff158, rw: 2 }, /* Sprite 3 vert-horiz start pos data */
        <CustomData>{ name: "SPR3CTL", adr: 0xdff15A, rw: 2 }, /* Sprite 3 position and control data */
        <CustomData>{ name: "SPR3DATA", adr: 0xdff15C, rw: 2 }, /* Sprite 3 image data register A */
        <CustomData>{ name: "SPR3DATB", adr: 0xdff15E, rw: 2 }, /* Sprite 3 image data register B */
        <CustomData>{ name: "SPR4POS", adr: 0xdff160, rw: 2 }, /* Sprite 4 vert-horiz start pos data */
        <CustomData>{ name: "SPR4CTL", adr: 0xdff162, rw: 2 }, /* Sprite 4 position and control data */
        <CustomData>{ name: "SPR4DATA", adr: 0xdff164, rw: 2 }, /* Sprite 4 image data register A */
        <CustomData>{ name: "SPR4DATB", adr: 0xdff166, rw: 2 }, /* Sprite 4 image data register B */
        <CustomData>{ name: "SPR5POS", adr: 0xdff168, rw: 2 }, /* Sprite 5 vert-horiz start pos data */
        <CustomData>{ name: "SPR5CTL", adr: 0xdff16A, rw: 2 }, /* Sprite 5 position and control data */
        <CustomData>{ name: "SPR5DATA", adr: 0xdff16C, rw: 2 }, /* Sprite 5 image data register A */
        <CustomData>{ name: "SPR5DATB", adr: 0xdff16E, rw: 2 }, /* Sprite 5 image data register B */
        <CustomData>{ name: "SPR6POS", adr: 0xdff170, rw: 2 }, /* Sprite 6 vert-horiz start pos data */
        <CustomData>{ name: "SPR6CTL", adr: 0xdff172, rw: 2 }, /* Sprite 6 position and control data */
        <CustomData>{ name: "SPR6DATA", adr: 0xdff174, rw: 2 }, /* Sprite 6 image data register A */
        <CustomData>{ name: "SPR6DATB", adr: 0xdff176, rw: 2 }, /* Sprite 6 image data register B */
        <CustomData>{ name: "SPR7POS", adr: 0xdff178, rw: 2 }, /* Sprite 7 vert-horiz start pos data */
        <CustomData>{ name: "SPR7CTL", adr: 0xdff17A, rw: 2 }, /* Sprite 7 position and control data */
        <CustomData>{ name: "SPR7DATA", adr: 0xdff17C, rw: 2 }, /* Sprite 7 image data register A */
        <CustomData>{ name: "SPR7DATB", adr: 0xdff17E, rw: 2 }, /* Sprite 7 image data register B */
        <CustomData>{ name: "COLOR00", adr: 0xdff180, rw: 2 }, /* Color table 00 */
        <CustomData>{ name: "COLOR01", adr: 0xdff182, rw: 2 }, /* Color table 01 */
        <CustomData>{ name: "COLOR02", adr: 0xdff184, rw: 2 }, /* Color table 02 */
        <CustomData>{ name: "COLOR03", adr: 0xdff186, rw: 2 }, /* Color table 03 */
        <CustomData>{ name: "COLOR04", adr: 0xdff188, rw: 2 }, /* Color table 04 */
        <CustomData>{ name: "COLOR05", adr: 0xdff18A, rw: 2 }, /* Color table 05 */
        <CustomData>{ name: "COLOR06", adr: 0xdff18C, rw: 2 }, /* Color table 06 */
        <CustomData>{ name: "COLOR07", adr: 0xdff18E, rw: 2 }, /* Color table 07 */
        <CustomData>{ name: "COLOR08", adr: 0xdff190, rw: 2 }, /* Color table 08 */
        <CustomData>{ name: "COLOR09", adr: 0xdff192, rw: 2 }, /* Color table 09 */
        <CustomData>{ name: "COLOR10", adr: 0xdff194, rw: 2 }, /* Color table 10 */
        <CustomData>{ name: "COLOR11", adr: 0xdff196, rw: 2 }, /* Color table 11 */
        <CustomData>{ name: "COLOR12", adr: 0xdff198, rw: 2 }, /* Color table 12 */
        <CustomData>{ name: "COLOR13", adr: 0xdff19A, rw: 2 }, /* Color table 13 */
        <CustomData>{ name: "COLOR14", adr: 0xdff19C, rw: 2 }, /* Color table 14 */
        <CustomData>{ name: "COLOR15", adr: 0xdff19E, rw: 2 }, /* Color table 15 */
        <CustomData>{ name: "COLOR16", adr: 0xdff1A0, rw: 2 }, /* Color table 16 */
        <CustomData>{ name: "COLOR17", adr: 0xdff1A2, rw: 2 }, /* Color table 17 */
        <CustomData>{ name: "COLOR18", adr: 0xdff1A4, rw: 2 }, /* Color table 18 */
        <CustomData>{ name: "COLOR19", adr: 0xdff1A6, rw: 2 }, /* Color table 19 */
        <CustomData>{ name: "COLOR20", adr: 0xdff1A8, rw: 2 }, /* Color table 20 */
        <CustomData>{ name: "COLOR21", adr: 0xdff1AA, rw: 2 }, /* Color table 21 */
        <CustomData>{ name: "COLOR22", adr: 0xdff1AC, rw: 2 }, /* Color table 22 */
        <CustomData>{ name: "COLOR23", adr: 0xdff1AE, rw: 2 }, /* Color table 23 */
        <CustomData>{ name: "COLOR24", adr: 0xdff1B0, rw: 2 }, /* Color table 24 */
        <CustomData>{ name: "COLOR25", adr: 0xdff1B2, rw: 2 }, /* Color table 25 */
        <CustomData>{ name: "COLOR26", adr: 0xdff1B4, rw: 2 }, /* Color table 26 */
        <CustomData>{ name: "COLOR27", adr: 0xdff1B6, rw: 2 }, /* Color table 27 */
        <CustomData>{ name: "COLOR28", adr: 0xdff1B8, rw: 2 }, /* Color table 28 */
        <CustomData>{ name: "COLOR29", adr: 0xdff1BA, rw: 2 }, /* Color table 29 */
        <CustomData>{ name: "COLOR30", adr: 0xdff1BC, rw: 2 }, /* Color table 30 */
        <CustomData>{ name: "COLOR31", adr: 0xdff1BE, rw: 2 }, /* Color table 31 */
        <CustomData>{ name: "HTOTAL", adr: 0xdff1C0, rw: 2 | 4 }, /* Highest number count in horiz line (VARBEAMEN = 1) */
        <CustomData>{ name: "HSSTOP", adr: 0xdff1C2, rw: 2 | 4 }, /* Horiz line pos for HSYNC stop */
        <CustomData>{ name: "HBSTRT", adr: 0xdff1C4, rw: 2 | 4 }, /* Horiz line pos for HBLANK start */
        <CustomData>{ name: "HBSTOP", adr: 0xdff1C6, rw: 2 | 4 }, /* Horiz line pos for HBLANK stop */
        <CustomData>{ name: "VTOTAL", adr: 0xdff1C8, rw: 2 | 4 }, /* Highest numbered vertical line (VARBEAMEN = 1) */
        <CustomData>{ name: "VSSTOP", adr: 0xdff1CA, rw: 2 | 4 }, /* Vert line for VBLANK start */
        <CustomData>{ name: "VBSTRT", adr: 0xdff1CC, rw: 2 | 4 }, /* Vert line for VBLANK start */
        <CustomData>{ name: "VBSTOP", adr: 0xdff1CE, rw: 2 | 4 }, /* Vert line for VBLANK stop */
        <CustomData>{ name: "SPRHSTRT", adr: 0xdff1D0 }, /* UHRES sprite vertical start */
        <CustomData>{ name: "SPRHSTOP", adr: 0xdff1D2 }, /* UHRES sprite vertical stop */
        <CustomData>{ name: "BPLHSTRT", adr: 0xdff1D4 }, /* UHRES bit plane vertical stop */
        <CustomData>{ name: "BPLHSTOP", adr: 0xdff1D6 }, /* UHRES bit plane vertical stop */
        <CustomData>{ name: "HHPOSW", adr: 0xdff1D8 }, /* DUAL mode hires H beam counter write */
        <CustomData>{ name: "HHPOSR", adr: 0xdff1DA }, /* DUAL mode hires H beam counter read */
        <CustomData>{ name: "BEAMCON0", adr: 0xdff1DC, rw: 2 | 4 }, /* Beam counter control register (SHRES,UHRES,PAL) */
        <CustomData>{ name: "HSSTRT", adr: 0xdff1DE, rw: 2 | 4 }, /* Horizontal sync start (VARHSY) */
        <CustomData>{ name: "VSSTRT", adr: 0xdff1E0, rw: 2 | 4 }, /* Vertical sync start (VARVSY) */
        <CustomData>{ name: "HCENTER", adr: 0xdff1E2, rw: 2 | 4 }, /* Horizontal pos for vsync on interlace */
        <CustomData>{ name: "DIWHIGH", adr: 0xdff1E4, rw: 2 | 4 }, /* Display window upper bits for start/stop */
        <CustomData>{ name: "BPLHMOD", adr: 0xdff1E6 }, /* UHRES bit plane modulo */
        <CustomData>{ name: "SPRHPTH", adr: 0xdff1E8 }, /* UHRES sprite pointer (high 5 bits) */
        <CustomData>{ name: "SPRHPTL", adr: 0xdff1EA }, /* UHRES sprite pointer (low 15 bits) */
        <CustomData>{ name: "BPLHPTH", adr: 0xdff1EC }, /* VRam (UHRES) bitplane pointer (hi 5 bits) */
        <CustomData>{ name: "BPLHPTL", adr: 0xdff1EE }, /* VRam (UHRES) bitplane pointer (lo 15 bits) */
        <CustomData>{ name: "RESERVED", adr: 0xdff1F0 }, /* Reserved (forever i guess!) */
        <CustomData>{ name: "RESERVED", adr: 0xdff1F2 }, /* Reserved (forever i guess!) */
        <CustomData>{ name: "RESERVED", adr: 0xdff1F4 }, /* Reserved (forever i guess!) */
        <CustomData>{ name: "RESERVED", adr: 0xdff1F6 }, /* Reserved (forever i guess!) */
        <CustomData>{ name: "RESERVED", adr: 0xdff1F8 }, /* Reserved (forever i guess!) */
        <CustomData>{ name: "RESERVED", adr: 0xdff1Fa }, /* Reserved (forever i guess!) */
        <CustomData>{ name: "FMODE", adr: 0xdff1FC, rw: 2 | 8 }, /* Fetch mode register */
        <CustomData>{ name: "NO-OP(NULL)", adr: 0xdff1FE }   /*   Can also indicate last 2 or 3 refresh cycles or the restart of the COPPER after lockup.*/
    ];

    private static customMap: Map<string, CustomData> | undefined;
    private static customMapByAddr: Map<number, CustomData> | undefined;

    private static prepareCustomMap() {
        if (MemoryLabelsRegistry.customMap === undefined) {
            MemoryLabelsRegistry.customMap = new Map<string, CustomData>();
            MemoryLabelsRegistry.customMapByAddr = new Map<number, CustomData>();
            for (let d of MemoryLabelsRegistry.customData) {
                MemoryLabelsRegistry.customMap.set(d.name, d);
                MemoryLabelsRegistry.customMapByAddr.set(d.adr, d);
            }
        }
    }
    public static getCustomAddress(name: string): number | undefined {
        MemoryLabelsRegistry.prepareCustomMap();
        if (MemoryLabelsRegistry.customMap) {
            let d = MemoryLabelsRegistry.customMap.get(name);
            if (d === undefined) {
                // Maybe a double value - lets try with the high position
                d = MemoryLabelsRegistry.customMap.get(name + 'H');
                if (d !== undefined) {
                    return d.adr;
                }
            } else {
                return d.adr;
            }
        }
        return undefined;
    }
    public static getCustomName(address: number): string | undefined {
        MemoryLabelsRegistry.prepareCustomMap();
        if (MemoryLabelsRegistry.customMapByAddr) {
            let d = MemoryLabelsRegistry.customMapByAddr.get(address);
            if (d) {
                return d.name;
            }
        }
        return undefined;
    }

    public static getCopperAddress(copperIndex: number, variableResolver: DebugVariableResolver): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let registerName = "COP1LCH";
            if (copperIndex !== 1) {
                registerName = "COP2LCH";
            }
            let copperHigh = MemoryLabelsRegistry.getCustomAddress(registerName);
            if (copperHigh !== undefined) {
                // Getting the value
                await variableResolver.getMemory(copperHigh, 4).then((memory) => {
                    resolve(parseInt(memory, 16));
                }).catch(err => {
                    reject(err);
                });
            }
        });
    }
}