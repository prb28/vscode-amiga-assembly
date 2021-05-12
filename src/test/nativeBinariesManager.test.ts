import { expect } from 'chai';
import { BinariesManager, TagInfo, Version } from '../nativeBinariesManager';
import { spy, when, anything, mock, instance } from 'ts-mockito/lib/ts-mockito';
import { CancellationToken, ExtensionContext, Uri } from 'vscode';
import { FileDownloader } from '@microsoft/vscode-file-downloader-api';
import * as temp from 'temp';
import * as path from 'path';
import * as fs from 'fs';
import { FileDownloadSettings } from '@microsoft/vscode-file-downloader-api/out/FileDownloader';
import { FileProxy } from '../fsProxy';

describe("Native binaries manager tests", function () {
    context("Native binaries", function () {
        it("Should retrieve the tags list from github", async function () {
            let binManager = new BinariesManager("", "");
            let tags = await binManager.listTagsFromGitHub();
            let found = false;
            for (let t of tags) {
                if (t.name === "0.22.0-windows") {
                    expect(t.zipball_url).to.be.equal("https://api.github.com/repos/prb28/vscode-amiga-assembly-binaries/zipball/refs/tags/0.22.0-windows");
                    expect(t.os).to.be.equal("windows");
                    expect(t.version).to.be.eql(new Version("0.22.0"));
                    found = true;
                }
            }
            // tslint:disable-next-line: no-unused-expression
            expect(found).to.be.true;
        });
        it("Should the latest zip file", async function () {
            let binManager = new BinariesManager("dummyDir", "0.22");
            let spyBinManager = spy(binManager);
            let tags = Array<TagInfo>();
            let osName = binManager.getOsName();
            let versionStr = "0.19.0";
            tags.push(<TagInfo>{
                name: `${versionStr}-${osName}`,
                zipball_url: `http://local/refs/tags/${versionStr}-${osName}.zip`,
                os: osName,
                version: new Version(versionStr)
            });
            versionStr = "0.22.0";
            tags.push(<TagInfo>{
                name: `${versionStr}-${osName}`,
                zipball_url: `http://local/refs/tags/${versionStr}-${osName}.zip`,
                os: osName,
                version: new Version(versionStr)
            });
            versionStr = "0.22.1";
            tags.push(<TagInfo>{
                name: `${versionStr}-${osName}`,
                zipball_url: `http://local/refs/tags/${versionStr}-${osName}.zip`,
                os: osName,
                version: new Version(versionStr)
            });
            tags.push(<TagInfo>{
                name: `${versionStr}-debian`,
                zipball_url: `http://local/refs/tags/${versionStr}-debian.zip`,
                os: osName,
                version: new Version(versionStr)
            });
            when(spyBinManager.listTagsFromGitHub()).thenResolve(tags);
            let [vers, filename] = await binManager.getZipURL(new Version("0.22"));
            expect(vers.toString()).to.be.equal("0.22.1");
            expect(filename).to.be.equal(`http://local/refs/tags/0.22.1-${osName}.zip`);
        });
        it("Should retrieve the branch zip file if a tag is not found", async function () {
            let binManager = new BinariesManager("dummyDir", "0.23");
            let spyBinManager = spy(binManager);
            let tags = Array<TagInfo>();
            let branchName = binManager.getBranchName();
            when(spyBinManager.listTagsFromGitHub()).thenResolve(tags);
            let [vers, filename] = await binManager.getZipURL(new Version("0.23"));
            expect(vers.toString()).to.be.equal("0.23.0");
            expect(filename).to.be.equal(`${BinariesManager.BINARIES_BRANCH_URL}/${branchName}.zip`);
        });
        it("Should get version from path", function () {
            let binManager = new BinariesManager("dummyDir", "0.23");
            let vStr = "1.2.3";
            let v1 = new Version(vStr);
            // tslint:disable-next-line: no-unused-expression
            expect(binManager.getVersionFromFilename("foo")).to.be.null;
            // tslint:disable-next-line: no-unused-expression
            expect(binManager.getVersionFromFilename(`/test/file/test-${vStr}`)).to.be.null;
            expect(binManager.getVersionFromFilename(`/test/file/${vStr}`)).to.be.eql(v1);
        });
        it("Should get the master branch on tag retrieve exception", async function () {
            let binManager = new BinariesManager("dummyDir", "0.23");
            let spyBinManager = spy(binManager);
            let branchName = binManager.getBranchName();
            when(spyBinManager.listTagsFromGitHub()).thenReject(new Error("no tag"));
            let [vers, filename] = await binManager.getZipURL(new Version("0.23"));
            expect(vers.toString()).to.be.equal("0.23.0");
            expect(filename).to.be.equal(`${BinariesManager.BINARIES_BRANCH_URL}/${branchName}.zip`);
        });
        it("Should remove the old binaries", async function () {
            let tempDir = temp.mkdirSync("tmpDirBinaries");
            let uri1 = Uri.file(path.join(tempDir, "1.2.3"));
            fs.mkdirSync(uri1.fsPath);
            let uri11 = Uri.file(path.join(uri1.fsPath, "subDir_1.2.3"));
            fs.mkdirSync(uri11.fsPath);
            let uri2 = Uri.file(path.join(tempDir, "0.2.3"));
            fs.mkdirSync(uri2.fsPath);

            let binManager = new BinariesManager("dummyDir", "0.23");
            let spyBinManager = spy(binManager);
            let vStr = "1.2.3";
            let v1 = new Version(vStr);
            let fileDownloaderMock = mock(FileDownloaderMock);
            let downloadedFile = Uri.parse(tempDir);
            when(fileDownloaderMock.downloadFile(anything(), anything(), anything(), anything(), anything(), anything())).thenResolve(downloadedFile);
            when(fileDownloaderMock.listDownloadedItems(anything())).thenResolve([uri1, uri2]);
            let fileDownloader = instance(fileDownloaderMock);
            when(spyBinManager.getFileDownloader()).thenResolve(fileDownloader);
            when(spyBinManager.getZipURL(anything())).thenResolve([v1, "http://mydownnload"]);

            let fUri = await binManager.downloadBinaries(<ExtensionContext>{}, vStr);
            expect(fUri.fsPath).to.be.equal(uri11.fsPath);
            // Check if other dir was deleted
            let fProxy = new FileProxy(Uri.parse(tempDir));
            let files = await fProxy.listFiles();
            expect(files.length).to.be.equal(1);
            expect(path.basename(files[0].getUri().fsPath)).to.be.eql(path.basename(uri1.fsPath));
        });
        it("Should throw an exception when the binaries could not be retrieved", async function () {
            let tempDir = "tmp";
            let uri1 = Uri.file(path.join(tempDir, "1.2.3"));
            let uri2 = Uri.file(path.join(tempDir, "0.2.3"));

            let binManager = new BinariesManager("dummyDir", "0.23");
            let spyBinManager = spy(binManager);
            let vStr = "1.2.3";
            let v1 = new Version(vStr);
            let fileDownloaderMock = mock(FileDownloaderMock);
            when(fileDownloaderMock.downloadFile(anything(), anything(), anything(), anything(), anything(), anything())).thenReject(new Error("not good"));
            when(fileDownloaderMock.listDownloadedItems(anything())).thenResolve([uri1, uri2]);
            let fileDownloader = instance(fileDownloaderMock);
            when(spyBinManager.getFileDownloader()).thenResolve(fileDownloader);
            when(spyBinManager.getZipURL(anything())).thenResolve([v1, "http://mydownnload"]);

            // tslint:disable-next-line: no-unused-expression
            expect(binManager.downloadBinaries(<ExtensionContext>{}, vStr)).to.be.rejected;
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
            let v1 = new Version("1.2.3");
            expect(v1.compare(new Version("1.2.3"))).to.be.equal(0);
            expect(v1.compare(new Version("2.2.3"))).to.be.equal(1);
            expect(v1.compare(new Version("0.2.3"))).to.be.equal(-1);
            expect(v1.compare(new Version("1.2"))).to.be.equal(-1);
        });
        it("Should verify if versions are compatible", function () {
            let v1 = new Version("1.2.3");
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
});

class FileDownloaderMock implements FileDownloader {
    downloadFile(url: Uri, filename: string, context: ExtensionContext, cancellationToken?: CancellationToken, onDownloadProgressChange?: (downloadedBytes: number, totalBytes: number | undefined) => void, settings?: FileDownloadSettings): Promise<Uri> {
        throw new Error('Method not implemented.');
    }
    listDownloadedItems(context: ExtensionContext): Promise<Uri[]> {
        throw new Error('Method not implemented.');
    }
    getItem(filename: string, context: ExtensionContext): Promise<Uri> {
        throw new Error('Method not implemented.');
    }
    tryGetItem(filename: string, context: ExtensionContext): Promise<Uri | undefined> {
        throw new Error('Method not implemented.');
    }
    deleteItem(filename: string, context: ExtensionContext): Promise<void> {
        throw new Error('Method not implemented.');
    }
    deleteAllItems(context: ExtensionContext): Promise<void> {
        throw new Error('Method not implemented.');
    }

}