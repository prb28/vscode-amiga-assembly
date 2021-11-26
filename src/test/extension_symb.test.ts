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
            // activate the extension
            const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
            if (ext) {
                await ext.activate();
            }
            // Read the file
            document = await vscode.workspace.openTextDocument(uri);
            // tslint:disable-next-line:no-unused-expression
            expect(document).to.not.be.undefined;
        });
        it("Should find a symbol definition", async () => {
            const locations = await vscode.commands.executeCommand('vscode.executeDefinitionProvider', uri, new Position(343, 33));
            // tslint:disable-next-line:no-unused-expression
            expect(locations).to.not.be.undefined;
            if (locations) {
                const l = locations as Array<Location>;
                expect(l.length).to.be.equal(1);
                expect(l[0].range).to.be.eql(new Range(new Position(25, 0), new Position(25, 11)));
                expect(l[0].uri.fsPath).to.be.eql(uri.fsPath);
            }
        });
        it("Should find all the symbol references", async () => {
            const locations = await vscode.commands.executeCommand('vscode.executeReferenceProvider', uri, new Position(343, 33));
            // tslint:disable-next-line:no-unused-expression
            expect(locations).to.not.be.undefined;
            if (locations) {
                const l = locations as Array<Location>;
                expect(l.length).to.be.equal(12);
                expect(l[0].range).to.be.eql(new Range(new Position(343, 28), new Position(343, 39)));
                expect(l[0].uri.fsPath).to.be.eql(uri.fsPath);
            }
        });
        it("Should find all the symbol references for symbol in calculus", async () => {
            const locations = await vscode.commands.executeCommand('vscode.executeReferenceProvider', uri, new Position(302, 41));
            // tslint:disable-next-line:no-unused-expression
            expect(locations).to.not.be.undefined;
            if (locations) {
                const l = locations as Array<Location>;
                expect(l.length).to.be.equal(2);
                expect(l[1].range).to.be.eql(new Range(new Position(302, 34), new Position(302, 44)));
                expect(l[1].uri.fsPath).to.be.eql(uri.fsPath);
            }
        });
        it("Should find all the symbol references for a dot label", async () => {
            const locations = await vscode.commands.executeCommand('vscode.executeReferenceProvider', uri, new Position(119, 5));
            // tslint:disable-next-line:no-unused-expression
            expect(locations).to.not.be.undefined;
            if (locations) {
                const l = locations as Array<Location>;
                expect(l.length).to.be.equal(1);
                expect(l[0].range).to.be.eql(new Range(new Position(115, 25), new Position(115, 34)));
                expect(l[0].uri.fsPath).to.be.eql(uri.fsPath);
            }
        });
        it("Should find all the symbol references for a strange label", async () => {
            const locations = await vscode.commands.executeCommand('vscode.executeReferenceProvider', uri, new Position(216, 5));
            // tslint:disable-next-line:no-unused-expression
            expect(locations).to.not.be.undefined;
            if (locations) {
                const l = locations as Array<Location>;
                expect(l.length).to.be.equal(1);
                expect(l[0].range).to.be.eql(new Range(new Position(156, 22), new Position(156, 30)));
                expect(l[0].uri.fsPath).to.be.eql(uri.fsPath);
            }
        });
    });
});
