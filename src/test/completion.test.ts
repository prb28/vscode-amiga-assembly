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
import { ASMLine } from '../parser';

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
        ASMLine.init(await state.getLanguage());
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
            expect(elm.detail).to.be.equal("lib exec.OldOpenLibrary()");
            expect(elm.label).to.be.equal("OldOpenLibrary");
        });
        it("Should return a completion on a custom register", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" move.l INTEN");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.detail).to.be.equal("hardware $01C");
            expect(elm.label).to.be.equal("INTENAR");
        });
        it("Should preserve case on completion of a register", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" move.l inten");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.label).to.be.equal("intenar");
        });
        it("Should return a completion on a cpu register", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" move.l d");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.not.be.undefined;
            const elm = results.find(e => e.label === "d0")!;
            expect(elm).to.not.be.empty;
            expect(elm.detail).to.be.equal("data register");
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
            expect(elm.detail).to.be.equal("W/2");
            expect(elm.label).to.be.equal("MY_W_VAR");
        });
        it("Should return a completion on a label", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 7);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" jsr Mai");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.detail).to.be.equal("label tutorial.s:100");
            expect(elm.label).to.be.equal("Main");
        });
        it("Should return a completion on a local label in scope", async function () {
            const document = new DummyTextDocument();
            const position: Position = new Position(1, 8);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine("Example:");
            document.addLine(" jsr .examp");
            document.addLine(".example");
            const definitionHandler = state.getDefinitionHandler();
            await definitionHandler.scanFile(document.uri, document);
            const cp = new M68kCompletionItemProvider(documentationManager, definitionHandler, await state.getLanguage());

            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.not.be.empty;
            const elm = results.find(n => n.label === '.example')!;
            expect(elm).to.not.be.empty;
            expect(elm.detail).to.be.equal("label file.s:2");
            expect(elm.label).to.be.equal(".example");
        });
        it("Should not return a completion on a local label out of scope", async function () {
            const document = new DummyTextDocument();
            const position: Position = new Position(1, 8);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine("Example:");
            document.addLine(" jsr .examp");
            document.addLine("Example2:");
            document.addLine(".example");
            const definitionHandler = state.getDefinitionHandler();
            await definitionHandler.scanFile(document.uri, document);
            const cp = new M68kCompletionItemProvider(documentationManager, definitionHandler, await state.getLanguage());

            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            const elm = results.find(n => n.label === '.example')!;
            expect(elm).to.be.undefined;
        });
        it("Should not return prefixed local labels", async function () {
            const document = new DummyTextDocument();
            const position: Position = new Position(2, 10);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine("Example:");
            document.addLine(".example");
            document.addLine(" jsr Exampl");
            const definitionHandler = state.getDefinitionHandler();
            await definitionHandler.scanFile(document.uri, document);
            const cp = new M68kCompletionItemProvider(documentationManager, definitionHandler, await state.getLanguage());
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results).to.have.lengthOf(1);
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
            expect(elm.detail).to.be.equal("instruction");
            expect((elm.documentation as vscode.MarkdownString).value).to.contain("# MOVE");
        });
        it("Should preserve case on completion of an instruction", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 3);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" MOV");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            expect(results.length).to.be.equal(5);
            const elm = results[0];
            expect(elm.label).to.be.equal("MOVE");
        });
        it("Should return a completion on a directive", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 4);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" sect");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            const elm = results[0];
            expect(elm.label).to.be.equal("section");
            expect(elm.detail).to.be.equal("directive");
            expect((elm.documentation as vscode.MarkdownString).value).to.contain("# SECTION");
        });
        it("Should return a completion on a macro", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 4);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" mac");
            const results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            const elm = results.find(e => e.label === "macro1")!;
            expect(elm).to.not.be.empty;
            expect(elm.detail).to.be.equal("macro");
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
        it("Should match case of size completions to instruction", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            let position = new Position(0, 6);
            const tokenEmitter = new CancellationTokenSource();
            document.addLine(" MOVE.");
            let results = await cp.provideCompletionItems(document, position, tokenEmitter.token);
            const elm = results[0];
            expect(elm.label).to.be.equal("B");
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
            expect(elm.label.toString().toUpperCase()).to.be.equal("INTENAR");
        });
        context("Opened document", function () {
            let sourceDocument: vscode.TextDocument;
            before(async function () {
                sourceDocument = await vscode.workspace.openTextDocument(Uri.file(MAIN_SOURCE));
            });
            it("Should return a completion for an include file", async function () {
                const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
                const position = new Position(20, 23);
                const tokenEmitter = new CancellationTokenSource();
                const results = await cp.provideCompletionItems(sourceDocument, position, tokenEmitter.token);
                expect(results.length).to.be.equal(3);
                expect(results[0].label).to.be.equal("hardware/");
                expect(results[1].label).to.be.equal("hw.i");
                expect(results[2].label).to.be.equal("include/");
            });
            it("Should return a completion for an include file in a directory", async function () {
                const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
                const document = new DummyTextDocument();
                document.uri = Uri.file(Path.join(SOURCES_DIR, 'dummy.s'));
                const tokenEmitter = new CancellationTokenSource();
                document.addLine("  include \"include/\"");
                const results = await cp.provideCompletionItems(document, new Position(0, 19), tokenEmitter.token);
                expect(results.length).to.be.equal(2);
                expect(results[0].label).to.be.equal("hardware/");
                expect(results[1].label).to.be.equal("hw.i");
            });
            it("Should return a completion for an include file filtering the beginning", async function () {
                const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
                const document = new DummyTextDocument();
                document.uri = Uri.file(Path.join(SOURCES_DIR, 'dummy.s'));
                const tokenEmitter = new CancellationTokenSource();
                document.addLine("  include \"include/\"");
                let results = await cp.provideCompletionItems(document, new Position(0, 15), tokenEmitter.token);
                expect(results.length).to.be.equal(1);
                expect(results[0].label).to.be.equal("include/");
                document.addLine("  include \"include/hw\"");
                results = await cp.provideCompletionItems(document, new Position(1, 21), tokenEmitter.token);
                expect(results.length).to.be.equal(1);
                expect(results[0].label).to.be.equal("hw.i");
            });
            it("Should return a completion for an include file with an incdir instruction", async function () {
                const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
                const document = new DummyTextDocument();
                document.uri = Uri.file(MAIN_SOURCE);
                const tokenEmitter = new CancellationTokenSource();
                document.addLine("  incdir include");
                document.addLine("  include \"ha");
                let results = await cp.provideCompletionItems(document, new Position(1, 14), tokenEmitter.token);
                expect(results.length).to.be.equal(1);
                expect(results[0].label).to.be.equal("hardware/");
                document.addLine("  include \"hardware/cu");
                results = await cp.provideCompletionItems(document, new Position(2, 23), tokenEmitter.token);
                expect(results.length).to.be.equal(1);
                expect(results[0].label).to.be.equal("custom.i");
            });
            it("Should return a completion for an include file with an absolute path", async function () {
                const absPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
                const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
                const document = new DummyTextDocument();
                document.uri = Uri.file(MAIN_SOURCE);
                const tokenEmitter = new CancellationTokenSource();
                document.addLine(`  include "${absPath}`);
                const results = await cp.provideCompletionItems(document, new Position(0, 12 + absPath.length), tokenEmitter.token);
                expect(results.length).to.be.equal(3);
                expect(results[0].label).to.be.equal("fs-uae/");
                expect(results[1].label).to.be.equal("gencop.s");
                expect(results[2].label).to.be.equal("hello.c");
            });
        });
    });
});
