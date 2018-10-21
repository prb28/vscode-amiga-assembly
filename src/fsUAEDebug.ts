import {
    Logger, logger,
    InitializedEvent, TerminatedEvent, StoppedEvent, BreakpointEvent,
    Thread, StackFrame, Scope, Source, Handles, DebugSession
} from 'vscode-debugadapter/lib/main';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { basename } from 'path';
import { GdbProxy, GdbRegister, GdbBreakpoint, Segment, GdbHaltStatus } from './gdbProxy';
import { ExecutorHelper } from './execHelper';
import { CancellationTokenSource, workspace, window } from 'vscode';
import { DebugInfo } from './debugInfo';
import { Capstone } from './capstone';
import { DebugVariableResolver } from './debugVariableResolver';
import { DebugExpressionHelper } from './debugExpressionHelper';
import { DebugDisassembledMananger, DebugDisassembledFile, DisassembleAddressArguments } from './debugDisassembled';
import * as fs from 'fs';
import { StringUtils } from './stringUtils';
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
    /** Build the workspace before debug */
    buildWorkspace?: boolean;
}

export class FsUAEDebugSession extends DebugSession implements DebugVariableResolver {
    // Default selection mask for exception : each bit is a exception code
    static readonly DEFAULT_EXCEPTION_MASK = 0b1111111000000010000011110000000000000000011111111111100;

    // we don't support multiple threads, so we can use a hardcoded ID for the default thread
    private static THREAD_ID = 1;

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

    /** Helper class to deal with the debug expressions */
    private debugExpressionHelper = new DebugExpressionHelper();

    /** Manager of disassembled code */
    private debugDisassembledMananger: DebugDisassembledMananger;

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
        this.debugDisassembledMananger = new DebugDisassembledMananger(this.gdbProxy, undefined, this);
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
        this.debugDisassembledMananger = new DebugDisassembledMananger(gdbProxy, capstone, this);
    }

	/**
	 * Initialize proxy
	 */
    public initProxy() {
        // setup event handlers
        this.gdbProxy.on('stopOnEntry', () => {
            this.sendEvent(new StoppedEvent('entry', FsUAEDebugSession.THREAD_ID));
        });
        this.gdbProxy.on('stopOnStep', () => {
            this.sendEvent(new StoppedEvent('step', FsUAEDebugSession.THREAD_ID));
        });
        this.gdbProxy.on('stopOnBreakpoint', () => {
            this.sendEvent(new StoppedEvent('breakpoint', FsUAEDebugSession.THREAD_ID));
        });
        this.gdbProxy.on('stopOnException', (status: GdbHaltStatus) => {
            logger.error("Exception raised: " + status.details);
            this.sendEvent(new StoppedEvent('exception', FsUAEDebugSession.THREAD_ID));
        });
        this.gdbProxy.on('segmentsUpdated', (segments: Array<Segment>) => {
            this.updateSegments(segments);
        });
        this.gdbProxy.on('breakpointValidated', (bp: GdbBreakpoint) => {
            let debugBp = <DebugProtocol.Breakpoint>{
                verified: bp.verified,
                id: bp.id
            };
            this.sendEvent(new BreakpointEvent('changed', debugBp));
        });
        // this.gdbProxy.on('output', (text: string, filePath: string, line: number, column: number) => {
        // 	const e: DebugProtocol.OutputEvent = new OutputEvent(`${text}\n`);
        // 	e.body.source = this.createSource(filePath);
        // 	e.body.line = this.convertDebuggerLineToClient(line);
        // 	e.body.column = this.convertDebuggerColumnToClient(column);
        // 	this.sendEvent(e);
        // });
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

        // Conditionnal breakpoints not supported
        response.body.supportsConditionalBreakpoints = false;

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
        let conf: any = workspace.getConfiguration('amiga-assembly').get('cstool');
        if (!this.capstone && conf && (conf.length > 5)) {
            this.capstone = new Capstone(conf);
        }

        this.debugDisassembledMananger = new DebugDisassembledMananger(this.gdbProxy, this.capstone, this);

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
    protected loadDebugInfo(args: LaunchRequestArguments): boolean {
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
        this.debugInfo = new DebugInfo(sMap);
        return this.debugInfo.loadInfo(args.program);
    }

    protected async launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments) {
        // make sure to set the buffered logging to warn if 'trace' is not set
        logger.setup(args.trace ? Logger.LogLevel.Verbose : Logger.LogLevel.Log, false);

        // Does the program exists ? -> Loads the debug info
        let dInfoLoaded = false;
        try {
            dInfoLoaded = this.loadDebugInfo(args);
        } catch (err) {
            response.success = false;
            response.message = "Invalid program to debug: " + err.message;
            this.sendResponse(response);
            return;
        }
        if ((!args.program) || (!dInfoLoaded)) {
            response.success = false;
            response.message = "Invalid program to debug - review launch settings";
            this.sendResponse(response);
            return;
        }

        // Showing the help text
        if (!this.testMode) {
            logger.warn("Commands:");
            logger.warn("    Memory dump:");
            logger.warn("        m address, size[, wordSizeInBytes, rowSizeInWords,ab]");
            logger.warn("        			a: show ascii output, b: show bytes output");
            logger.warn("            example: m 5c50,10,2,4");
            logger.warn("        m ${register|symbol}, size[, wordSizeInBytes, rowSizeInWords]");
            logger.warn("            example: m ${mycopperlabel},10,2,4");
            logger.warn("    Disassembled Memory dump:");
            logger.warn("        m address|${register|symbol},size,d");
            logger.warn("            example: m ${pc},10,d");
            logger.warn("    Memory set:");
            logger.warn("        M address=bytes");
            logger.warn("            example: M 5c50=0ff534");
            logger.warn("        M ${register|symbol}=bytes");
            logger.warn("            example: M ${mycopperlabel}=0ff534");
        }

        // Launch the emulator
        try {
            this.startEmulator(args).catch(err => {
                window.showErrorMessage(err.message);
                this.sendEvent(new TerminatedEvent());
            });
        } catch (error) {
            response.success = false;
            response.message = error.message;
            this.sendResponse(response);
            return;
        }

        // wait until configuration has finished (and configurationDoneRequest has been called)
        await this.configurationDone.wait(1000);

        // temp to use in timeout
        let debAdapter = this;

        let timeoutValue = 3000;
        if (this.testMode) {
            timeoutValue = 1;
        }
        setTimeout(function () {
            // connects to FS-UAE
            debAdapter.gdbProxy.connect(args.serverName, args.serverPort).then(async () => {
                // Loads the program
                logger.warn("Starting program: " + args.program);
                await debAdapter.gdbProxy.load(args.program, args.stopOnEntry).then(() => {
                    debAdapter.sendResponse(response);
                }).catch(err => {
                    response.success = false;
                    response.message = err.toString();
                    debAdapter.sendResponse(response);
                });
            }).catch(err => {
                response.success = false;
                response.message = err.toString();
                debAdapter.sendResponse(response);
            });
        }, timeoutValue);
    }

    public checkEmulator(emulatorPath: string): boolean {
        // Function usefull for testing - mocking
        return fs.existsSync(emulatorPath);
    }

    public startEmulator(args: LaunchRequestArguments): Promise<void> {
        if (args.startEmulator) {
            logger.warn("Starting emulator: " + args.emulator);
            const emulatorExe = args.emulator;
            if (emulatorExe) {
                // Is the emeulator exe present in the filesystem ?
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
            logger.warn("Emulator starting skipped by settings");
            return Promise.resolve();
        }
    }

    protected customRequest(command: string, response: DebugProtocol.Response, args: any): void {
        switch (command) {
            case 'disassemble':
                this.disassembleRequest(response, args);
                break;
            default:
                response.body = { error: 'Invalid command.' };
                this.sendResponse(response);
                break;
        }
    }

    protected async disassembleRequest(response: DebugProtocol.Response, args: DisassembleAddressArguments): Promise<void> {
        await this.debugDisassembledMananger.disassembleRequest(args).then(variables => {
            response.body = {
                variables: variables,
            };
            this.sendResponse(response);
        }).catch((err) => {
            response.success = false;
            response.message = err.toString();
            this.sendResponse(response);
        });
    }

    protected terminateEmulator() {
        if (this.cancellationTokenSource) {
            this.cancellationTokenSource.cancel();
        }
    }

    protected async setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): Promise<void> {
        let debugBreakPoints = new Array<DebugProtocol.Breakpoint>();
        const path = <string>args.source.path;
        const clientLines = args.lines || [];

        // clear all breakpoints for this file
        if (this.debugInfo) {
            let values = this.debugInfo.getAllSegmentIds(path);
            for (let segmentId of values) {
                await this.gdbProxy.clearBreakpoints(segmentId);
            }
        }

        // set and verify breakpoint locations
        let breakPoints: GdbBreakpoint[] = [];
        for (let l of clientLines) {
            if (!DebugDisassembledFile.isDebugAsmFile(path)) {
                if (this.debugInfo) {
                    const dbInfo = this.debugInfo;
                    let values = this.debugInfo.getAddressSeg(path, l);
                    if (values) {
                        await this.gdbProxy.setBreakPoint(values[0], values[1]).then(bp => {
                            breakPoints.push(bp);
                            let values = dbInfo.resolveFileLine(bp.segmentId, bp.offset);
                            if (values) {
                                debugBreakPoints.push(<DebugProtocol.Breakpoint>{
                                    id: bp.id,
                                    line: values[1],
                                    source: path, // The path is the local path and not the stored in binary file
                                    verified: true // We assume that if the line is in the binary, it is verified
                                });
                            }
                        }).catch((err) => {
                            response.success = false;
                            response.message = err.toString();
                            this.sendResponse(response);
                            return;
                        });
                    } else {
                        debugBreakPoints.push(<DebugProtocol.Breakpoint>{
                            line: l,
                            source: path,
                            verified: false
                        });
                    }
                } else {
                    response.success = false;
                    response.message = 'Breakpoint information cannot be retrieved';
                    this.sendResponse(response);
                    return;
                }
            } else {
                let address = await this.debugDisassembledMananger.getAddressForFileEditorLine(path, l).catch((err) => {
                    response.success = false;
                    response.message = err.toString();
                    this.sendResponse(response);
                    return;
                });
                if (address) {
                    await this.gdbProxy.setBreakPointFromAddress(address).then(bp => {
                        breakPoints.push(bp);
                        debugBreakPoints.push(<DebugProtocol.Breakpoint>{
                            id: bp.id,
                            line: l,
                            source: path, // The path is the local path and not the stored in binary file
                            verified: true // We assume that if the line is in the binary, it is verified
                        });
                    }).catch((err) => {
                        response.success = false;
                        response.message = err.toString();
                        this.sendResponse(response);
                        return;
                    });
                } else {
                    debugBreakPoints.push(<DebugProtocol.Breakpoint>{
                        line: l,
                        source: path,
                        verified: false
                    });
                }
            }
        }
        // send back the actual breakpoint positions
        response.body = {
            breakpoints: debugBreakPoints
        };
        this.sendResponse(response);
    }

    protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
        // runtime supports now threads so just return a default thread.
        response.body = {
            threads: [
                new Thread(FsUAEDebugSession.THREAD_ID, "thread 1")
            ]
        };
        this.sendResponse(response);
    }

    protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): void {
        if (this.debugInfo) {
            const dbgInfo = this.debugInfo;
            this.gdbProxy.stack().then(async stk => {
                let stackFrames = [];
                for (let f of stk.frames) {
                    let stackFrameDone = false;
                    let pc = f.pc.toString(16);
                    if (f.segmentId >= 0) {
                        let values = dbgInfo.resolveFileLine(f.segmentId, f.offset);
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
                        let line: string;
                        let dCode = this.disassembledCache.get(f.pc);
                        if (dCode) {
                            line = dCode;
                        } else {
                            // Get the disassembled line
                            line = pc + ": ";
                            if (this.capstone) {
                                let memory = await this.gdbProxy.getMemory(f.pc, 10).catch((err) => {
                                    console.error("Error ingored: " + err.getMessage());
                                });
                                if (memory) {
                                    let disassembled = await this.capstone.disassemble(memory);
                                    let selectedLine = disassembled.split(/\r\n|\r|\n/g)[0];
                                    let elms = selectedLine.split("  ");
                                    if (elms.length > 2) {
                                        selectedLine = elms[2];
                                    }
                                    line += selectedLine.trim().replace(/\s\s+/g, ' ');
                                }
                            }
                            this.disassembledCache.set(f.pc, line);
                        }
                        // The the stack frame from the manager
                        let stackFrame = await this.debugDisassembledMananger.getStackFrame(f.index, f.pc, line);
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
                return;
            }).catch((err) => {
                response.success = false;
                response.message = err.toString();
                this.sendResponse(response);
                return;
            });
        } else {
            this.sendResponse(response);
        }
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
                        const variables = new Array<DebugProtocol.Variable>();
                        for (let i = 0; i < registers.length; i++) {
                            let r = registers[i];
                            variables.push({
                                name: r.name,
                                type: "register",
                                value: StringUtils.padStartWith0(r.value.toString(16), 8),
                                variablesReference: 0
                            });
                        }
                        response.body = {
                            variables: variables
                        };
                        this.sendResponse(response);
                    }).catch(err => {
                        response.success = false;
                        response.message = err.toString();
                        this.sendResponse(response);
                    });
                } else if (id.startsWith("segments_")) {
                    const variables = new Array<DebugProtocol.Variable>();
                    const segments = this.gdbProxy.getSegments();
                    if (segments) {
                        for (let i = 0; i < segments.length; i++) {
                            let s = segments[i];
                            variables.push({
                                name: "Segment #" + i,
                                type: "segment",
                                value: s.address.toString(16) + " {size:" + s.size + "}",
                                variablesReference: 0
                            });
                        }
                        response.body = {
                            variables: variables
                        };
                    } else {
                        response.success = false;
                        response.message = "No Segments found";
                    }
                    this.sendResponse(response);
                } else if (id.startsWith("symbols_")) {
                    const variables = new Array<DebugProtocol.Variable>();
                    for (let entry of Array.from(this.symbolsMap.entries())) {
                        let key = entry[0];
                        let value = entry[1];
                        variables.push({
                            name: key,
                            type: "symbol",
                            value: value.toString(16),
                            variablesReference: 0
                        });
                    }
                    response.body = {
                        variables: variables
                    };
                    this.sendResponse(response);
                }
            }
        }
    }

    protected setVariableRequest(response: DebugProtocol.SetVariableResponse, args: DebugProtocol.SetVariableArguments): void {
        const id = this.variableHandles.get(args.variablesReference);
        if ((id !== null) && (id.startsWith("registers_"))) {
            this.gdbProxy.setRegister(args.name, args.value).then((newValue) => {
                response.body = {
                    value: newValue
                };
                this.sendResponse(response);
            });
        } else {
            response.success = false;
            this.sendResponse(response);
        }
    }

    public terminate() {
        this.terminateEmulator();
    }

    public shutdown() {
        this.terminate();
    }

    protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): void {
        this.gdbProxy.continueExecution().then(() => {
            this.sendResponse(response);
        }).catch(err => {
            response.success = false;
            response.message = err.toString();
            this.sendResponse(response);
        });
    }

    protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
        this.gdbProxy.step().then(() => {
            this.sendResponse(response);
        }).catch(err => {
            response.success = false;
            response.message = err.toString();
            this.sendResponse(response);
        });
    }

    protected stepInRequest(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments): void {
        this.gdbProxy.stepIn().then(() => {
            this.sendResponse(response);
        }).catch(err => {
            response.success = false;
            response.message = err.toString();
            this.sendResponse(response);
        });
    }

    protected stepOutRequest(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments): void {
        response.success = false;
        response.message = "Option not availaible";
        this.sendResponse(response);
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
            response.success = false;
            response.message = err.toString();
            this.sendResponse(response);
        });
    }

    public getVariableValue(variableName: string, frameIndex: number | undefined): Promise<string> {
        return new Promise<(any | null)>(async (resolve, reject) => {
            // Is it a register?
            let matches = /^([ad][0-7]|pc|sr)$/i.exec(variableName);
            if (matches) {
                let values = await this.gdbProxy.getRegister(variableName, frameIndex).catch(err => {
                    reject(err);
                });
                if (values) {
                    resolve(values[0]);
                } else {
                    reject(new Error("No value for register " + variableName));
                }
            } else {
                // Is it a symbol?
                let address = this.symbolsMap.get(variableName);
                if (address !== undefined) {
                    // call to get the value in memory for this address
                    this.gdbProxy.getMemory(address, 4).then((memory) => {
                        resolve(memory);
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    reject(new Error("Unknown symbol " + variableName));
                }
            }
        });
    }

    private evaluateRequestGetMemory(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
        const matches = /m\s*([\{\}\$0-9a-z\+\-\*\/\%\(\)]+)\s*,\s*([0-9]+)(,\s*([0-9]+),\s*([0-9]+))?(,([abd]+))?/i.exec(args.expression);
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
                                const ckey = key;
                                // disassemble the code 
                                this.capstone.disassemble(memory).then((code) => {
                                    let [firstRow, variables] = this.debugExpressionHelper.processOutputFromDisassembler(code, startAddress);
                                    this.variableRefMap.set(ckey, variables);
                                    this.variableExpressionMap.set(args.expression, ckey);
                                    response.body = {
                                        result: firstRow,
                                        type: "array",
                                        variablesReference: ckey,
                                    };
                                    this.sendResponse(response);
                                }).catch((err) => {
                                    response.success = false;
                                    response.message = err.toString();
                                    this.sendResponse(response);
                                });
                            } else {
                                response.success = false;
                                response.message = "Capstone cstool must be configured in the settings";
                                this.sendResponse(response);
                            }
                        }
                    }).catch((err) => {
                        response.success = false;
                        response.message = err.toString();
                        this.sendResponse(response);
                    });
                }).catch((err) => {
                    response.success = false;
                    response.message = err.toString();
                    this.sendResponse(response);
                });
            } else {
                response.success = false;
                response.message = "Invalid memory dump expression";
                this.sendResponse(response);
            }
        } else {
            response.success = false;
            response.message = "Expression not recognized";
            this.sendResponse(response);
        }
    }

    private evaluateRequestSetMemory(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
        const matches = /M\s*([\{\}\$0-9a-z]+)\s*=\s*([0-9a-z]+)/i.exec(args.expression);
        if (matches) {
            let addrStr = matches[1];
            let data = matches[2];
            if ((addrStr !== null) && (data !== null) && (data.length > 0)) {
                // reaplace the address if it is a variable
                this.debugExpressionHelper.getAddressFromExpression(addrStr, args.frameId, this).then((address) => {
                    this.gdbProxy.setMemory(address, data).then(() => {
                        args.expression = 'm' + addrStr + ',' + data.length.toString(16);
                        return this.evaluateRequestGetMemory(response, args);
                    }).catch((err) => {
                        response.success = false;
                        response.message = err.toString();
                        this.sendResponse(response);
                    });
                }).catch((err) => {
                    response.success = false;
                    response.message = err.toString();
                    this.sendResponse(response);
                });
            } else {
                response.success = false;
                response.message = "Invalid memory set expression";
                this.sendResponse(response);
            }
        } else {
            response.success = false;
            response.message = "Expression not recognized";
            this.sendResponse(response);
        }
    }

    protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
        // Evaluate an expression
        let matches = /^([ad][0-7]|pc|sr)$/i.exec(args.expression);
        if (matches) {
            return this.evaluateRequestRegister(response, args);
        } else if (args.expression.startsWith('m')) {
            return this.evaluateRequestGetMemory(response, args);
        } else if (args.expression.startsWith('M')) {
            return this.evaluateRequestSetMemory(response, args);
        }
    }

    protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments): void {
        this.gdbProxy.pause().then(() => {
            this.sendResponse(response);
        }).catch(err => {
            response.success = false;
            response.message = err.toString();
            this.sendResponse(response);
        });
    }

    protected exceptionInfoRequest(response: DebugProtocol.ExceptionInfoResponse, args: DebugProtocol.ExceptionInfoArguments): void {
        this.gdbProxy.getHaltStatus().then((haltStatus) => {
            response.body = {
                exceptionId: haltStatus.code.toString(),
                description: haltStatus.details,
                breakMode: 'always'
            };
            this.sendResponse(response);
        }).catch(err => {
            response.success = false;
            response.message = err.toString();
            this.sendResponse(response);
        });
    }

    protected setExceptionBreakPointsRequest(response: DebugProtocol.SetExceptionBreakpointsResponse, args: DebugProtocol.SetExceptionBreakpointsArguments): void {
        if (args.filters.length > 0) {
            this.gdbProxy.setBreakPoint(0, 0, FsUAEDebugSession.DEFAULT_EXCEPTION_MASK).then(() => {
                this.sendResponse(response);
            }).catch((err) => {
                response.success = false;
                response.message = err.toString();
                this.sendResponse(response);
            });
        } else {
            this.gdbProxy.removeBreakPoint(0, 0, FsUAEDebugSession.DEFAULT_EXCEPTION_MASK).then(() => {
                this.sendResponse(response);
            }).catch((err) => {
                response.success = false;
                response.message = err.toString();
                this.sendResponse(response);
            });
        }
    }

	/**
	 * Updates the segments addresses of th hunks
	 * 
	 *@param segment The list of returned segments from the debugger 
	 */
    public updateSegments(segments: Array<Segment>) {
        let posSegment = 0;
        if (this.debugInfo) {
            let address = segments[posSegment].address;
            for (let hunk of this.debugInfo.hunks) {
                if (posSegment >= this.debugInfo.hunks.length) {
                    break;
                }
                hunk.segmentsId = posSegment;
                hunk.segmentsAddress = address;
            }
            // Retrieve the symbols
            const symbols = this.debugInfo.getSymbols(undefined);
            for (let s of symbols) {
                this.symbolsMap.set(s.name, s.offset + address);
            }
        }
    }

    //---- helpers
    private createSource(filePath: string): Source {
        return new Source(basename(filePath), this.convertDebuggerPathToClient(filePath));
    }
}
