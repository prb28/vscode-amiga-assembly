import { BreakpointsChangeEvent } from 'vscode';
import { DebugProtocol } from '@vscode/debugprotocol';
import { ExtensionState } from './extension';
import winston = require('winston');
import { BreakpointStorage } from 'uae-dap';

export class BreakpointStorageWorkspace implements BreakpointStorage {
    /** Storage prefix for keys*/
    static readonly STORAGE_PREFIX = 'amiga.assembly';
    /** Storage prefix for keys*/
    static readonly STORAGE_DATA_LIST = `${BreakpointStorageWorkspace.STORAGE_PREFIX}.dataBreakpointsList`;

    static storedDataBreakpointsList: string[] | undefined;

    public setSize(bpId: string, size: number) {
        const id = BreakpointStorageWorkspace.getDataBreakpointStorageId(bpId);
        winston.info(
            `[BreakpointStorageWorkspace] SET size of DataBreakpoint id: ${id}=${size}`
        );
        ExtensionState.getCurrent()
            .getExtensionContext()
            ?.workspaceState.update(id, size);
        BreakpointStorageWorkspace.addStoredDataBreakpoints(id);
    }

    public getSize(bpId: string): number | undefined {
        const id = BreakpointStorageWorkspace.getDataBreakpointStorageId(bpId);
        const size = ExtensionState.getCurrent()
            .getExtensionContext()
            ?.workspaceState.get<number>(id);
        winston.info(
            `[BreakpointStorageWorkspace] GET size of DataBreakpoint id: ${id}=${size}`
        );
        return size;
    }

    public clear() {
        BreakpointStorageWorkspace.loadStoredDataBreakpoints();
        if (BreakpointStorageWorkspace.storedDataBreakpointsList) {
            for (const id of BreakpointStorageWorkspace.storedDataBreakpointsList) {
                BreakpointStorageWorkspace.removeSizeForDataBreakpoint(
                    id,
                    true
                );
            }
            ExtensionState.getCurrent()
                .getExtensionContext()
                ?.workspaceState.update(
                    BreakpointStorageWorkspace.STORAGE_DATA_LIST,
                    undefined
                );
            BreakpointStorageWorkspace.storedDataBreakpointsList =
                new Array<string>();
        }
    }

    public static removeStoredDataBreakpoints(id: string) {
        if (BreakpointStorageWorkspace.storedDataBreakpointsList) {
            BreakpointStorageWorkspace.storedDataBreakpointsList =
                BreakpointStorageWorkspace.storedDataBreakpointsList?.filter(
                    (k) => k !== id
                );
            BreakpointStorageWorkspace.saveStoredDataBreakpoints(
                BreakpointStorageWorkspace.storedDataBreakpointsList
            );
        }
    }

    public static removeSizeForDataBreakpoint(
        bpId: string,
        skipStoringList?: boolean
    ) {
        const id = BreakpointStorageWorkspace.getDataBreakpointStorageId(bpId);
        winston.info(
            `[BreakpointStorageWorkspace] Removing DataBreakpoint id: ${id}`
        );
        ExtensionState.getCurrent()
            .getExtensionContext()
            ?.workspaceState.update(id, undefined);
        if (!skipStoringList) {
            BreakpointStorageWorkspace.removeStoredDataBreakpoints(id);
        }
    }

    public static loadStoredDataBreakpoints() {
        if (!BreakpointStorageWorkspace.storedDataBreakpointsList) {
            BreakpointStorageWorkspace.storedDataBreakpointsList =
                ExtensionState.getCurrent()
                    .getExtensionContext()
                    ?.workspaceState.get<Array<string>>(
                        BreakpointStorageWorkspace.STORAGE_DATA_LIST
                    );
            if (!BreakpointStorageWorkspace.storedDataBreakpointsList) {
                BreakpointStorageWorkspace.storedDataBreakpointsList =
                    new Array<string>();
            }
            winston.info(
                '[BreakpointStorageWorkspace] Loading data breakpoints keys'
            );
            for (const k of BreakpointStorageWorkspace.storedDataBreakpointsList) {
                winston.info(
                    `[BreakpointStorageWorkspace] index breakpoint : ${k}`
                );
            }
        }
    }

    private static saveStoredDataBreakpoints(list: Array<string>) {
        ExtensionState.getCurrent()
            .getExtensionContext()
            ?.workspaceState.update(
                BreakpointStorageWorkspace.STORAGE_DATA_LIST,
                list
            );
        winston.info(
            '[BreakpointStorageWorkspace] Saving data breakpoints keys'
        );
        for (const k of list) {
            winston.info(
                `[BreakpointStorageWorkspace] index breakpoint : ${k}`
            );
        }
    }

    public static addStoredDataBreakpoints(id: string) {
        if (!BreakpointStorageWorkspace.storedDataBreakpointsList) {
            BreakpointStorageWorkspace.storedDataBreakpointsList =
                new Array<string>();
        }
        if (
            !BreakpointStorageWorkspace.storedDataBreakpointsList.includes(id)
        ) {
            BreakpointStorageWorkspace.storedDataBreakpointsList.push(id);
        }
        BreakpointStorageWorkspace.saveStoredDataBreakpoints(
            BreakpointStorageWorkspace.storedDataBreakpointsList
        );
    }

    public static getDataBreakpointStorageId(id: string): string {
        if (id.startsWith(BreakpointStorageWorkspace.STORAGE_PREFIX)) {
            return id;
        }
        return `${BreakpointStorageWorkspace.STORAGE_PREFIX}.${id}`;
    }

    public static getStoredDataBreakpointsList(): Array<string> | undefined {
        return BreakpointStorageWorkspace.storedDataBreakpointsList;
    }

    private static instanceOfDataBreakpoint(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        object: any
    ): object is DebugProtocol.DataBreakpoint {
        return 'dataId' in object;
    }

    public static onDidChangeBreakpoints(event: BreakpointsChangeEvent) {
        for (const bp of event.removed) {
            if (BreakpointStorageWorkspace.instanceOfDataBreakpoint(bp)) {
                BreakpointStorageWorkspace.removeSizeForDataBreakpoint(
                    bp.dataId
                );
            }
        }
    }
}
