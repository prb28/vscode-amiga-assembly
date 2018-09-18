//
// Tests of the extension
//

// The module 'chai' provides assertion methods from node
import { expect } from 'chai';
import * as vscode from 'vscode';
import { Position, Range, Location } from 'vscode';
import * as Path from 'path';

describe("Global Extension Tests", function () {
    context("Symbols commands", function () {
        let document: vscode.TextDocument;
        // Creating the relative path to find the test file
        const testFilesPath = Path.join(__dirname, "..", "..", "test_files", "sources");
        // Simple test file
        const uri = vscode.Uri.file(Path.join(testFilesPath, "tutorial.s"));
        before(async () => {
            // Read the file
            document = await vscode.workspace.openTextDocument(uri);
            // tslint:disable-next-line:no-unused-expression
            expect(document).to.not.be.undefined;
        });
        it("Should find a symbol definition", async () => {
            let locations = await vscode.commands.executeCommand('vscode.executeDefinitionProvider', uri, new Position(341, 33));
            // tslint:disable-next-line:no-unused-expression
            expect(locations).to.not.be.undefined;
            if (locations) {
                let l = locations as Array<Location>;
                expect(l.length).to.be.equal(1);
                expect(l[0].range).to.be.eql(new Range(new Position(25, 0), new Position(25, 11)));
                expect(l[0].uri.fsPath).to.be.eql(uri.fsPath);
            }
        });
        it.only("Should find all the symbol references", async () => {
            let locations = await vscode.commands.executeCommand('vscode.executeReferenceProvider', uri, new Position(341, 33));
            // tslint:disable-next-line:no-unused-expression
            expect(locations).to.not.be.undefined;
            if (locations) {
                let l = locations as Array<Location>;
                expect(l.length).to.be.equal(12);
                expect(l[0].range).to.be.eql(new Range(new Position(341, 28), new Position(341, 39)));
                expect(l[0].uri.fsPath).to.be.eql(uri.fsPath);
            }
        });
    });
});
