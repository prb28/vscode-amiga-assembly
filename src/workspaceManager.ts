import { ExtensionContext, OpenDialogOptions, Uri, window } from "vscode";
import { ExampleProjectManager } from "./downloadManager";
import { FileProxy } from "./fsProxy";

export class WorkspaceManager {
    /**
     * Downloads the project.
     * @param context Extension context
     * @param version Version of te extension
     * @param destinationURI URI destination of the downloaded files
     */
    public async createExampleWorkspace(context: ExtensionContext, version: string, destinationURI?: Uri): Promise<void> {
        let destURI = destinationURI;
        if (!destURI) {
            destURI = await this.showInputPanel();
        }
        // Download example workspace
        const exampleProjectManager = new ExampleProjectManager();
        const downloadedFile = new FileProxy(await exampleProjectManager.downloadProject(context, version));
        // copy files
        downloadedFile.copy(new FileProxy(destURI));
    }

    /**
     * Shows an input panel
     * @return selected folder Uri
     */
    public async showInputPanel(): Promise<Uri> {
        const selectedFiles = await window.showOpenDialog(<OpenDialogOptions>{
            prompt: "Select a file to disassemble",
            canSelectMany: false,
            canSelectFiles: false,
            canSelectFolders: true,
        });
        if (selectedFiles && (selectedFiles.length > 0)) {
            return selectedFiles[0];
        } else {
            const message = "No selected Folder";
            window.showErrorMessage(message);
            throw new Error(message);
        }
    }

}