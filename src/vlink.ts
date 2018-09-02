import { workspace, Uri } from "vscode";
import { ExecutorParser, ICheckResult, Executor } from "./executor";
import * as path from "path";

/**
 * Class to manage the VLINK linker
 */
export class VLINKLinker {
    executor: Executor;
    parser: VLINKParser;

    constructor() {
        this.executor = new Executor();
        this.parser = new VLINKParser();
    }

    /**
     * Build the selected file
     * @param filepathname Path of the file to build
     * @param exeFilepathname Name of the executabl generated
     * @param workspaceRootDir Path to the root of the workspace
     * @param buildDir Build directory
     */
    public linkFiles(filesURI: Uri[], exeFilepathname: string, workspaceRootDir: Uri, buildDir: Uri): Promise<ICheckResult[]> {
        let configuration = workspace.getConfiguration('amiga-assembly');
        let conf: any = configuration.get('vlink');
        if (this.mayLink(conf)) {
            let vlinkExecutableName: string = conf.file;
            let confArgs = conf.options;
            let objectPathnames: string[] = [];
            for (let i = 0; i < filesURI.length; i += 1) {
                let filename = path.basename(filesURI[i].fsPath);
                let objFilename;
                let extSep = filename.indexOf(".");
                if (extSep > 0) {
                    objFilename = path.join(buildDir.fsPath, filename.substr(0, filename.lastIndexOf(".")) + ".o");
                } else {
                    objFilename = path.join(buildDir.fsPath, filename + ".o");
                }
                objectPathnames.push(objFilename);
            }
            let args: Array<string> = confArgs.concat(['-o', path.join(buildDir.fsPath, exeFilepathname)]).concat(objectPathnames);
            return this.executor.runTool(args, workspaceRootDir.fsPath, "warning", true, vlinkExecutableName, null, true, this.parser);
        } else {
            return Promise.reject("Please configure VLINK linker");
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
                let match = /(error|warning|message)\s([\d]+)\sin\sline\s([\d]+)\sof\s[\"](.+)[\"]:\s*(.*)/.exec(line);
                if (match) {
                    let error: ICheckResult = new ICheckResult();
                    error.file = match[4];
                    error.line = parseInt(match[3]);
                    error.msg = match[1] + " " + match[2] + ": " + match[5];
                    error.severity = match[1];
                    errors.push(error);
                } else {
                    match = /.*error\s([\d]+)\s*:\s*(.*)/.exec(line);
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