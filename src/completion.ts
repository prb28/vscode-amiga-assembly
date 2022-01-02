import * as vscode from 'vscode';
import { DocumentationManager, DocumentationType, isDocumentationLazy } from './documentation';
import { M68kDefinitionHandler } from './definitionHandler';
import { ASMLine } from './parser';
import { M68kLanguage } from './language';
import { FileProxy } from './fsProxy';
import { Uri } from 'vscode';

export class M68kCompletionItemProvider implements vscode.CompletionItemProvider {
    documentationManager: DocumentationManager;
    definitionHandler: M68kDefinitionHandler;
    language: M68kLanguage;
    constructor(documentationManager: DocumentationManager, definitionHandler: M68kDefinitionHandler, language: M68kLanguage) {
        this.documentationManager = documentationManager;
        this.definitionHandler = definitionHandler;
        this.language = language;
    }
    public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
        let completions = new Array<vscode.CompletionItem>();
        let range = document.getWordRangeAtPosition(position);
        const line = document.lineAt(position.line);
        const text = line.text;
        let lastChar = "";
        if (position.character > 0) {
            lastChar = line.text.charAt(position.character - 1);
        }
        const asmLine = new ASMLine(text, line);
        if (range) {
            let prefix = "";
            if (line.text.charAt(range.start.character -1) === ".") {
                // Extend range to include leading dot
                range = new vscode.Range(
                    new vscode.Position(range.start.line, range.start.character - 1),
                    range.end
                );
                // Find previous global label
                for (let i = range.start.line; i >= 0; i--) {
                    const match = document.lineAt(i).text.match(/^(\w+)\b/);
                    if (match) {
                        prefix = match[0];
                        break;
                    }
                }
            }
            const word = prefix + document.getText(range);
            const isInComment = (range.intersection(asmLine.commentRange) !== undefined);
            const isInInstruction = (range.intersection(asmLine.instructionRange) !== undefined);
            if ((!isInComment) && ((!isInInstruction) || ((lastChar !== ".") && (!asmLine.instruction.includes("."))))) {
                const labelsAdded = new Array<string>();
                const isInData = (range.intersection(asmLine.dataRange) !== undefined);
                // In the documentation
                const values = await this.documentationManager.findKeywordStartingWith(word);
                if (values) {
                    for (const value of values) {
                        let label = value.name;
                        let kind = vscode.CompletionItemKind.Function;
                        const isMnemonic = value.type === DocumentationType.INSTRUCTION || value.type === DocumentationType.DIRECTIVE
                        if (isInData) {
                            if (isMnemonic) {
                                continue;
                            } else {
                                if (value.type === DocumentationType.REGISTER || value.type === DocumentationType.CPU_REGISTER) {
                                    if (word[0] === word[0].toLowerCase()) {
                                        label = label.toLowerCase()
                                    }
                                    kind = vscode.CompletionItemKind.Variable;
                                } else if (word.startsWith("_LVO")) {
                                    label = "_LVO" + label;
                                }
                            }
                        } else {
                            if (!isMnemonic) {
                                continue;
                            }
                            if (word[0] === word[0].toUpperCase()) {
                                label = label.toUpperCase()
                            }
                        }
                        if (isDocumentationLazy(value)) {
                            await value.loadDescription();
                        }
                        const completion = new vscode.CompletionItem(label, kind);
                        completion.detail = value.detail;
                        completion.documentation = new vscode.MarkdownString(value.description);
                        completions.push(completion);
                        labelsAdded.push(label);
                    }
                }
                if (isInData) {
                    // Look for the include instruction
                    if (asmLine.instruction.toLowerCase() === "include") {
                        completions = await this.provideCompletionForIncludes(asmLine, document, position);
                    } else {
                        // In the current symbols
                        const labels = this.definitionHandler.findLabelStartingWith(word);
                        for (const [label, symbol] of labels.entries()) {
                            if (!labelsAdded.includes(label)) {
                                const kind = vscode.CompletionItemKind.Function;
                                const completion = new vscode.CompletionItem(label.substring(prefix.length), kind);
                                const filename = symbol.getFile().getUri().path.split("/").pop();
                                const line = symbol.getRange().start.line;
                                completion.detail =  "label " + filename + ":" + line;
                                completion.range = { replacing: range, inserting: range }
                                completions.push(completion);
                                labelsAdded.push(label);
                            }
                        }
                        const variables: Map<string, string | undefined> = this.definitionHandler.findVariableStartingWith(word);
                        for (const [variable, value] of variables.entries()) {
                            if (!labelsAdded.includes(variable)) {
                                const kind = vscode.CompletionItemKind.Variable;
                                const completion = new vscode.CompletionItem(variable, kind);
                                completion.detail = value;
                                completion.range = { replacing: range, inserting: range }
                                completions.push(completion);
                            }
                        }
                    }
                } else {
                    const macros = this.definitionHandler.findMacroStartingWith(word);
                    for (const [label] of macros.entries()) {
                        if (!labelsAdded.includes(label)) {
                            const kind = vscode.CompletionItemKind.Function;
                            const completion = new vscode.CompletionItem(label, kind);
                            completion.detail =  "macro";
                            completions.push(completion);
                            labelsAdded.push(label);
                        }
                    }
                }
            }
        } else if ((lastChar === ".") && asmLine.instructionRange.contains(position.translate(undefined, -1))) {
            const localRange = document.getWordRangeAtPosition(position.translate(undefined, -1));
            const word = document.getText(localRange);
            const extensions = this.language.getExtensions(word.toLowerCase());
            const isUpper = word === word.toUpperCase();
            if (extensions) {
                for (let ext of extensions) {
                    const text = isUpper ? ext.toUpperCase() : ext;
                    const completion = new vscode.CompletionItem(text, vscode.CompletionItemKind.Unit);
                    completions.push(completion);
                }
            }
        }
        return completions;
    }

    private async retrieveIncludeDir(documentFile: FileProxy): Promise<FileProxy | undefined> {
        let includeDir: FileProxy | undefined;
        if (await documentFile.exists()) {
            const includeDirInSource = await this.definitionHandler.getIncludeDir(documentFile.getUri());
            if (includeDirInSource) {
                let incDirFile = new FileProxy(Uri.file(includeDirInSource));
                if (await incDirFile.exists() && await incDirFile.isDirectory()) {
                    includeDir = incDirFile
                } else {
                    // May be a relative path to the current
                    incDirFile = documentFile.getParent().getRelativeFile(includeDirInSource);
                    if (await incDirFile.exists() && await incDirFile.isDirectory()) {
                        includeDir = incDirFile
                    }
                }
            }
        }
        return includeDir;
    }

    private async provideCompletionsForFile(asmLine: ASMLine, documentFile: FileProxy, parent: FileProxy, position: vscode.Position, checkAbsolute: boolean): Promise<vscode.CompletionItem[]> {
        const documentPath = FileProxy.normalize(documentFile.getPath());
        const completions = new Array<vscode.CompletionItem>();
        // filtering the path from the include
        let length = position.character - asmLine.dataRange.start.character;
        let start = 0;
        if (asmLine.data.startsWith("\"")) {
            start = 1;
            length--;
        }
        let filter: string | undefined;
        if (length > 0) {
            const typedPath = asmLine.data.substr(start, length);
            // check for an absolute path
            let newParent = new FileProxy(Uri.file(FileProxy.normalize(typedPath)));
            if (checkAbsolute && await newParent.exists() && await newParent.isDirectory()) {
                parent = newParent;
            } else {
                // check for a relative path
                newParent = parent.getRelativeFile(typedPath);
                if (await newParent.exists() && await newParent.isDirectory()) {
                    parent = newParent;
                } else {
                    // check for relative path with filename
                    const normalizedTypedPath = FileProxy.normalize(typedPath);
                    const pos = normalizedTypedPath.lastIndexOf("/");
                    if (pos > 0) {
                        const subPath = normalizedTypedPath.substr(0, pos);
                        newParent = parent.getRelativeFile(subPath);
                        if (await newParent.exists() && await newParent.isDirectory()) {
                            parent = newParent;
                            filter = normalizedTypedPath.substr(pos + 1);
                        } else {
                            filter = typedPath;
                        }
                    } else {
                        filter = typedPath;
                    }
                }
            }
        }
        for (const f of await parent.listFiles()) {
            if (documentPath !== FileProxy.normalize(f.getPath()) && (!filter || f.getName().startsWith(filter)) && !f.getName().startsWith(".")) {
                // search for the files
                let kind = vscode.CompletionItemKind.File;
                let name = f.getName();
                let sortText = `B${name}`;
                if (await f.isDirectory()) {
                    kind = vscode.CompletionItemKind.Folder;
                    name += "/";
                    sortText = `A${name}`;
                }
                const completion = new vscode.CompletionItem(name, kind);
                completion.sortText = sortText;
                completions.push(completion);
            }
        }
        return completions;
    }

    private cleanAndReorder(completions: vscode.CompletionItem[]): vscode.CompletionItem[] {
        const fileMap = new Map<string, vscode.CompletionItem>();
        for (const c of completions) {
            fileMap.set(c.label.toString(), c);
        }
        return Array.from(fileMap.values());
    }

    private async provideCompletionForIncludes(asmLine: ASMLine, document: vscode.TextDocument, position: vscode.Position): Promise<vscode.CompletionItem[]> {
        let completions = new Array<vscode.CompletionItem>();
        // current folder of the document
        const fp = new FileProxy(document.uri);
        const includeDir: FileProxy | undefined = await this.retrieveIncludeDir(fp);
        if (includeDir) {
            completions = await this.provideCompletionsForFile(asmLine, fp, includeDir, position, false);
        }
        completions = completions.concat(await this.provideCompletionsForFile(asmLine, fp, fp.getParent(), position, true));
        return this.cleanAndReorder(completions);
    }
}
