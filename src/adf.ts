import { CancellationToken, Uri, workspace, FileType } from "vscode";
import { ExecutorHelper } from "./execHelper";
import * as path from 'path';
import { VASMCompiler } from "./vasm";
import { FileProxy } from "./fsProxy";
import { ExtensionState } from "./extension";

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
    public async createBootableADFDisk(compiler?: VASMCompiler, cancellationToken?: CancellationToken): Promise<void> {
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
                    throw new Error("Configuration of the ADF file generator not set");
                }
            }
            let includes = conf.includes;
            let excludes = conf.excludes;
            let adfCreateOptions = conf.adfCreateOptions;
            let bootBlockSourceFileName;
            if (conf.bootBlockSourceFile) {
                bootBlockSourceFileName = conf.bootBlockSourceFile;
            }
            await this.createBootableADFDiskFromDir(filename, rootSourceDir, includes, excludes, adfCreateOptions, bootBlockSourceFileName, compiler, cancellationToken);
        } else {
            throw new Error("Configuration of the ADF file generator not set");
        }
    }

    /**
     * Create a bootable disk from path
     * @param filename Filename of the new adf disk file
     * @param rootSourceDir Directory root to copy in the created disk
     * @param includes Expression for the files to include
     * @param excludes Expression for the files to exclude
     * @param adfCreateOptions Option for the create command
     * @param bootBlockSourceFilename Filename of the boot block, if none the default boot block will be installed
     * @param compiler Compiler to compile to boot block code
     * @param cancellationToken Token to cancel the process
     */
    public async createBootableADFDiskFromDir(filename: string, rootSourceDir: string, includes: string, excludes: string, adfCreateOptions: Array<string>, bootBlockSourceFilename?: string, compiler?: VASMCompiler, cancellationToken?: CancellationToken): Promise<void> {
        const workspaceRootDir = this.getWorkspaceRootDir();
        let bootBlockFilename: string | undefined = undefined;
        if (bootBlockSourceFilename && compiler) {
            // Build the source file
            // Find the source file in the workspace
            let sourceFullPath: Uri | null = null;
            let bUri = Uri.file(bootBlockSourceFilename);
            let pFile = new FileProxy(bUri);
            if (pFile.exists()) {
                sourceFullPath = bUri;
            } else {
                // file not exists
                if (workspaceRootDir) {
                    sourceFullPath = Uri.file(path.join(workspaceRootDir.fsPath, bootBlockSourceFilename));
                    pFile = new FileProxy(sourceFullPath);
                    if (!pFile.exists()) {
                        sourceFullPath = null;
                    }
                }
            }
            if (sourceFullPath) {
                // Call the build command
                let results = await compiler.buildFile(sourceFullPath, false, true, true);
                if (results && results[0]) {
                    let bootBlockDataFilename = results[0];
                    bootBlockFilename = bootBlockDataFilename.replace(".o", ".bb");
                    let bootBlockDataFilenameUri = Uri.file(bootBlockDataFilename);
                    let bootBlockFile = new FileProxy(bootBlockDataFilenameUri);
                    // create the bootblock
                    try {
                        let bootBlock = await bootBlockFile.readFile();
                        await this.writeBootBlockFile(Buffer.from(bootBlock), Uri.file(bootBlockFilename));
                    } catch (err) {
                        throw new Error(`Error writing boot block '${bootBlockSourceFilename}'`);
                    }
                }
            } else {
                throw new Error(`Boot source file '${bootBlockSourceFilename}' not found`);
            }
        }
        // Create a disk
        await this.createADFDisk(filename, adfCreateOptions, cancellationToken);
        // Install the disk
        await this.installADFDisk(filename, bootBlockFilename, cancellationToken);
        let files: Array<FileProxy>;
        if (rootSourceDir && rootSourceDir.length > 0) {
            let rootSourceDirUri: Uri;
            if (!path.isAbsolute(rootSourceDir) && workspace.workspaceFolders) {
                rootSourceDirUri = Uri.file(path.join(workspace.workspaceFolders[0].uri.fsPath, rootSourceDir));
            } else {
                if (workspace.workspaceFolders) {
                    let relativePath = path.relative(workspace.workspaceFolders[0].uri.fsPath, rootSourceDir);
                    rootSourceDirUri = Uri.file(path.join(workspace.workspaceFolders[0].uri.fsPath, relativePath));
                } else {
                    rootSourceDirUri = Uri.file(rootSourceDir);
                }
            }
            let sourceRootFileProxy = new FileProxy(rootSourceDirUri, true);
            files = await sourceRootFileProxy.findFiles(includes, excludes);
            if (files.length > 0) {
                let createdDirs = new Array<string>();
                createdDirs.push("/");
                for (let file of files) {
                    let relativePath = path.relative(rootSourceDirUri.fsPath, file.getUri().fsPath);
                    let stat = await file.stat();
                    if (stat.type & FileType.Directory) {
                        // For each file copy to disk
                        await this.mkdirs(filename, relativePath, createdDirs, cancellationToken);
                    } else {
                        // For each file copy to disk
                        let fileParentDir = path.parse(file.getUri().path).dir;
                        let parentRelativePath = path.relative(rootSourceDirUri.path, fileParentDir);
                        if (parentRelativePath === "") {
                            parentRelativePath = "/";
                        } else {
                            await this.mkdirs(filename, parentRelativePath, createdDirs, cancellationToken);
                        }
                        await this.copyToADFDisk(filename, file.getUri().fsPath, parentRelativePath, cancellationToken);
                    }
                }
            }
        }
    }

    /**
     * Create a new disk
     * @param filename Filename of the new adf disk file
     * @param dirPath Path of the directory to create
     * @param createdDirs already created dirs 
     * @param cancellationToken Token to cancel the process
     */
    public async mkdirs(filename: string, dirPath: string, createdDirs: Array<string>, cancellationToken?: CancellationToken): Promise<void> {
        if (!(createdDirs.includes(dirPath))) {
            // split the path
            let normPath = dirPath.replace(/\\/g, '/');
            let concatPath = "";
            for (let pathElement of normPath.split('/')) {
                concatPath += pathElement;
                if (!(createdDirs.includes(concatPath))) {
                    await this.mkdir(filename, concatPath, cancellationToken);
                    createdDirs.push(concatPath);
                }
            }
        }
    }

    /**
     * Create a new disk
     * @param filename Filename of the new adf disk file
     * @param dirPath Path of the directory to create
     * @param cancellationToken Token to cancel the process
     */
    public async mkdir(filename: string, dirPath: string, cancellationToken?: CancellationToken): Promise<void> {
        await this.executeADFCommand(this.adfMkDirFilePath, [filename, dirPath], cancellationToken);
    }

    /**
     * Create a new disk
     * @param filename Filename of the new adf disk file
     * @param adfCreateOptions Option for the create command
     * @param cancellationToken Token to cancel the process
     */
    public async createADFDisk(filename: string, adfCreateOptions: Array<string>, cancellationToken?: CancellationToken): Promise<void> {
        let args = new Array<string>();
        args = args.concat(adfCreateOptions);
        args.push(filename);
        await this.executeADFCommand(this.adfCreateFilePath, args, cancellationToken);
    }

    /**
     * Install a bootblock to the disk
     * @param filename Filename of the new adf disk file
     * @param bootBlockFilename Filename of the boot block, if none the default boot block will be installed
     * @param cancellationToken Token to cancel the process
     */
    public async installADFDisk(filename: string, bootBlockFilename?: string, cancellationToken?: CancellationToken): Promise<void> {
        if (bootBlockFilename) {
            await this.executeADFCommand(this.adfInstallFilePath, [`--install=${bootBlockFilename}`, filename], cancellationToken);
        } else {
            await this.executeADFCommand(this.adfInstallFilePath, ["-i", filename], cancellationToken);
        }
    }

    /**
     * Copy a file or a directory to the ADF disk
     * @param filename Filename of the new adf disk file
     * @param sourceFilename Filename of the new adf disk file
     * @param destinationDir Destination directory in the Adf disk
     * @param cancellationToken Token to cancel the process
     */
    public async copyToADFDisk(filename: string, sourceFilename: string, destinationDir: string, cancellationToken?: CancellationToken): Promise<void> {
        await this.executeADFCommand(this.adfCopyFilePath, [filename, sourceFilename, destinationDir], cancellationToken);
    }

    /**
     * Create a new disk
     * @param commandFilename Filename of the command to execute
     * @param args Arguments for the command
     * @param cancellationToken Token to cancel the process
     */
    private async executeADFCommand(commandFilename: string, args: Array<string>, cancellationToken?: CancellationToken): Promise<void> {
        const workspaceRootDir = this.getWorkspaceRootDir();
        let rootPath: string | null = null;
        if (workspaceRootDir) {
            rootPath = workspaceRootDir.fsPath;
        }
        let stdout = await this.executor.runToolRetrieveStdout(args, rootPath, commandFilename, null, cancellationToken);
        if (stdout.indexOf("Done.") < 0) {
            throw new Error(stdout);
        }
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
        return ExtensionState.getCurrent().getWorkspaceRootDir();
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
        let newSum = 0;
        for (let i = 0; i < 256; i++) { // The boot block must be 1024
            if (i !== 1) { // skip the checksum value ni the bootblock
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
    public async writeBootBlockFile(bootblockData: Buffer, filename: Uri): Promise<void> {
        let bootblock = this.createBootBlock(bootblockData);
        let fileProxy = new FileProxy(filename);
        await fileProxy.writeFile(bootblock);
    }

}