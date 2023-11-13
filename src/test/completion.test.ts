//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { Position, Uri } from 'vscode';
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
            document.addLine(" jsr mymymy");
            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.be.empty;
        });
        it("Should return a completion on a library function", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            document.addLine(" jsr oldopen");
            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.detail).to.be.equal("lib exec.OldOpenLibrary()");
            expect(elm.label).to.be.equal("OldOpenLibrary");
        });
        it("Should return a completion on a custom register", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            document.addLine(" move.l INTEN");
            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.detail).to.be.equal("hardware $01C");
            expect(elm.label).to.be.equal("INTENAR");
        });
        it("Should preserve case on completion of a register", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            document.addLine(" move.l inten");
            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.label).to.be.equal("intenar");
        });
        it("Should return a completion on a cpu register", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            document.addLine(" move.l d");
            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.not.be.undefined;
            const elm = results.find(e => e.label === "d0")!;
            expect(elm).to.not.be.empty;
            expect(elm.detail).to.be.equal("data register");
        });
        it("Should return a completion on a variable", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 11);
            document.addLine(" move.l MY_W_V");
            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.detail).to.be.equal("W/2");
            expect(elm.label).to.be.equal("MY_W_VAR");
            expect(elm.documentation).to.be.equal("My W Var");
        });
        it("Should return a completion on a label", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 7);
            document.addLine(" jsr Mai");
            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.not.be.undefined;
            const elm = results[0];
            expect(elm.detail).to.be.equal("label tutorial.s:100");
            expect(elm.label).to.be.equal("Main");
            expect(elm.documentation).to.be.contain("Main - Fonction principale\nFonction principale du traitement\n\nI/O: None");
        });
        it("Should return a completion on a local label in scope", async function () {
            const document = new DummyTextDocument();
            const position: Position = new Position(1, 8);
            document.addLine("Example:");
            document.addLine(" jsr .examp");
            document.addLine(".example");
            const definitionHandler = state.getDefinitionHandler();
            await definitionHandler.scanFile(document.uri, document);
            const cp = new M68kCompletionItemProvider(documentationManager, definitionHandler, await state.getLanguage());

            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.not.be.empty;
            const elm = results.find(n => n.label === '.example')!;
            expect(elm).to.not.be.empty;
            expect(elm.detail).to.be.equal("label file.s:2");
            expect(elm.label).to.be.equal(".example");
        });
        it("Should not return a completion on a local label out of scope", async function () {
            const document = new DummyTextDocument();
            const position: Position = new Position(1, 8);
            document.addLine("Example:");
            document.addLine(" jsr .examp");
            document.addLine("Example2:");
            document.addLine(".example");
            const definitionHandler = state.getDefinitionHandler();
            await definitionHandler.scanFile(document.uri, document);
            const cp = new M68kCompletionItemProvider(documentationManager, definitionHandler, await state.getLanguage());

            const results = await cp.provideCompletionItems(document, position);
            const elm = results.find(n => n.label === '.example')!;
            expect(elm).to.be.undefined;
        });
        it("Should not return prefixed local labels", async function () {
            const document = new DummyTextDocument();
            const position: Position = new Position(2, 10);
            document.addLine("Example:");
            document.addLine(".example");
            document.addLine(" jsr Exampl");
            const definitionHandler = state.getDefinitionHandler();
            await definitionHandler.scanFile(document.uri, document);
            const cp = new M68kCompletionItemProvider(documentationManager, definitionHandler, await state.getLanguage());
            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.have.lengthOf(1);
        });
        it("Should return a completion on an instruction", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 3);
            document.addLine(" mov");
            const results = await cp.provideCompletionItems(document, position);
            expect(results.length).to.be.equal(7);
            const elm = results[0];
            expect(elm.label).to.be.equal("move");
            expect(elm.detail).to.be.equal("instruction");
            expect((elm.documentation as vscode.MarkdownString).value).to.contain("# MOVE");
        });
        it("Should preserve case on completion of an instruction", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 3);
            document.addLine(" MOV");
            const results = await cp.provideCompletionItems(document, position);
            expect(results.length).to.be.equal(7);
            const elm = results[0];
            expect(elm.label).to.be.equal("MOVE");
        });
        it("Should return a completion on a directive", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 4);
            document.addLine(" sect");
            const results = await cp.provideCompletionItems(document, position);
            const elm = results[0];
            expect(elm.label).to.be.equal("section");
            expect(elm.detail).to.be.equal("directive");
            expect((elm.documentation as vscode.MarkdownString).value).to.contain("# SECTION");
        });
        it("Should return a completion on a macro", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(0, 4);
            document.addLine(" mac");
            const results = await cp.provideCompletionItems(document, position);
            const elm = results.find(e => e.label === "macro1")!;
            expect(elm).to.not.be.undefined;
            expect(elm.detail).to.be.equal("macro");
            expect(elm.documentation).to.contain("<name> MACRO");
        });
        it("Should return a completion on a xref", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position: Position = new Position(1, 10);
            document.addLine(" xref MyXref");
            document.addLine(" bsr MyXre");
            await dHnd.scanFile(document.uri, document);
            const results = await cp.provideCompletionItems(document, position);
            const elm = results.find(e => e.label === "MyXref")!;
            expect(elm).to.not.be.undefined;
            expect(elm.detail).to.be.equal("xref");
        });
        it("Should not return a completion on an instruction after .", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            let position = new Position(0, 6);
            document.addLine(" move.");
            let results = await cp.provideCompletionItems(document, position);
            expect(results.length).to.be.equal(3);
            const elm = results[0];
            expect(elm.label).to.be.equal("b");
            position = new Position(1, 6);
            document.addLine(" move.l");
            results = await cp.provideCompletionItems(document, position);
            expect(results).to.be.empty;
        });
        it("Should match case of size completions to instruction", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position = new Position(0, 6);
            document.addLine(" MOVE.");
            const results = await cp.provideCompletionItems(document, position);
            const elm = results[0];
            expect(elm.label).to.be.equal("B");
        });
        it("Should not return completion in a comment", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            let position = new Position(0, 4);
            document.addLine("; mov");
            let results = await cp.provideCompletionItems(document, position);
            expect(results).to.be.empty;
            position = new Position(0, 22);
            document.addLine("  move.l d0,a1  ; mov");
            results = await cp.provideCompletionItems(document, position);
            expect(results).to.be.empty;
        });
        it("Should not return completion on a variable or function in an instruction place", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            let position = new Position(0, 11);
            document.addLine("  OldOpenLib");
            let results = await cp.provideCompletionItems(document, position);
            expect(results).to.be.empty;
            position = new Position(0, 8);
            document.addLine("  MY_W_VA");
            results = await cp.provideCompletionItems(document, position);
            expect(results).to.be.empty;
        });
        it("Should not return completion with an instruction in a data", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            const position = new Position(0, 11);
            document.addLine("  move.l jsr");
            const results = await cp.provideCompletionItems(document, position);
            expect(results).to.be.empty;
        });
        it("Should not have the same completion in variable and library function or register", async function () {
            const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
            const document = new DummyTextDocument();
            let position = new Position(0, 14);
            document.addLine("  jsr AddTail");
            let results = await cp.provideCompletionItems(document, position);
            expect(results.length).to.be.equal(1);
            let elm = results[0];
            expect(elm.label).to.be.equal("AddTail");
            document.addLine(" move.l INTENAR");
            position = new Position(1, 15);
            results = await cp.provideCompletionItems(document, position);
            expect(results.length).to.be.greaterThan(0);
            elm = results[0];
            expect(typeof elm.label === 'string');
            if (typeof elm.label === 'string') {
                expect(elm.label.toUpperCase()).to.be.equal("INTENAR");
            }
        });
        context("Include completions", function () {
            const includeSrc = Path.join(PROJECT_ROOT, 'test_files', 'include-dirs', 'example.s');
            let completionProvider: M68kCompletionItemProvider;
            let defHandler: M68kDefinitionHandler;
            let doc: DummyTextDocument;
            beforeEach(async function () {
                defHandler = new M68kDefinitionHandler();
                completionProvider = new M68kCompletionItemProvider(documentationManager, defHandler, await state.getLanguage());
                doc = new DummyTextDocument();
                doc.uri = Uri.file(includeSrc);
            });
            it("Should return file completions for include", async function () {
                doc.addLine("  include \"in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 14));
                expect(results).to.have.lengthOf(2);
                expect(results[0].label).to.be.equal("inc-r1.i");
                expect(results[1].label).to.be.equal("inc-r2.i");
            });
            it("Should return file completions filtered by prefix", async function () {
                doc.addLine("  include \"inc-r2");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 18));
                expect(results).to.have.lengthOf(1);
                expect(results[0].label).to.be.equal("inc-r2.i");
            });
            it("Should return all file completions for include with no input text", async function () {
                doc.addLine("  include \"");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 14));
                expect(results).to.have.lengthOf(7);
            });
            it("Should return all file completions for directory", async function () {
                doc.addLine("  include \"b-dir/");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 19));
                expect(results).to.have.lengthOf(2);
                expect(results[0].label).to.be.equal("inc-b1.i");
                expect(results[1].label).to.be.equal("inc-b2.i");
            });
            it("Should return directory completions for include", async function () {
                doc.addLine("  include \"a-");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 14));
                expect(results).to.have.lengthOf(1);
                expect(results[0].label).to.be.equal("a-dir/");
            });
            it("Should return completions for incbin", async function () {
                doc.addLine("  incbin \"in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 14));
                expect(results).to.have.lengthOf(2);
            });
            it("Should return completions for incdir", async function () {
                doc.addLine("  incdir \"in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 14));
                expect(results).to.have.lengthOf(2);
            });
            it("Should return completions with ./ path", async function () {
                doc.addLine("  include \"./in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 16));
                expect(results).to.have.lengthOf(2);
            });
            it("Should return completions with ../ path", async function () {
                doc.addLine("  include \"../in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 17));
                expect(results).to.have.lengthOf(1);
                expect(results[0].label).to.be.equal("include-dirs/");
            });
            it("Should return a completions with an incdir instruction", async function () {
                doc.addLine("  incdir \"a-dir\"");
                doc.addLine("  include \"in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(1, 14));
                expect(results).to.have.lengthOf(5);
                expect(results[0].label).to.be.equal("inc-r1.i");
                expect(results[1].label).to.be.equal("inc-r2.i");
                expect(results[2].label).to.be.equal("inc-a1.i");
                expect(results[3].label).to.be.equal("inc-a2.i");
                expect(results[4].label).to.be.equal("inc-a3.i");
            });
            it("Should return a completion for an include file with an absolute path", async function () {
                const absPath = Path.join(PROJECT_ROOT, 'test_files', 'debug');
                const cp = new M68kCompletionItemProvider(documentationManager, state.getDefinitionHandler(), await state.getLanguage());
                doc.addLine(`  include "${absPath}`);
                const results = await cp.provideCompletionItems(doc, new Position(0, 12 + absPath.length));
                expect(results.length).to.be.equal(3);
                expect(results[0].label).to.be.equal("fs-uae/");
                expect(results[1].label).to.be.equal("gencop.s");
                expect(results[2].label).to.be.equal("hello.c");
            });
            it("Should return a completions with multiple incdir instructions", async function () {
                doc.addLine("  incdir \"a-dir\"");
                doc.addLine("  incdir \"b-dir\"");
                doc.addLine("  include \"in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(2, 14));
                expect(results).to.have.lengthOf(7);
                expect(results[0].label).to.be.equal("inc-r1.i");
                expect(results[1].label).to.be.equal("inc-r2.i");
                expect(results[2].label).to.be.equal("inc-a1.i");
                expect(results[3].label).to.be.equal("inc-a2.i");
                expect(results[4].label).to.be.equal("inc-a3.i");
                expect(results[5].label).to.be.equal("inc-b1.i");
                expect(results[6].label).to.be.equal("inc-b2.i");
            });
            it("Should use incdir instructions in other files", async function () {
                const otherSrc = Path.join(PROJECT_ROOT, 'test_files', 'include-dirs', 'adds-c-dir.s');
                await defHandler.scanFile(Uri.file(otherSrc));
                doc.addLine("  include \"in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 14));
                expect(results).to.have.lengthOf(3);
                expect(results[0].label).to.be.equal("inc-r1.i");
                expect(results[1].label).to.be.equal("inc-r2.i");
                expect(results[2].label).to.be.equal("inc-c1.i");
            });
            it("Should handle single quotes", async function () {
                doc.addLine("  incdir 'a-dir'");
                doc.addLine("  incdir 'b-dir'");
                doc.addLine("  include 'in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(2, 14));
                expect(results).to.have.lengthOf(7);
            });
            it("Should handle paths without quotes", async function () {
                doc.addLine("  incdir a-dir");
                doc.addLine("  incdir b-dir");
                doc.addLine("  include in");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(2, 13));
                expect(results).to.have.lengthOf(7);
            });
            it("Should adjust start for path segments containing word boundaries", async function () {
                doc.addLine("  include \"inc-r");
                await defHandler.scanFile(doc.uri, doc);
                const results = await completionProvider.provideCompletionItems(doc, new Position(0, 16));
                if (results[0].range && !(results[0].range instanceof vscode.Range)) {
                    expect(results[0].range.inserting.start.character).to.equal(10);
                }
            });
        });
    });
});