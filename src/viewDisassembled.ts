import * as vscode from 'vscode';
import { DebugProtocol } from 'vscode-debugprotocol';
import { ASMLine } from './parser';

export class DisassembledMemoryDataProvider implements vscode.TreeDataProvider<ViewLineItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ViewLineItem | undefined> = new vscode.EventEmitter<ViewLineItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<ViewLineItem | undefined> = this._onDidChangeTreeData.event;
    private currentValues?: Array<ViewLineItem>;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: ViewLineItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ViewLineItem): Promise<ViewLineItem[]> {
        if (!element && this.currentValues) {
            return this.currentValues;
        } else {
            return [];
        }
    }
    setDisassembledMemory(memory: DebugProtocol.DisassembledInstruction[]): void {
        this.currentValues = new Array<ViewLineItem>();
        for (const dl of memory) {
            const address = dl.address;
            const asmLine = new ASMLine(` ${dl.instruction}`);
            const label = `${asmLine.instruction}  ${asmLine.data}`;
            const item = new ViewLineItem(`${address}: ${label}`);
            if (dl.instructionBytes) {
                item.description = dl.instructionBytes;
            }
            this.currentValues.push(item);
        }
        this.refresh();
    }
}

export class ViewLineItem extends vscode.TreeItem {
    public description = "";

    constructor(label: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
    }

    getDescription(): string {
        return this.description;
    }
}
