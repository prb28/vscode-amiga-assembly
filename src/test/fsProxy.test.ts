import { expect } from 'chai';
import * as chai from 'chai';
import { Uri, FileType } from 'vscode';
import * as temp from 'temp';
import * as path from 'path';
import * as chaiAsPromised from 'chai-as-promised';
import { FileProxy } from "../fsProxy";
chai.use(chaiAsPromised);

describe("FsProxy test", function () {
    before(function () {
        // Automatically track and cleanup files at exit
        temp.track();
    });
    it("Should stat an existing file", async function () {
        let filePath = path.join(__dirname, "..", "..", "test_files", "hw-exp.s");
        let expectedSize = 1303;
        let f = new FileProxy(Uri.file(filePath));
        let stat = await f.stat();
        expect(stat.size).to.be.greaterThan(expectedSize);
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        stat = await f.stat();
        expect(stat.size).to.be.greaterThan(expectedSize);
    });
    it("Should send an error on stat of an non existing file", async function () {
        let filePath = path.join(__dirname, "..", "..", "test_files", "noFile");
        let f = new FileProxy(Uri.file(filePath));
        // tslint:disable-next-line:no-unused-expression
        expect(f.stat()).to.be.rejected;
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        // tslint:disable-next-line:no-unused-expression
        expect(f.stat()).to.be.rejected;
    });
    it("Should read an existing file", async function () {
        let filePath = path.join(__dirname, "..", "..", "test_files", "hw-exp.s");
        let expectedSize = 1303;
        let f = new FileProxy(Uri.file(filePath));
        let contents = await f.readFile();
        expect(contents.length).to.be.greaterThan(expectedSize);
        expect(contents.indexOf("dos.library")).to.be.greaterThan(0);
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        contents = await f.readFile();
        expect(contents.length).to.be.greaterThan(expectedSize);
        expect(contents.indexOf("dos.library")).to.be.greaterThan(0);
    });
    it("Should send an error on read of an non existing file", async function () {
        let filePath = path.join(__dirname, "..", "..", "test_files", "noFile");
        let f = new FileProxy(Uri.file(filePath));
        // tslint:disable-next-line:no-unused-expression
        expect(f.readFile()).to.be.rejected;
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        // tslint:disable-next-line:no-unused-expression
        expect(f.readFile()).to.be.rejected;
    });
    it("Should write a file", async function () {
        let tempDir = temp.mkdirSync("out-test-fs");
        let filePath = path.join(tempDir, "wOut.txt");
        let f = new FileProxy(Uri.file(filePath));
        let writtenContents = "test";
        let buf = Buffer.from(writtenContents);
        await f.writeFile(buf);
        // Read the file
        let contents = await f.readFile();
        expect(contents).to.be.eql(buf);
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        await f.writeFile(buf);
        // Read the file
        contents = await f.readFile();
        expect(contents).to.be.eql(buf);
    });
    it("Should send an error on write of an non existing dir", async function () {
        let filePath = path.join(__dirname, "..", "..", "out");
        let f = new FileProxy(Uri.file(filePath));
        let writtenContents = "test";
        let buf = Buffer.from(writtenContents);
        // tslint:disable-next-line:no-unused-expression
        expect(f.writeFile(buf)).to.be.rejected;
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        // tslint:disable-next-line:no-unused-expression
        expect(f.writeFile(buf)).to.be.rejected;
    });
    it("Should verify if a file or dir exists", async function () {
        let filePath = path.join(__dirname, "..", "..", "test_files", "hw-exp.s");
        let f = new FileProxy(Uri.file(filePath));
        // tslint:disable-next-line:no-unused-expression
        expect(f.exists()).to.eventually.be.true;
        filePath = path.join(__dirname, "..", "..", "test_files");
        f = new FileProxy(Uri.file(filePath));
        // tslint:disable-next-line:no-unused-expression
        expect(f.exists()).to.eventually.be.true;
        filePath = path.join(__dirname, "..", "..", "NoFile");
        f = new FileProxy(Uri.file(filePath));
        // tslint:disable-next-line:no-unused-expression
        expect(f.exists()).to.eventually.be.false;
    });
    it("Should list the files in a directory", async function () {
        let filePath = path.join(__dirname, "..", "..", "test_files");
        let f = new FileProxy(Uri.file(filePath));
        let files = await f.readDirectory();
        expect(files.length).to.be.equal(11);
        let foundFile = false;
        let foundDir = false;
        for (let [cFile, cType] of files) {
            if (cFile === "hw-exp.s") {
                expect(cType).to.be.equal(FileType.File);
                foundFile = true;
            } else if (cFile === "debug") {
                expect(cType).to.be.equal(FileType.Directory);
                foundDir = true;
            }
        }
        // tslint:disable-next-line:no-unused-expression
        expect(foundFile).to.be.true;
        // tslint:disable-next-line:no-unused-expression
        expect(foundDir).to.be.true;
    });

    it("Should find the files in a directory", async function () {
        let filePath = path.join(__dirname, "..", "..", "test_files");
        let f = new FileProxy(Uri.file(filePath));
        let include = "**/*.s";
        let exclude = "**/hw-exp.s";
        let files = await f.findFiles(include, exclude);
        expect(files.length).to.be.equal(8);
        let foundWrongFile = false;
        for (let fProxy of files) {
            if (fProxy.getUri().fsPath.indexOf("hw-exp.s") > 0) {
                foundWrongFile = true;
            }
        }
        // tslint:disable-next-line:no-unused-expression
        expect(foundWrongFile).to.be.false;
    });

    it("Should find the child path from a directory", async function () {
        let filePath = path.join(__dirname, "..", "..", "test_files");
        let f = new FileProxy(Uri.file(filePath));
        let childFileName = "foo";
        let rootChildFileName = `${filePath}/${childFileName}`;
        let normRootChildFileName = FileProxy.normalize(rootChildFileName);
        let rootChildFileNameBack = `${filePath}\\${childFileName}`;
        expect(FileProxy.normalize(f.getRelativeFile(childFileName).getUri().fsPath)).to.be.equal(normRootChildFileName);
        expect(FileProxy.normalize(f.getRelativeFile(rootChildFileName).getUri().fsPath)).to.be.equal(normRootChildFileName);
        expect(FileProxy.normalize(f.getRelativeFile(rootChildFileNameBack).getUri().fsPath)).to.be.equal(normRootChildFileName);
    });

    it("Should normalize paths", function () {
        expect(FileProxy.normalize("\\\\a//b//c/D")).to.be.equal("/a//b//c/D");
        expect(FileProxy.normalize("\\\\a//b\\c/d")).to.be.equal("/a//b/c/d");
        expect(FileProxy.normalize("c:/d")).to.be.equal("C:/d");
        expect(FileProxy.normalize("c:\\d")).to.be.equal("C:/d");
        expect(FileProxy.normalize("c:")).to.be.equal("C:");
        expect(FileProxy.normalize("C:/b")).to.be.equal("C:/b");
    });

});