import {
    OutputEvent
} from 'vscode-debugadapter/lib/main';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { GdbProxyWinUAE } from './gdbProxyWinUAE';
import { LaunchRequestArguments, FsUAEDebugSession } from './fsUAEDebug';
import { GdbProxy } from './gdbProxy';
import { InputBoxOptions, window } from 'vscode';
import { VariableFormatter } from './variableFormatter';


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

    protected async getVariableAsDisplayed(variableName: string): Promise<string> {
        const value = await this.getVariableValueAsNumber(variableName);
        let formatter = this.variableFormatterMap.get(variableName);
        if (!formatter) {
            formatter = VariableFormatter.HEXADECIMAL_FORMATTER;
        }
        return formatter.format(value);
    }

    protected async dataBreakpointInfoRequest(response: DebugProtocol.DataBreakpointInfoResponse, args: DebugProtocol.DataBreakpointInfoArguments): Promise<void> {
        if (args.variablesReference !== undefined && args.name) {
            const id = this.variableHandles.get(args.variablesReference);
            if (id && (id.startsWith(WinUAEDebugSession.PREFIX_SYMBOLS) || id.startsWith(WinUAEDebugSession.PREFIX_REGISTERS))) {
                const variableName = args.name;
                const displayValue = await this.getVariableAsDisplayed(variableName);
                this.breakpointManager.populateDataBreakpointInfoResponseBody(response, variableName, displayValue, id.startsWith(WinUAEDebugSession.PREFIX_REGISTERS));
            }
        }
        this.sendResponse(response);
    }

    protected async setDataBreakpointsRequest(response: DebugProtocol.SetDataBreakpointsResponse, args: DebugProtocol.SetDataBreakpointsArguments): Promise<void> {
        const debugBreakPoints = new Array<DebugProtocol.Breakpoint>();
        // clear all breakpoints for this file
        await this.breakpointManager.clearDataBreakpoints();
        // set and verify breakpoint locations
        if (args.breakpoints) {
            for (const reqBp of args.breakpoints) {
                const [variableName, displayValue, value] = this.breakpointManager.parseDataIdAddress(reqBp.dataId);
                let size = this.breakpointManager.getSizeForDataId(reqBp.dataId);
                if (!size) {
                    const sizeStr = await window.showInputBox(<InputBoxOptions>{
                        prompt: `Enter the size in bytes to watch starting at address '${displayValue}' (variable: '${variableName}')`,
                        value: "2",
                        validateInput: (value: string) => {
                            if (!Number.isInteger(parseInt(value))) {
                                return "The value must be an integer.";
                            }
                            return null;
                        }
                    });
                    if (sizeStr) {
                        size = parseInt(sizeStr);
                        this.breakpointManager.setSizeForDataId(reqBp.dataId, size);
                    }
                }
                if (!size) {
                    size = 2;
                }
                const debugBp = this.breakpointManager.createDataBreakpoint(value, size, reqBp.accessType, `${size} bytes watched starting at ${displayValue}`);
                try {
                    const modifiedBp = await this.breakpointManager.setBreakpoint(debugBp);
                    debugBreakPoints.push(modifiedBp);
                } catch (err) {
                    debugBreakPoints.push(debugBp);
                }
                // send back the actual breakpoint positions
                response.body = {
                    breakpoints: debugBreakPoints
                };
                response.success = true;
            }
        }
        this.sendResponse(response);
    }
}
