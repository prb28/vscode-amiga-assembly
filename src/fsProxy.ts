import { Uri, workspace, FileStat, FileType, FileSystemError } from "vscode";
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
            const fDirectStat = fs.statSync(this.uri.fsPath);
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
    public async readFileText(encoding?: BufferEncoding): Promise<string> {
        const buffer = await this.readFile();
        return buffer.toString(encoding);
    }


    /**
     * Read the file contents
     * @return buffer containing the file
     */
    public async readFile(): Promise<Buffer> {
        if (this.useDirectAccess) {
            const contents = fs.readFileSync(this.uri.fsPath);
            if (contents) {
                return contents;
            } else {
                throw FileSystemError.FileNotFound(this.uri);
            }
        } else {
            const contents = await workspace.fs.readFile(this.uri);
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
     */
    public async writeFile(contents: Buffer): Promise<void> {
        if (this.useDirectAccess) {
            fs.writeFileSync(this.uri.fsPath, contents);
        } else {
            await workspace.fs.writeFile(this.uri, contents);
        }
    }

    /**
     * Rename the file
     * @param newFile New file
     */
    public async rename(newFile: FileProxy): Promise<void> {
        if (this.useDirectAccess) {
            fs.renameSync(this.uri.fsPath, newFile.getUri().fsPath);
        } else {
            await workspace.fs.rename(this.uri, newFile.getUri());
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
            const results = fs.readdirSync(this.uri.fsPath, { withFileTypes: true });
            const values = new Array<[string, FileType]>();
            for (const dir of results) {
                const fType = dir.isFile() ? FileType.File : FileType.Directory;
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
        const values = new Array<FileProxy>();
        // List the source dir
        const files = glob.sync(includes, {
            cwd: this.uri.fsPath,
            ignore: excludes
        });
        for (const f of files) {
            values.push(this.getRelativeFile(f));
        }
        return values;
    }

    /**
     * List the files in the directory
     */
    public async listFiles(): Promise<Array<FileProxy>> {
        const values = new Array<FileProxy>();
        const files = fs.readdirSync(this.uri.fsPath);
        for (const f of files) {
            values.push(this.getRelativeFile(f));
        }
        return values;
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
     * Gets the parent file
     * @returns Parent file
     */
    public getParent(): FileProxy {
        const parent = path.dirname(this.uri.fsPath);
        return new FileProxy(Uri.file(parent));
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
            const fChar = newDName.charAt(0).toUpperCase();
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
        const normalizedRelativePath = FileProxy.normalize(relativePath);
        const currentUriPath = FileProxy.normalize(this.uri.fsPath);
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
        const stat = await this.stat();
        return (stat.type & FileType.Directory) > 0;
    }

    /**
     * Check if the file is a file
     */
    public async isFile(): Promise<boolean> {
        const stat = await this.stat();
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

    /**
     * Copy fil or directory recursively
     * @param destination Destination file
     */
    public async copy(destination: FileProxy): Promise<void> {
        if (await this.isFile()) {
            await destination.writeFile(await this.readFile());
        } else {
            const files = await this.listFiles();
            await destination.mkdir();
            for (const f of files) {
                const name = f.getName();
                const destFile = destination.getRelativeFile(name);
                await f.copy(destFile);
            }
        }
    }

    public async replaceStringInFile(stringToReplace: string | RegExp, replacementString: string): Promise<void> {
        if (await this.isFile()) {
            const contents = await this.readFile();
            const strContents = contents.toString();
            const replacedString = strContents.replace(stringToReplace, replacementString);
            await this.writeFile(Buffer.from(replacedString));
        } else {
            throw new Error("Replace string cannot be done on a directory");
        }
    }

    /**
     * Test if the two files are in the same directory.
     * @param file1 First file
     * @param file2 Second file
     * @returns True if they are in the same directory
     */
    public static inSameDir(file1: string, file2: string): boolean {
        const parentFile1 = FileProxy.normalize(path.basename(path.dirname(file1)));
        const parentFile2 = FileProxy.normalize(path.basename(path.dirname(file2)));
        return parentFile1 === parentFile2;
    }
}
