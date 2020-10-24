import {
    OutputEvent
} from 'vscode-debugadapter/lib/main';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { GdbProxyWinUAE } from './gdbProxyWinUAE';
import { LaunchRequestArguments, FsUAEDebugSession } from './fsUAEDebug';
import { GdbProxy } from './gdbProxy';


export class WinUAEDebugSession extends FsUAEDebugSession {
    protected createGdbProxy(): GdbProxy {
        return new GdbProxyWinUAE(undefined);
    }

    protected async connect(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): Promise<void> {
        return new Promise(async (resolve) => {
            // temp to use in timeout
            let debAdapter = this;

            let timeoutValue = 3000;
            if (this.testMode) {
                timeoutValue = 1;
            }
            setTimeout(async () => {
                // connects to WinUAE
                await debAdapter.gdbProxy.connect(args.serverName, args.serverPort).then(async () => {
                    // Loads the program
                    debAdapter.sendEvent(new OutputEvent(`Starting program: ${args.program}`));
                    await debAdapter.gdbProxy.initProgram(args.stopOnEntry).then(async () => {
                        await debAdapter.gdbProxy.sendAllPendingBreakpoints().catch(err => {
                            debAdapter.sendStringErrorResponse(response, err.message);
                        });
                        let thread = this.gdbProxy.getCurrentCpuThread();
                        if (thread) {
                            await debAdapter.gdbProxy.continueExecution(thread).then(() => {
                                debAdapter.sendResponse(response);
                            }).catch(err => {
                                debAdapter.sendStringErrorResponse(response, err.message);
                            });
                        }
                    }).catch(err => {
                        debAdapter.sendStringErrorResponse(response, err.message);
                    });
                }).catch(err => {
                    debAdapter.sendStringErrorResponse(response, err.message);
                });
                resolve();
            }, timeoutValue);
        });
    }

    protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
        const thread = this.gdbProxy.getThread(args.threadId);
        if (thread) {
            this.gdbProxy.stack(thread).then(async stk => {
                let frame = stk.frames[0];
                let startAddress = frame.pc;
                let endAddress = frame.pc;
                this.gdbProxy.stepToRange(thread, startAddress, endAddress).then(() => {
                    this.sendResponse(response);
                }).catch(err => {
                    this.sendStringErrorResponse(response, err.message);
                });
            }).catch(err => {
                this.sendStringErrorResponse(response, err.message);
            });
        } else {
            this.sendStringErrorResponse(response, "Unknown thread");
        }
    }
}