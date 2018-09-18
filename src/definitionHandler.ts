import { DefinitionProvider, TextDocument, Position, CancellationToken, Location, Uri, FileSystemWatcher, ReferenceProvider, ReferenceContext, ProviderResult } from 'vscode';
import * as vscode from 'vscode';
import { SymbolFile, Symbol } from './symbols';

export class M68kDefinitionHandler implements DefinitionProvider, ReferenceProvider {
    static readonly SOURCE_FILES_GLOB = "**/*.{asm,s,i,ASM,S,I}";
    private watcher: FileSystemWatcher;
    private files = new Map<string, SymbolFile>();
    private definedSymbols = new Map<String, Symbol>();
    private referedSymbols = new Map<string, Map<String, Array<Symbol>>>();

    constructor() {
        this.watcher = vscode.workspace.createFileSystemWatcher(M68kDefinitionHandler.SOURCE_FILES_GLOB);
        this.watcher.onDidChange(this.scanFile);
        this.scanWorkspace();
    }
    public provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Thenable<Location> {
        return new Promise(async (resolve, reject) => {
            let rg = document.getWordRangeAtPosition(position);
            if (rg) {
                await this.scanFile(document.uri, document);
                let label = document.getText(rg);
                let s = this.definedSymbols.get(label);
                if (s !== undefined) {
                    return resolve(new Location(s.getFile().getUri(), s.getRange()));
                }
            }
            return reject();
        });
    }

    public provideReferences(document: TextDocument, position: Position, context: ReferenceContext, token: CancellationToken): ProviderResult<Location[]> {
        return new Promise(async (resolve, reject) => {
            let rg = document.getWordRangeAtPosition(position);
            if (rg) {
                await this.scanFile(document.uri, document);
                let label = document.getText(rg);
                let locations = new Array<Location>();
                for (let refs of this.referedSymbols) {
                    let symbs = refs[1].get(label);
                    if (symbs !== undefined) {
                        for (let i = 0; i < symbs.length; i++) {
                            let s = symbs[i];
                            locations.push(new Location(s.getFile().getUri(), s.getRange()));
                        }
                    }
                }
                resolve(locations);
            }
            return reject();
        });
    }

    public scanWorkspace(): Promise<void> {
        return new Promise((resolve, reject) => {
            return vscode.workspace.findFiles(M68kDefinitionHandler.SOURCE_FILES_GLOB, null, undefined).then(filesURI => {
                let promises = [];
                for (let i = 0; i < filesURI.length; i++) {
                    promises.push(this.scanFile(filesURI[i]));
                }
                return Promise.all(promises);
            });
        });
    }

    public scanFile(uri: Uri, document: TextDocument | undefined = undefined): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let file = this.files.get(uri.fsPath);
            if (file === undefined) {
                file = new SymbolFile(uri);
                this.files.set(uri.fsPath, file);
            }
            if (document) {
                file.readDocument(document);
            } else {
                file.readFile().catch(err => {
                    reject(err);
                    return;
                });
            }
            let symb = file.getDefinedSymbols();
            for (let i = 0; i < symb.length; i++) {
                let s = symb[i];
                this.definedSymbols.set(s.getLabel(), s);
            }
            this.referedSymbols.delete(uri.fsPath);
            let refs = new Map<String, Array<Symbol>>();
            symb = file.getReferedSymbols();
            for (let i = 0; i < symb.length; i++) {
                let s = symb[i];
                let label = s.getLabel();
                let lst = refs.get(label);
                if (lst === undefined) {
                    lst = new Array<Symbol>();
                    refs.set(label, lst);
                }
                lst.push(s);
            }
            this.referedSymbols.set(uri.fsPath, refs);
            resolve();
        });
    }
}

