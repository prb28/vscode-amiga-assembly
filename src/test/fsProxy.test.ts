import { expect } from 'chai';
import * as chai from 'chai';
import { Uri, FileType } from 'vscode';
import * as temp from 'temp';
import * as path from 'path';
import * as chaiAsPromised from 'chai-as-promised';
import { FileProxy } from "../fsProxy";
import { constants } from 'fs';
chai.use(chaiAsPromised);

describe("FsProxy test", function () {
    before(function () {
        // Automatically track and cleanup files at exit
        temp.track();
    });
    it("Should stat an existing file", async function () {
        const filePath = path.join(__dirname, "..", "..", "test_files", "hw-exp.s");
        const expectedSize = 1302;
        let f = new FileProxy(Uri.file(filePath));
        let stat = await f.stat();
        expect(stat.size).to.be.greaterThan(expectedSize);
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        stat = await f.stat();
        expect(stat.size).to.be.greaterThan(expectedSize);
    });
    it("Should send an error on stat of an non existing file", async function () {
        const filePath = path.join(__dirname, "..", "..", "test_files", "noFile");
        let f = new FileProxy(Uri.file(filePath));
        // tslint:disable-next-line:no-unused-expression
        expect(f.stat()).to.be.rejected;
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        // tslint:disable-next-line:no-unused-expression
        expect(f.stat()).to.be.rejected;
    });
    it("Should read an existing file", async function () {
        const filePath = path.join(__dirname, "..", "..", "test_files", "hw-exp.s");
        const expectedSize = 1302;
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
        const filePath = path.join(__dirname, "..", "..", "test_files", "noFile");
        let f = new FileProxy(Uri.file(filePath));
        // tslint:disable-next-line:no-unused-expression
        expect(f.readFile()).to.be.rejected;
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        // tslint:disable-next-line:no-unused-expression
        expect(f.readFile()).to.be.rejected;
    });
    it("Should write a file", async function () {
        const tempDir = temp.mkdirSync("out-test-fs");
        const filePath = path.join(tempDir, "wOut.txt");
        let f = new FileProxy(Uri.file(filePath));
        const writtenContents = "test";
        const buf = Buffer.from(writtenContents);
        await f.writeFile(buf);
        // Read the file
        let contents = await f.readFile();
        expect(contents).to.be.eql(buf);
        await expect(f.isDirectory()).to.be.eventually.false;
        await expect(f.isFile()).to.be.eventually.true;
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        await f.writeFile(buf);
        // Read the file
        contents = await f.readFile();
        expect(contents).to.be.eql(buf);
        await expect(f.isDirectory()).to.be.eventually.false;
        await expect(f.isFile()).to.be.eventually.true;
    });
    it("Should send an error on write of an non existing dir", async function () {
        const filePath = path.join(__dirname, "..", "..", "out");
        let f = new FileProxy(Uri.file(filePath));
        const writtenContents = "test";
        const buf = Buffer.from(writtenContents);
        // tslint:disable-next-line:no-unused-expression
        expect(f.writeFile(buf)).to.be.rejected;
        // with direct access
        f = new FileProxy(Uri.file(filePath), true);
        // tslint:disable-next-line:no-unused-expression
        expect(f.writeFile(buf)).to.be.rejected;
    });

    it("Should delete a file", async function () {
        const tempDir = temp.mkdirSync("delete-test-fs");
        const filePath = path.join(tempDir, "wOut.txt");
        let f = new FileProxy(Uri.file(filePath));
        const writtenContents = "test";
        const buf = Buffer.from(writtenContents);
        await f.writeFile(buf);
        await expect(f.exists()).to.be.eventually.true;
        // with direct access
        await f.delete();
        await expect(f.exists()).to.be.eventually.false;
        f = new FileProxy(Uri.file(filePath), true);
        await f.writeFile(buf);
        await expect(f.exists()).to.be.eventually.true;
        // with direct access
        await f.delete();
        await expect(f.exists()).to.be.eventually.false;
    });

    it("Should create a directory and delete", async function () {
        const tempDir = temp.mkdirSync("mkdir-test-fs");
        const dirPath = path.join(tempDir, "testDir");
        let f = new FileProxy(Uri.file(dirPath));
        await expect(f.exists()).to.be.eventually.false;
        await f.mkdir();
        await expect(f.exists()).to.be.eventually.true;
        await expect(f.isDirectory()).to.be.eventually.true;
        await expect(f.isFile()).to.be.eventually.false;
        await f.delete();
        await expect(f.exists()).to.be.eventually.false;
        // with direct access
        const dirPathDirect = path.join(tempDir, "testDirDirect");
        f = new FileProxy(Uri.file(dirPathDirect), true);
        await expect(f.exists()).to.be.eventually.false;
        await f.mkdir();
        await expect(f.exists()).to.be.eventually.true;
        await expect(f.isDirectory()).to.be.eventually.true;
        await expect(f.isFile()).to.be.eventually.false;
        await f.delete();
        await expect(f.exists()).to.be.eventually.false;
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
        const files = await f.readDirectory();
        expect(files.length).to.be.equal(13);
        let foundFile = false;
        let foundDir = false;
        for (const [cFile, cType] of files) {
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
        filePath = path.join(__dirname, "..", "..", "test_files", "debug", "fs-uae", "hd0");
        f = new FileProxy(Uri.file(filePath));
        expect((await f.listFiles()).length).to.be.equal(6);
    });

    it("Should find the files in a directory", async function () {
        const filePath = path.join(__dirname, "..", "..", "test_files");
        const f = new FileProxy(Uri.file(filePath));
        const include = "**/*.s";
        const exclude = "**/hw-exp.s";
        const files = await f.findFiles(include, exclude);
        expect(files.length).to.be.equal(11);
        let foundWrongFile = false;
        for (const fProxy of files) {
            if (fProxy.getUri().fsPath.indexOf("hw-exp.s") > 0) {
                foundWrongFile = true;
            }
        }
        // tslint:disable-next-line:no-unused-expression
        expect(foundWrongFile).to.be.false;
    });

    it("Should order the files when listing it", async function () {
        const filePath = path.join(__dirname, "..", "..", "test_files");
        const f = new FileProxy(Uri.file(filePath));
        const include = "{hw2-toform.s,comment-docs.s,disassemble-exp.s}";
        const exclude = "";
        const files = await f.findFiles(include, exclude);
        expect(files.length).to.be.equal(3);
        const expectedFileOrder = ["hw2-toform.s", "comment-docs.s", "disassemble-exp.s"];
        for (let i = 0; i < expectedFileOrder.length; i++) {
            expect(files[i].getName()).to.be.eql(expectedFileOrder[i]);
        }
    });

    it("Should find the child path from a directory", async function () {
        const filePath = path.join(__dirname, "..", "..", "test_files");
        const f = new FileProxy(Uri.file(filePath));
        const childFileName = "foo";
        const rootChildFileName = `${filePath}/${childFileName}`;
        const normRootChildFileName = FileProxy.normalize(rootChildFileName);
        const rootChildFileNameBack = `${filePath}\\${childFileName}`;
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

    it("Should copy a directory recursively", async function () {
        // create a temp dir
        const tempDir = temp.mkdirSync("copyDir");
        const filePath = path.join(__dirname, "..", "..", "test_files", "debug", "fs-uae", "hd0");
        const sourceDir = new FileProxy(Uri.file(filePath));
        await sourceDir.copy(new FileProxy(Uri.file(path.join(tempDir, "copy"))));
        let expFile = new FileProxy(Uri.file(path.join(tempDir, "copy", "s", "Startup-Sequence")));
        // tslint:disable-next-line: no-unused-expression
        expect(await expFile.exists()).to.be.true;
        expFile = new FileProxy(Uri.file(path.join(tempDir, "copy", "hello")));
        // tslint:disable-next-line: no-unused-expression
        expect(await expFile.exists()).to.be.true;
        expFile = new FileProxy(Uri.file(path.join(tempDir, "copy", ".test", "test.txt")));
        // tslint:disable-next-line: no-unused-expression
        expect(await expFile.exists()).to.be.true;
    });
    it("Should test if two files are in the same directory", async function () {
        expect(FileProxy.inSameDir("/a/b/c/d", "/a/b/c/d")).to.be.true;
        expect(FileProxy.inSameDir("/a/b/c/d", "/a/b/c/f")).to.be.true;
        expect(FileProxy.inSameDir("C:\\a/b/c/d", "C:/a/b/c/d")).to.be.true;
        expect(FileProxy.inSameDir("C:\\a/b/c/d", "C:\\a/b/c/f")).to.be.true;
        expect(FileProxy.inSameDir("/a/b/c/d", "/a/b/f/d")).to.be.false;
        expect(FileProxy.inSameDir("/a/b/c/d", "/a/b/f")).to.be.false;
    });
    it("Should rename a file", async function () {
        // create a temp dir
        const tempDir = temp.mkdirSync("renameDir");
        const filePath = path.join(tempDir, "test.txt");
        const newFilePath = path.join(tempDir, "newtest.txt");
        const f = new FileProxy(Uri.file(filePath));
        const writtenContents = "test";
        const buf = Buffer.from(writtenContents);
        await f.writeFile(buf);
        await f.rename(new FileProxy(Uri.file(newFilePath)));
        const fDest = new FileProxy(Uri.file(newFilePath));
        expect(await f.exists()).to.be.false;
        expect(await fDest.exists()).to.be.true;
    });
    it("Should replace a string in a file", async function () {
        // create a temp dir
        const tempDir = temp.mkdirSync("repalceDir");
        const filePath = path.join(tempDir, "test.txt");
        const f = new FileProxy(Uri.file(filePath));
        const writtenContents = "my new test is good test";
        const buf = Buffer.from(writtenContents);
        await f.writeFile(buf);
        await f.replaceStringInFile(new RegExp("test", "g"), "done");
        const contents = await f.readFile();
        expect(contents.toString()).to.be.eq("my new done is good done")
    });
    it("Should apply chmod ", async () => {
        const tempDir = temp.mkdirSync("chmod_test");
        const filePath = path.join(tempDir, "test.txt");
        const f = new FileProxy(Uri.file(filePath));
        const writtenContents = "test";
        const buf = Buffer.from(writtenContents);
        await f.writeFile(buf);
        f.setPermissions(0o400);
        expect(f.testPermissions(constants.R_OK)).to.be.true;
        f.setPermissions(0o755);
        expect(f.testPermissions(constants.R_OK | constants.X_OK | constants.W_OK)).to.be.true;
    });
    it("Should apply chmod in all files in dir", async () => {
        const tempDir = temp.mkdirSync("chmod_test");
        const tempDirProxy = new FileProxy(Uri.file(tempDir));
        const filePath = path.join(tempDir, "test.txt");
        const f = new FileProxy(Uri.file(filePath));
        const writtenContents = "test";
        const buf = Buffer.from(writtenContents);
        await f.writeFile(buf);
        await tempDirProxy.setPermissionsInAllFiles(0o400);
        expect(f.testPermissions(constants.R_OK)).to.be.true;
        await tempDirProxy.setPermissionsInAllFiles(0o755);
        expect(f.testPermissions(constants.R_OK | constants.X_OK | constants.W_OK)).to.be.true;
    });
});