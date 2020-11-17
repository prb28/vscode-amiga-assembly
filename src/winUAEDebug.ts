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

    protected async nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): Promise<void> {
        const thread = this.gdbProxy.getThread(args.threadId);
        if (thread) {
            try {
                let stk = await this.gdbProxy.stack(thread);
                let frame = stk.frames[0];
                let startAddress = frame.pc;
                let endAddress = frame.pc;
                await this.gdbProxy.stepToRange(thread, startAddress, endAddress);
                this.sendResponse(response);
            } catch (err) {
                this.sendStringErrorResponse(response, err.message);
            }
        } else {
            this.sendStringErrorResponse(response, "Unknown thread");
        }
    }

    protected async stepOutRequest(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments): Promise<void> {
        const thread = this.gdbProxy.getThread(args.threadId);
        if (thread) {
            try {
                let stk = await this.gdbProxy.stack(thread);
                if (stk.frames.length > 0) {
                    let frame = stk.frames[1];
                    let bpArray = this.breakpointManager.createTemporaryBreakpointArray([frame.pc + 1, frame.pc + 2, frame.pc + 4]);
                    await this.breakpointManager.addTemporaryBreakpointArray(bpArray);
                    await this.gdbProxy.continueExecution(thread);
                    this.sendResponse(response);
                } else {
                    this.sendStringErrorResponse(response, "No frame to step out");
                }
            } catch (err) {
                this.sendStringErrorResponse(response, err.message);
            }
        } else {
            this.sendStringErrorResponse(response, "Unknown thread");
        }
    }
}
