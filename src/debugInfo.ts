import { Hunk, HunkParser, SourceLine } from './amigaHunkParser';

export class DebugInfo {
    public hunks = new Array<Hunk>();

    public loadInfo(filePath: string) {
        console.log("Trying debug data from {:?}", filePath);
        let parser = new HunkParser();
        this.hunks = parser.parse_file(filePath);
    }

    protected tryFindLine(filename: string, lines: Array<SourceLine>, offset: number): ([string, number] | null) {
        let sourceLine = 0;
        let wasOver = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.offset === offset) {
                //println!("Matching source {} line {}", filename, line.line);
                return [filename, line.line];
            }
            if (line.offset <= offset) {
                sourceLine = line.line;
            } else if (line.offset > offset) {
                wasOver = true;
            }
        }

        if (wasOver) {
            //println!("Partial Matching source {} line {}", filename, sourceLine);
            return [filename, sourceLine];
        } else {
            return null;
        }
    }

    public resolveFileLine(segId: number, offset: number): ([string, number] | null) {
        if (segId >= this.hunks.length) {
            return null;
        }

        let hunk = this.hunks[segId];

        let source_files = hunk.line_debug_info;
        if (source_files) {
            for (let i = 0; i < source_files.length; i++) {
                let srcFile = source_files[i];
                //if offset > src_file.base_offset {
                //    continue;
                //}
                let data = this.tryFindLine(srcFile.name, srcFile.lines, offset);
                if (data) {
                    return data;
                }
            }
        }
        return null;
    }

    public getAddressSeg(filename: string, fileLine: number, pathReplacements: Map<string, string>): ([number, number] | null) {
        for (let i = 0; i < this.hunks.length; i++) {
            let hunk = this.hunks[i];
            let sourceFiles = hunk.line_debug_info;
            if (sourceFiles) {
                for (let j = 0; j < sourceFiles.length; j++) {
                    let srcFile = sourceFiles[j];
                    // Is there a path replacement
                    let name = srcFile.name;
                    for (let key of Array.from(pathReplacements.keys())) {
                        if (name.indexOf(key) >= 0) {
                            let value = pathReplacements.get(key);
                            if (value) {
                                name = name.replace(key, value);
                                break;
                            }
                        }
                    }
                    if (name === filename) {
                        for (let k = 0; k < srcFile.lines.length; k++) {
                            let line = srcFile.lines[k];
                            if (line.line === fileLine) {
                                return [i, line.offset];
                            }
                        }
                    }
                }
            }
        }

        return null;
    }
}
