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
        return new Promise((resolve) => {
            let timeoutValue = 3000;
            if (this.testMode) {
                timeoutValue = 1;
            }
            setTimeout(async () => {
                // connects to WinUAE
                try {
                    await this.gdbProxy.connect(args.serverName, args.serverPort);
                    // Loads the program
                    this.sendEvent(new OutputEvent(`Starting program: ${args.program}`));
                    await this.gdbProxy.initProgram(args.stopOnEntry);
                    await this.gdbProxy.sendAllPendingBreakpoints();
                    const thread = this.gdbProxy.getCurrentCpuThread();
                    if (thread) {
                        if (args.stopOnEntry) {
                            await this.gdbProxy.stepIn(thread);
                        } else {
                            await this.gdbProxy.continueExecution(thread);
                        }
                        this.sendResponse(response);
                    }
                } catch (err) {
                    this.sendStringErrorResponse(response, err.message);
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
                const stk = await this.gdbProxy.stack(thread);
                const frame = stk.frames[0];
                const startAddress = frame.pc;
                const endAddress = frame.pc;
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
                const stk = await this.gdbProxy.stack(thread);
                if (stk.frames.length > 0) {
                    const frame = stk.frames[1];
                    const bpArray = this.breakpointManager.createTemporaryBreakpointArray([frame.pc + 1, frame.pc + 2, frame.pc + 4]);
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
