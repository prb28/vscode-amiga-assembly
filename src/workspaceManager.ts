import { ExtensionContext, OpenDialogOptions, Uri, window } from "vscode";
import { ExampleProjectManager } from "./downloadManager";
import { FileProxy } from "./fsProxy";
import * as path from 'path';
import winston = require('winston');

export class WorkspaceManager {
    /**
     * Downloads the project.
     * @param context Extension context
     * @param version Version of te extension
     * @param destinationURI URI destination of the downloaded files
     */
    public async createExampleWorkspace(context: ExtensionContext, version: string, destinationURI?: Uri): Promise<Uri> {
        let destURI = destinationURI;
        if (!destURI) {
            destURI = await this.showInputPanel();
        }
        winston.info(`Downloading workspace version ${version} to folder ${destURI}`);
        // Download example workspace
        const exampleProjectManager = new ExampleProjectManager();
        const downloadedFile = new FileProxy(await exampleProjectManager.downloadProject(context, version));
        // copy files
        const destDir = new FileProxy(destURI);
        await downloadedFile.copy(destDir);
        const files = await destDir.listFiles();
        for (const f of files) {
            if (path.basename(f.getPath()).endsWith("code-workspace")) {
                return f.getUri();
            }
        }
        return destDir.getUri();
    }

    /**
     * Shows an input panel
     * @return selected folder Uri
     */
    public async showInputPanel(): Promise<Uri> {
        winston.debug(`Opening Dialog`);
        const selectedFolders = await window.showOpenDialog(<OpenDialogOptions>{
            prompt: "Select a file to disassemble",
            canSelectMany: false,
            canSelectFiles: false,
            canSelectFolders: true,
        });
        if (selectedFolders && (selectedFolders.length > 0)) {
            const selectedFolder = selectedFolders[0];
            // check if there is files in the folder
            const fProxy = new FileProxy(selectedFolder);
            const subFiles = await fProxy.listFiles();
            if (subFiles.length > 0) {
                const answer = await window.showWarningMessage("The folder is not empty. Do you really want to use it ?", "Yes", "Cancel");
                if (answer === "Yes") {
                    winston.info(`Selected folder: ${selectedFolder}`);
                    return selectedFolder;
                }
            } else {
                winston.info(`Selected folder: ${selectedFolder}`);
                return selectedFolder;
            }
        }
        const message = "Example project creation canceled";
        window.showErrorMessage(message);
        throw new Error(message);
    }

}