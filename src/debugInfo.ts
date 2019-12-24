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

    public load(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (this.loaded) {
                resolve(true);
            } else {
                let parser = new HunkParser();
                try {
                    this.hunks = await parser.readFile(this.uri);
                    resolve(true);
                } catch (err) {
                    resolve(false);
                }
            }
        });
    }

    public getCodeData(): Uint32Array[] {
        let codeDataArray = new Array<Uint32Array>();
        for (let i = 0; i < this.hunks.length; i++) {
            let hunk = this.hunks[i];
            if ((hunk.hunkType === HunkType.CODE) && hunk.codeData) {
                codeDataArray.push(hunk.codeData);
            }
        }
        return codeDataArray;
    }

    public getSymbols(filename: string | undefined): Promise<Array<[Symbol, number | undefined]>> {
        return new Promise(async (resolve, _reject) => {
            await this.load();
            let symbols = Array<[Symbol, number | undefined]>();
            let normFilename = filename;
            if (normFilename) {
                normFilename = FileProxy.normalize(normFilename);
            }
            for (let i = 0; i < this.hunks.length; i++) {
                let hunk = this.hunks[i];
                if (hunk.symbols) {
                    if (normFilename) {
                        let sourceFiles = hunk.lineDebugInfo;
                        if (sourceFiles) {
                            for (let j = 0; j < sourceFiles.length; j++) {
                                let srcFile = sourceFiles[j];
                                // Is there a path replacement
                                let name = await this.resolveFileName(srcFile.name);
                                if (this.areSameSourceFileNames(name, normFilename)) {
                                    for (let s of hunk.symbols) {
                                        symbols.push([s, hunk.segmentsId]);
                                    }
                                    break;
                                }
                            }
                        }
                    } else {
                        for (let s of hunk.symbols) {
                            symbols.push([s, hunk.segmentsId]);
                        }
                    }
                }
            }
            resolve(symbols);
        });
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

    private getSourceLineText(filename: string, line: number): Promise<[string, string | null]> {
        return new Promise(async (resolve, reject) => {
            let resolvedFileName = await this.resolveFileName(filename);
            let contents: Array<string> | undefined = this.sourceFilesCacheMap.get(resolvedFileName);
            if (!contents) {
                // Load source file
                let fileProxy = new FileProxy(Uri.file(resolvedFileName));
                let fileContentsString = await fileProxy.readFileText();
                contents = fileContentsString.split(/\r\n|\r|\n/g);
                this.sourceFilesCacheMap.set(resolvedFileName, contents);
            }
            if (contents && (line < contents.length)) {
                resolve([resolvedFileName, contents[line]]);
            }
            resolve([resolvedFileName, null]);
        });
    }

    public resolveFileLine(segId: number, offset: number): Promise<([string, number, string | null] | null)> {
        return new Promise(async (resolve, reject) => {
            await this.load();
            if (segId >= this.hunks.length) {
                resolve(null);
            }
            let hunk = this.hunks[segId];
            let sourceLineText = null;

            let source_files = hunk.lineDebugInfo;
            if (source_files) {
                for (let i = 0; i < source_files.length; i++) {
                    let srcFile = source_files[i];
                    //if offset > src_file.base_offset {
                    //    continue;
                    //}
                    let data = this.tryFindLine(srcFile.name, srcFile.lines, offset);
                    if (data) {
                        // transform the file path to a local one
                        let resolvedFileName = await this.resolveFileName(data[0]);
                        if (data[1] > 0) {
                            [resolvedFileName, sourceLineText] = await this.getSourceLineText(resolvedFileName, data[1] - 1);
                        }
                        resolve([resolvedFileName, data[1], sourceLineText]);
                    }
                }
            }
            resolve(null);
        });
    }

    private findFileInWorkspace(filename: string): Promise<string> {
        return new Promise(async (resolve, _reject) => {
            // fall back to the first workspace
            let folders = vscode.workspace.workspaceFolders;
            if (folders) {
                for (let folder of folders) {
                    let folderPath = path.join(folder.uri.fsPath, filename);
                    let fileProxy = new FileProxy(Uri.file(folderPath));
                    if (await fileProxy.exists()) {
                        resolve(folderPath);
                    }
                }
            }
            resolve(filename);
        });
    }

    private resolveFileName(filename: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let resolvedFileName = this.resolvedSourceFilesNames.get(filename);
            if (!resolvedFileName) {
                resolvedFileName = filename;
                if (this.pathReplacements) {
                    for (let key of Array.from(this.pathReplacements.keys())) {
                        if (resolvedFileName.indexOf(key) >= 0) {
                            let value = this.pathReplacements.get(key);
                            if (value) {
                                resolvedFileName = resolvedFileName.replace(key, value);
                                break;
                            }
                        }
                    }
                }
                // search the file in the workspace
                resolvedFileName = await this.findFileInWorkspace(resolvedFileName);
                let fProxy = new FileProxy(Uri.file(resolvedFileName));
                if (this.sourcesRootPaths && !await fProxy.exists()) {
                    for (let rootPath of this.sourcesRootPaths) {
                        let checkedPath = path.join(rootPath, resolvedFileName);
                        let checkedProxy = new FileProxy(Uri.file(checkedPath));
                        if (await checkedProxy.exists()) {
                            resolvedFileName = checkedPath;
                            break;
                        }
                    }
                }
                resolvedFileName = FileProxy.normalize(resolvedFileName);
                this.resolvedSourceFilesNames.set(filename, resolvedFileName);
            }
            resolve(resolvedFileName);
        });
    }

    public areSameSourceFileNames(sourceA: string, sourceB: string): boolean {
        if (path.isAbsolute(sourceA) && path.isAbsolute(sourceB)) {
            return sourceA === sourceB;
        }
        return path.basename(sourceB) === path.basename(sourceA);
    }

    public getAddressSeg(filename: string, fileLine: number): Promise<([number, number] | null)> {
        return new Promise(async (resolve, _reject) => {
            await this.load();
            let normFilename = FileProxy.normalize(filename);
            for (let i = 0; i < this.hunks.length; i++) {
                let hunk = this.hunks[i];
                let sourceFiles = hunk.lineDebugInfo;
                if (sourceFiles) {
                    for (let j = 0; j < sourceFiles.length; j++) {
                        let srcFile = sourceFiles[j];
                        // Is there a path replacement
                        let name = await this.resolveFileName(srcFile.name);
                        if (this.areSameSourceFileNames(name, normFilename)) {
                            for (let k = 0; k < srcFile.lines.length; k++) {
                                let line = srcFile.lines[k];
                                if (line.line === fileLine) {
                                    resolve([i, line.offset]);
                                }
                            }
                        }
                    }
                }
            }
            resolve(null);
        });
    }

    public getAllSegmentIds(filename: string): Promise<number[]> {
        return new Promise(async (resolve, _reject) => {
            await this.load();
            let segIds: number[] = [];
            let normFilename = FileProxy.normalize(filename);
            for (let i = 0; i < this.hunks.length; i++) {
                let hunk = this.hunks[i];
                let sourceFiles = hunk.lineDebugInfo;
                if (sourceFiles) {
                    for (let j = 0; j < sourceFiles.length; j++) {
                        let srcFile = sourceFiles[j];
                        // Is there a path replacement
                        let name = await this.resolveFileName(srcFile.name);
                        if (this.areSameSourceFileNames(name, normFilename)) {
                            segIds.push(i);
                        }
                    }
                }
            }
            resolve(segIds);
        });
    }
}
