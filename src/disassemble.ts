import { window, Uri, workspace } from 'vscode';
import { disassemble, disassembledFileToPath, HunkType } from 'uae-dap';
import { parseHunksFromFile } from 'uae-dap';

export enum DisassembleRequestType {
    MEMORY,
    FILE,
    COPPER,
}

export class Disassembler {
    /**
     * Display an input panel for the requested disassembly type
     */
    public async showInputPanel(type: DisassembleRequestType): Promise<void> {
        switch (type) {
            case DisassembleRequestType.COPPER:
                return this.copper();
            case DisassembleRequestType.FILE:
                return this.file();
            case DisassembleRequestType.MEMORY:
                return this.memory();
        }
    }

    private async copper() {
        const address = await window.showInputBox({
            prompt: 'Copper address: 1 or 2 or $xxxxxxxx or #{symbol} or ${symbol} ',
        });
        if (!address) {
            throw new Error('No input address expression');
        }
        const filename = `copper_${address}__3000.dbgasm`;
        const uri = this.createUri(filename);
        try {
            await window.showTextDocument(uri);
        } catch (err) {
            window.showErrorMessage(err.message);
        }
    }

    private async file() {
        const selectedFiles = await window.showOpenDialog({
            title: 'Select a file to disassemble',
            openLabel: 'Disassemble',
            canSelectMany: false,
            canSelectFiles: true,
            canSelectFolders: false,
        });
        if (!selectedFiles || selectedFiles.length < 1) {
            const message = 'No selected File to disassemble';
            window.showErrorMessage(message);
            throw new Error(message);
        }
        const selectedFile = selectedFiles[0];
        try {
            const code = await this.disassembleFile(selectedFile.fsPath);
            const content = code
                .split(/\r?\n/g)
                .map((l) => {
                    const elms = l.split('  ');
                    return elms.length > 2
                        ? ' ' + elms[2].replace(', ', ',') + ';' + l
                        : l.replace(', ', ',') + ';' + l;
                })
                .join('\n');

            const document = await workspace.openTextDocument({
                language: 'm68k',
                content,
            });
            await window.showTextDocument(document);
        } catch (err) {
            window.showErrorMessage(err.message);
            throw new Error(err.message);
        }
    }

    private async memory() {
        const memoryReference = await window.showInputBox({
            prompt: 'Memory address: $xxxxxxxx or #{symbol} or ${symbol} ',
        });
        if (memoryReference === undefined) {
            throw new Error('No input address expression');
        }
        const filename = disassembledFileToPath({
            stackFrameIndex: 0,
            memoryReference,
            instructionCount: 1000,
        });
        const uri = this.createUri(filename);
        try {
            await window.showTextDocument(uri);
        } catch (err) {
            window.showErrorMessage(err.message);
            throw err;
        }
    }

    /**
     * Disassemble a amiga hunk file
     * @param filename File to disassemble
     */
    private async disassembleFile(filename: string): Promise<string> {
        const hunks = await parseHunksFromFile(filename);
        const results = await Promise.all(
            hunks
                .filter((h) => h.hunkType === HunkType.CODE && h.data)
                .map(async (h) => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const buffer = Array.from(h.data!)
                        .map((n) => n.toString(16))
                        .map((n) => this.padStartWith0(n, 8))
                        .join('');
                    const { code } = await disassemble(buffer);
                    return code;
                })
        );
        return results.join('\n');
    }

    private padStartWith0(stringToPad: string, targetLength: number): string {
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        if (stringToPad.length > targetLength) {
            return stringToPad;
        }
        let padString = '0';
        targetLength = targetLength - stringToPad.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + stringToPad;
    }

    private createUri(filename: string) {
        return Uri.parse(`disassembly:${filename.replace('#', '%23')}`);
    }
}
