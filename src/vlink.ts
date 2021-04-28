import { Uri, EventEmitter } from "vscode";
import { ExecutorParser, ICheckResult, ExecutorHelper } from "./execHelper";
import * as path from "path";
import { ConfigurationHelper } from "./configurationHelper";

/**
 * Class to manage the VLINK linker
 */
export class VLINKLinker {
    executor: ExecutorHelper;
    parser: VLINKParser;

    constructor() {
        this.executor = new ExecutorHelper();
        this.parser = new VLINKParser();
    }

    /**
     * Build the selected file
     * @param filepathname Path of the file to build
     * @param exeFilepathname Name of the executable generated
     * @param entrypoint Optional name of the object file containing the entrypoint
     * @param workspaceRootDir Path to the root of the workspace
     * @param buildDir Build directory
     * @param logEmitter Log emitter
     */
    public async linkFiles(filesURI: Uri[], exeFilepathname: string, entrypoint: string | undefined, workspaceRootDir: Uri, buildDir: Uri, logEmitter?: EventEmitter<string>): Promise<ICheckResult[]> {
        let conf: any = ConfigurationHelper.retrieveObjectPropertyInDefaultConf('vlink');
        if (this.mayLink(conf)) {
            let vlinkExecutableName: string = conf.file;
            let confArgs = conf.options;
            let objectPathNames: string[] = [];
            for (let i = 0; i < filesURI.length; i += 1) {
                let filename = path.basename(filesURI[i].fsPath);
                let objFilename;
                let extSep = filename.indexOf(".");
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
                let entrypointNoExt = entrypoint.replace(/\.[^/.]+$/, "");
                objectPathNames.sort(function (a, b) {
                    if (a === b) {
                        return 0;
                    }
                    let filename_a = path.basename(a).replace(/\.[^/.]+$/, "");
                    let filename_b = path.basename(b).replace(/\.[^/.]+$/, "");
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
            let args: Array<string> = confArgs.concat(['-o', path.join(buildDir.fsPath, exeFilepathname)]).concat(objectPathNames);
            return await this.executor.runTool(args, workspaceRootDir.fsPath, "warning", true, vlinkExecutableName, null, true, this.parser, undefined, logEmitter);
        } else {
            let message = "Please configure VLINK linker";
            throw new Error(message);
        }
    }

    /**
     * Function to check if it is possible to link
     * @param conf Configuration
     */
    mayLink(conf: any) {
        return (conf && conf.enabled);
    }

}

/**
 * Class dedicated to parse the output of the linker
 */
export class VLINKParser implements ExecutorParser {
    parse(text: string): ICheckResult[] {
        let errors: ICheckResult[] = [];
        let lines = text.split(/\r\n|\r|\n/g);
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
            let line = lines[lineIndex];
            if ((line.length > 1) && !line.startsWith('>')) {
                let match = /(error|warning|message)\s([\d]+)\sin\sline\s([\d]+)\sof\s[\"](.+)[\"]:\s*(.*)/i.exec(line);
                if (match) {
                    let error: ICheckResult = new ICheckResult();
                    error.file = match[4];
                    error.line = parseInt(match[3]);
                    error.msg = match[1] + " " + match[2] + ": " + match[5];
                    error.severity = match[1];
                    errors.push(error);
                } else {
                    match = /.*error\s([\d]+)\s*:\s*(.*)/i.exec(line);
                    if (match) {
                        let error: ICheckResult = new ICheckResult();
                        error.severity = 'error';
                        error.msg = line;
                        errors.push(error);
                    }
                }
            }
        }
        return errors;
    }
}