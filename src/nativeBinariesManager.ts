import { ExtensionContext, ProgressLocation, Uri, window } from "vscode";
import * as path from 'path';
import { getApi, FileDownloader } from "@microsoft/vscode-file-downloader-api";


export class BinariesManager {
    static readonly BINARIES_ROOT_URL = "https://github.com/prb28/vscode-amiga-assembly-binaries/archive/refs/tags/";
    protected binariesPath: Uri;

    constructor(extensionPath: string, binariesDirName: string) {
        this.binariesPath = Uri.file(path.join(extensionPath, binariesDirName));
    }

    public async downloadBinaries(context: ExtensionContext, version: string): Promise<Uri> {
        let osName = this.getOsName();
        const zipFilename = `${version}-${osName}`;
        const url = `${BinariesManager.BINARIES_ROOT_URL}/${zipFilename}.zip`;
        let fileUri;
        try {
            fileUri = await this.getDownloadedFile(version, context);
        } catch (error) {
            // file not found,download it
            fileUri = await this.downloadFile("binaries", Uri.parse(url), version, context, true);
        }
        return fileUri.with({ path: `${fileUri.path}/vscode-amiga-assembly-binaries-${zipFilename}` });
    }

    public getOsName(): string {
        switch (process.platform) {
            case "win32":
                return "windows";
            case "darwin":
                return "osx";
            default:
                return "debian";
        }
    }

    public async getDownloadedFile(filename: string, context: ExtensionContext): Promise<Uri> {
        const fileDownloader: FileDownloader = await getApi();
        return await fileDownloader.getItem(filename, context);
    }

    public async deleteDownloadedFile(filename: string, context: ExtensionContext): Promise<void> {
        const fileDownloader: FileDownloader = await getApi();
        await fileDownloader.deleteItem(filename, context);
    }

    public async deleteAllDownloadedFiles(context: ExtensionContext): Promise<void> {
        const fileDownloader: FileDownloader = await getApi();
        await fileDownloader.deleteAllItems(context);
    }

    public async downloadFile(name: string, uri: Uri, outPath: string, context: ExtensionContext, extract?: boolean): Promise<Uri> {
        return await window.withProgress<Uri>({
            location: ProgressLocation.Notification,
            title: `Downloading ${name}`,
            cancellable: true
        }, (progress, token) => {
            return new Promise(async (resolve, reject) => {
                // Get downloader API and begin to download the requested file
                let fileDownloader = await getApi();
                let lastProgress = 0;
                try {
                    let file: Uri = await fileDownloader.downloadFile(uri, outPath, context, token, (downloaded, total) => {
                        // Just return if we don't know how large the file is
                        if (!total) {
                            progress.report({ message: 'Please wait...' });
                        } else {
                            // Otherwise, update the progress
                            progress.report({ message: `Please wait...`, increment: downloaded - lastProgress });
                            lastProgress = downloaded;
                        }
                    }, { shouldUnzip: extract });
                    // Return the final path of the downloaded file
                    resolve(file);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}
