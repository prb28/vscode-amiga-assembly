/* eslint-disable @typescript-eslint/ban-types */
import { Hunk, HunkParser, SourceLine, HunkType, Symbol } from './amigaHunkParser';
import * as path from 'path';
import * as vscode from 'vscode';
import { FileProxy } from './fsProxy';
import { Uri } from 'vscode';

export class DebugInfo {
    public hunks = new Array<Hunk>();
    private pathReplacements?: Map<string, string>;
    private sourcesRootPaths?: Array<string>;
    private resolvedSourceFilesNames = new Map<string, string>();
    private sourceFilesCacheMap = new Map<string, Array<string>>();
    private uri: Uri;
    private loaded = false;

    constructor(fileUri: Uri, pathReplacements?: Map<string, string>, sourcesRootPaths?: Array<string>) {
        this.uri = fileUri;
        this.pathReplacements = pathReplacements;
        this.sourcesRootPaths = sourcesRootPaths;
    }

    public async load(): Promise<boolean> {
        if (this.loaded) {
            return true;
        } else {
            const parser = new HunkParser();
            try {
                this.hunks = await parser.readFile(this.uri);
                return true;
            } catch (err) {
                return false;
            }
        }
    }

    public getCodeData(): Uint32Array[] {
        const codeDataArray = new Array<Uint32Array>();
        for (let i = 0; i < this.hunks.length; i++) {
            const hunk = this.hunks[i];
            if ((hunk.hunkType === HunkType.CODE) && hunk.codeData) {
                codeDataArray.push(hunk.codeData);
            }
        }
        return codeDataArray;
    }

    public async getSymbols(filename: string | undefined): Promise<Array<[Symbol, number | undefined]>> {
        await this.load();
        const symbols = Array<[Symbol, number | undefined]>();
        let normFilename = filename;
        if (normFilename) {
            normFilename = FileProxy.normalize(normFilename);
        }
        for (let i = 0; i < this.hunks.length; i++) {
            const hunk = this.hunks[i];
            if (hunk.symbols) {
                if (normFilename) {
                    const sourceFiles = hunk.lineDebugInfo;
                    if (sourceFiles) {
                        for (let j = 0; j < sourceFiles.length; j++) {
                            const srcFile = sourceFiles[j];
                            // Is there a path replacement
                            const name = await this.resolveFileName(srcFile.name);
                            if (this.areSameSourceFileNames(name, normFilename)) {
                                for (const s of hunk.symbols) {
                                    symbols.push([s, hunk.segmentsId]);
                                }
                                break;
                            }
                        }
                    }
                } else {
                    for (const s of hunk.symbols) {
                        symbols.push([s, hunk.segmentsId]);
                    }
                }
            }
        }
        return symbols;
    }

    protected tryFindLine(filename: string, lines: Array<SourceLine>, offset: number): ([string, number] | null) {
        let sourceLine = 0;
        let wasOver = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
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

    private async getSourceLineText(filename: string, line: number): Promise<[string, string | null]> {
        const resolvedFileName = await this.resolveFileName(filename);
        let contents: Array<string> | undefined = this.sourceFilesCacheMap.get(resolvedFileName);
        if (!contents) {
            // Load source file
            const fileProxy = new FileProxy(Uri.file(resolvedFileName));
            const fileContentsString = await fileProxy.readFileText();
            contents = fileContentsString.split(/\r\n|\r|\n/g);
            this.sourceFilesCacheMap.set(resolvedFileName, contents);
        }
        if (contents && (line < contents.length)) {
            return [resolvedFileName, contents[line]];
        }
        return [resolvedFileName, null];
    }

    public async resolveFileLine(segId: number, offset: number): Promise<([string, number, string | null] | null)> {
        await this.load();
        if (segId >= this.hunks.length) {
            return null;
        }
        const hunk = this.hunks[segId];
        let sourceLineText = null;

        const source_files = hunk.lineDebugInfo;
        if (source_files) {
            for (let i = 0; i < source_files.length; i++) {
                const srcFile = source_files[i];
                //if offset > src_file.base_offset {
                //    continue;
                //}
                const data = this.tryFindLine(srcFile.name, srcFile.lines, offset);
                if (data) {
                    // transform the file path to a local one
                    let resolvedFileName = await this.resolveFileName(data[0]);
                    if (data[1] > 0) {
                        [resolvedFileName, sourceLineText] = await this.getSourceLineText(resolvedFileName, data[1] - 1);
                    }
                    return [resolvedFileName, data[1], sourceLineText];
                }
            }
        }
        return null;
    }

    private async findFileInWorkspace(filename: string): Promise<string> {
        // fall back to the first workspace
        const folders = vscode.workspace.workspaceFolders;
        if (folders) {
            for (const folder of folders) {
                const folderPath = path.join(folder.uri.fsPath, filename);
                const fileProxy = new FileProxy(Uri.file(folderPath));
                if (await fileProxy.exists()) {
                    return folderPath;
                }
            }
        }
        return filename;
    }

    private async resolveFileName(filename: string): Promise<string> {
        let resolvedFileName = this.resolvedSourceFilesNames.get(filename);
        if (!resolvedFileName) {
            resolvedFileName = filename;
            if (this.pathReplacements) {
                const normalizedFilename = FileProxy.normalize(resolvedFileName);
                for (const key of Array.from(this.pathReplacements.keys())) {
                    const normalizedKey = FileProxy.normalize(key);
                    if (normalizedFilename.indexOf(normalizedKey) >= 0) {
                        const value = this.pathReplacements.get(key);
                        if (value) {
                            resolvedFileName = normalizedFilename.replace(normalizedKey, value);
                            break;
                        }
                    }
                }
            }
            // search the file in the workspace
            resolvedFileName = await this.findFileInWorkspace(resolvedFileName);
            const fProxy = new FileProxy(Uri.file(resolvedFileName));
            if (this.sourcesRootPaths && !await fProxy.exists()) {
                for (const rootPath of this.sourcesRootPaths) {
                    const checkedPath = path.join(rootPath, resolvedFileName);
                    const checkedProxy = new FileProxy(Uri.file(checkedPath));
                    if (await checkedProxy.exists()) {
                        resolvedFileName = checkedPath;
                        break;
                    }
                }
            }
            resolvedFileName = FileProxy.normalize(resolvedFileName);
            this.resolvedSourceFilesNames.set(filename, resolvedFileName);
        }
        return resolvedFileName;
    }

    public areSameSourceFileNames(sourceA: string, sourceB: string): boolean {
        if (path.isAbsolute(sourceA) && path.isAbsolute(sourceB)) {
            return sourceA === sourceB;
        }
        return path.basename(sourceB) === path.basename(sourceA);
    }

    public async getAddressSeg(filename: string, fileLine: number): Promise<([number, number] | null)> {
        await this.load();
        const normFilename = FileProxy.normalize(filename);
        for (let i = 0; i < this.hunks.length; i++) {
            const hunk = this.hunks[i];
            const sourceFiles = hunk.lineDebugInfo;
            if (sourceFiles) {
                for (let j = 0; j < sourceFiles.length; j++) {
                    const srcFile = sourceFiles[j];
                    // Is there a path replacement
                    const name = await this.resolveFileName(srcFile.name);
                    if (this.areSameSourceFileNames(name, normFilename)) {
                        for (let k = 0; k < srcFile.lines.length; k++) {
                            const line = srcFile.lines[k];
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

    public async getAllSegmentIds(filename: string): Promise<number[]> {
        await this.load();
        const segIds: number[] = [];
        const normFilename = FileProxy.normalize(filename);
        for (let i = 0; i < this.hunks.length; i++) {
            const hunk = this.hunks[i];
            const sourceFiles = hunk.lineDebugInfo;
            if (sourceFiles) {
                for (let j = 0; j < sourceFiles.length; j++) {
                    const srcFile = sourceFiles[j];
                    // Is there a path replacement
                    const name = await this.resolveFileName(srcFile.name);
                    if (this.areSameSourceFileNames(name, normFilename)) {
                        segIds.push(i);
                    }
                }
            }
        }
        return segIds;
    }
}
