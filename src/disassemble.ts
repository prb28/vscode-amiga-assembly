import { window, OpenDialogOptions, InputBoxOptions, Uri, workspace, Position } from 'vscode';
import { Capstone } from './capstone';
import * as path from 'path';
import { DebugDisassembledFile } from './debugDisassembled';

export enum DisassembleRequestType {
    MEMORY,
    FILE,
    COPPER
}
export class Disassembler {
    public getCapstone(): (Capstone | null) {
        let conf: any = workspace.getConfiguration('amiga-assembly', null).get('cstool');
        if (conf && (conf.length > 5)) {
            return new Capstone(conf);
        }
        return null;
    }

    /**
     * Shows an input panel to calculate
     */
    public showInputPanel(disassembleRequestType: DisassembleRequestType): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (disassembleRequestType === DisassembleRequestType.COPPER) {
                let address = await window.showInputBox(<InputBoxOptions>{
                    //value: "${COP1LC}",
                    prompt: "Copper address: 1 or 2 or $xxxxxxxx or #{symbol} or ${symbol} "
                });
                if (address !== undefined) {
                    // Code to replace #, it is not done by the Uri.parse
                    address = address.replace('#', '%23');
                    let filename = `${DebugDisassembledFile.DGBFILE_COPPER_SEPARATOR}${address}__3000.${DebugDisassembledFile.DGBFILE_EXTENSION}`;
                    const newFile = Uri.parse(`disassembly:${filename}`);
                    await window.showTextDocument(newFile).then((_) => {
                        resolve();
                    }, err => {
                        window.showErrorMessage(err.message);
                        reject(err);
                    });
                } else {
                    reject(new Error("No input address expression"));
                }
            } else if (disassembleRequestType === DisassembleRequestType.FILE) {
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
                        // Disassembles the file
                        await capstone.disassembleFile(selectedFile).then(async data => {
                            // opens a new editor document
                            let folder = ".";
                            let folders = workspace.workspaceFolders;
                            if (folders && folders.length) {
                                folder = folders[0].uri.fsPath;
                            }
                            let filename = path.basename(selectedFile.fsPath) + "_" + Date.now() + "_dis.s";
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
                            window.showErrorMessage(err.message);
                            reject(err);
                        });
                    } else {
                        let message = "No selected File to disassemble";
                        window.showErrorMessage(message);
                        reject(new Error(message));
                    }
                } else {
                    let message = "To use this command: configure the capstone path in the settings";
                    window.showErrorMessage(message);
                    reject(new Error(message));
                }
            } else {
                // Memory disassemble
                let address = await window.showInputBox(<InputBoxOptions>{
                    prompt: "Memory address: $xxxxxxxx or #{symbol} or ${symbol} "
                });
                if (address !== undefined) {
                    let dFile = new DebugDisassembledFile();
                    dFile.setStackFrameIndex(0);
                    dFile.setAddressExpression(address);
                    dFile.setLength(1000);
                    await window.showTextDocument(dFile.toURI()).then((_) => {
                        resolve();
                    }, err => {
                        window.showErrorMessage(err.message);
                        reject(err);
                    });
                } else {
                    reject(new Error("No input address expression"));
                }
            }
        });
    }

}
