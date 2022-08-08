import {
    BreakpointStorage,
    LaunchRequestArguments,
    WinUAEDebugSession as Base,
} from 'uae-dap';
import * as vscode from 'vscode';
import { DebugProtocol } from '@vscode/debugprotocol';
import { BreakpointStorageWorkspace } from './breakpointStorage';
import { prepareLaunchRequestArgs } from './fsUAEDebug';

export class WinUAEDebugSession extends Base {
    protected static BREAKPOINT_EVENT_SET = false;
    protected createDbgasmFiles = false;
    /** Current memory display pc */
    protected currentMemoryViewPc = -1;

    constructor() {
        super();
        // event handler to clean data breakpoints
        if (!WinUAEDebugSession.BREAKPOINT_EVENT_SET) {
            vscode.debug.onDidChangeBreakpoints((event) => {
                for (const bp of event.removed) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const dataId = (bp as any).dataId;
                    if (dataId) {
                        BreakpointStorageWorkspace.removeSizeForDataBreakpoint(
                            dataId
                        );
                    }
                }
            });
            WinUAEDebugSession.BREAKPOINT_EVENT_SET = true;
        }
    }

    protected async onCpuFrame(address: number): Promise<void> {
        super.onCpuFrame(address);
        if (address !== this.currentMemoryViewPc && this.program) {
            this.currentMemoryViewPc = address;
            const dLines = await this.program.disassemble({
                memoryReference: address.toString(),
                instructionCount: 25,
            });
            await vscode.commands.executeCommand(
                'disassembledMemory.setDisassembledMemory',
                dLines
            );
        }
    }

    protected launchRequest(
        response: DebugProtocol.LaunchResponse,
        args: LaunchRequestArguments
    ): Promise<void> {
        return super.launchRequest(response, prepareLaunchRequestArgs(args));
    }

    protected getBreakpointStorage(): BreakpointStorage {
        return new BreakpointStorageWorkspace();
    }

    protected async getDataBreakpointSize(
        id: string,
        address: string,
        variable: string
    ): Promise<number> {
        const storage = this.getBreakpointStorage();
        let size = storage.getSize(id);
        if (!size) {
            const sizeStr = await vscode.window.showInputBox(<
                vscode.InputBoxOptions
                >{
                    prompt: `Enter the size in bytes to watch starting at address '${address}' (variable: '${variable}')`,
                    value: '2',
                    validateInput: (value: string) => {
                        if (!Number.isInteger(parseInt(value))) {
                            return 'The value must be an integer.';
                        }
                        return null;
                    },
                });
            if (sizeStr) {
                size = parseInt(sizeStr);
                storage.setSize(id, size);
            }
        }
        if (!size) {
            size = 2;
        }
        return size;
    }
}
