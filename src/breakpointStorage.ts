import { ExtensionState } from './extension';

/**
 * Persistent implementation of DataBreakpointSizes
 * Stores user entered sizes of data breakpoints in workspace storage, keyed by dataId
 */
export class DataBreakpointSizesStorage {
    private PREFIX = 'amiga.assembly.dataBreakpointsList.';

    public set(id: string, size: number): void {
        this.workspaceState()?.update(this.PREFIX + id, size);
    }
    public get(id: string): number | undefined {
        return this.workspaceState()?.get(this.PREFIX + id);
    }
    public delete(id: string): void {
        this.workspaceState()?.update(this.PREFIX + id, undefined);
    }
    public clear(): void {
        this.workspaceState()
            ?.keys()
            .filter((k) => k.startsWith(this.PREFIX))
            .map((k) => {
                this.workspaceState()?.update(k, undefined);
            });
    }
    private workspaceState() {
        return ExtensionState.getCurrent().getExtensionContext()
            ?.workspaceState;
    }
}
