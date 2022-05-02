import { expect } from 'chai';
import * as chai from 'chai';
import { Uri, extensions } from 'vscode';
import * as temp from 'temp';
import * as path from 'path';
import * as chaiAsPromised from 'chai-as-promised';
import { FileProxy } from "../fsProxy";
import { WorkspaceManager } from '../workspaceManager';
import { ExtensionState } from '../extension';
chai.use(chaiAsPromised);

describe("WorkspaceManager test", function () {
    before(async function () {
        // Automatically track and cleanup files at exit
        temp.track();
        // activate the extension
        const ext = extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
    });
    it("Should copy the project to a folder", async function () {
        // create a temp dir
        const tempDir = temp.mkdirSync("exampleProject");
        const workspaceManager = new WorkspaceManager();
        const context = ExtensionState.getCurrent().getExtensionContext();
        if (context) {
            await workspaceManager.createExampleWorkspace(context, "1.0", Uri.file(tempDir));
            const expFile = new FileProxy(Uri.file(path.join(tempDir, "gencop.s")));
            // tslint:disable-next-line: no-unused-expression
            expect(await expFile.exists()).to.be.true;
        } else {
            expect.fail("Context not defined");
        }
    });
});