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
    public async stat(): Promise<FileStat> {
        if (this.useDirectAccess) {
            let fDirectStat = fs.statSync(this.uri.fsPath);
            return <FileStat>{
                ctime: fDirectStat.ctime.valueOf(),
                size: fDirectStat.size,
                mtime: fDirectStat.mtimeMs,
                type: fDirectStat.isFile() ? FileType.File : FileType.Directory
            };
        } else {
            return workspace.fs.stat(this.uri);
        }
    }

    /**
     * Read a text file.
     */
    public readFileText(encoding?: BufferEncoding): Promise<string> {
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
    public async readFile(): Promise<Buffer> {
        if (this.useDirectAccess) {
            let contents = fs.readFileSync(this.uri.fsPath);
            if (contents) {
                return contents;
            } else {
                throw FileSystemError.FileNotFound(this.uri);
            }
        } else {
            let contents = await workspace.fs.readFile(this.uri);
            if (contents) {
                return Buffer.from(contents);
            } else {
                throw FileSystemError.FileNotFound(this.uri);
            }
        }
    }

    /**
     * Write the file
     * @param contents Contents to be written
     * @return buffer containing the file
     */
    public async writeFile(contents: Buffer): Promise<void> {
        if (this.useDirectAccess) {
            fs.writeFileSync(this.uri.fsPath, contents);
        } else {
            await workspace.fs.writeFile(this.uri, contents);
        }
    }

    /**
     * Check it the uri exists
     */
    public async exists(): Promise<boolean> {
        if (this.useDirectAccess) {
            try {
                return fs.existsSync(this.uri.fsPath);
            } catch (err) {
                return false;
            }
        } else {
            try {
                await this.stat();
                return true;
            } catch (err) {
                return false;
            }
        }
    }

    /**
     * List directory files
     * @return buffer containing the list of filenames and types
     */
    public async readDirectory(): Promise<Array<[string, FileType]>> {
        if (this.useDirectAccess) {
            let results = fs.readdirSync(this.uri.fsPath, { withFileTypes: true });
            let values = new Array<[string, FileType]>();
            for (let dir of results) {
                let fType = dir.isFile() ? FileType.File : FileType.Directory;
                values.push([dir.name, fType]);
            }
            return values;
        } else {
            return workspace.fs.readDirectory(this.uri);
        }
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
    public async findFiles(includes: string, excludes: string): Promise<Array<FileProxy>> {
        if (this.useDirectAccess || workspace.getWorkspaceFolder(this.uri) === undefined) {
            let values = new Array<FileProxy>();
            // List the source dir
            let files = glob.sync(includes, {
                cwd: this.uri.fsPath,
                ignore: excludes
            });
            for (let f of files) {
                values.push(this.getRelativeFile(f));
            }
            return values;
        } else {
            let values = new Array<FileProxy>();
            let files = await workspace.findFiles(includes, excludes);
            for (let f of files) {
                values.push(new FileProxy(f));
            }
            return values;
        }
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
     * Check if the file is a directory
     */
    public async isDirectory(): Promise<boolean> {
        let stat = await this.stat();
        return (stat.type & FileType.Directory) > 0;
    }

    /**
     * Check if the file is a file
     */
    public async isFile(): Promise<boolean> {
        let stat = await this.stat();
        return (stat.type & FileType.File) > 0;
    }

    /**
     * Deletes a file
     */
    public async delete(): Promise<void> {
        if (this.useDirectAccess || workspace.getWorkspaceFolder(this.uri) === undefined) {
            if (await this.isDirectory()) {
                fs.rmdirSync(this.uri.fsPath, { recursive: true });
            } else {
                fs.unlinkSync(this.uri.fsPath);
            }
        } else {
            await workspace.fs.delete(this.uri, { recursive: true });
        }
    }

    /**
     * Creates a directory
     */
    public async mkdir(): Promise<void> {
        if (this.useDirectAccess || workspace.getWorkspaceFolder(this.uri) === undefined) {
            try {
                fs.mkdirSync(this.uri.fsPath);
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }
        } else {
            await workspace.fs.createDirectory(this.uri);
        }
    }

    /**
     * Returns the path of the file
     */
    public getPath(): string {
        return this.uri.fsPath;
    }
}
