import {
    InitializedEvent, TerminatedEvent, BreakpointEvent,
    Thread, StackFrame, Scope, Source, Handles, DebugSession, OutputEvent, ContinuedEvent
} from 'vscode-debugadapter/lib/main';
import * as vscode from 'vscode';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { basename } from 'path';
import { GdbProxy } from './gdbProxy';
import { GdbRegister, Segment, GdbHaltStatus, GdbAmigaSysThreadId } from './gdbProxyCore';
import { ExecutorHelper } from './execHelper';
import { CancellationTokenSource, workspace, window, Uri } from 'vscode';
import { DebugInfo } from './debugInfo';
import { Capstone } from './capstone';
import { DebugVariableResolver } from './debugVariableResolver';
import { DebugExpressionHelper } from './debugExpressionHelper';
import { DebugDisassembledManager, DisassembleAddressArguments } from './debugDisassembled';
import { StringUtils } from './stringUtils';
import { MemoryLabelsRegistry } from './customMemoryAddresses';
import { BreakpointManager, GdbBreakpoint } from './breakpointManager';
import { CopperDisassembler } from './copperDisassembler';
import { FileProxy } from './fsProxy';
const { Subject } = require('await-notify');


/**
 * This interface describes the mock-debug specific launch attributes
 * (which are not part of the Debug Adapter Protocol).
 * The schema for these attributes lives in the package.json of the mock-debug extension.
 * The interface should always match this schema.
 */
export interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
    /** An absolute path to the "program" to debug. */
    program: string;
    /** Automatically stop target after launch. If not specified, target does not stop. */
    stopOnEntry?: boolean;
    /** enable logging the Debug Adapter Protocol */
    trace?: boolean;
    /** Name of the server */
    serverName: string;
    /** Port of the server */
    serverPort: number;
    /** Start emulator */
    startEmulator: boolean;
    /** emulator program */
    emulator?: string;
    /** emulator working directory */
    emulatorWorkingDir?: string;
    /** Emulator options */
    options: Array<string>;
    /** path replacements for source files */
    sourceFileMap?: Object;
    /** root paths for sources */
    rootSourceFileMap?: Array<string>;
    /** Build the workspace before debug */
    buildWorkspace?: boolean;
}

export class FsUAEDebugSession extends DebugSession implements DebugVariableResolver {
    // a Mock runtime (or debugger)
    private variableHandles = new Handles<string>();

    /** Configuration object */
    private configurationDone = new Subject();

    /** Proxy to Gdb */
    private gdbProxy: GdbProxy;

    /** Variables references map */
    private variableRefMap = new Map<number, DebugProtocol.Variable[]>();

    /** Variables expression map */
    private variableExpressionMap = new Map<string, number>();

    /** All the symbols in the file */
    private symbolsMap = new Map<string, number>();

    /** Test mode activated */
    private testMode = false;

    /** Executor to run fs-uae */
    private executor: ExecutorHelper;

    /** Token to cancel the emulator */
    private cancellationTokenSource?: CancellationTokenSource;

    /** Debug information for the loaded program */
    private debugInfo?: DebugInfo;

    /** Tool to disassemble */
    private capstone?: Capstone;

    /** Cache for disassembled code */
    private disassembledCache = new Map<number, string>();

    /** Cache for disassembled code */
    private disassembledCopperCache = new Map<number, string>();

    /** Helper class to deal with the debug expressions */
    private debugExpressionHelper = new DebugExpressionHelper();

    /** Manager of disassembled code */
    private debugDisassembledManager: DebugDisassembledManager;

    /** Breakpoint manager */
    private breakpointManager: BreakpointManager;

    /** Current memory display pc */
    private currentMemoryViewPc = -1;

    /** trace the communication protocol */
    private trace: boolean = false;

	/**
	 * Creates a new debug adapter that is used for one debug session.
	 * We configure the default implementation of a debug adapter here.
	 */
    public constructor() {
        super();
        // this debugger uses zero-based lines and columns
        this.setDebuggerLinesStartAt1(false);
        this.setDebuggerColumnsStartAt1(false);
        this.gdbProxy = new GdbProxy(undefined);
        this.initProxy();
        this.executor = new ExecutorHelper();
        this.debugDisassembledManager = new DebugDisassembledManager(this.gdbProxy, undefined, this);
        this.breakpointManager = new BreakpointManager(this.gdbProxy, this.debugDisassembledManager);
    }

	/**
	 * Setting the context to run the tests.
	 * @param gdbProxy mocked proxy
	 * @param executor mocked executor
	 * @param capstone mocked capstone
	 */
    public setTestContext(gdbProxy: GdbProxy, executor: ExecutorHelper, capstone: Capstone) {
        this.executor = executor;
        this.gdbProxy = gdbProxy;
        this.initProxy();
        this.testMode = true;
        this.capstone = capstone;
        this.debugDisassembledManager = new DebugDisassembledManager(gdbProxy, capstone, this);
        this.breakpointManager = new BreakpointManager(this.gdbProxy, this.debugDisassembledManager);
    }

    /**
     * Creates a stop event
     */
    private crateStoppedEvent(threadId: number, reason: string, preserveFocusHint?: boolean): DebugProtocol.StoppedEvent {
        return <DebugProtocol.StoppedEvent>{
            event: "stopped",
            body: {
                reason: reason,
                threadId: threadId,
                preserveFocusHint: preserveFocusHint,
                allThreadsStopped: true
            }
        };
    }

	/**
	 * Initialize proxy
	 */
    public initProxy() {
        // setup event handlers
        this.gdbProxy.on('stopOnEntry', (threadId: number) => {
            this.sendEvent(this.crateStoppedEvent(threadId, "entry", false));
        });
        this.gdbProxy.on('stopOnStep', (threadId: number, preserveFocusHint?: boolean) => {
            this.sendEvent(this.crateStoppedEvent(threadId, "step", preserveFocusHint));
        });
        this.gdbProxy.on('stopOnPause', (threadId: number) => {
            this.sendEvent(this.crateStoppedEvent(threadId, "pause", false));
        });
        this.gdbProxy.on('stopOnBreakpoint', (threadId: number) => {
            this.sendEvent(this.crateStoppedEvent(threadId, "breakpoint", false));
        });
        this.gdbProxy.on('stopOnException', (status: GdbHaltStatus, threadId: number) => {
            this.sendEvent(this.crateStoppedEvent(threadId, "exception", false));
        });
        this.gdbProxy.on('continueThread', (threadId: number, allThreadsContinued?: boolean) => {
            this.sendEvent(new ContinuedEvent(threadId, allThreadsContinued));
        });
        this.gdbProxy.on('segmentsUpdated', (segments: Array<Segment>) => {
            this.updateSegments(segments);
        });
        this.gdbProxy.on('breakpointValidated', (bp: GdbBreakpoint) => {
            // Dirty workaround to issue https://github.com/microsoft/vscode/issues/65993
            setTimeout(async () => {
                try {
                    this.sendEvent(new BreakpointEvent('changed', bp));
                } catch (error) {
                    // forget it
                }
            }, 100);
        });
        this.gdbProxy.on('threadStarted', (threadId: number) => {
            let event = <DebugProtocol.ThreadEvent>{
                event: "thread",
                body: {
                    reason: 'started',
                    threadId: threadId
                }
            };
            this.sendEvent(event);
        });
        this.gdbProxy.on('output', (text: string, filePath?: string, line?: number, column?: number, level?: string) => {
            if (this.trace) {
                const e: DebugProtocol.OutputEvent = new OutputEvent(`${text}\n`);
                if (filePath !== undefined) {
                    e.body.source = this.createSource(filePath);
                }
                if (line !== undefined) {
                    e.body.line = this.convertDebuggerLineToClient(line);
                }
                if (column !== undefined) {
                    e.body.column = this.convertDebuggerColumnToClient(column);
                }
                this.sendEvent(e);
            }
        });
        this.gdbProxy.on('end', () => {
            this.terminate();
        });
    }



	/**
	 * The 'initialize' request is the first request called by the frontend
	 * to interrogate the features the debug adapter provides.
	 */
    protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {

        // build and return the capabilities of this debug adapter:
        response.body = response.body || {};

        // the adapter implements the configurationDoneRequest.
        response.body.supportsConfigurationDoneRequest = true;

        // make VS Code to use 'evaluate' when hovering over source
        response.body.supportsEvaluateForHovers = true;

        // make VS Code to show a 'step back' button
        response.body.supportsStepBack = false;

        // Restart frame not supported
        response.body.supportsRestartFrame = false;

        // Conditional breakpoints not supported
        response.body.supportsConditionalBreakpoints = false;

        // Read memory
        response.body.supportsReadMemoryRequest = true;

        // Disassemble
        response.body.supportsDisassembleRequest = true;

        // Set expression is accepted - TODO : Try it later
        //response.body.supportsSetExpression = true;

        response.body.supportsExceptionInfoRequest = true;
        response.body.supportsExceptionOptions = true;
        response.body.exceptionBreakpointFilters = [{
            filter: "all",
            label: "All Exceptions",
            default: true
        }];

        // This default debug adapter does support the 'setVariable' request.
        response.body.supportsSetVariable = true;

        // Sets the capstone path
        let conf: any = workspace.getConfiguration('amiga-assembly', null).get('cstool');
        if (!this.capstone && conf && (conf.length > 5)) {
            this.capstone = new Capstone(conf);
        }

        this.debugDisassembledManager = new DebugDisassembledManager(this.gdbProxy, this.capstone, this);

        this.sendResponse(response);

        // since this debug adapter can accept configuration requests like 'setBreakpoint' at any time,
        // we request them early by sending an 'initializeRequest' to the frontend.
        // The frontend will end the configuration sequence by calling 'configurationDone' request.
        this.sendEvent(new InitializedEvent());
    }

	/**
	 * Called at the end of the configuration sequence.
	 * Indicates that all breakpoints etc. have been sent to the DA and that the 'launch' can start.
	 */
    protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): void {
        super.configurationDoneRequest(response, args);

        // notify the launchRequest that configuration has finished
        this.configurationDone.notify();
    }

	/**
	 * Load the program with all the debug information
	 */
    protected loadDebugInfo(args: LaunchRequestArguments): Promise<boolean> {
        let sMap = new Map<string, string>();
        if (args.sourceFileMap) {
            let keys = Object.keys(args.sourceFileMap);
            for (let k of keys) {
                const desc = Object.getOwnPropertyDescriptor(args.sourceFileMap, k);
                if (desc) {
                    sMap.set(k, desc.value);
                }
            }
        }
        this.debugInfo = new DebugInfo(Uri.file(args.program), sMap, args.rootSourceFileMap);
        return this.debugInfo.load();
    }

    /**
     * Send a response containing an error.
     * @param response response to send
     * @param message Error message
     */
    private sendStringErrorResponse(response: DebugProtocol.Response, message: string) {
        response.success = false;
        response.message = message;
        this.sendResponse(response);
    }

    protected async launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (args.trace) {
                this.trace = args.trace;
            } else {
                this.trace = false;
            }
            // Does the program exists ? -> Loads the debug info
            let dInfoLoaded = false;
            try {
                dInfoLoaded = await this.loadDebugInfo(args);
                if (dInfoLoaded && this.debugInfo) {
                    this.breakpointManager.setDebugInfo(this.debugInfo);
                    this.breakpointManager.checkPendingBreakpointsAddresses();
                }
            } catch (err) {
                this.sendStringErrorResponse(response, "Invalid program to debug: " + err.message);
                resolve();
                return;
            }
            if ((!args.program) || (!dInfoLoaded)) {
                this.sendStringErrorResponse(response, "Invalid program to debug - review launch settings");
                resolve();
                return;
            }

            // Showing the help text
            if (!this.testMode) {
                let text = "Commands:\n" +
                    "    Memory dump:\n" +
                    "        m address, size[, wordSizeInBytes, rowSizeInWords,ab]\n" +
                    "        			a: show ascii output, b: show bytes output\n" +
                    "            example: m 5c50,10,2,4\n" +
                    "        m ${register|symbol}, #{symbol}, size[, wordSizeInBytes, rowSizeInWords]\n" +
                    "            example: m ${mycopperlabel},10,2,4\n" +
                    "    Disassembled Memory dump:\n" +
                    "        m address|${register|symbol}|#{symbol},size,d\n" +
                    "            example: m ${pc},10,d\n" +
                    "    Memory set:\n" +
                    "        M address=bytes\n" +
                    "            example: M 5c50=0ff534\n" +
                    "        M ${register|symbol}=bytes\n" +
                    "        M #{register|symbol}=bytes\n" +
                    "            example: M ${mycopperlabel}=0ff534\n" +
                    "      ${symbol} gives the address of symbol," +
                    "      #{symbol} gives the pointed value from the symbol\n";
                this.sendEvent(new OutputEvent(text));
            }

            // Launch the emulator
            this.startEmulator(args).catch(err => {
                window.showErrorMessage(err.message);
                this.sendEvent(new TerminatedEvent());
                this.sendStringErrorResponse(response, err.message);
                resolve();
                return;
            });

            // wait until configuration has finished (and configurationDoneRequest has been called)
            await this.configurationDone.wait(1000);

            // temp to use in timeout
            let debAdapter = this;

            let timeoutValue = 3000;
            if (this.testMode) {
                timeoutValue = 1;
            }
            setTimeout(async () => {
                // connects to FS-UAE
                await debAdapter.gdbProxy.connect(args.serverName, args.serverPort).then(async () => {
                    // Loads the program
                    debAdapter.sendEvent(new OutputEvent(`Starting program: ${args.program}`));
                    await debAdapter.gdbProxy.load(args.program, args.stopOnEntry).then(() => {
                        debAdapter.sendResponse(response);
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

    public checkEmulator(emulatorPath: string): Promise<boolean> {
        // Function useful for testing - mocking
        let fileProxy = new FileProxy(Uri.file(emulatorPath));
        return fileProxy.exists();
    }

    public startEmulator(args: LaunchRequestArguments): Promise<void> {
        if (args.startEmulator) {
            this.sendEvent(new OutputEvent(`Starting emulator: ${args.emulator}`));
            const emulatorExe = args.emulator;
            if (emulatorExe) {
                // Is the emulator exe present in the filesystem ?
                if (this.checkEmulator(emulatorExe)) {
                    return new Promise(async (resolve, reject) => {
                        this.cancellationTokenSource = new CancellationTokenSource();
                        const emulatorWorkingDir = args.emulatorWorkingDir || null;
                        this.executor.runTool(args.options, emulatorWorkingDir, "warning", true, emulatorExe, null, true, null, this.cancellationTokenSource.token).then(() => {
                            this.sendEvent(new TerminatedEvent());
                            resolve();
                        }).catch((err) => {
                            reject(new Error(`Error raised by the emulator run: ${err.message}`));
                        });
                    });
                } else {
                    throw (new Error(`The emulator executable '${emulatorExe}' cannot be found`));
                }
            } else {
                throw (new Error("The emulator executable file path must be defined in the launch settings"));
            }
        } else {
            this.sendEvent(new OutputEvent("Emulator starting skipped by settings"));
            return Promise.resolve();
        }
    }

    protected customRequest(command: string, response: DebugProtocol.Response, args: any): void {
        if (command === 'disassembleInner') {
            this.disassembleRequestInner(response, args);
        } else {
            response.body = { error: 'Invalid command.' };
            this.sendResponse(response);
        }
    }

    protected disassembleRequestInner(response: DebugProtocol.DisassembleResponse, args: DisassembleAddressArguments): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.debugDisassembledManager.disassembleRequest(args).then(instructions => {
                response.body = {
                    instructions: instructions,
                };
                this.sendResponse(response);
                resolve();
            }).catch((err) => {
                this.sendStringErrorResponse(response, err.message);
                reject(err);
            });
        });
    }

    protected disassembleRequest(response: DebugProtocol.DisassembleResponse, args: DebugProtocol.DisassembleArguments): Promise<void> {
        let dArgs = DisassembleAddressArguments.copy(args, false);
        return this.disassembleRequestInner(response, dArgs);
    }

    protected terminateEmulator() {
        if (this.cancellationTokenSource) {
            this.cancellationTokenSource.cancel();
        }
    }

    protected async setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let debugBreakPoints = new Array<DebugProtocol.Breakpoint>();
            // clear all breakpoints for this file
            this.breakpointManager.clearBreakpoints(args.source);
            // set and verify breakpoint locations
            if (args.breakpoints) {
                for (let reqBp of args.breakpoints) {
                    let debugBp = this.breakpointManager.createBreakpoint(args.source, reqBp.line);
                    await this.breakpointManager.setBreakpoint(debugBp).then(modifiedBp => {
                        debugBreakPoints.push(modifiedBp);
                    }).catch(err => {
                        debugBreakPoints.push(debugBp);
                    });
                }
            }
            // send back the actual breakpoint positions
            response.body = {
                breakpoints: debugBreakPoints
            };
            response.success = true;
            this.sendResponse(response);
            resolve();
        });

    }

    protected threadsRequest(response: DebugProtocol.ThreadsResponse): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.gdbProxy.getThreadIds().then(thIds => {
                let threads = new Array<Thread>();
                for (let t of thIds) {
                    threads.push(new Thread(t.getId(), t.getDisplayName()));
                }
                response.body = {
                    threads: threads
                };
                this.sendResponse(response);
            }).catch((err) => {
                this.sendStringErrorResponse(response, err.message);
            });
            resolve();
        });
    }

    protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            if (this.debugInfo) {
                const dbgInfo = this.debugInfo;
                const thread = this.gdbProxy.getThread(args.threadId);
                if (thread) {
                    this.gdbProxy.stack(thread).then(async stk => {
                        let stackFrames = [];
                        let updatedView = false;
                        for (let f of stk.frames) {
                            if ((!updatedView) && (thread.getThreadId() === GdbAmigaSysThreadId.CPU)) {
                                // Update the cpu view
                                this.updateDisassembledView(f.pc, 100);
                                updatedView = true;
                            }
                            let stackFrameDone = false;
                            let pc = f.pc.toString(16);
                            if (f.segmentId >= 0) {
                                let values = await dbgInfo.resolveFileLine(f.segmentId, f.offset);
                                if (values) {
                                    let line = values[2];
                                    if (line) {
                                        let idx = line.indexOf(';');
                                        if (idx > 0) {
                                            line = line.substring(0, idx);
                                        }
                                        line = pc + ": " + line.trim().replace(/\s\s+/g, ' ');
                                    } else {
                                        line = pc;
                                    }
                                    stackFrames.push(new StackFrame(f.index, line, this.createSource(values[0]), values[1], 1));
                                    stackFrameDone = true;
                                }
                            }
                            if (!stackFrameDone) {
                                let line: string = pc;
                                if (thread.getThreadId() === GdbAmigaSysThreadId.CPU) {
                                    let dCode = this.disassembledCache.get(f.pc);
                                    if (dCode) {
                                        line = dCode;
                                    } else {
                                        // Get the disassembled line
                                        line += ": ";
                                        if (this.capstone) {
                                            let memory = await this.gdbProxy.getMemory(f.pc, 10).catch((err) => {
                                                console.error("Error ignored: " + err.getMessage());
                                            });
                                            if (memory) {
                                                let disassembled = await this.capstone.disassemble(memory);
                                                let lines = disassembled.split(/\r\n|\r|\n/g);
                                                let selectedLine = lines[0];
                                                for (let l of lines) {
                                                    if (l.trim().length > 0) {
                                                        selectedLine = l;
                                                        break;
                                                    }
                                                }
                                                let elms = selectedLine.split("  ");
                                                if (elms.length > 2) {
                                                    selectedLine = elms[2];
                                                }
                                                line += selectedLine.trim().replace(/\s\s+/g, ' ');
                                            }
                                        }
                                        this.disassembledCache.set(f.pc, line);
                                    }
                                } else if (thread.getThreadId() === GdbAmigaSysThreadId.COP) {
                                    let dCopperCode = this.disassembledCopperCache.get(f.pc);
                                    if (dCopperCode) {
                                        line = dCopperCode;
                                    } else {
                                        // Get the disassembled line
                                        line += ": ";
                                        let memory = await this.gdbProxy.getMemory(f.pc, 10).catch((err) => {
                                            console.error("Error ignored: " + err.getMessage());
                                        });
                                        if (memory) {
                                            let cDis = new CopperDisassembler(memory);
                                            line = line + cDis.disassemble()[0].toString().split("    ")[0];
                                            this.disassembledCopperCache.set(f.pc, line);
                                        }
                                    }
                                }
                                // The the stack frame from the manager
                                let stackFrame = await this.debugDisassembledManager.getStackFrame(f.index, f.pc, line, (thread.getThreadId() === GdbAmigaSysThreadId.COP));
                                if (stackFrame) {
                                    stackFrames.push(stackFrame);
                                }
                            }
                        }
                        response.body = {
                            stackFrames: stackFrames,
                            totalFrames: stk.count
                        };
                        this.sendResponse(response);
                    }).catch((err) => {
                        this.sendStringErrorResponse(response, err.message);
                    });
                } else {
                    this.sendStringErrorResponse(response, "Unknown thread");
                }
            } else {
                this.sendStringErrorResponse(response, "No debug info loaded");
            }
            resolve();
        });
    }

    protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
        const frameReference = args.frameId;
        const scopes = new Array<Scope>();
        scopes.push(new Scope("Registers", this.variableHandles.create("registers_" + frameReference), false));
        scopes.push(new Scope("Segments", this.variableHandles.create("segments_" + frameReference), true));
        scopes.push(new Scope("Symbols", this.variableHandles.create("symbols_" + frameReference), true));

        response.body = {
            scopes: scopes
        };
        this.sendResponse(response);
    }

    protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): void {
        let variables = this.variableRefMap.get(args.variablesReference);
        if (variables) {
            response.body = {
                variables: variables
            };
            this.sendResponse(response);
        } else {
            const id = this.variableHandles.get(args.variablesReference);
            if (id !== null) {
                if (id.startsWith("registers_")) {
                    //Gets the frameId
                    let frameId = parseInt(id.substring(10));
                    this.gdbProxy.registers(frameId).then((registers: Array<GdbRegister>) => {
                        const variablesArray = new Array<DebugProtocol.Variable>();
                        for (let i = 0; i < registers.length; i++) {
                            let r = registers[i];
                            let v = r.value.toString(10);
                            if (!GdbProxy.SR_LABELS.includes(r.name)) {
                                v = StringUtils.padStart(r.value.toString(16), 8, "0");
                            }
                            variablesArray.push({
                                name: r.name,
                                type: "register",
                                value: v,
                                variablesReference: 0
                            });
                        }
                        response.body = {
                            variables: variablesArray
                        };
                        this.sendResponse(response);
                    }).catch(err => {
                        this.sendStringErrorResponse(response, err.message);
                    });
                } else if (id.startsWith("segments_")) {
                    const variablesArray = new Array<DebugProtocol.Variable>();
                    const segments = this.gdbProxy.getSegments();
                    if (segments) {
                        for (let i = 0; i < segments.length; i++) {
                            let s = segments[i];
                            variablesArray.push({
                                name: "Segment #" + i,
                                type: "segment",
                                value: s.address.toString(16) + " {size:" + s.size + "}",
                                variablesReference: 0
                            });
                        }
                        response.body = {
                            variables: variablesArray
                        };
                    } else {
                        response.success = false;
                        response.message = "No Segments found";
                    }
                    this.sendResponse(response);
                } else if (id.startsWith("symbols_")) {
                    const variablesArray = new Array<DebugProtocol.Variable>();
                    for (let entry of Array.from(this.symbolsMap.entries())) {
                        let key = entry[0];
                        let value = entry[1];
                        variablesArray.push({
                            name: key,
                            type: "symbol",
                            value: value.toString(16),
                            variablesReference: 0
                        });
                    }
                    response.body = {
                        variables: variablesArray
                    };
                    this.sendResponse(response);
                }
            }
        }
    }

    protected setVariableRequest(response: DebugProtocol.SetVariableResponse, args: DebugProtocol.SetVariableArguments): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const id = this.variableHandles.get(args.variablesReference);
            if ((id !== null) && (id.startsWith("registers_"))) {
                await this.gdbProxy.setRegister(args.name, args.value).then((newValue) => {
                    response.body = {
                        value: newValue
                    };
                    this.sendResponse(response);
                }).catch(err => {
                    this.sendStringErrorResponse(response, err.getMessage());
                });
            } else {
                this.sendStringErrorResponse(response, "Illegal variable request");
            }
            resolve();
        });
    }

    public terminate() {
        this.gdbProxy.destroy();
        this.terminateEmulator();
    }

    public shutdown() {
        this.terminate();
    }

    protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): void {
        let thread = this.gdbProxy.getThread(args.threadId);
        if (thread) {
            this.gdbProxy.continueExecution(thread).then(() => {
                response.body = {
                    allThreadsContinued: false
                };
                this.sendResponse(response);
            }).catch(err => {
                this.sendStringErrorResponse(response, err.message);
            });
        } else {
            this.sendStringErrorResponse(response, "Unknown thread");
        }
    }

    protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
        let thread = this.gdbProxy.getThread(args.threadId);
        if (thread) {
            this.gdbProxy.stepToRange(thread, 0, 0).then(() => {
                this.sendResponse(response);
            }).catch(err => {
                this.sendStringErrorResponse(response, err.message);
            });
        } else {
            this.sendStringErrorResponse(response, "Unknown thread");
        }
    }

    protected stepInRequest(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments): void {
        let thread = this.gdbProxy.getThread(args.threadId);
        if (thread) {
            this.gdbProxy.stepIn(thread).then(() => {
                this.sendResponse(response);
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
                let startAddress = frame.pc + 1;
                let endAddress = frame.pc + 10;
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

    private evaluateRequestRegister(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
        // It's a reg value
        this.gdbProxy.getRegister(args.expression, args.frameId).then(value => {
            response.body = {
                result: value[0],
                variablesReference: 0,
            };
            this.sendResponse(response);
        }).catch(err => {
            this.sendStringErrorResponse(response, err.message);
        });
    }

    protected readMemoryRequest(response: DebugProtocol.ReadMemoryResponse, args: DebugProtocol.ReadMemoryArguments): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            let address = parseInt(args.memoryReference);
            if (args.offset) {
                address += args.offset;
            }
            let memory = await this.gdbProxy.getMemory(address, args.count).catch(err => {
                this.sendStringErrorResponse(response, err.message);
            });
            if (memory) {
                response.body = {
                    address: address.toString(),
                    data: StringUtils.hexToBase64(memory)
                };
                this.sendResponse(response);
            }
            resolve();
        });
    }

    public getMemory(address: number, size: number): Promise<string> {
        return this.gdbProxy.getMemory(address, size);
    }

    public getVariablePointedMemory(variableName: string, frameIndex?: number, size?: number): Promise<string> {
        return new Promise(async (resolve, reject) => {
            await this.getVariableValueAsNumber(variableName, frameIndex).then(async (address) => {
                let lSize = size;
                if (lSize === undefined) {
                    // By default me assume it is an address 32b
                    lSize = 4;
                }
                // call to get the value in memory for this address
                await this.gdbProxy.getMemory(address, lSize).then((memory) => {
                    resolve(memory);
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
    public getVariableValue(variableName: string, frameIndex?: number): Promise<string> {
        return new Promise(async (resolve, reject) => {
            await this.getVariableValueAsNumber(variableName, frameIndex).then((value) => {
                resolve(value.toString(16));
            }).catch(err => {
                reject(err);
            });
        });
    }

    public getVariableValueAsNumber(variableName: string, frameIndex?: number): Promise<number> {
        return new Promise(async (resolve, reject) => {
            // Is it a register?
            let matches = /^([ad][0-7]|pc|sr)$/i.exec(variableName);
            if (matches) {
                let values = await this.gdbProxy.getRegister(variableName, frameIndex).catch(err => {
                    reject(err);
                });
                if (values) {
                    resolve(parseInt(values[0], 16));
                } else {
                    reject(new Error("No value for register " + variableName));
                }
            } else {
                // Is it a symbol?
                let address = this.symbolsMap.get(variableName);
                if (address !== undefined) {
                    resolve(address);
                } else {
                    // Is it a standard register
                    address = MemoryLabelsRegistry.getCustomAddress(variableName.toUpperCase());
                    if (address !== undefined) {
                        resolve(address);
                    } else {
                        reject(new Error("Unknown symbol " + variableName));
                    }
                }
            }
        });
    }

    private evaluateRequestGetMemory(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
        const matches = /m\s*([\{\}\$#0-9a-z_\+\-\*\/\%\(\)]+)\s*,\s*([0-9]+)(,\s*([0-9]+),\s*([0-9]+))?(,([abd]+))?/i.exec(args.expression);
        if (matches) {
            let rowLength = 4;
            let wordLength = 4;
            let mode = "ab";
            let length = parseInt(matches[2]);
            if ((matches.length > 5) && matches[4] && matches[5]) {
                wordLength = parseInt(matches[4]);
                rowLength = parseInt(matches[5]);
            }
            if ((matches.length > 7) && matches[7]) {
                mode = matches[7];
            }
            if (length !== null) {
                // replace the address if it is a variable
                this.debugExpressionHelper.getAddressFromExpression(matches[1], args.frameId, this).then((address) => {
                    // ask for memory dump
                    this.gdbProxy.getMemory(address, length).then((memory) => {
                        let key = this.variableExpressionMap.get(args.expression);
                        if (!key) {
                            key = this.variableHandles.create(args.expression);
                        }
                        let startAddress = address;
                        if (mode !== "d") {
                            let [firstRow, variables] = this.debugExpressionHelper.processOutputFromMemoryDump(memory, startAddress, mode, wordLength, rowLength);
                            this.variableRefMap.set(key, variables);
                            this.variableExpressionMap.set(args.expression, key);
                            response.body = {
                                result: firstRow,
                                type: "array",
                                variablesReference: key,
                            };
                            this.sendResponse(response);
                        } else {
                            if (this.capstone) {
                                const constKey = key;
                                // disassemble the code 
                                this.capstone.disassemble(memory).then((code) => {
                                    let [firstRow, variables] = this.debugExpressionHelper.processVariablesFromDisassembler(code, startAddress);
                                    this.variableRefMap.set(constKey, variables);
                                    this.variableExpressionMap.set(args.expression, constKey);
                                    response.body = {
                                        result: firstRow,
                                        type: "array",
                                        variablesReference: constKey,
                                    };
                                    this.sendResponse(response);
                                }).catch((err) => {
                                    response.success = false;
                                    response.message = err.toString();
                                    this.sendResponse(response);
                                });
                            } else {
                                this.sendStringErrorResponse(response, "Capstone cstool must be configured in the settings");
                            }
                        }
                    }).catch((err) => {
                        this.sendStringErrorResponse(response, err.message);
                    });
                }).catch((err) => {
                    this.sendStringErrorResponse(response, err.message);
                });
            } else {
                this.sendStringErrorResponse(response, "Invalid memory dump expression");
            }
        } else {
            this.sendStringErrorResponse(response, "Expression not recognized");
        }
    }

    private evaluateRequestSetMemory(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
        const matches = /M\s*([\{\}\$#0-9a-z_]+)\s*=\s*([0-9a-z_]+)/i.exec(args.expression);
        if (matches) {
            let addrStr = matches[1];
            let data = matches[2];
            if ((addrStr !== null) && (data !== null) && (data.length > 0)) {
                // replace the address if it is a variable
                this.debugExpressionHelper.getAddressFromExpression(addrStr, args.frameId, this).then((address) => {
                    this.gdbProxy.setMemory(address, data).then(() => {
                        args.expression = 'm' + addrStr + ',' + data.length.toString(16);
                        return this.evaluateRequestGetMemory(response, args);
                    }).catch((err) => {
                        this.sendStringErrorResponse(response, err.message);
                    });
                }).catch((err) => {
                    this.sendStringErrorResponse(response, err.message);
                });
            } else {
                this.sendStringErrorResponse(response, "Invalid memory set expression");
            }
        } else {
            this.sendStringErrorResponse(response, "Expression not recognized");
        }
    }

    protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): Promise<void> {
        return new Promise(async (resolve, reject) => {
            // Evaluate an expression
            let matches = /^([ad][0-7]|pc|sr)$/i.exec(args.expression);
            if (matches) {
                this.evaluateRequestRegister(response, args);
            } else if (args.expression.startsWith('m')) {
                this.evaluateRequestGetMemory(response, args);
            } else if (args.expression.startsWith('M')) {
                this.evaluateRequestSetMemory(response, args);
            } else {
                await this.debugExpressionHelper.getAddressFromExpression(args.expression, args.frameId, this).then((address) => {
                    response.body = {
                        result: '$' + address.toString(16),
                        type: "string",
                        variablesReference: 0,
                    };
                    this.sendResponse(response);
                }).catch((err) => {
                    this.sendStringErrorResponse(response, err.message);
                });
            }
            resolve();
        });
    }

    protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            let thread = this.gdbProxy.getThread(args.threadId);
            if (thread) {
                await this.gdbProxy.pause(thread).then(() => {
                    this.sendResponse(response);
                }).catch(err => {
                    this.sendStringErrorResponse(response, err.message);
                });
            } else {
                this.sendStringErrorResponse(response, "Unknown thread");
            }
            resolve();
        });
    }

    protected exceptionInfoRequest(response: DebugProtocol.ExceptionInfoResponse, args: DebugProtocol.ExceptionInfoArguments): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            await this.gdbProxy.getHaltStatus().then((haltStatus) => {
                let selectedHs: GdbHaltStatus = haltStatus[0];
                for (let hs of haltStatus) {
                    if ((hs.thread) && (hs.thread.getThreadId() === GdbAmigaSysThreadId.CPU)) {
                        selectedHs = hs;
                        break;
                    }
                }
                response.body = {
                    exceptionId: selectedHs.code.toString(),
                    description: selectedHs.details,
                    breakMode: 'always'
                };
                this.sendResponse(response);
            }).catch(err => {
                this.sendStringErrorResponse(response, err.message);
            });
            resolve();
        });
    }

    protected setExceptionBreakPointsRequest(response: DebugProtocol.SetExceptionBreakpointsResponse, args: DebugProtocol.SetExceptionBreakpointsArguments): Promise<void> {
        return new Promise(async (resolve, _reject) => {
            if (args.filters.length > 0) {
                await this.breakpointManager.setExceptionBreakpoint().then(() => {
                    response.success = true;
                    this.sendResponse(response);
                }).catch(err => {
                    this.sendStringErrorResponse(response, err.message);
                });
            } else {
                await this.breakpointManager.removeExceptionBreakpoint().then(breakpoint => {
                    response.success = true;
                    this.sendResponse(response);
                }).catch(err => {
                    this.sendStringErrorResponse(response, err.message);
                });
            }
            resolve();
        });
    }

	/**
	 * Updates the segments addresses of th hunks
	 * 
	 *@param segment The list of returned segments from the debugger 
	 */
    public updateSegments(segments: Array<Segment>) {
        if (this.debugInfo) {
            let lastPos = this.debugInfo.hunks.length;
            for (let posSegment = 0; posSegment < lastPos; posSegment++) {
                // Segments in order of file
                let hunk = this.debugInfo.hunks[posSegment];
                let segment;
                let address;
                if (posSegment >= segments.length) {
                    // Segment not declared by the protocol
                    segment = <Segment>{
                        address: 0,
                        name: "",
                        size: hunk.allocSize
                    };
                    address = this.gdbProxy.addSegment(segment);
                } else {
                    segment = segments[posSegment];
                    address = segment.address;
                    segment.size = hunk.allocSize;
                }
                hunk.segmentsId = posSegment;
                hunk.segmentsAddress = address;
                // Retrieve the symbols
                if (hunk.symbols) {
                    for (let s of hunk.symbols) {
                        this.symbolsMap.set(s.name, s.offset + address);
                    }
                }
            }
        }
    }

    public updateDisassembledView(address: number, length: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (address !== this.currentMemoryViewPc) {
                this.currentMemoryViewPc = address;
                await this.debugDisassembledManager.disassembleNumericalAddressCPU(address, length).then(async dLines => {
                    await vscode.commands.executeCommand('disassembledMemory.setDisassembledMemory', dLines);
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }

    //---- helpers
    private createSource(filePath: string): Source {
        return new Source(basename(filePath), this.convertDebuggerPathToClient(filePath));
    }
}
