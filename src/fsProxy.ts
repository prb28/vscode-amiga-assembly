import { Uri, workspace, FileStat, FileType, FileSystemError } from "vscode";
//import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

/**
 * Class to Manage all the filesystem accesses
 */
export class FileProxy {
    /** URI of the file */
    private uri: Uri;

    /** Does not use the vscode workspace access */
    private useDirectAccess: boolean;

    /**
     * Constructor
     * @param uri Uri of the file
     * @param useDirectAccess If true it use the direct access to filesystem
     */
    public constructor(uri: Uri, useDirectAccess = false) {
        this.uri = uri;
        this.useDirectAccess = useDirectAccess;
    }

    /**
     * Gets stats of the uri
     * @return file stats
     */
    public stat(): Promise<FileStat> {
        return new Promise(async (resolve, reject) => {
            if (this.useDirectAccess) {
                try {
                    let fDirectStat = fs.statSync(this.uri.fsPath);
                    resolve(<FileStat>{
                        ctime: fDirectStat.ctime.valueOf(),
                        size: fDirectStat.size,
                        mtime: fDirectStat.mtimeMs,
                        type: fDirectStat.isFile() ? FileType.File : FileType.Directory
                    });
                } catch (err) {
                    reject(err);
                }
            } else {
                try {
                    resolve(await workspace.fs.stat(this.uri));
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    /**
     * Read a text file.
     */
    public readFileText(encoding?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let buffer = await this.readFile();
                resolve(buffer.toString(encoding));
            } catch (err) {
                reject(err);
            }
        });
    }


    /**
     * Read the file contents
     * @return buffer containing the file
     */
    public readFile(): Promise<Buffer> {
        return new Promise(async (resolve, reject) => {
            if (this.useDirectAccess) {
                try {
                    let contents = fs.readFileSync(this.uri.fsPath);
                    if (contents) {
                        resolve(contents);
                    } else {
                        reject(FileSystemError.FileNotFound(this.uri));
                    }
                } catch (err) {
                    reject(err);
                }
            } else {
                try {
                    let contents = await workspace.fs.readFile(this.uri);
                    if (contents) {
                        resolve(Buffer.from(contents));
                    } else {
                        reject(FileSystemError.FileNotFound(this.uri));
                    }
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    /**
     * Write the file
     * @param contents Contents to be written
     * @return buffer containing the file
     */
    public writeFile(contents: Buffer): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (this.useDirectAccess) {
                try {
                    fs.writeFile(this.uri.fsPath, contents, (err) => {
                        if (err === null) {
                            resolve();
                        } else {
                            reject(err);
                        }
                    });
                } catch (err) {
                    reject(err);
                }
            } else {
                try {
                    await workspace.fs.writeFile(this.uri, contents);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    /**
     * Check it the uri exists
     */
    public exists(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (this.useDirectAccess) {
                try {
                    resolve(fs.existsSync(this.uri.fsPath));
                } catch (err) {
                    resolve(false);
                }
            } else {
                try {
                    await this.stat();
                    resolve(true);
                } catch (err) {
                    resolve(false);
                }
            }
        });
    }

    /**
     * List directory files
     * @return buffer containing the list of filenames and types
     */
    public readDirectory(): Promise<Array<[string, FileType]>> {
        return new Promise(async (resolve, reject) => {
            if (this.useDirectAccess) {
                try {
                    let results = fs.readdirSync(this.uri.fsPath, { withFileTypes: true });
                    let values = new Array<[string, FileType]>();
                    for (let dir of results) {
                        let fType = dir.isFile() ? FileType.File : FileType.Directory;
                        values.push([dir.name, fType]);
                    }
                    resolve(values);
                } catch (err) {
                    reject(err);
                }
            } else {
                try {
                    resolve(await workspace.fs.readDirectory(this.uri));
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    /**
     * Retrieves the uri value
     * @return Uri value
     */
    public getUri(): Uri {
        return this.uri;
    }

    /**
     * Find the files matching patterns in the directory
     */
    public findFiles(includes: string, excludes: string): Promise<Array<FileProxy>> {
        return new Promise(async (resolve, reject) => {
            if (this.useDirectAccess || workspace.getWorkspaceFolder(this.uri) === undefined) {
                try {
                    let values = new Array<FileProxy>();
                    // List the source dir
                    let files = glob.sync(includes, {
                        cwd: this.uri.fsPath,
                        ignore: excludes
                    });
                    for (let f of files) {
                        values.push(this.getRelativeFile(f));
                    }
                    resolve(values);
                } catch (err) {
                    reject(err);
                }
            } else {
                let values = new Array<FileProxy>();
                let files = await workspace.findFiles(includes, excludes);
                for (let f of files) {
                    values.push(new FileProxy(f));
                }
                resolve(values);
            }
        });
    }

    /**
     * List the files in the directory
     */
    public listFiles(): Promise<Array<FileProxy>> {
        return this.findFiles("*", "");
    }

    /**
     * Name of the file
     * 
     * @return The name of the file
     */
    public getName(): string {
        return path.basename(this.uri.fsPath);
    }

    /**
     * Normalizes a path
     * @param inputPath Path to normalize
     * @return Normalized path
     */
    public static normalize(inputPath: string): string {
        let newDName = inputPath.replace(/\\+/g, '/');
        // Testing Windows derive letter -> to uppercase
        if ((newDName.length > 0) && (newDName.charAt(1) === ":")) {
            let fChar = newDName.charAt(0).toUpperCase();
            newDName = fChar + ":" + newDName.substring(2);
        }
        return newDName;
    }

    /**
     * Creates a file with a relative path to the current uri
     * @param relativePath relative path to be added
     * @return A new file to the relative path
     */
    public getRelativeFile(relativePath: string): FileProxy {
        let normalizedRelativePath = FileProxy.normalize(relativePath);
        let currentUriPath = FileProxy.normalize(this.uri.fsPath);
        // Does the current uri contains child path ?
        if (normalizedRelativePath.indexOf(currentUriPath) === 0) {
            return new FileProxy(Uri.file(normalizedRelativePath), this.useDirectAccess);
        } else {
            return new FileProxy(Uri.file(`${currentUriPath}/${normalizedRelativePath}`), this.useDirectAccess);
        }
    }

    /**
     * Deletes a file
     */
    delete() {
        return new Promise(async (resolve, reject) => {
            if (this.useDirectAccess || workspace.getWorkspaceFolder(this.uri) === undefined) {
                try {
                    fs.unlinkSync(this.uri.fsPath);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            } else {
                try {
                    await workspace.fs.delete(this.uri);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    /**
     * Creates a directory
     */
    mkdir(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (this.useDirectAccess || workspace.getWorkspaceFolder(this.uri) === undefined) {
                try {
                    fs.mkdirSync(this.uri.fsPath);
                    resolve();
                } catch (err) {
                    if (err.code !== 'EEXIST') {
                        reject(err);
                    }
                }
            } else {
                try {
                    await workspace.fs.createDirectory(this.uri);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    /**
     * Returns the path of the file
     */
    public getPath(): string {
        return this.uri.fsPath;
    }
}
