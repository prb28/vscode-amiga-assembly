import { expect } from 'chai';
import { BinariesManager, TagInfo, Version, ExampleProjectManager, DownloadManager } from '../downloadManager';
import { spy, when, anything, mock, instance } from '@johanblumenberg/ts-mockito';
import { CancellationToken, ExtensionContext, Uri } from 'vscode';
import { FileDownloader } from '@microsoft/vscode-file-downloader-api';
import * as temp from 'temp';
import * as path from 'path';
import * as fs from 'fs';
import { FileDownloadSettings } from '@microsoft/vscode-file-downloader-api/out/FileDownloader';
import { FileProxy } from '../fsProxy';

describe.only("Download manager tests", function () {
    before(function () {
        // Automatically track and cleanup files at exit
        temp.track();
    });
    context("Native binaries", function () {
        it("Should retrieve the tags list from github", async function () {
            const binManager = new BinariesManager();
            const tags = await binManager.listTagsFromGitHub();
            let found = false;
            for (const t of tags) {
                if (t.name === "0.22.0-windows") {
                    expect(t.zipball_url).to.be.equal("https://api.github.com/repos/prb28/vscode-amiga-assembly-binaries/zipball/refs/tags/0.22.0-windows");
                    expect(t.extension).to.be.equal("windows");
                    expect(t.version).to.be.eql(new Version("0.22.0"));
                    found = true;
                }
            }
            // tslint:disable-next-line: no-unused-expression
            expect(found).to.be.true;
        });
        it("Should the latest zip file", async function () {
            const binManager = new BinariesManager();
            const spyBinManager = spy(binManager);
            const tags = Array<TagInfo>();
            const osName = binManager.getOsName();
            let versionStr = "0.19.0";
            tags.push(<TagInfo>{
                name: `${versionStr}-${osName}`,
                zipball_url: `http://local/refs/tags/${versionStr}-${osName}.zip`,
                extension: osName,
                version: new Version(versionStr)
            });
            versionStr = "0.22.0";
            tags.push(<TagInfo>{
                name: `${versionStr}-${osName}`,
                zipball_url: `http://local/refs/tags/${versionStr}-${osName}.zip`,
                extension: osName,
                version: new Version(versionStr)
            });
            versionStr = "0.22.1";
            tags.push(<TagInfo>{
                name: `${versionStr}-${osName}`,
                zipball_url: `http://local/refs/tags/${versionStr}-${osName}.zip`,
                extension: osName,
                version: new Version(versionStr)
            });
            tags.push(<TagInfo>{
                name: `${versionStr}-debian`,
                zipball_url: `http://local/refs/tags/${versionStr}-debian.zip`,
                extension: osName,
                version: new Version(versionStr)
            });
            when(spyBinManager.listTagsFromGitHub()).thenResolve(tags);
            const [vers, filename] = await binManager.getZipURL(new Version("0.22"));
            expect(vers.toString()).to.be.equal("0.22.1");
            expect(filename).to.be.equal(`http://local/refs/tags/0.22.1-${osName}.zip`);
        });
        it("Should retrieve the branch zip file if a tag is not found", async function () {
            const binManager = new BinariesManager();
            const spyBinManager = spy(binManager);
            const tags = Array<TagInfo>();
            const branchName = binManager.getBranchName();
            when(spyBinManager.listTagsFromGitHub()).thenResolve(tags);
            const [vers, filename] = await binManager.getZipURL(new Version("0.23"));
            expect(vers.toString()).to.be.equal("0.23.0");
            expect(filename).to.be.equal(`${BinariesManager.BINARIES_BRANCH_URL}/${branchName}.zip`);
        });
        it("Should get version from path", function () {
            const binManager = new BinariesManager();
            const vStr = "1.2.3";
            const v1 = new Version(vStr);
            // tslint:disable-next-line: no-unused-expression
            expect(binManager.getVersionFromFilename("foo")).to.be.null;
            // tslint:disable-next-line: no-unused-expression
            expect(binManager.getVersionFromFilename(`/test/file/test${DownloadManager.VERSION_SEPARATOR}${vStr}`)).to.be.eql(v1);
            expect(binManager.getVersionFromFilename(`/test/file/${vStr}`)).to.be.eql(v1);
            expect(binManager.getVersionFromFilename(`C:\\Users\\RUNNER~1\\AppData\\Local\\Temp\\tmpDirBinaries2021619-5832-ojrvnq.5fdpl\\test${DownloadManager.VERSION_SEPARATOR}${vStr}`)).to.be.eql(v1);
        });
        it("Should get the master branch on tag retrieve exception", async function () {
            const binManager = new BinariesManager();
            const spyBinManager = spy(binManager);
            const branchName = binManager.getBranchName();
            when(spyBinManager.listTagsFromGitHub()).thenReject(new Error("no tag"));
            const [vers, filename] = await binManager.getZipURL(new Version("0.23"));
            expect(vers.toString()).to.be.equal("0.23.0");
            expect(filename).to.be.equal(`${BinariesManager.BINARIES_BRANCH_URL}/${branchName}.zip`);
        });
        it("Should remove the old binaries according to the project", async function () {
            const tempDir = temp.mkdirSync("tmpDirBinaries");
            const uri1 = Uri.file(path.join(tempDir, `vscode-amiga-assembly-binaries${DownloadManager.VERSION_SEPARATOR}1.2.3`));
            console.log("making dir : " + uri1.fsPath);
            const fProxy1 = new FileProxy(uri1);
            await fProxy1.mkdir();
            //fs.mkdirSync(uri1.fsPath);
            const uri11 = Uri.file(path.join(uri1.fsPath, "prb28-vscode-amiga-assembly-binaries-123"));
            fs.mkdirSync(uri11.fsPath);
            const uri2 = Uri.file(path.join(tempDir, `vscode-amiga-assembly-binaries${DownloadManager.VERSION_SEPARATOR}0.2.3`));
            fs.mkdirSync(uri2.fsPath);
            const uri21 = Uri.file(path.join(uri2.fsPath, "prb28-vscode-amiga-assembly-binaries-438605e"));
            fs.mkdirSync(uri21.fsPath);
            const uri3 = Uri.file(path.join(tempDir, `vscode-amiga-assembly-binaries${DownloadManager.VERSION_SEPARATOR}0.2.0`));
            fs.mkdirSync(uri3.fsPath);
            fs.mkdirSync(Uri.file(path.join(uri3.fsPath, "prb28-vscode-amiga-assembly-binaries-xxxxx")).fsPath);
            const uri32 = Uri.file(path.join(uri3.fsPath, "prb28-another_project-xxxx"));
            fs.mkdirSync(uri32.fsPath);
            const uri4 = Uri.file(path.join(tempDir, `vscode-amiga-assembly-binaries${DownloadManager.VERSION_SEPARATOR}2.2.3`));
            fs.mkdirSync(uri4.fsPath);
            const uri41 = Uri.file(path.join(uri4.fsPath, "prb28-another-project-123"));
            fs.mkdirSync(uri41.fsPath);
            const fProxy = new FileProxy(Uri.parse(tempDir));
            let files = await fProxy.listFiles();
            for (const f of files) {
                console.log("before file : " + f.getPath());
            }

            const binManager = new BinariesManager();
            const spyBinManager = spy(binManager);
            const vStr = "1.2.3";
            const v1 = new Version(vStr);
            const fileDownloaderMock = mock(FileDownloaderMock);
            const downloadedFile = Uri.parse(tempDir);
            when(fileDownloaderMock.downloadFile(anything(), anything(), anything(), anything(), anything(), anything())).thenResolve(downloadedFile);
            when(fileDownloaderMock.listDownloadedItems(anything())).thenResolve([uri1, uri2, uri3]);
            const fileDownloader = instance(fileDownloaderMock);
            when(spyBinManager.getFileDownloader()).thenResolve(fileDownloader);
            when(spyBinManager.getZipURL(anything())).thenResolve([v1, "http://mydownload"]);

            const fUri = await binManager.downloadProject(<ExtensionContext>{}, vStr);
            expect(fUri.fsPath).to.be.equal(uri11.fsPath);
            // Check if other dir was deleted
            console.log(`listing files of ${tempDir}`);
            //expect(files.length).to.be.equal(3);
            let count = 0;
            files = await fProxy.listFiles();
            for (const f of files) {
                console.log("file : " + f.getPath());
                if (f.getPath().includes("1.2.3")) {
                    expect(path.basename(f.getUri().fsPath)).to.be.eql(path.basename(uri1.fsPath));
                    const subFiles = await f.listFiles();
                    expect(subFiles.length).to.be.equal(1);
                    expect(path.basename(subFiles[0].getUri().fsPath)).to.be.eql(path.basename(uri11.fsPath));
                    count++;
                } else if (f.getPath().includes("0.2.0")) {
                    expect(path.basename(f.getUri().fsPath)).to.be.eql(path.basename(uri3.fsPath));
                    const subFiles = await f.listFiles();
                    expect(subFiles.length).to.be.equal(1);
                    expect(path.basename(subFiles[0].getUri().fsPath)).to.be.eql(path.basename(uri32.fsPath));
                    count++;
                } else {
                    expect(path.basename(f.getUri().fsPath)).to.be.eql(path.basename(uri4.fsPath));
                    const subFiles = await f.listFiles();
                    expect(subFiles.length).to.be.equal(1);
                    expect(path.basename(subFiles[0].getUri().fsPath)).to.be.eql(path.basename(uri41.fsPath));
                    count++;
                }
            }
            expect(count).to.be.equal(3);
        });
        it("Should throw an exception when the binaries could not be retrieved", async function () {
            const tempDir = "tmp";
            const uri1 = Uri.file(path.join(tempDir, "1.2.3"));
            const uri2 = Uri.file(path.join(tempDir, "0.2.3"));

            const binManager = new BinariesManager();
            const spyBinManager = spy(binManager);
            const vStr = "1.2.3";
            const v1 = new Version(vStr);
            const fileDownloaderMock = mock(FileDownloaderMock);
            when(fileDownloaderMock.downloadFile(anything(), anything(), anything(), anything(), anything(), anything())).thenReject(new Error("not good"));
            when(fileDownloaderMock.listDownloadedItems(anything())).thenResolve([uri1, uri2]);
            const fileDownloader = instance(fileDownloaderMock);
            when(spyBinManager.getFileDownloader()).thenResolve(fileDownloader);
            when(spyBinManager.getZipURL(anything())).thenResolve([v1, "http://mydownnload"]);

            // tslint:disable-next-line: no-unused-expression
            expect(binManager.downloadProject(<ExtensionContext>{}, vStr)).to.be.rejected;
        });
    });
    context("Version class", function () {
        it("Should create version", function () {
            let v1 = new Version("1.2.3.5");
            expect(v1.major).to.be.equal(1);
            expect(v1.minor).to.be.equal(2);
            expect(v1.increment).to.be.equal(3);
            expect(`${v1.toString()}`).to.be.equal("1.2.3");
            v1 = new Version("1.2");
            expect(v1.major).to.be.equal(1);
            expect(v1.minor).to.be.equal(2);
            expect(v1.increment).to.be.equal(0);
            expect(`${v1.toString()}`).to.be.equal("1.2.0");
            v1 = new Version("");
            expect(v1.major).to.be.equal(0);
            expect(v1.minor).to.be.equal(0);
            expect(v1.increment).to.be.equal(0);
            expect(`${v1.toString()}`).to.be.equal("0.0.0");
        });
        it("Should compare versions", function () {
            const v1 = new Version("1.2.3");
            expect(v1.compare(new Version("1.2.3"))).to.be.equal(0);
            expect(v1.compare(new Version("2.2.3"))).to.be.equal(1);
            expect(v1.compare(new Version("0.2.3"))).to.be.equal(-1);
            expect(v1.compare(new Version("1.2"))).to.be.equal(-1);
        });
        it("Should verify if versions are compatible", function () {
            const v1 = new Version("1.2.3");
            // tslint:disable-next-line: no-unused-expression
            expect(v1.isCompatible(new Version(""))).to.be.false;
            // tslint:disable-next-line: no-unused-expression
            expect(v1.isCompatible(new Version("2.2.3"))).to.be.false;
            // tslint:disable-next-line: no-unused-expression
            expect(v1.isCompatible(new Version("1.3.3"))).to.be.false;
            // tslint:disable-next-line: no-unused-expression
            expect(v1.isCompatible(new Version("1.2.4"))).to.be.true;
            // tslint:disable-next-line: no-unused-expression
            expect(v1.isCompatible(new Version("1.2"))).to.be.true;
        });
    });
    context("Example project binaries", function () {
        it("Should retrieve the tags list from github", async function () {
            const binManager = new ExampleProjectManager();
            const tags = await binManager.listTagsFromGitHub();
            let found = false;
            for (const t of tags) {
                if (t.name === "0.21") {
                    expect(t.zipball_url).to.be.equal("https://api.github.com/repos/prb28/vscode-amiga-wks-example/zipball/refs/tags/0.21");
                    expect(t.extension).to.be.undefined;
                    expect(t.version).to.be.eql(new Version("0.21.0"));
                    found = true;
                }
            }
            // tslint:disable-next-line: no-unused-expression
            expect(found).to.be.true;
        });
        it("Should the latest zip file", async function () {
            const binManager = new ExampleProjectManager();
            const spyBinManager = spy(binManager);
            const tags = Array<TagInfo>();
            let versionStr = "0.19.0";
            tags.push(<TagInfo>{
                name: `${versionStr}`,
                zipball_url: `http://local/refs/tags/${versionStr}.zip`,
                version: new Version(versionStr)
            });
            versionStr = "0.22.0";
            tags.push(<TagInfo>{
                name: `${versionStr}`,
                zipball_url: `http://local/refs/tags/${versionStr}.zip`,
                version: new Version(versionStr)
            });
            versionStr = "0.22.1";
            tags.push(<TagInfo>{
                name: `${versionStr}`,
                zipball_url: `http://local/refs/tags/${versionStr}.zip`,
                version: new Version(versionStr)
            });
            tags.push(<TagInfo>{
                name: `${versionStr}`,
                zipball_url: `http://local/refs/tags/${versionStr}.zip`,
                version: new Version(versionStr)
            });
            when(spyBinManager.listTagsFromGitHub()).thenResolve(tags);
            const [vers, filename] = await binManager.getZipURL(new Version("0.22"));
            expect(vers.toString()).to.be.equal("0.22.1");
            expect(filename).to.be.equal(`http://local/refs/tags/0.22.1.zip`);
        });
        it("Should retrieve the branch zip file if a tag is not found", async function () {
            const binManager = new ExampleProjectManager();
            const spyBinManager = spy(binManager);
            const tags = Array<TagInfo>();
            const branchName = binManager.getBranchName();
            when(spyBinManager.listTagsFromGitHub()).thenResolve(tags);
            const [vers, filename] = await binManager.getZipURL(new Version("0.99121"));
            expect(vers.toString()).to.be.equal("0.99121.0");
            expect(filename).to.be.equal(`${ExampleProjectManager.BRANCH_URL}/${branchName}.zip`);
        });
        it("Should get the master branch on tag retrieve exception", async function () {
            const binManager = new ExampleProjectManager();
            const spyBinManager = spy(binManager);
            const branchName = binManager.getBranchName();
            when(spyBinManager.listTagsFromGitHub()).thenReject(new Error("no tag"));
            const [vers, filename] = await binManager.getZipURL(new Version("0.99121"));
            expect(vers.toString()).to.be.equal("0.99121.0");
            expect(branchName).to.be.equal("master");
            expect(filename).to.be.equal(`${ExampleProjectManager.BRANCH_URL}/${branchName}.zip`);
        });
    });
});

class FileDownloaderMock implements FileDownloader {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    downloadFile(url: Uri, filename: string, context: ExtensionContext, cancellationToken?: CancellationToken, onDownloadProgressChange?: (downloadedBytes: number, totalBytes: number | undefined) => void, settings?: FileDownloadSettings): Promise<Uri> {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    listDownloadedItems(context: ExtensionContext): Promise<Uri[]> {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getItem(filename: string, context: ExtensionContext): Promise<Uri> {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tryGetItem(filename: string, context: ExtensionContext): Promise<Uri | undefined> {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteItem(filename: string, context: ExtensionContext): Promise<void> {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteAllItems(context: ExtensionContext): Promise<void> {
        throw new Error('Method not implemented.');
    }

}