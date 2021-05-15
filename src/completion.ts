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
    public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
        const completions = new Array<vscode.CompletionItem>();
        const range = document.getWordRangeAtPosition(position);
        const line = document.lineAt(position.line);
        const text = line.text;
        let lastChar = "";
        if (position.character > 0) {
            lastChar = line.text.charAt(position.character - 1);
        }
        const asmLine = new ASMLine(text, line);
        if (range) {
            const word = document.getText(range);
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
                        if (isInData) {
                            if (value.type === DocumentationType.INSTRUCTION) {
                                continue;
                            } else {
                                if (value.type === DocumentationType.REGISTER) {
                                    kind = vscode.CompletionItemKind.Variable;
                                } else if (word.startsWith("_LVO")) {
                                    label = "_LVO" + label;
                                }
                            }
                        } else if (value.type !== DocumentationType.INSTRUCTION) {
                            continue;
                        }
                        const completion = new vscode.CompletionItem(label, kind);
                        completion.documentation = new vscode.MarkdownString(value.description);
                        completions.push(completion);
                        labelsAdded.push(label);
                    }
                }
                if (isInData) {
                    // In the current symbols
                    const variables: Map<string, string | undefined> = this.definitionHandler.findVariableStartingWith(word);
                    for (const [variable, value] of variables.entries()) {
                        if (!labelsAdded.includes(variable)) {
                            const kind = vscode.CompletionItemKind.Variable;
                            const completion = new vscode.CompletionItem(variable, kind);
                            completion.detail = value;
                            completions.push(completion);
                        }
                    }
                }
            }
        } else if ((lastChar === ".") && asmLine.instructionRange.contains(position.translate(undefined, -1))) {
            const localRange = document.getWordRangeAtPosition(position.translate(undefined, -1));
            const word = document.getText(localRange);
            const extensions = this.language.getExtensions(word);
            if (extensions) {
                for (const ext of extensions) {
                    const completion = new vscode.CompletionItem(ext, vscode.CompletionItemKind.Unit);
                    completions.push(completion);
                }
            }
        }
        return completions;
    }
}
