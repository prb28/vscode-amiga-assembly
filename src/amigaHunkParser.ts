import * as fs from 'fs';

const HUNK_HEADER: number = 1011; // 0x3f3
// hunk types
const HUNK_UNIT: number = 999;
const HUNK_NAME: number = 1000;
const HUNK_CODE: number = 1001;
const HUNK_DATA: number = 1002;
const HUNK_BSS: number = 1003;
const HUNK_RELOC32: number = 1004;
const HUNK_DEBUG: number = 1009;
const HUNK_SYMBOL: number = 1008;
const HUNK_END: number = 1010;
const DEBUG_LINE: number = 0x4c494e45;

const HUNKF_CHIP: number = 1 << 30;
const HUNKF_FAST: number = 1 << 31;


export enum HunkType {
    Code,
    Data,
    Bss,
}

export interface RelocInfo32 {
    target: number;
    data: Array<number>;
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
    memType: MemoryType;
    hunkType: HunkType;
    allocSize: number;
    dataSize: number;
    codeData?: Uint32Array;
    reloc32?: Array<RelocInfo32>;
    symbols?: Array<Symbol>;
    lineDebugInfo?: Array<SourceFile>;
    segmentsId?: number;
    segmentsAddress?: number;
}

export enum MemoryType {
    Any,
    Chip,
    Fast,
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
            case HUNKF_CHIP:
                memType = MemoryType.Chip;
                break;
            case HUNKF_FAST:
                memType = MemoryType.Fast;
                break;
            default:
                memType = MemoryType.Any;
                break;
        }
        return [size, memType];
    }

    private toArrayBuffer(buf: Buffer): ArrayBuffer {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }

    public parse_bss(hunk: Hunk, fileData: DataView, fileOffset: number): number {
        let size = fileData.getUint32(fileOffset, false);
        // BSS contains the The number of longwords of zeroed memory to allocate
        hunk.hunkType = HunkType.Bss;
        hunk.dataSize = size;
        return fileOffset + 4;
    }

    public parse_code_or_data(hunkType: HunkType, hunk: Hunk, fileData: DataView, fileOffset: number): number {
        let [size, memType] = this.get_size_type(fileData.getUint32(fileOffset, false));
        let codeData = new Uint32Array(size / 4);
        let pos = fileOffset + 4;

        hunk.dataSize = size;
        hunk.hunkType = hunkType;
        hunk.memType = memType;

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
                data: Array<number>(count),
            };
            for (let i = 0; i < count; i++) {
                reloc.data.push(fileData.getUint32(pos, false));
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
        while (hunkType !== HUNK_END) {
            switch (hunkType) {
                case HUNK_DEBUG:
                    pos = this.parse_debug(hunk, fileData, pos);
                    break;
                case HUNK_CODE:
                    pos = this.parse_code_or_data(HunkType.Code, hunk, fileData, pos);
                    break;
                case HUNK_DATA:
                    pos = this.parse_code_or_data(HunkType.Data, hunk, fileData, pos);
                    break;
                case HUNK_BSS:
                    pos = this.parse_bss(hunk, fileData, pos);
                    break;
                case HUNK_RELOC32:
                    pos = this.parse_reloc32(hunk, fileData, pos);
                    break;
                case HUNK_SYMBOL:
                    pos = this.parse_symbols(hunk, fileData, pos);
                    break;
                case HUNK_UNIT:
                // continue
                case HUNK_NAME:
                    pos = this.skip_hunk(fileData, pos);
                    break;
                case HUNK_END:
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

    public parse_file(filename: string): Array<Hunk> {
        const stats = fs.statSync(filename);
        const fileSizeInBytes = stats.size;
        let buffer = Buffer.alloc(fileSizeInBytes);
        let fd = fs.openSync(filename, 'r');
        fs.readSync(fd, buffer, 0, fileSizeInBytes, 0);
        let fileOffset = 0;
        let fileData = new DataView(this.toArrayBuffer(buffer)); // Reading in Big Endian

        let hunk_header = fileData.getUint32(fileOffset, false);
        fileOffset += 4;
        if (hunk_header !== HUNK_HEADER) {
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
            fileOffset += 4;
            hunk_table.push(<SizesTypes>{
                memType: memType,
                size: size
            });
        }

        let hunks = new Array<Hunk>();

        for (let i = 0; i < hunk_count; i++) {
            let hunk = <Hunk>{
                memType: hunk_table[i].memType,
                allocSize: hunk_table[i].size,
            };
            fileOffset = this.fill_hunk(hunk, fileData, fileOffset);
            hunks.push(hunk);
        }
        return hunks;
    }
}
