//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as formatter from '../formatter';
import * as path from 'path';


// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    // Defines a Mocha unit test
    test("Should align text", async () => {
        //let f: formatter.M68kFormatter;
        //f = new formatter.M68kFormatter();
        const testFilesPath = path.join(__dirname, "..", "..", "test_files");
        const uri = vscode.Uri.file(path.join(testFilesPath, "p.s"));
        await vscode.window.showTextDocument(uri);
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            //f.provideDocumentFormattingEdits(editor.document);
            await vscode.commands.executeCommand("editor.action.formatDocument");
            assert.equal("42", editor.document.lineAt(0).text);

        } else {
            assert.fail("editor", "editor", "Editor not opened");
        }

    });
});