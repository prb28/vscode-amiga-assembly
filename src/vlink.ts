import { Uri, EventEmitter } from "vscode";
import { ExecutorParser, ICheckResult, ExecutorHelper } from "./execHelper";
import * as path from "path";
import { substituteVariables } from "./configVariables";
import { ExtensionState } from "./extension";

/**
 * Definition of the vlink properties
 */
export interface VlinkBuildProperties {
    enabled: boolean;
    command: string;
    includes: string;
    excludes: string;
    exefilename: string;
    args: Array<string>;
    createStartupSequence: boolean;
    createExeFileParentDir: boolean;
    entrypoint: string;
}

/**
 * Class to manage the VLINK linker
 */
export class VLINKLinker {
    static readonly DEFAULT_BUILD_CURRENT_FILE_CONFIGURATION = <VlinkBuildProperties>{
        enabled: true,
        command: "${config:amiga-assembly.binDir}/vlink",
        createStartupSequence: true,
        createExeFileParentDir: true,
        exefilename: "../uae/dh0/myprogram",
        args: [
            "-bamigahunk",
            "-Bstatic"
        ]
    };
    static readonly DEFAULT_BUILD_CONFIGURATION = <VlinkBuildProperties>{
        enabled: true,
        command: "${config:amiga-assembly.binDir}/vlink",
        includes: "*.{s,S,asm,ASM}",
        excludes: "",
        createStartupSequence: true,
        createExeFileParentDir: true,
        exefilename: "../uae/dh0/myprogram",
        args: [
            "-bamigahunk",
            "-Bstatic"
        ]
    };

    executor: ExecutorHelper;
    parser: VLINKParser;

    constructor() {
        this.executor = new ExecutorHelper();
        this.parser = new VLINKParser();
    }

    /**
     * Get the name of the file without the extension
     * @param file Path of the file to be built
     * @returns The name of the executable file
     */
    private static getBaseFileNameNoExt(file: string): string {
        const filename = path.basename(file);
        const extSep = filename.indexOf(".");
        let filenameNoExt = filename;
        if (extSep > 0) {
            filenameNoExt = filename.substring(0, extSep);
        }
        return filenameNoExt;
    }

    /**
     * Build the selected file
     * @param conf Vlink configuration
     * @param filepathname Path of the file to build
     * @param exeFilepathname Name of the executable generated
     * @param entrypoint Optional name of the object file containing the entrypoint
     * @param workspaceRootDir Path to the root of the workspace
     * @param buildDir Build directory
     * @param logEmitter Log emitter
     */
    public async linkFiles(conf: VlinkBuildProperties, filesURI: Uri[], exeFilepathname: string, entrypoint: string | undefined, workspaceRootDir: Uri, buildDir: Uri, logEmitter?: EventEmitter<string>): Promise<ICheckResult[]> {
        exeFilepathname = substituteVariables(exeFilepathname, true);
        if (entrypoint) {
            entrypoint = substituteVariables(entrypoint, true);
        }
        const vlinkExecutableName: string = substituteVariables(conf.command, true, { extensionState: ExtensionState.getCurrent() });
        const confArgs = conf.args.map(a => substituteVariables(a, true));
        const objectPathNames: string[] = [];
        let entrypointNoExt: string | undefined = "empty";
        let entrypointFound = true;
        if (entrypoint !== undefined) {
            entrypointNoExt = VLINKLinker.getBaseFileNameNoExt(entrypoint);
            entrypointFound = false;
        }
        for (const fURI of filesURI) {
            const filenameNoExt = VLINKLinker.getBaseFileNameNoExt(fURI.fsPath);
            const objFilename = path.join(buildDir.fsPath, filenameNoExt + ".o");
            if (filenameNoExt === entrypointNoExt) {
                objectPathNames.unshift(objFilename);
                entrypointFound = true;
            } else {
                objectPathNames.push(objFilename);
            }
        }
        if (!entrypointFound) {
            throw new Error(`Entry point ${entrypoint} not found in the provided files`);
        }
        const args: Array<string> = confArgs.concat(['-o', path.join(buildDir.fsPath, exeFilepathname)]).concat(objectPathNames);
        return this.executor.runTool(args, workspaceRootDir.fsPath, "warning", true, vlinkExecutableName, undefined, true, this.parser, undefined, logEmitter);
    }

    /**
     * Function to check if it is possible to link
     * @param conf Configuration
     */
    mayLink(conf: VlinkBuildProperties): boolean {
        return (conf?.enabled);
    }

}

/**
 * Class dedicated to parse the output of the linker
 */
export class VLINKParser implements ExecutorParser {
    parse(text: string): ICheckResult[] {
        const errors: ICheckResult[] = [];
        const lines = text.split(/\r\n|\r|\n/g);
        for (const element of lines) {
            const line = element;
            if ((line.length > 1) && !line.startsWith('>')) {
                let match = /(error|warning|message)\s([\d]+)\sin\sline\s([\d]+)\sof\s["](.+)["]:\s*(.*)/i.exec(line);
                if (match) {
                    const error: ICheckResult = new ICheckResult();
                    error.file = match[4];
                    error.line = parseInt(match[3]);
                    error.msg = match[1] + " " + match[2] + ": " + match[5];
                    error.severity = match[1];
                    errors.push(error);
                } else {
                    match = /(error|warning|message)\s([\d]+):\s([a-z.]+)\s*\(([a-z+0-9]+)\)\s*:\s*(.*)/i.exec(line);
                    if (match) {
                        const error: ICheckResult = new ICheckResult();
                        let f = match[3];
                        if (f.endsWith(".o")) {
                            f = f.replace(".o", ".s");
                        }
                        error.file = f;
                        error.line = 1;
                        error.msg = "Link " + match[1] + " " + match[2] + "(" + match[4] + ")" + ": " + match[5];
                        error.severity = match[1].toLowerCase();
                        errors.push(error);
                    } else {
                        match = /.*error\s([\d]+)\s*:\s*(.*)/i.exec(line);
                        if (match) {
                            const error: ICheckResult = new ICheckResult();
                            error.severity = 'error';
                            error.msg = line;
                            errors.push(error);
                        }
                    }
                }
            }
        }
        return errors;
    }
}
