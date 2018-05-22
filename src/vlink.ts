import { workspace, Uri } from "vscode";
import { ExecutorParser, ICheckResult, Executor } from "./executor";
import * as fs from "fs";
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
     * @param debug If true debug symbols are added
     */
    public linkFiles(filesURI: Uri[], exeFilepathname: string): Promise<ICheckResult[]> {
        if (workspace.rootPath) {
            let configuration = workspace.getConfiguration('amiga-assembly');
            let conf: any = configuration.get('vlink');
            if (conf) {
                let buildDir = path.join(workspace.rootPath, "build");
                if (fs.existsSync(buildDir)) {
                    let vlinkExecutableName: string = conf.file;
                    let confArgs = conf.options;
                    let objectPathnames: string[] = [];
                    for (let i = 0; i < filesURI.length; i += 1) {
                        let filename = path.basename(filesURI[i].fsPath);
                        let objFilename;
                        let extSep = filename.indexOf(".");
                        if (extSep > 0) {
                            objFilename = path.join(buildDir, filename.substr(0, filename.lastIndexOf(".")) + ".o");
                        } else {
                            objFilename = path.join(buildDir, filename + ".o");
                        }
                        objectPathnames.push(objFilename);
                    }
                    let args: Array<string> = confArgs.concat(['-o', path.join(buildDir, exeFilepathname), objectPathnames]);
                    return this.executor.runTool(args, workspace.rootPath, "warning", true, vlinkExecutableName, null, true, this.parser);
                } else {
                    return new Promise((resolve, reject) => {
                        reject("Build dir does not exists");
                    });
                }
            } else {
                return new Promise((resolve, reject) => {
                    reject("Please configure VASM compiler");
                });
            }
        } else {
            return new Promise((resolve, reject) => {
                reject("Root workspace path not found");
            });
        }
    }
}

class VLINKParser implements ExecutorParser {
    parse(text: string): ICheckResult[] {
        console.log(text);
        let errors: ICheckResult[] = [];
        let lines = text.split('\n');
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
            let line = lines[lineIndex];
            if ((line.length > 1) && !line.startsWith('>')) {
                let match = /(error|warning|message)\s([\d]+)\sin\sline\s([\d]+)\sof\s[\"](.+)[\"]:\s*(.*)/.exec(line);
                if (match) {
                    let error: ICheckResult = new ICheckResult();
                    error.file = match[4];
                    error.line = parseInt(match[3]);
                    error.msg = match[1] + " " + match[2] + ": " + match[4];
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