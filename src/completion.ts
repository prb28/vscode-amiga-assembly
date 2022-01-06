import * as vscode from 'vscode';
import { DocumentationManager, DocumentationType, isDocumentationLazy } from './documentation';
import { M68kDefinitionHandler } from './definitionHandler';
import { ASMLine } from './parser';
import { M68kLanguage } from './language';
import { FileProxy } from './fsProxy';

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

        const inst = asmLine.instruction.toLowerCase();
        const isInclude = inst === "include" || inst === "incbin" || inst === "incdir";
        
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
                    if (isInclude) {
                        completions = await this.provideCompletionForIncludes(asmLine, document, position);
                    } else {
                        // In the current symbols
                        const labels = this.definitionHandler.findLabelStartingWith(word);
                        for (const [label, symbol] of labels.entries()) {
                            const unPrefixed = label.substring(prefix.length);
                            const isLocalFQ = unPrefixed.match(/.\./);
                            if (!labelsAdded.includes(label) && !isLocalFQ) {
                                const kind = vscode.CompletionItemKind.Function;
                                const completion = new vscode.CompletionItem(unPrefixed, kind);
                                const filename = symbol.getFile().getUri().path.split("/").pop();
                                const line = symbol.getRange().start.line;
                                completion.detail =  "label " + filename + ":" + line;
                                completion.documentation = symbol.getCommentBlock();
                                completion.range = { replacing: range, inserting: range }
                                completions.push(completion);
                                labelsAdded.push(label);
                            }
                        }
                        const variables = this.definitionHandler.findVariableStartingWith(word);
                        for (const [variable, symbol] of variables.entries()) {
                            if (!labelsAdded.includes(variable)) {
                                const kind = vscode.CompletionItemKind.Variable;
                                const completion = new vscode.CompletionItem(variable, kind);
                                completion.detail = symbol.getValue();
                                completion.documentation = symbol.getCommentBlock();
                                completion.range = { replacing: range, inserting: range }
                                completions.push(completion);
                            }
                        }
                    }
                } else {
                    const macros = this.definitionHandler.findMacroStartingWith(word);
                    for (const [label, symbol] of macros.entries()) {
                        if (!labelsAdded.includes(label)) {
                            const kind = vscode.CompletionItemKind.Function;
                            const completion = new vscode.CompletionItem(label, kind);
                            completion.detail =  "macro";
                            completion.documentation = symbol.getCommentBlock();
                            completions.push(completion);
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
        } else if (isInclude) {
            // Allow completion with no input to list all files
            completions = await this.provideCompletionForIncludes(asmLine, document, position);
        }
        return completions;
    }

    private async provideCompletionsForFile(asmLine: ASMLine, document: vscode.TextDocument, incDir: FileProxy, position: vscode.Position): Promise<vscode.CompletionItem[]> {
        const documentPath = FileProxy.normalize(document.fileName);
        const completions = new Array<vscode.CompletionItem>();

        // Extend range for replacement where path component contains word boundaries
        let range = document.getWordRangeAtPosition(position);
        const line = document.lineAt(position.line);
        if (range) {
            let start = range.start.character;
            while (start > 0 && !line.text.charAt(start - 1).match(/[\s'"/]/)) {
                start--;
            }
            range = new vscode.Range(
                new vscode.Position(range.start.line, start),
                range.end
            );
        }
        
        // filtering the path from the include
        let length = position.character - asmLine.dataRange.start.character;
        let start = 0;
        if (asmLine.data.startsWith('"') || asmLine.data.startsWith("'")) {
            start = 1;
            length--;
        }

        let prefix = "";
        let filter: string | undefined;
        if (length > 0) {
            const typedPath = asmLine.data.substr(start, length);

            // Get absolute or relative path
            let newParent = incDir.getRelativeFile(typedPath);

            if (await newParent.exists() && await newParent.isDirectory()) {
                // Typed path is a directory:
                incDir = newParent;
                // Ensure parent path ends with slash
                if (!typedPath.endsWith("/")) {
                    prefix = "/";
                }
            } else {
                const normalizedTypedPath = FileProxy.normalize(typedPath);
                const pos = normalizedTypedPath.lastIndexOf("/");
                if (pos !== -1) {
                    // Typed path is a partial filename in a containing directory
                    const subPath = normalizedTypedPath.substr(0, Math.max(pos, 1));
                    // Get containing directory
                    newParent = incDir.getRelativeFile(subPath);
                    if (await newParent.exists() && await newParent.isDirectory()) {
                        incDir = newParent;
                        filter = normalizedTypedPath.substr(pos + 1);
                    } else {
                        // containing directory doesn't exist
                        return [];
                    }
                } else {
                    // Typed path is partial filename with no containing directory
                    filter = typedPath;
                }
            }
        }

        // Add completions for matching files in directory
        for (const f of await incDir.listFiles()) {
            const isCurrentDoc = documentPath === FileProxy.normalize(f.getPath());
            const isHiddenFile = f.getName().startsWith(".");
            const matchesFilter = !filter || f.getName().startsWith(filter);
            if (!isCurrentDoc && !isHiddenFile && matchesFilter) {
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
                completion.insertText = prefix + name;
                if (range) {
                    completion.range = { replacing: range, inserting: range }
                }
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
        // Root folder of worksapce
        let rootUri = vscode.workspace.getWorkspaceFolder(document.uri)?.uri
        if (!rootUri) {
            // Default to containing folder of file if not in workspace
            rootUri = new FileProxy(document.uri).getParent().getUri();
        } 
        const rootDir = new FileProxy(rootUri);
        // In root dir:
        completions = completions.concat(await this.provideCompletionsForFile(asmLine, document, rootDir, position));
        // In any of the include dirs:
        for (const [incPath] of this.definitionHandler.getIncludeDirs().entries()) {
            let incDir = rootDir.getRelativeFile(incPath);
            if (await incDir.exists() && await incDir.isDirectory()) {
                const items = await this.provideCompletionsForFile(asmLine, document, incDir, position);
                completions = completions.concat(items);
            }
        }
        return this.cleanAndReorder(completions);
    }
}
