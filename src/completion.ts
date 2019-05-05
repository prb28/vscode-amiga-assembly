import * as vscode from 'vscode';
import { DocumentationManager, DocumentationRegister, DocumentationInstruction } from './documentation';
import { M68kDefinitionHandler } from './definitionHandler';
import { ASMLine } from './parser';

export class M68kCompletionItemProvider implements vscode.CompletionItemProvider {
    documentationManager: DocumentationManager;
    definitionHandler: M68kDefinitionHandler;
    constructor(documentationManager: DocumentationManager, definitionHandler: M68kDefinitionHandler) {
        this.documentationManager = documentationManager;
        this.definitionHandler = definitionHandler;
    }
    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
        return new Promise((resolve, reject) => {
            let completions = new Array<vscode.CompletionItem>();
            let range = document.getWordRangeAtPosition(position);
            if (range) {
                let line = document.lineAt(range.start.line);
                let text = line.text;
                let asmLine = new ASMLine(text, line);
                let word = document.getText(range);
                let isInComment = (range.intersection(asmLine.commentRange) !== undefined);
                let isInInstruction = (range.intersection(asmLine.instructionRange) !== undefined);
                let lastChar = "";
                if (text.length > position.character + 1) {
                    lastChar = line.text.charAt(position.character + 1);
                }
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
                                if (value instanceof DocumentationInstruction) {
                                    continue;
                                } else {
                                    if (value instanceof DocumentationRegister) {
                                        if (!isInData) {
                                            continue;
                                        }
                                        kind = vscode.CompletionItemKind.Variable;
                                    } else if (word.startsWith("_LVO")) {
                                        label = "_LVO" + label;
                                    }
                                }
                            } else if (!(value instanceof DocumentationInstruction)) {
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
            }
            resolve(completions);
        });
    }
}
