import * as vscode from 'vscode';
import { DocumentationManager, DocumentationType } from './documentation';
import { M68kDefinitionHandler } from './definitionHandler';
import { ASMLine } from './parser';
import { M68kLanguage } from './language';

export class M68kCompletionItemProvider implements vscode.CompletionItemProvider {
    documentationManager: DocumentationManager;
    definitionHandler: M68kDefinitionHandler;
    language: M68kLanguage;
    constructor(documentationManager: DocumentationManager, definitionHandler: M68kDefinitionHandler, language: M68kLanguage) {
        this.documentationManager = documentationManager;
        this.definitionHandler = definitionHandler;
        this.language = language;
    }
    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
        return new Promise((resolve, reject) => {
            let completions = new Array<vscode.CompletionItem>();
            let range = document.getWordRangeAtPosition(position);
            let line = document.lineAt(position.line);
            let text = line.text;
            let lastChar = "";
            if (position.character > 0) {
                lastChar = line.text.charAt(position.character - 1);
            }
            let asmLine = new ASMLine(text, line);
            if (range) {
                let word = document.getText(range);
                let isInComment = (range.intersection(asmLine.commentRange) !== undefined);
                let isInInstruction = (range.intersection(asmLine.instructionRange) !== undefined);
                if ((!isInComment) && ((!isInInstruction) || ((lastChar !== ".") && (!asmLine.instruction.includes("."))))) {
                    let labelsAdded = new Array<string>();
                    let isInData = (range.intersection(asmLine.dataRange) !== undefined);
                    // In the documentation
                    let values = this.documentationManager.findKeywordStartingWith(word);
                    if (values) {
                        for (const value of values) {
                            let label = value.name;
                            let kind = vscode.CompletionItemKind.Function;
                            if (isInData) {
                                if (value.type === DocumentationType.INSTRUCTION) {
                                    continue;
                                } else {
                                    if (value.type === DocumentationType.REGISTER) {
                                        if (!isInData) {
                                            continue;
                                        }
                                        kind = vscode.CompletionItemKind.Variable;
                                    } else if (word.startsWith("_LVO")) {
                                        label = "_LVO" + label;
                                    }
                                }
                            } else if (value.type !== DocumentationType.INSTRUCTION) {
                                continue;
                            }
                            let completion = new vscode.CompletionItem(label, kind);
                            completion.documentation = new vscode.MarkdownString(value.description);
                            completions.push(completion);
                            labelsAdded.push(label);
                        }
                    }
                    if (isInData) {
                        // In the current symbols
                        let variables: Map<string, string | undefined> = this.definitionHandler.findVariableStartingWith(word);
                        for (const [variable, value] of variables.entries()) {
                            if (!labelsAdded.includes(variable)) {
                                let kind = vscode.CompletionItemKind.Variable;
                                let completion = new vscode.CompletionItem(variable, kind);
                                completion.detail = value;
                                completions.push(completion);
                            }
                        }
                    }
                }
            } else if ((lastChar === ".") && asmLine.instructionRange.contains(position.translate(undefined, -1))) {
                let localRange = document.getWordRangeAtPosition(position.translate(undefined, -1));
                let word = document.getText(localRange);
                let extensions = this.language.getExtensions(word);
                if (extensions) {
                    for (let ext of extensions) {
                        let completion = new vscode.CompletionItem(ext, vscode.CompletionItemKind.Unit);
                        completions.push(completion);
                    }
                }
            }
            resolve(completions);
        });
    }
}
