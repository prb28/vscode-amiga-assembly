import { Uri, EventEmitter } from "vscode";
import { ExecutorParser, ICheckResult, ExecutorHelper } from "./execHelper";
import * as path from "path";
import { ConfigurationHelper } from "./configurationHelper";

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
        const vlinkExecutableName: string = ConfigurationHelper.replaceBinDirVariable(conf.command);
        const confArgs = conf.args;
        const objectPathNames: string[] = [];
        for (let i = 0; i < filesURI.length; i += 1) {
            const filename = path.basename(filesURI[i].fsPath);
            let objFilename;
            const extSep = filename.indexOf(".");
            if (extSep > 0) {
                objFilename = path.join(buildDir.fsPath, filename.substr(0, filename.lastIndexOf(".")) + ".o");
            } else {
                objFilename = path.join(buildDir.fsPath, filename + ".o");
            }
            objectPathNames.push(objFilename);
        }
        if (entrypoint !== undefined) {
            // Vlink is unable to set an entrypoint for Amiga hunk files.
            // The resulting executable will always start execution at the first
            // byte of the first section. So, in order to "set" the entrypoint, we
            // put the object containing the code to be executed first at the
            // beginning of the objects list.
            const entrypointNoExt = entrypoint.replace(/\.[^/.]+$/, "");
            objectPathNames.sort(function (a, b) {
                if (a === b) {
                    return 0;
                }
                const filename_a = path.basename(a).replace(/\.[^/.]+$/, "");
                const filename_b = path.basename(b).replace(/\.[^/.]+$/, "");
                if (filename_a === entrypointNoExt) {
                    return -1;
                }
                if (filename_b === entrypointNoExt) {
                    return 1;
                }
                if (a < b) {
                    return -1;
                }
                return 1;
            });
        }
        const args: Array<string> = confArgs.concat(['-o', path.join(buildDir.fsPath, exeFilepathname)]).concat(objectPathNames);
        return this.executor.runTool(args, workspaceRootDir.fsPath, "warning", true, vlinkExecutableName, null, true, this.parser, undefined, logEmitter);
    }

    /**
     * Function to check if it is possible to link
     * @param conf Configuration
     */
    mayLink(conf: any): boolean {
        return (conf && conf.enabled);
    }

}

/**
 * Class dedicated to parse the output of the linker
 */
export class VLINKParser implements ExecutorParser {
    parse(text: string): ICheckResult[] {
        const errors: ICheckResult[] = [];
        const lines = text.split(/\r\n|\r|\n/g);
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
            const line = lines[lineIndex];
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