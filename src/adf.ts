import { CancellationToken, Uri, workspace } from "vscode";
import { ExecutorHelper } from "./execHelper";
import * as path from 'path';
import * as glob from "glob";
import * as fs from "fs";

/**
 * Class to Generate an ADF file
 */
export class ADFTools {
    /** Path to the adftools executable */
    private adfCreateFilePath: string = "";
    private adfCopyFilePath: string = "";
    private adfInstallFilePath: string = "";
    private adfMkDirFilePath: string = "";
    /** Executor to run the tools */
    private executor: ExecutorHelper;

    /**
     * Constructor
     * @param adfToolsRootPath Path to ADFTools
     */
    public constructor(adfToolsRootPath: string) {
        this.executor = new ExecutorHelper();
        this.setToolsRootPath(adfToolsRootPath);
    }

    /**
     * Sets the tools rot path and generates the binaries paths
     * @param adfToolsRootPath Path to ADFTools
     */
    private setToolsRootPath(adfToolsRootPath: string) {
        this.adfCreateFilePath = path.join(adfToolsRootPath, 'adfcreate');
        this.adfCopyFilePath = path.join(adfToolsRootPath, 'adfcopy');
        this.adfInstallFilePath = path.join(adfToolsRootPath, 'adfinst');
        this.adfMkDirFilePath = path.join(adfToolsRootPath, 'adfmakedir');
    }

    /**
     * Create a bootable disk using the vscode configuration
     * @param cancellationToken Token to cancel the process
     */
    public createBootableADFDisk(cancellationToken?: CancellationToken): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const rootConf = workspace.getConfiguration('amiga-assembly', null);
            const conf: any = rootConf.get('adfgenerator');
            if (conf) {
                this.setToolsRootPath(conf.ADFToolsParentDir);
                let filename = conf.outputADFFile;
                let rootSourceDir = "";
                if (conf.sourceRootDir) {
                    rootSourceDir = conf.sourceRootDir;
                } else {
                    // retrieve VLINK conf
                    const confVLINK: any = rootConf.get('vlink');
                    if (confVLINK && confVLINK.exefilename) {
                        rootSourceDir = path.parse(confVLINK.exefilename).dir;
                    } else {
                        reject(new Error("Configuration of the ADF file generator not set"));
                    }
                }
                let includes = conf.includes;
                let excludes = conf.excludes;
                let adfCreateOptions = conf.adfCreateOptions;
                let bootBlockSourceFileName;
                if (conf.bootBlockSourceFile) {
                    bootBlockSourceFileName = conf.bootBlockSourceFile;
                }
                await this.createBootableADFDiskFromDir(filename, rootSourceDir, includes, excludes, adfCreateOptions, bootBlockSourceFileName, cancellationToken).then(() => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject(new Error("Configuration of the ADF file generator not set"));
            }
        });

    }

    /**
     * Create a bootable disk from path
     * @param filename Filename of the new adf disk file
     * @param rootSourceDir Directory root to copy in the created disk
     * @param includes Expression for the files to include
     * @param excludes Expression for the files to exclude
     * @param adfCreateOptions Option for the create command
     * @param bootBlockSourceFilename Filename of the boot block, if none the default boot block will be installed
     * @param cancellationToken Token to cancel the process
     */
    public createBootableADFDiskFromDir(filename: string, rootSourceDir: string, includes: string, excludes: string, adfCreateOptions: Array<string>, bootBlockSourceFilename?: string, cancellationToken?: CancellationToken): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                let bootBlockFilename;
                if (bootBlockSourceFilename) {
                    // Build the source file
                    // TODO: call the build command
                }
                // Create a disk
                await this.createADFDisk(filename, adfCreateOptions, cancellationToken).catch((err) => {
                    return reject(err);
                });
                // Install the disk
                await this.installADFDisk(filename, bootBlockFilename, cancellationToken).catch((err) => {
                    return reject(err);
                });
                let files = new Array<string>();
                let newRootSourceDir = rootSourceDir;
                try {
                    let stat = fs.lstatSync(newRootSourceDir);
                    if (stat.isDirectory()) {
                        // List the source dir
                        files = glob.sync(includes, {
                            cwd: newRootSourceDir,
                            ignore: excludes
                        });
                    }
                } catch (e) {
                    // Do nothing .. file not found
                }
                if (files.length <= 0) {
                    try {
                        // try to add the workspace dir
                        const workspaceRootDir = this.getWorkspaceRootDir();
                        if (workspaceRootDir) {
                            newRootSourceDir = path.join(workspaceRootDir.fsPath, newRootSourceDir);
                            let stat = fs.lstatSync(newRootSourceDir);
                            if (stat.isDirectory()) {
                                files = glob.sync(includes, {
                                    cwd: newRootSourceDir,
                                    ignore: excludes
                                });
                            }
                        }
                    } catch (e) {
                        return reject(new Error("Sources for ADFDisk dir not found in '" + rootSourceDir + "' and '" + newRootSourceDir + "'"));
                    }
                }
                if (files.length <= 0) {
                    return reject(new Error("No sources files found for ADFDisk in '" + rootSourceDir + "' and '" + newRootSourceDir + "'"));
                } else {
                    let createdDirs = new Array<string>();
                    createdDirs.push("/");
                    for (let file of files) {
                        let fullPath = path.join(newRootSourceDir, file);
                        try {
                            let stat = fs.lstatSync(fullPath);
                            if (stat.isDirectory()) {
                                // For each file copy to disk
                                await this.mkdirs(filename, file, createdDirs, cancellationToken).catch((err) => {
                                    return reject(err);
                                });
                            } else {
                                // For each file copy to disk
                                let fileParentDir = path.parse(file).dir;
                                if (fileParentDir === "") {
                                    fileParentDir = "/";
                                } else {
                                    await this.mkdirs(filename, fileParentDir, createdDirs, cancellationToken).catch((err) => {
                                        return reject(err);
                                    });
                                }
                                await this.copyToADFDisk(filename, fullPath, fileParentDir, cancellationToken).catch((err) => {
                                    return reject(err);
                                });
                            }
                        } catch (e) {
                            // Do nothing .. file not found - a bit weird..
                        }
                    }
                    resolve();
                }
            } catch (e) {
                reject(new Error(e));
            }
        });
    }

    /**
     * Create a new disk
     * @param filename Filename of the new adf disk file
     * @param dirPath Path of the directory to create
     * @param createdDirs already created dirs 
     * @param cancellationToken Token to cancel the process
     */
    public mkdirs(filename: string, dirPath: string, createdDirs: Array<string>, cancellationToken?: CancellationToken): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!(createdDirs.includes(dirPath))) {
                // split the path
                let normPath = dirPath.replace('\\', '/');
                let concatPath = "";
                for (let pathElement of normPath.split('/')) {
                    concatPath += pathElement;
                    if (!(createdDirs.includes(concatPath))) {
                        await this.mkdir(filename, concatPath, cancellationToken).catch((err) => {
                            return reject(err);
                        });
                        createdDirs.push(concatPath);
                    }
                }
            }
            resolve();
        });
    }

    /**
     * Create a new disk
     * @param filename Filename of the new adf disk file
     * @param dirPath Path of the directory to create
     * @param cancellationToken Token to cancel the process
     */
    public mkdir(filename: string, dirPath: string, cancellationToken?: CancellationToken): Promise<void> {
        return this.executeADFCommand(this.adfMkDirFilePath, [filename, dirPath], cancellationToken);
    }

    /**
     * Create a new disk
     * @param filename Filename of the new adf disk file
     * @param adfCreateOptions Option for the create command
     * @param cancellationToken Token to cancel the process
     */
    public createADFDisk(filename: string, adfCreateOptions: Array<string>, cancellationToken?: CancellationToken): Promise<void> {
        let args = new Array<string>();
        args = args.concat(adfCreateOptions);
        args.push(filename);
        return this.executeADFCommand(this.adfCreateFilePath, args, cancellationToken);
    }

    /**
     * Install a bootblock to the disk
     * @param filename Filename of the new adf disk file
     * @param bootBlockFilename Filename of the boot block, if none the default boot block will be installed
     * @param cancellationToken Token to cancel the process
     */
    public installADFDisk(filename: string, bootBlockFilename?: string, cancellationToken?: CancellationToken): Promise<void> {
        if (bootBlockFilename) {
            return this.executeADFCommand(this.adfInstallFilePath, [`--install=${cancellationToken}`, filename], cancellationToken);
        } else {
            return this.executeADFCommand(this.adfInstallFilePath, ["-i", filename], cancellationToken);
        }
    }

    /**
     * Copy a file or a directory to the ADF disk
     * @param filename Filename of the new adf disk file
     * @param sourceFilename Filename of the new adf disk file
     * @param destinationDir Destination directory in the Adf disk
     * @param cancellationToken Token to cancel the process
     */
    public copyToADFDisk(filename: string, sourceFilename: string, destinationDir: string, cancellationToken?: CancellationToken): Promise<void> {
        return this.executeADFCommand(this.adfCopyFilePath, [filename, sourceFilename, destinationDir], cancellationToken);
    }

    /**
     * Create a new disk
     * @param commandFilename Filename of the command to execute
     * @param args Arguments for the command
     * @param cancellationToken Token to cancel the process
     */
    private executeADFCommand(commandFilename: string, args: Array<string>, cancellationToken?: CancellationToken): Promise<void> {
        const workspaceRootDir = this.getWorkspaceRootDir();
        let rootPath: string | null = null;
        if (workspaceRootDir) {
            rootPath = workspaceRootDir.fsPath;
        }
        return new Promise((resolve, reject) => {
            this.executor.runToolRetrieveStdout(args, rootPath, commandFilename, null, cancellationToken).then((stdout) => {
                if (stdout.indexOf("Done.") < 0) {
                    reject(new Error(stdout));
                } else {
                    resolve();
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Setting the context to run the tests.
     * @param executor mocked executor
     */
    public setTestContext(executor: ExecutorHelper) {
        this.executor = executor;
    }

    /**
     * Reads the workspace folder dir
     */
    private getWorkspaceRootDir(): Uri | null {
        if (workspace.workspaceFolders && (workspace.workspaceFolders.length > 0)) {
            return workspace.workspaceFolders[0].uri;
        }
        return null;
    }

    /**
     * Create a new ADFTools class with vscode configuration
     */
    public static create(): ADFTools {
        const rootConf = workspace.getConfiguration('amiga-assembly', null);
        const conf: any = rootConf.get('adfgenerator');
        let rootToolsDir = "";
        if (conf && conf.ADFToolsParentDir) {
            rootToolsDir = conf.ADFToolsParentDir;
        }
        return new ADFTools(rootToolsDir);
    }

    /**
     * Compute checksum of a bootblock
     * @param bootblock Complete bootblock
     */
    public calculateChecksum(bootblock: Buffer): number {
        let newSum: number = 0;
        newSum = 0;
        for (let i = 0; i < 256; i++) { // The boot block must be 1024
            if (i != 1) { // skip the checksum value ni the bootblock
                newSum += bootblock.readUInt32BE(i * 4); // Read unsigned int 32b in Big Endian
                if (newSum > 0xffffffff) { // Int32 overflow
                    newSum -= 0x100000000; // Simulating overflow
                    newSum++; // part of the checksum calculation
                }
            }
        }
        return ~newSum >>> 0;	/* not unsigned */
    }

    /**
     * Create a bootblock buffer from a boot block binary buffer
     * @param bootblockData Boot block binary data
     */
    public createBootBlock(bootblockData: Buffer): Buffer {
        let bootblock = Buffer.alloc(1024);
        bootblockData.copy(bootblock);
        let checksum = this.calculateChecksum(bootblock);
        bootblock.writeUInt32BE(checksum, 4);
        return bootblock;
    }

    /**
     * Write a bootblock file to integrate in adfinstall from a binary boot block buffer
     * @param bootblockData Boot block binary data
     */
    public writeBootBlockFile(bootblockData: Buffer, filename: string) {
        let bootblock = this.createBootBlock(bootblockData);
        let fd = fs.openSync(filename, 'w');
        fs.writeSync(fd, bootblock);
    }

}