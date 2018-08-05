import {
	Logger, logger,
	LoggingDebugSession,
	InitializedEvent, TerminatedEvent, StoppedEvent, BreakpointEvent,
	Thread, StackFrame, Scope, Source, Handles
} from 'vscode-debugadapter/lib/main';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { basename } from 'path';
import { GdbProxy, GdbRegister, GdbBreakpoint, Segment, GdbHaltStatus } from './gdbProxy';
import { Executor } from './executor';
import { CancellationTokenSource, workspace } from 'vscode';
import { DebugInfo } from './debugInfo';
import { Capstone } from './capstone';
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
	/** Emulator options */
	options: Array<string>;
	/** path replacements for source files */
	sourceFileMap?: Object;
	/** Build the workspace before debug */
	buildWorkspace?: boolean;
}

export class FsUAEDebugSession extends LoggingDebugSession {

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
	private executor: Executor;

	/** Token to cancel the emulator */
	private cancellationTokenSource?: CancellationTokenSource;

	/** Debug information for the loaded program */
	private debugInfo?: DebugInfo;

	/** Tool to disassemble */
	private capstone?: Capstone;

	/**
	 * Creates a new debug adapter that is used for one debug session.
	 * We configure the default implementation of a debug adapter here.
	 */
	public constructor() {
		super("fsuae-debug.txt");
		// this debugger uses zero-based lines and columns
		this.setDebuggerLinesStartAt1(false);
		this.setDebuggerColumnsStartAt1(false);
		this.gdbProxy = new GdbProxy(undefined);
		this.initProxy();
		this.executor = new Executor();
	}

	/**
	 * Setting the context to run the tests.
	 * @param gdbProxy mocked proxy
	 * @param executor mocked executor
	 */
	public setTestContext(gdbProxy: GdbProxy, executor: Executor) {
		this.executor = executor;
		this.gdbProxy = gdbProxy;
		this.initProxy();
		this.testMode = true;
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
		let configuration = workspace.getConfiguration('amiga-assembly');
		let conf: any = configuration.get('cstool');
		if (conf && (conf.length > 5)) {
			this.capstone = new Capstone(conf);
		}

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
		if ((!args.program) || (!this.loadDebugInfo(args))) {
			response.success = false;
			response.message = "Invalid program to debug - review launch settings";
			this.sendResponse(response);
		}

		// Showing the help text
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

		// Launch the emulator
		this.startEmulator(args);

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
			debAdapter.gdbProxy.connect(args.serverName, args.serverPort).then(() => {
				// Loads the program
				logger.warn("Starting program: " + args.program);
				debAdapter.gdbProxy.load(args.program, args.stopOnEntry).then(() => {
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

	public startEmulator(args: LaunchRequestArguments) {
		if (args.startEmulator) {
			logger.warn("Starting emulator: " + args.emulator);
			this.cancellationTokenSource = new CancellationTokenSource();
			if (args.emulator) {
				this.executor.runTool(args.options, null, "warning", true, args.emulator, null, true, null, this.cancellationTokenSource.token).then(() => {
					this.sendEvent(new TerminatedEvent());
				}).catch(err => {
					this.sendEvent(new TerminatedEvent());
				});
			}
		} else {
			logger.warn("Emulator starting skipped by settings");
		}
	}

	protected terminateEmulator() {
		if (this.cancellationTokenSource) {
			this.cancellationTokenSource.cancel();
		}
	}

	protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void {
		new Promise(async (resolve, reject) => {
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
				if (this.debugInfo) {
					let values = this.debugInfo.getAddressSeg(path, l);
					if (values) {
						await this.gdbProxy.setBreakPoint(values[0], values[1]).then(bp => {
							breakPoints.push(bp);
						});
					}
				} else {
					// TODO : keep the breakpoint to do it later
				}
			}
			if (this.debugInfo) {
				let debugBreakPoints = new Array<DebugProtocol.Breakpoint>();
				for (let i = 0; i < breakPoints.length; i++) {
					let breakpt = breakPoints[i];
					let values = this.debugInfo.resolveFileLine(breakpt.segmentId, breakpt.offset);
					if (values) {
						debugBreakPoints.push(<DebugProtocol.Breakpoint>{
							id: breakpt.id,
							line: values[1],
							source: path, // The path is the local path and not the stored in binary file
							verified: true // We assume that if the line is in the binary, it is verified
						});
					}
				}
				// send back the actual breakpoint positions
				response.body = {
					breakpoints: debugBreakPoints
				};
			} else {
				// TODO : keep the breakpoint to do it later
			}
			resolve();
		}).then(() => {
			this.sendResponse(response);
		}).catch((err) => {
			response.success = false;
			response.message = err.toString();
			this.sendResponse(response);
		});
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
					if (f.segmentId >= 0) {
						let values = dbgInfo.resolveFileLine(f.segmentId, f.offset);
						if (values) {
							stackFrames.push(new StackFrame(f.index, "Thread CPU", this.createSource(values[0]), values[1], 1));
						}
					}
					stackFrames.push(new StackFrame(f.index, "Thread CPU"));
				}
				response.body = {
					stackFrames: stackFrames,
					totalFrames: stk.count
				};
				this.sendResponse(response);
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
					this.gdbProxy.registers().then((registers: Array<GdbRegister>) => {
						const variables = new Array<DebugProtocol.Variable>();
						for (let i = 0; i < registers.length; i++) {
							let r = registers[i];
							variables.push({
								name: r.name,
								type: "register",
								value: this.padStartWith0(r.value.toString(16), 8),
								variablesReference: 0
							});
						}
						response.body = {
							variables: variables
						};
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
						this.sendResponse(response);
					}
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
		let value = this.gdbProxy.getRegister(args.expression);
		if (value) {
			response.body = {
				result: value,
				variablesReference: 0,
			};
		} else {
			response.success = false;
		}
		this.sendResponse(response);
	}

	protected getVariableValue(variableName: string): Promise<string> {
		return new Promise<(any | null)>((resolve, reject) => {
			// Is it a register?
			let matches = /^([ad][0-7]|pc|sr)$/i.exec(variableName);
			if (matches) {
				resolve(this.gdbProxy.getRegister(variableName));
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

	private checkAddressForEvaluation(address: string): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			if (address !== null) {
				if (address.startsWith('${')) {
					// It's a variable designation
					let variable = address.substring(2, address.length - 1);
					this.getVariableValue(variable).then(value => {
						let v = parseInt(value, 16);
						resolve(v);
					}).catch(err => {
						reject(err);
					});
				} else {
					if (address.startsWith('$')) {
						resolve(parseInt(address.substring(1), 16));
					} else if (address.startsWith('#')) {
						resolve(parseInt(address.substring(1)));
					} else {
						resolve(parseInt(address, 16));
					}
				}
			} else {
				reject(new Error("Invalid address"));
			}
		});
	}

	private evaluateRequestGetMemory(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
		const matches = /m\s*([\{\}\$0-9a-z]+)\s*,\s*([0-9]+)(,\s*([0-9]+),\s*([0-9]+))?(,([abd]+))?/i.exec(args.expression);
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
				// reaplace the address if it is a variable
				this.checkAddressForEvaluation(matches[1]).then((address) => {
					// ask for memory dump
					this.gdbProxy.getMemory(address, length).then((memory) => {
						let key = this.variableExpressionMap.get(args.expression);
						if (!key) {
							key = this.variableHandles.create(args.expression);
						}
						let variables = new Array<DebugProtocol.Variable>();
						let startAddress = address;
						let firstRow = "";
						if (mode !== "d") {
							let chunks = this.chunk(memory.toString(), wordLength * 2);
							let i = 0;
							let rowCount = 0;
							let row = "";
							while (i < chunks.length) {
								if (rowCount > 0) {
									row += " ";
								}
								row += chunks[i];
								if ((rowCount >= rowLength - 1) || (i === chunks.length - 1)) {
									if (mode.indexOf('a') >= 0) {
										let asciiText = this.convertToASCII(row.replace(/\s+/g, ''));
										if (mode.indexOf('b') >= 0) {
											if ((i === chunks.length - 1) && (rowCount < rowLength - 1)) {
												let chuksMissing = rowLength - 1 - rowCount;
												let padding = chuksMissing * wordLength * 2 + chuksMissing;
												for (let j = 0; j < padding; j++) {
													row += " ";
												}
											}
											row += " | ";
										} else {
											row = "";
										}
										row += asciiText;
									}
									variables.push({
										value: row,
										name: this.padStartWith0(startAddress.toString(16), 8),
										variablesReference: 0
									});
									if (firstRow.length <= 0) {
										firstRow = row;
									}
									startAddress += rowCount * wordLength;
									rowCount = 0;
									row = "";
								} else {
									rowCount++;
								}
								i++;
							}
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
									let lines = code.split('\n');
									let i = 0;
									for (let l of lines) {
										let elms = l.split("  ");
										if (elms.length > 2) {
											let instructionElms = elms[2].split('\t');
											let instuction = elms[2];
											if (instructionElms.length > 1) {
												instuction = instructionElms[0] + this.getEndPad(instructionElms[0], 10) + instructionElms[1];
											}
											let v = elms[1] + this.getEndPad(elms[1], 26) + instuction;
											if (firstRow.length <= 0) {
												firstRow = elms[2].replace("\t", " ");
											}
											let offset = parseInt(elms[0], 16);
											let addOffset = address + offset;
											variables.push({
												value: v,
												name: addOffset.toString(16),
												variablesReference: 0
											});
										} else {
											if (firstRow.length <= 0) {
												firstRow = l;
											}
											variables.push({
												value: l,
												name: i.toString(),
												variablesReference: 0
											});
										}
										i++;
									}
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
				this.checkAddressForEvaluation(addrStr).then((address) => {
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
		let matches = /^[ad][0-7]$/i.exec(args.expression);
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
		let mask = 0b1111111000000010000011110000000000000000011111111111100;
		if (args.filters.length > 0) {
			this.gdbProxy.setBreakPoint(0, 0, mask).then(() => {
				this.sendResponse(response);
			}).catch((err) => {
				response.success = false;
				response.message = err.toString();
				this.sendResponse(response);
			});
		} else {
			this.gdbProxy.removeBreakPoint(0, 0, mask).then(() => {
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
		return new Source(basename(filePath), this.convertDebuggerPathToClient(filePath), undefined, undefined, 'mock-adapter-data');
	}

	/**
     * Padding on start of string
     * @param stringToPad String to pad
     * @param targetLength Length targetted
     * @return Padding string
     */
	public padStartWith0(stringToPad: string, targetLength: number): string {
		targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
		let padString = '0';
		if (stringToPad.length > targetLength) {
			return stringToPad;
		}
		else {
			targetLength = targetLength - stringToPad.length;
			if (targetLength > padString.length) {
				padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
			}
			return padString.slice(0, targetLength) + stringToPad;
		}
	}
	/**
	 * Getting the pad of the good size at the end of string
	 * @param stringToPad String to pad
	 * @param targetLength Length targetted
	 * @return Padding string
	 */
	public getEndPad(stringToPad: string, targetLength: number): string {
		targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
		let padString = ' ';
		if (stringToPad.length > targetLength) {
			return '';
		}
		else {
			targetLength = targetLength - stringToPad.length;
			if (targetLength > padString.length) {
				padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
			}
			return padString.slice(0, targetLength);
		}
	}
	private chunk(str: string, n: number): string[] {
		let ret = [];
		let maxCount = str.length - n - 1;
		let i;
		for (i = 0; i < maxCount; i += n) {
			ret.push(str.substring(i, n + i));
		}
		if ((str.length - i) > 0) {
			ret.push(str.substring(i));
		}
		return ret;
	}
	private convertToASCII(memory: string): string {
		let asciiContents = "";
		var chunks = this.chunk(memory, 2);
		for (let c of chunks) {
			let i = parseInt(c, 16);
			if ((i < 32) || (i > 176)) {
				asciiContents += ".";
			} else {
				asciiContents += String.fromCharCode(i);
			}
		}
		return asciiContents;
	}
}
