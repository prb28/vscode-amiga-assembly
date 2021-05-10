import { ExtensionContext, ProgressLocation, Uri, window } from "vscode";
import * as path from 'path';
import { getApi, FileDownloader } from "@microsoft/vscode-file-downloader-api";
import axios from 'axios';
import { FileProxy } from "./fsProxy";

/**
 * Interface to store the Github Tag informations
 */
export interface TagInfo {
    /** Name of the tag */
    name: string;
    /** url of the zip */
    zipball_url: string;
    /** Os of the tag */
    os: string;
    /** Version of the tag */
    version: Version;
}

/**
 * Class to manage the version and their comparison.
 * Version format : major.minor.increment
 */
export class Version {
    public major: number;
    public minor: number;
    public increment: number;

    /**
     * Constructor
     * @param version String containing a version
     */
    constructor(version: string) {
        let elms = version.split(".");
        this.major = 0;
        this.minor = 0;
        this.increment = 0;
        if (version.length > 0 && elms.length > 0) {
            this.major = parseInt(elms[0]);
            if (elms.length > 1) {
                this.minor = parseInt(elms[1]);
                if (elms.length > 2) {
                    this.increment = parseInt(elms[2]);
                }
            }
        }
    }

    /**
     * Compares two version
     * @param other Other Version to compare
     * @returns -1 : this is greater, 0 : equals, 1: other is grater
     */
    public compare(other: Version): number {
        if (other.major > this.major) {
            return 1;
        } else if (other.major < this.major) {
            return -1;
        } else {
            if (other.minor > this.minor) {
                return 1;
            } else if (other.minor < this.minor) {
                return -1;
            } else {
                if (other.increment > this.increment) {
                    return 1;
                } else if (other.increment < this.increment) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }
    }

    /**
     * Verify if the two version are compatible : same major and minor
     * @param other Other version
     * @returns 
     */
    public isCompatible(other: Version): boolean {
        return this.major === other.major && this.minor === other.minor;
    }

    /**
     * Get the version as string
     * @returns version as string
     */
    public toString(): string {
        return `${this.major}.${this.minor}.${this.increment}`;
    }

    /**
     * Parse a version string
     * @param version Parses a version from string
     * @returns A version or null if it not a version format
     */
    public static parse(version: string): Version | null {
        if (version.match("[\d\.]+")) {
            return new Version(version);
        }
        return null;
    }
}

/**
 * Manager for the extension binaries
 */
export class BinariesManager {
    /** URL of the github binaries project branches */
    static readonly BINARIES_BRANCH_URL = "https://github.com/prb28/vscode-amiga-assembly-binaries/archive/refs/heads";
    /** URL of the github binaries project tags */
    static readonly BINARIES_TAGS_URL = "https://api.github.com/repos/prb28/vscode-amiga-assembly-binaries/tags";
    /** Local path of the downloaded binaries */
    protected binariesPath: Uri;

    /**
     * Constructor
     * @param extensionPath Path of the extension
     * @param binariesDirName Name of the binaries directory
     */
    constructor(extensionPath: string, binariesDirName: string) {
        this.binariesPath = Uri.file(path.join(extensionPath, binariesDirName));
    }

    /**
     * Returns the version from a path
     * @param filePath Path to parse
     * @returns Version or null
     */
    public getVersionFromFilename(filePath: string): Version | null {
        let filename = path.basename(filePath);
        return Version.parse(filename);
    }

    /**
     * Delete a directory (useful for the tests)
     * @param directoryUri Uri of the directory
     * @returns 
     */
    public deleteDirectory(directoryUri: Uri): Promise<void> {
        let dProxy = new FileProxy(directoryUri);
        return dProxy.delete();
    }

    /**
     * Downloads the binaries.
     * @param context Extension context
     * @param version Version of te extension
     * @returns Uri of the downloaded binaries
     */
    public async downloadBinaries(context: ExtensionContext, version: string): Promise<Uri> {
        const [downloadedVersion, url] = await this.getZipURL(new Version(version));
        const uri = Uri.parse(url);
        // List all the download files
        let downloadedFiles = await this.listAllDownloadedFiles(context);
        let fileUri: Uri | undefined;
        for (let file of downloadedFiles) {
            let vDir = this.getVersionFromFilename(file.path);
            if (vDir) {
                if (vDir.compare(downloadedVersion) !== 0) {
                    this.deleteDirectory(file);
                } else {
                    fileUri = file;
                }
            }
        }
        if (!fileUri) {
            fileUri = await this.downloadFile("binaries", uri, downloadedVersion.toString(), context, true);
        }
        let fProxy = new FileProxy(fileUri);
        let files = await fProxy.listFiles();
        return files[0].getUri();
    }

    /**
     * List all the tags of the binaries projet.
     * @returns List of tag infos
     */
    public async listTagsFromGitHub(): Promise<Array<TagInfo>> {
        let tagList = new Array<TagInfo>();
        const response = await axios.get(BinariesManager.BINARIES_TAGS_URL);
        for (let d of response.data) {
            let elms = d.name.split("-");
            if (elms.length > 1) {
                let version = new Version(elms[0]);
                let os = elms[1];
                tagList.push(<TagInfo>{
                    name: d.name,
                    zipball_url: d.zipball_url,
                    version: version,
                    os: os
                });
            }
        }
        return tagList;
    }

    /**
     * Get the current os name as written in the binaries names
     * @returns The current os name 
     */
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

    /**
     * Get the current branch name for the os
     * @returns The current branch name
     */
    public getBranchName(): string {
        switch (process.platform) {
            case "win32":
                return "windows_x64";
            case "darwin":
                return "osx";
            default:
                return "debian_x64";
        }
    }

    /**
     * Retrieves and selects the URL to download the binaries
     * @param version Selected version
     * @returns Tuple [version, URL of the binaries]
     */
    public async getZipURL(version: Version): Promise<[Version, string]> {
        const osName = this.getOsName();
        let tagInfos = await this.listTagsFromGitHub();
        let bestTagInfo: TagInfo | undefined;
        for (let tag of tagInfos) {
            if (tag.os === osName) {
                if (version.isCompatible(tag.version) && (!bestTagInfo || bestTagInfo.version.compare(tag.version) > 0)) {
                    bestTagInfo = tag;
                }
            }
        }
        if (bestTagInfo) {
            return [bestTagInfo.version, `${bestTagInfo.zipball_url}`];
        }
        // no tag : the master is returned
        let branchName = this.getBranchName();
        return [version, `${BinariesManager.BINARIES_BRANCH_URL}/${branchName}.zip`];
    }

    /**
     * Gets the local downloaded file path
     * @param filename Downloaded file name
     * @param context Context of the extension
     * @returns local downloaded file path
     */
    public async getDownloadedFile(filename: string, context: ExtensionContext): Promise<Uri> {
        const fileDownloader: FileDownloader = await this.getFileDownloader();
        return await fileDownloader.getItem(filename, context);
    }

    /**
     * Deletes the local downloaded file path
     * @param filename Downloaded file name
     * @param context Context of the extension
     */
    public async deleteDownloadedFile(filename: string, context: ExtensionContext): Promise<void> {
        const fileDownloader: FileDownloader = await this.getFileDownloader();
        await fileDownloader.deleteItem(filename, context);
    }

    /**
     * Deletes all downloaded files
     * @param context Context of the extension
     */
    public async deleteAllDownloadedFiles(context: ExtensionContext): Promise<void> {
        const fileDownloader: FileDownloader = await this.getFileDownloader();
        await fileDownloader.deleteAllItems(context);
    }

    /**
     * List the downloaded files
     * @param context Extension context
     */
    public async listAllDownloadedFiles(context: ExtensionContext): Promise<Uri[]> {
        const fileDownloader: FileDownloader = await this.getFileDownloader();
        let files = await fileDownloader.listDownloadedItems(context);
        return files;
    }

    /**
     * Return the file downloader api (useful for mocking)
     * @returns FileDownloader api
     */
    public getFileDownloader(): Promise<FileDownloader> {
        return getApi();
    }

    /**
     * Download a file
     * @param name Name of the file
     * @param uri URI of the files
     * @param outPath Output directory
     * @param context Extension context
     * @param extract If true the unzip the file
     * @returns Local uri of the downloaded file
     */
    public async downloadFile(name: string, uri: Uri, outPath: string, context: ExtensionContext, extract?: boolean): Promise<Uri> {
        return await window.withProgress<Uri>({
            location: ProgressLocation.Notification,
            title: `Downloading ${name} `,
            cancellable: true
        }, (progress, token) => {
            return new Promise(async (resolve, reject) => {
                // Get downloader API and begin to download the requested file
                let fileDownloader = await this.getFileDownloader();
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
