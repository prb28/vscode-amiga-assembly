import { window, OpenDialogOptions, Uri, workspace, Position } from 'vscode';
import { Capstone } from './capstone';
import * as path from 'path';

export class Disassembler {
    public getCapstone(): (Capstone | null) {
        let configuration = workspace.getConfiguration('amiga-assembly');
        let conf: any = configuration.get('cstool');
        if (conf && (conf.length > 5)) {
            return new Capstone(conf);
        }
        return null;
    }

    /**
     * Shows an input panel to calculate
     */
    public showInputPanel(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const capstone = this.getCapstone();
            if (capstone) {
                let selectedFiles = await window.showOpenDialog(<OpenDialogOptions>{
                    prompt: "Select a file to disassemble",
                    canSelectMany: false,
                    canSelectFiles: true,
                    canSelectFolders: false,
                });
                if (selectedFiles && (selectedFiles.length > 0)) {
                    const selectedFile = selectedFiles[0];
                    const filePath = selectedFile.fsPath;
                    // Disassembles the file
                    await capstone.disassembleFile(filePath).then(async data => {
                        // opens a new editor document
                        let folder = ".";
                        let folders = workspace.workspaceFolders;
                        if (folders && folders.length) {
                            folder = folders[0].uri.fsPath;
                        }
                        let filename = path.basename(filePath) + "_" + Date.now() + "_dis.s";
                        const newFile = Uri.parse("untitled:" + folder + "/" + filename);
                        await window.showTextDocument(newFile).then((textEditor) => {
                            textEditor.edit(edit => {
                                let text = "";
                                let lines = data.split(/\r\n|\r|\n/g);
                                for (let l of lines) {
                                    let elms = l.split("  ");
                                    if (elms.length > 2) {
                                        text += " " + elms[2].replace(", ", ",") + ";" + l + '\n';
                                    } else {
                                        text += l.replace(", ", ",") + ";" + l + '\n';
                                    }
                                }
                                edit.insert(new Position(0, 0), text);
                                resolve();
                            });
                        });
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    reject(new Error("No selected File to disassemble"));
                }
            } else {
                reject(new Error("To use this command: configure the capstone path in the settings"));
            }
        });
    }

}
