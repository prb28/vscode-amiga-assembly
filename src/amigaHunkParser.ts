import * as fs from 'fs';
import winston = require('winston');

const DEBUG_LINE: number = 0x4c494e45;

export enum HunkType {
    HEADER = 1011, // 0x3f3
    UNIT = 999,
    NAME = 1000,
    CODE = 1001,
    DATA = 1002,
    BSS = 1003,
    RELOC32 = 1004,
    DEBUG = 1009,
    SYMBOL = 1008,
    END = 1010,
}

export interface RelocInfo32 {
    target: number;
    offsets: Array<number>;
}

export interface Symbol {
    name: string;
    offset: number;
}

export interface SourceLine {
    line: number;
    offset: number;
}

export interface SourceFile {
    name: string;
    baseOffset: number;
    lines: Array<SourceLine>;
}

export interface Hunk {
    index: number;
    fileOffset: number;
    memType: MemoryType;
    hunkType: HunkType;
    allocSize: number;
    dataSize: number;
    dataOffset: number;
    codeData?: Uint32Array;
    reloc32?: Array<RelocInfo32>;
    symbols?: Array<Symbol>;
    lineDebugInfo?: Array<SourceFile>;
    segmentsId?: number;
    segmentsAddress?: number;
}

export enum MemoryType {
    ANY,
    CHIP = 1 << 30,
    FAST = 1 << 31,
}

export interface SizesTypes {
    memType: MemoryType;
    size: number;
}

export class HunkParser {
    private skip_hunk(fileData: DataView, fileOffset: number): number {
        let [size,] = this.get_size_type(fileData.getUint32(fileOffset, false));
        return fileOffset + size + 4;
    }

    public get_size_type(t: number): [number, MemoryType] {
        let size = (t & 0x0fffffff) * 4;
        let mem_t = t & 0xf0000000;
        let memType: MemoryType;
        switch (mem_t) {
            case MemoryType.CHIP:
                memType = MemoryType.CHIP;
                break;
            case MemoryType.FAST:
                memType = MemoryType.FAST;
                break;
            default:
                memType = MemoryType.ANY;
                break;
        }
        return [size, memType];
    }

    private toArrayBuffer(buf: Buffer): ArrayBuffer {
        let ab = new ArrayBuffer(buf.length);
        let view = new Uint8Array(ab);
        for (let i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }

    public parse_bss(hunk: Hunk, fileData: DataView, fileOffset: number): number {
        let size = fileData.getUint32(fileOffset, false);
        // BSS contains the The number of long words of zeroed memory to allocate
        hunk.hunkType = HunkType.BSS;
        hunk.dataSize = size;
        return fileOffset + 4;
    }

    public parse_code_or_data(hunkType: HunkType, hunk: Hunk, fileData: DataView, fileOffset: number): number {
        let [size,] = this.get_size_type(fileData.getUint32(fileOffset, false));
        let codeData = new Uint32Array(size / 4);
        let pos = fileOffset + 4;

        hunk.dataSize = size;
        hunk.dataOffset = pos;
        hunk.hunkType = hunkType;

        for (let i = 0; i < (size / 4); i += 1) {
            codeData[i] = fileData.getInt32(pos, false);
            pos += 4;
        }

        hunk.codeData = codeData;
        return pos;
    }

    protected find_string_end(fileData: DataView, fileOffset: number): number {
        let pos = fileOffset;
        let v = fileData.getUint32(pos, false);
        while (v !== 0) {
            pos += 1;
            v = fileData.getUint32(pos, false);
        }
        return pos - fileOffset;
    }
    protected read_name_size(fileData: DataView, fileOffset: number, num_ui32: number): string {
        let lenBytes = num_ui32 * 4;
        let temp_buffer = new Array<number>(512);
        let pos = fileOffset;
        let idx = 0;
        let v = fileData.getUint8(pos);
        pos += 1;
        while ((v !== 0) && (pos < (fileOffset + lenBytes + 1))) {
            temp_buffer[idx++] = v;
            v = fileData.getUint8(pos++);
        }
        return String.fromCharCode.apply(String, temp_buffer.slice(0, idx));
    }

    /*
    fn read_name(file: &mut File) -> Option<io::Result<String>> {
        let num_longs = try!(file.read_number::<BigEndian>());
    }
    */

    protected parse_symbols(hunk: Hunk, fileData: DataView, fileOffset: number): number {
        let symbols = new Array<Symbol>();
        let pos = fileOffset;
        let num_longs = fileData.getUint32(pos, false);
        pos += 4;
        while (num_longs > 0) {
            let symbol = <Symbol>{
                name: this.read_name_size(fileData, pos, num_longs),
                offset: fileData.getUint32(pos + (num_longs * 4), false),
            };
            symbols.push(symbol);
            pos += num_longs * 4 + 4;
            num_longs = fileData.getUint32(pos, false);
            pos += 4;
        }
        // Sort symbols by offset ?
        if (symbols.length > 0) {
            symbols.sort(function (a, b) { return (a.offset > b.offset) ? 1 : ((b.offset > a.offset) ? -1 : 0); });
            hunk.symbols = symbols;
        }
        return pos;
    }
    protected fill_debug_info(baseOffset: number, num_longs: number, fileData: DataView, fileOffset: number): SourceFile {
        let pos = fileOffset;
        let num_name_longs = fileData.getUint32(pos, false);
        pos += 4;
        let name = this.read_name_size(fileData, pos, num_name_longs);
        pos += num_name_longs * 4;
        let num_lines = (num_longs - num_name_longs - 1) / 2;
        let lines = new Array<SourceLine>();

        for (let i = 0; i < num_lines; i++) {
            let line_no = fileData.getUint32(pos, false) & 0xffffff; // mask for SAS/C extra info
            pos += 4;
            let offset = fileData.getUint32(pos, false);
            pos += 4;
            lines.push(<SourceLine>{
                line: line_no,
                offset: baseOffset + offset,
            });
        }

        return <SourceFile>{
            name: name,
            baseOffset: baseOffset,
            lines: lines,
        };
    }

    protected parse_debug(hunk: Hunk, fileData: DataView, fileOffset: number): number {
        let pos = fileOffset;
        let num_longs = fileData.getUint32(pos, false) - 2; // skip base offset and tag
        pos += 4;
        let baseOffset = fileData.getUint32(pos, false);
        pos += 4;
        let debug_tag = fileData.getUint32(pos, false);
        pos += 4;

        // We only support debug line as debug format currently so skip if not found
        if (debug_tag === DEBUG_LINE) {
            let debug_info = hunk.lineDebugInfo;
            if (!debug_info) {
                debug_info = new Array<SourceFile>();
                hunk.lineDebugInfo = debug_info;
            }
            let source_file = this.fill_debug_info(baseOffset, num_longs, fileData, pos);
            debug_info.push(source_file);
        }
        return pos + num_longs * 4;
    }


    protected parse_reloc32(hunk: Hunk, fileData: DataView, fileOffset: number): number {
        let relocs = new Array<RelocInfo32>();
        let pos = fileOffset;
        let count = fileData.getUint32(pos, false);
        pos += 4;
        while (count > 0) {
            let target = fileData.getUint32(pos, false);
            pos += 4;
            let reloc = <RelocInfo32>{
                target: target,
                offsets: Array<number>(),
            };
            for (let i = 0; i < count; i++) {
                reloc.offsets.push(fileData.getUint32(pos, false));
                pos += 4;
            }
            relocs.push(reloc);
            count = fileData.getUint32(pos, false);
            pos += 4;
        }
        hunk.reloc32 = relocs;
        return pos;
    }

    public fill_hunk(hunk: Hunk, fileData: DataView, fileOffset: number): number {
        let pos = fileOffset;
        let hunkType = fileData.getUint32(pos, false);
        pos += 4;
        while (hunkType !== HunkType.END) {
            switch (hunkType) {
                case HunkType.DEBUG:
                    winston.debug(`Hunk DEBUG ${pos}`);
                    pos = this.parse_debug(hunk, fileData, pos);
                    break;
                case HunkType.CODE:
                    winston.debug(`Hunk CODE ${pos}`);
                    pos = this.parse_code_or_data(HunkType.CODE, hunk, fileData, pos);
                    break;
                case HunkType.DATA:
                    winston.debug(`Hunk DATA ${pos}`);
                    pos = this.parse_code_or_data(HunkType.DATA, hunk, fileData, pos);
                    break;
                case HunkType.BSS:
                    winston.debug(`Hunk BSS ${pos}`);
                    pos = this.parse_bss(hunk, fileData, pos);
                    break;
                case HunkType.RELOC32:
                    winston.debug(`Hunk RELOC32 ${pos}`);
                    pos = this.parse_reloc32(hunk, fileData, pos);
                    break;
                case HunkType.SYMBOL:
                    winston.debug(`Hunk SYMBOL ${pos}`);
                    pos = this.parse_symbols(hunk, fileData, pos);
                    break;
                case HunkType.UNIT:
                    winston.debug(`Hunk UNIT ${pos}`);
                    pos = this.skip_hunk(fileData, pos);
                    break;
                case HunkType.NAME:
                    winston.debug(`Hunk NAME ${pos}`);
                    break;
                case HunkType.END:
                    winston.debug(`Hunk END ${pos}`);
                    break;
                default:
                    // thrown error : unknown "Unknown hunk type {:x}", hunkType
                    break;
            }
            if (pos > (fileData.byteLength - 2)) {
                break;
            } else {
                hunkType = fileData.getUint32(pos, false);
                pos += 4;
            }
        }
        return pos;
    }

    public logHunk(hunk: Hunk) {
        winston.debug(`Hunk #${hunk.index} offset \$${hunk.fileOffset.toString(16)}`);
        winston.debug(`    > hunkType   : ${HunkType[hunk.hunkType]}`);
        winston.debug(`    > memType    : ${MemoryType[hunk.memType]}`);
        winston.debug(`    > dataSize   : ${hunk.dataSize}`);
        if (hunk.dataOffset) {
            winston.debug(`    > dataOffset : \$${hunk.dataOffset.toString(16)}`);
        }
        winston.debug(`    > allocSize  : ${hunk.allocSize}`);
        if (hunk.reloc32) {
            for (let reloc of hunk.reloc32) {
                let offsets = Array<string>();
                for (let relocOffset of reloc.offsets) {
                    offsets.push(`\$${relocOffset.toString(16)}`);
                }
                let s = offsets.join(',');
                winston.debug(`    > reloc[${reloc.target}] : ${s}`);
            }
        }
        if (hunk.symbols) {
            for (let symbol of hunk.symbols) {
                winston.debug(`    > symbol[${symbol.name}] : ${symbol.offset}`);
            }
        }
        if (hunk.lineDebugInfo) {
            for (let sourceFile of hunk.lineDebugInfo) {
                winston.debug(`    > lineDebugInfo : ${sourceFile.name}`);
            }
        }
    }

    public parse_file(filename: string): Array<Hunk> {
        winston.debug(`Parsing file "${filename}"`);
        const stats = fs.statSync(filename);
        const fileSizeInBytes = stats.size;
        let buffer = Buffer.alloc(fileSizeInBytes);
        let fd = fs.openSync(filename, 'r');
        fs.readSync(fd, buffer, 0, fileSizeInBytes, 0);
        let fileOffset = 0;
        let fileData = new DataView(this.toArrayBuffer(buffer)); // Reading in Big Endian

        let hunk_header = fileData.getUint32(fileOffset, false);
        fileOffset += 4;
        if (hunk_header !== HunkType.HEADER) {
            throw new Error("Not a valid hunk file : Unable to find correct HUNK_HEADER");
        }

        // Skip header/string section
        fileOffset += 4;

        let table_size = fileData.getUint32(fileOffset, false);
        fileOffset += 4;
        let first_hunk = fileData.getUint32(fileOffset, false);
        fileOffset += 4;
        let last_hunk = fileData.getUint32(fileOffset, false);
        fileOffset += 4;

        if (table_size < 0 || first_hunk < 0 || last_hunk < 0) {
            throw new Error("Not a valid hunk file : Invalid sizes for hunks");
        }

        let hunk_count = last_hunk - first_hunk + 1;

        let hunk_table = new Array<SizesTypes>();

        for (let i = 0; i < hunk_count; i++) {
            let [size, memType] = this.get_size_type(fileData.getUint32(fileOffset, false));
            winston.debug(`Hunk found [${MemoryType[memType]}] size = ${size}`);
            fileOffset += 4;
            hunk_table.push(<SizesTypes>{
                memType: memType,
                size: size
            });
        }

        let hunks = new Array<Hunk>();

        for (let i = 0; i < hunk_count; i++) {
            let hunk = <Hunk>{
                index: i,
                fileOffset: fileOffset,
                memType: hunk_table[i].memType,
                allocSize: hunk_table[i].size,
            };
            fileOffset = this.fill_hunk(hunk, fileData, fileOffset);
            this.logHunk(hunk);
            hunks.push(hunk);
        }
        return hunks;
    }
}
