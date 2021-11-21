import { window, OpenDialogOptions, InputBoxOptions, Uri, workspace, Position, TextDocumentShowOptions } from 'vscode';
import { Capstone } from './capstone';
import { DebugDisassembledFile } from './debugDisassembled';
import { ConfigurationHelper } from './configurationHelper';

export enum DisassembleRequestType {
    MEMORY,
    FILE,
    COPPER
}
export class Disassembler {
    public getCapstone(): (Capstone | null) {
        const conf = ConfigurationHelper.retrieveStringPropertyInDefaultConf('cstool');
        if (conf && (conf.length > 5)) {
            return new Capstone(conf);
        }
        return null;
    }

    /**
     * Shows an input panel to calculate
     */
    public async showInputPanel(disassembleRequestType: DisassembleRequestType): Promise<void> {
        if (disassembleRequestType === DisassembleRequestType.COPPER) {
            let address = await window.showInputBox(<InputBoxOptions>{
                //value: "${COP1LC}",
                prompt: "Copper address: 1 or 2 or $xxxxxxxx or #{symbol} or ${symbol} "
            });
            if (address !== undefined) {
                // Code to replace #, it is not done by the Uri.parse
                address = address.replace('#', '%23');
                const filename = `${DebugDisassembledFile.DGBFILE_COPPER_SEPARATOR}${address}__3000.${DebugDisassembledFile.DGBFILE_EXTENSION}`;
                const newFile = Uri.parse(`disassembly:${filename}`);
                try {
                    await window.showTextDocument(newFile);
                } catch (err) {
                    window.showErrorMessage(err.message);
                }
            } else {
                throw new Error("No input address expression");
            }
        } else if (disassembleRequestType === DisassembleRequestType.FILE) {
            const capstone = this.getCapstone();
            if (capstone) {
                const selectedFiles = await window.showOpenDialog(<OpenDialogOptions>{
                    prompt: "Select a file to disassemble",
                    canSelectMany: false,
                    canSelectFiles: true,
                    canSelectFolders: false,
                });
                if (selectedFiles && (selectedFiles.length > 0)) {
                    const selectedFile = selectedFiles[0];
                    // Disassembles the file
                    try {
                        const data = await capstone.disassembleFile(selectedFile);
                        let text = "";
                        const lines = data.split(/\r\n|\r|\n/g);
                        for (const l of lines) {
                            const elms = l.split("  ");
                            if (elms.length > 2) {
                                text += " " + elms[2].replace(", ", ",") + ";" + l + '\n';
                            } else {
                                text += l.replace(", ", ",") + ";" + l + '\n';
                            }
                        }
                        const document = await workspace.openTextDocument({ language: "m68k", content: text });
                        await window.showTextDocument(document);
                    } catch (err) {
                        window.showErrorMessage(err.message);
                        throw new Error(err.message);
                    }
                } else {
                    const message = "No selected File to disassemble";
                    window.showErrorMessage(message);
                    throw new Error(message);
                }
            } else {
                const message = "To use this command: configure the capstone path in the settings";
                window.showErrorMessage(message);
                throw new Error(message);
            }
        } else {
            // Memory disassemble
            const address = await window.showInputBox(<InputBoxOptions>{
                prompt: "Memory address: $xxxxxxxx or #{symbol} or ${symbol} "
            });
            if (address !== undefined) {
                const dFile = new DebugDisassembledFile();
                dFile.setStackFrameIndex(0);
                dFile.setAddressExpression(address);
                dFile.setLength(1000);
                try {
                    await window.showTextDocument(dFile.toURI());
                } catch (err) {
                    window.showErrorMessage(err.message);
                    throw err;
                }
            } else {
                throw new Error("No input address expression");
            }
        }
    }
}
