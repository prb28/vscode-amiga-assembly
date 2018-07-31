import { window, OpenDialogOptions, Uri, workspace, Position } from 'vscode';
import { Capstone } from './capstone';
import * as path from 'path';

export class Disassembler {
    private getCapstone(): (Capstone | null) {
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
    public showInputPanel() {
        const capstone = this.getCapstone();
        if (capstone) {
            return window.showOpenDialog(<OpenDialogOptions>{
                prompt: "Select a file to disassemble",
                canSelectMany: false,
                canSelectFiles: true,
                canSelectFolders: false,
            }).then((selectedFiles) => {
                if (selectedFiles && (selectedFiles.length > 0)) {
                    const selectedFile = selectedFiles[0];
                    const filePath = selectedFile.fsPath;
                    // Disassembles the file
                    return capstone.disassembleFile(filePath).then((data) => {
                        // opens a new editor document
                        let folder = ".";
                        let folders = workspace.workspaceFolders;
                        if (folders && folders.length) {
                            folder = folders[0].uri.fsPath;
                        }
                        let filename = path.basename(filePath) + "_" + Date.now() + "_dis.s";
                        const newFile = Uri.parse("untitled:" + folder + "/" + filename);
                        return window.showTextDocument(newFile).then((textEditor) => {
                            textEditor.edit(edit => {
                                let text = "";
                                let lines = data.split('\n');
                                for (let l of lines) {
                                    let elms = l.split("  ");
                                    if (elms.length > 2) {
                                        text += " " + elms[2].replace(", ", ",") + ";" + l + '\n';
                                    } else {
                                        text += l.replace(", ", ",") + ";" + l + '\n';
                                    }
                                }
                                edit.insert(new Position(0, 0), text);
                            });
                        });
                    });
                }
            });
        } else {
            window.showErrorMessage("To use this command: configure the capstone path in the settings");
        }
    }

}
