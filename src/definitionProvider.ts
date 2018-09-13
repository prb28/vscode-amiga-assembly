import { DefinitionProvider, TextDocument, Position, CancellationToken, Location, Uri, FileSystemWatcher } from 'vscode';
import * as vscode from 'vscode';
import { SymbolFile, Symbol } from './symbols';

export class M68kDefinitionProvider implements DefinitionProvider {
    static readonly SOURCE_FILES_GLOB = "**/*.{asm,s,i,ASM,S,I}";
    private watcher: FileSystemWatcher;
    private files = new Map<Uri, SymbolFile>();
    private symbols = new Map<String, Symbol>();

    constructor() {
        this.watcher = vscode.workspace.createFileSystemWatcher(M68kDefinitionProvider.SOURCE_FILES_GLOB);
        this.watcher.onDidChange(this.scanFile);
        this.scanWorkspace();
    }
    public provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Thenable<Location> {
        return new Promise((resolve, reject) => {
            let rg = document.getWordRangeAtPosition(position);
            if (rg) {
                let label = document.getText(rg);
                let s = this.symbols.get(label);
                if (s !== undefined) {
                    return resolve(new Location(s.getFile().getUri(), s.getRange()));
                }
            }
            return reject();
        });
    }

    public scanWorkspace(): Promise<void> {
        return new Promise((resolve, reject) => {
            return vscode.workspace.findFiles(M68kDefinitionProvider.SOURCE_FILES_GLOB, null, undefined).then(filesURI => {
                let promises = [];
                for (let i = 0; i < filesURI.length; i++) {
                    promises.push(this.scanFile(filesURI[i]));
                }
                return Promise.all(promises);
            });
        });
    }

    public scanFile(uri: Uri): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let file = this.files.get(uri);
            if (file === undefined) {
                file = new SymbolFile(uri);
            }
            let sf = await file.readFile();
            if (sf) {
                let symb = sf.getDefinedSymbols();
                for (let i = 0; i < symb.length; i++) {
                    let s = symb[i];
                    this.symbols.set(s.getLabel(), s);
                }
            }
        });
    }
}

