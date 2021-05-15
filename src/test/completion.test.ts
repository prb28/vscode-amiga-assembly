//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { Position, CancellationTokenSource, Uri } from 'vscode';
import { DummyTextDocument } from './dummy';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { ExtensionState } from '../extension';
import * as Path from 'path';
import { M68kDefinitionHandler } from '../definitionHandler';
import * as vscode from 'vscode';
import { M68kCompletionItemProvider } from '../completion';
import { DocumentationManager } from '../documentation';

chai.use(chaiAsPromised);
// tslint:disable:no-unused-expression
describe("Completion Tests", function () {
    const PROJECT_ROOT = Path.join(__dirname, '..', '..');
    const SOURCES_DIR = Path.join(PROJECT_ROOT, 'test_files', 'sources');
    const MAIN_SOURCE = Path.join(SOURCES_DIR, 'tutorial.s');
    let dHnd: M68kDefinitionHandler;
    let state: ExtensionState;
    let documentationManager: DocumentationManager;
    before(async function () {
        // activate the extension
        const ext = vscode.extensions.getExtension('prb28.amiga-assembly');
        if (ext) {
            await ext.activate();
        }
        state = ExtensionState.getCurrent();
        dHnd = state.getDefinitionHandler();
        documentationManager = await state.getDocumentationManager();
        await dHnd.scanFile(Uri.file(MAIN_SOURCE));
    });
    describe("Completion api", function () {
        it("Should return no completion on an unknown work", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" jsr mymymy");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.be.empty;
        });
        it("Should return a completion on a library function", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" jsr oldopen");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.label).to.be.equal("OldOpenLibrary");
        });
        it("Should return a completion on a register", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" move.l INTEN");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.label).to.be.equal("INTENAR");
        });
        it("Should return a completion on a variable", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" move.l MY_W_V");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.label).to.be.equal("MY_W_VAR");
        });
        it("Should return a completion on an instruction", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 3);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" mov");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results.length).to.be.equal(5);
            const elm = results[0];
            expect(elm.label).to.be.equal("move");
        });
        it("Should not return a completion on an instruction after .", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            let position = new Position(0, 6);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" move.");
            let results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results.length).to.be.equal(3);
            const elm = results[0];
            expect(elm.label).to.be.equal("b");
            position = new Position(1, 6);
            document.addLine(" move.l");
            results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.be.empty;
        });
        it("Should not return completion in a comment", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            let position = new Position(0, 4);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine("; mov");
            let results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.be.empty;
            position = new Position(0, 22);
            document.addLine("  move.l d0,a1  ; mov");
            results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.be.empty;
        });
        it("Should not return completion on a variable or function in an instruction place", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            let position = new Position(0, 11);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine("  OldOpenLib");
            let results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.be.empty;
            position = new Position(0, 8);
            document.addLine("  MY_W_VA");
            results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.be.empty;
        });
        it("Should not return completion with an instruction in a data", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position = new Position(0, 11);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine("  move.l jsr");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.be.empty;
        });
        it("Should not have the same completion in variable and library function or register", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            let position = new Position(0, 14);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine("  jsr AddTail");
            let results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results.length).to.be.equal(1);
            let elm = results[0];
            expect(elm.label).to.be.equal("AddTail");
            document.addLine(" move.l INTENAR");
            position = new Position(1, 15);
            results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results.length).to.be.greaterThan(0);
            elm = results[0];
            expect(elm.label.toUpperCase()).to.be.equal("INTENAR");
        });
    });
});
