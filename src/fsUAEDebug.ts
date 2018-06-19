/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
	Logger, logger,
	LoggingDebugSession,
	InitializedEvent, TerminatedEvent, StoppedEvent, BreakpointEvent,
	Thread, StackFrame, Scope, Source, Handles
} from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol';
import { basename } from 'path';
import { GdbProxy, GdbStackFrame, GdbRegister, GdbBreakpoint, Segment, GdbStackPosition } from './gdbProxy';
import { Executor } from './executor';
import { CancellationTokenSource } from 'vscode';
import { DebugInfo } from './debugInfo';
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
	/** emulator program */
	emulator?: string;
	/** configuration file */
	conf: string;
	/** drive */
	drive: string;
	/** path replacements for source files */
	sourceFileMap?: Object;
}

export class FsUAEDebugSession extends LoggingDebugSession {

	// we don't support multiple threads, so we can use a hardcoded ID for the default thread
	private static THREAD_ID = 1;

	// a Mock runtime (or debugger)
	private _variableHandles = new Handles<string>();

	private _configurationDone = new Subject();

	private _gdbProxy: GdbProxy = new GdbProxy();

	/** Executor to run fs-uae */
	private executor = new Executor();

	/** TOken to cancle the emulator */
	private cancellationTokenSource?: CancellationTokenSource;

	/** Debug information for the loaded program */
	private debugInfo?: DebugInfo;
	/**
	 * Creates a new debug adapter that is used for one debug session.
	 * We configure the default implementation of a debug adapter here.
	 */
	public constructor() {
		super("fsuae-debug.txt");

		// this debugger uses zero-based lines and columns
		this.setDebuggerLinesStartAt1(false);
		this.setDebuggerColumnsStartAt1(false);

		// setup event handlers
		this._gdbProxy.on('stopOnEntry', () => {
			this.sendEvent(new StoppedEvent('entry', FsUAEDebugSession.THREAD_ID));
		});
		this._gdbProxy.on('stopOnStep', () => {
			this.sendEvent(new StoppedEvent('step', FsUAEDebugSession.THREAD_ID));
		});
		this._gdbProxy.on('stopOnBreakpoint', () => {
			this.sendEvent(new StoppedEvent('breakpoint', FsUAEDebugSession.THREAD_ID));
		});
		this._gdbProxy.on('stopOnException', () => {
			this.sendEvent(new StoppedEvent('exception', FsUAEDebugSession.THREAD_ID));
		});
		this._gdbProxy.on('segmentsUpdated', (segments: Array<Segment>) => {
			this.updateSegments(segments);
		});
		this._gdbProxy.on('breakpointValidated', (bp: GdbBreakpoint) => {
			let debugBp = <DebugProtocol.Breakpoint>{
				verified: bp.verified,
				id: bp.id
			};
			this.sendEvent(new BreakpointEvent('changed', debugBp));
		});
		// this._gdbProxy.on('output', (text: string, filePath: string, line: number, column: number) => {
		// 	const e: DebugProtocol.OutputEvent = new OutputEvent(`${text}\n`);
		// 	e.body.source = this.createSource(filePath);
		// 	e.body.line = this.convertDebuggerLineToClient(line);
		// 	e.body.column = this.convertDebuggerColumnToClient(column);
		// 	this.sendEvent(e);
		// });
		this._gdbProxy.on('end', () => {
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
		this._configurationDone.notify();
	}

	protected async launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments) {

		// make sure to 'Stop' the buffered logging if 'trace' is not set
		logger.setup(args.trace ? Logger.LogLevel.Verbose : Logger.LogLevel.Stop, false);

		// Loads the debug info
		console.log(args.sourceFileMap);
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
		this.debugInfo.loadInfo(args.program);

		// Launch the emulator
		//this.startEmulator(args);

		// wait until configuration has finished (and configurationDoneRequest has been called)
		await this._configurationDone.wait(1000);

		// temp to use in timeout
		let debAdapter = this;

		setTimeout(function () {

			// connects to FS-UAE
			debAdapter._gdbProxy.connect(args.serverName, args.serverPort).then(() => {
				// Loads the program
				debAdapter._gdbProxy.load(args.program, args.stopOnEntry);
				debAdapter.sendResponse(response);
			}).catch(err => {
				response.success = false;
				response.message = err.toString();
				debAdapter.sendResponse(response);
			});
		}, 3000);
	}

	protected startEmulator(args: LaunchRequestArguments) {
		this.cancellationTokenSource = new CancellationTokenSource();
		if (args.emulator) {
			let pargs = [args.conf];
			this.executor.runTool(pargs, null, "warning", true, args.emulator, null, true, null, this.cancellationTokenSource.token).then(() => {
				this.sendEvent(new TerminatedEvent());
			}).catch(err => {
				this.sendEvent(new TerminatedEvent());
			});
		}
	}

	protected terminateEmulator() {
		if (this.cancellationTokenSource) {
			this.cancellationTokenSource.cancel();
		}
	}

	protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void {
		const path = <string>args.source.path;
		const clientLines = args.lines || [];

		// clear all breakpoints for this file
		if (this.debugInfo) {
			let values = this.debugInfo.getAllSegmentIds(path);
			for (let segmentId of values) {
				this._gdbProxy.clearBreakpoints(segmentId);
			}
		}

		// set and verify breakpoint locations
		let promises: Promise<GdbBreakpoint>[] = [];
		clientLines.map(l => {
			if (this.debugInfo) {
				let values = this.debugInfo.getAddressSeg(path, l);
				if (values) {
					promises.push(this._gdbProxy.setBreakPoint(values[0], values[1]).then(bp => {
						return bp;
					}));
				}
			} else {
				// TODO : keep the breakpoint to do it later
			}
		});
		Promise.all(promises).then((breakPoints: GdbBreakpoint[]) => {
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
		let stk: GdbStackFrame = this._gdbProxy.stack();
		if (this.debugInfo) {
			const dbgInfo = this.debugInfo;
			response.body = {
				stackFrames: stk.frames.map((f: GdbStackPosition) => {
					let values = dbgInfo.resolveFileLine(f.segmentId, f.offset);
					let file = "";
					let line = 0;
					if (values) {
						file = values[0];
						line = values[1];
					}
					return new StackFrame(f.index, file, this.createSource(file), line);
				}),
				totalFrames: stk.count
			};
		}
		this.sendResponse(response);
	}

	protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
		const frameReference = args.frameId;
		const scopes = new Array<Scope>();
		scopes.push(new Scope("Local", this._variableHandles.create("local_" + frameReference), false));
		scopes.push(new Scope("Global", this._variableHandles.create("global_" + frameReference), true));

		response.body = {
			scopes: scopes
		};
		this.sendResponse(response);
	}

	protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): void {
		this._gdbProxy.registers().then((registers: Array<GdbRegister>) => {
			const variables = new Array<DebugProtocol.Variable>();
			const id = this._variableHandles.get(args.variablesReference);
			if (id !== null) {
				for (let i = 0; i < registers.length; i++) {
					let r = registers[i];
					variables.push({
						name: r.name,
						type: "string",
						value: this.padStartWith0(r.value.toString(16), 8),
						variablesReference: 0
					});
				}
			}

			response.body = {
				variables: variables
			};
			this.sendResponse(response);
		});

	}

	public terminate() {
		this.terminateEmulator();
	}

	protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): void {
		this._gdbProxy.continueExecution();
		this.sendResponse(response);
	}

	protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
		this._gdbProxy.step();
		this.sendResponse(response);
	}

	protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
		// Evaluate an expression
		const matches = /m\s*([0-9a-z]+)\s*,\s*([0-9a-z]+)/i.exec(args.expression);
		if (matches) {
			let address = parseInt(matches[1], 16);
			let length = parseInt(matches[2], 16);
			if ((address !== null) && (length !== null)) {
				// ask for memory dump
				this._gdbProxy.memory(address, length).then((memory) => {
					response.body = {
						result: this.chunk(memory.toString(), 8),
						type: "string",
						variablesReference: 0,
					};
					this.sendResponse(response);
				});
			} else {
				response.success = false;
				response.message = "Invalid memory dump expression";
				this.sendResponse(response);
			}
		} else {
			response.success = false;
			response.message = "Expression non recognized";
			this.sendResponse(response);
		}
	}

	/**
	 * Updates the segments addresses of th hunks
	 * 
	 *@param segment The list of returned segments from the debugger 
	 */
	private updateSegments(segments: Array<Segment>) {
		let posSegment = 0;
		if (this.debugInfo) {
			for (let hunk of this.debugInfo.hunks) {
				if (posSegment >= this.debugInfo.hunks.length) {
					break;
				}
				hunk.segmentsId = posSegment;
				hunk.segmentsAddress = segments[posSegment].address;
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
	private chunk(str: string, n: number): string {
		let ret = [];
		for (let i = 0; i < str.length - n - 1; i += n) {
			ret.push(str.substring(i, n + i));
		}
		return ret.join(' ');
	}

}
