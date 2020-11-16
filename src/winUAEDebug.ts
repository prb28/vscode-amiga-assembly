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
                try {
                    await debAdapter.gdbProxy.connect(args.serverName, args.serverPort);
                    // Loads the program
                    debAdapter.sendEvent(new OutputEvent(`Starting program: ${args.program}`));
                    await debAdapter.gdbProxy.initProgram(args.stopOnEntry);
                    await debAdapter.gdbProxy.sendAllPendingBreakpoints();
                    let thread = this.gdbProxy.getCurrentCpuThread();
                    if (thread) {
                        if (args.stopOnEntry) {
                            await debAdapter.gdbProxy.stepIn(thread);
                        } else {
                            await debAdapter.gdbProxy.continueExecution(thread);
                        }
                        debAdapter.sendResponse(response);
                    }
                } catch (err) {
                    debAdapter.sendStringErrorResponse(response, err.message);
                } finally {
                    resolve();
                }
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

    protected stepOutRequest(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments): void {
        const thread = this.gdbProxy.getThread(args.threadId);
        if (thread) {
            this.gdbProxy.stack(thread).then(async stk => {
                let frame = stk.frames[1];
                let bpArray = this.breakpointManager.createTemporaryBreakpointArray([frame.pc + 1, frame.pc + 2, frame.pc + 4]);
                await this.breakpointManager.addTemporaryBreakpointArray(bpArray).catch(err => {
                    this.sendStringErrorResponse(response, err.message);
                });
                await this.gdbProxy.continueExecution(thread).catch(err => {
                    this.sendStringErrorResponse(response, err.message);
                });
                this.sendResponse(response);
            }).catch(err => {
                this.sendStringErrorResponse(response, err.message);
            });
        } else {
            this.sendStringErrorResponse(response, "Unknown thread");
        }
    }
}
