/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
	Logger, logger,
	LoggingDebugSession,
	InitializedEvent, TerminatedEvent, StoppedEvent, BreakpointEvent, OutputEvent,
	Thread, StackFrame, Scope, Source, Handles
} from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol';
import { basename } from 'path';
import { GdbProxy, GdbBreakpoint, GdbStackFrame, GdbRegister } from './gdbProxy';
import { Executor } from './executor';
import { CancellationTokenSource } from 'vscode';
const { Subject } = require('await-notify');


/**
 * This interface describes the mock-debug specific launch attributes
 * (which are not part of the Debug Adapter Protocol).
 * The schema for these attributes lives in the package.json of the mock-debug extension.
 * The interface should always match this schema.
 */
interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
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
	emulator: string;
	/** configuration file */
	conf: string;
	/** drive */
	drive: string;
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
	private cancellationTokenSource?: CancellationTokenSource;

	/**
	 * Creates a new debug adapter that is used for one debug session.
	 * We configure the default implementation of a debug adapter here.
	 */
	public constructor() {
		super("mock-debug.txt");

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
		this._gdbProxy.on('breakpointValidated', (bp: GdbBreakpoint) => {
			this.sendEvent(new BreakpointEvent('changed', <DebugProtocol.Breakpoint>{ verified: bp.verified, id: bp.id }));
		});
		this._gdbProxy.on('output', (text: string, filePath: string, line: number, column: number) => {
			const e: DebugProtocol.OutputEvent = new OutputEvent(`${text}\n`);
			e.body.source = this.createSource(filePath);
			e.body.line = this.convertDebuggerLineToClient(line);
			e.body.column = this.convertDebuggerColumnToClient(column);
			this.sendEvent(e);
		});
		this._gdbProxy.on('end', () => {
			this.sendEvent(new TerminatedEvent());
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

		// Launch the emulator
		this.startEmulator(args);

		// wait until configuration has finished (and configurationDoneRequest has been called)
		await this._configurationDone.wait(1000);

		// temp to use in timeout
		let debAdapter = this;

		setTimeout(function () {

			// connects to FS-UAE
			debAdapter._gdbProxy.connect(args.serverName, args.serverPort);

			debAdapter._gdbProxy.setBreakPoint("", 0);
			// Loads the program
			debAdapter._gdbProxy.load(args.program);
			//this._gdbProxy.start(args.program, !!args.stopOnEntry);

			debAdapter.sendResponse(response);
		}, 3000);
	}

	protected startEmulator(args: LaunchRequestArguments) {
		this.cancellationTokenSource = new CancellationTokenSource();
		let pargs = [args.conf];
		this.executor.runTool(pargs, null, "warning", true, args.emulator, null, true, null, this.cancellationTokenSource.token);
	}

	protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void {

		const path = <string>args.source.path;
		const clientLines = args.lines || [];

		// clear all breakpoints for this file
		this._gdbProxy.clearBreakpoints(path);

		// set and verify breakpoint locations
		let promises: Promise<GdbBreakpoint>[] = [];
		clientLines.map(l => {
			promises.push(this._gdbProxy.setBreakPoint(path, this.convertClientLineToDebugger(l)).then(bp => {
				return bp;
			}));
		});
		Promise.all(promises).then((breakPoints: GdbBreakpoint[]) => {
			// send back the actual breakpoint positions
			response.body = {
				breakpoints: breakPoints
			};
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
		this._gdbProxy.stack().then((stk: GdbStackFrame) => {
			response.body = {
				stackFrames: stk.frames.map((f: any) => new StackFrame(f.index, f.name, this.createSource(f.file), this.convertDebuggerLineToClient(f.line))),
				totalFrames: stk.count
			};
			this.sendResponse(response);
		});
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
						value: r.value,
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

	protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): void {
		this._gdbProxy.continue();
		this.sendResponse(response);
	}

	protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
		this._gdbProxy.step();
		this.sendResponse(response);
	}

	protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
		/*
				let reply: string | undefined = undefined;
		
				if (args.context === 'repl') {
					// 'evaluate' supports to create and delete breakpoints from the 'repl':
					const matches = /new +([0-9]+)/.exec(args.expression);
					if (matches && matches.length === 2) {
						const mbp = this._gdbProxy.setBreakPoint(this._gdbProxy.sourceFile, this.convertClientLineToDebugger(parseInt(matches[1])));
						const bp = <DebugProtocol.Breakpoint>new Breakpoint(mbp.verified, this.convertDebuggerLineToClient(mbp.line), undefined, this.createSource(this._gdbProxy.sourceFile));
						bp.id = mbp.id;
						this.sendEvent(new BreakpointEvent('new', bp));
						reply = `breakpoint created`;
					} else {
						const matches = /del +([0-9]+)/.exec(args.expression);
						if (matches && matches.length === 2) {
							const mbp = this._gdbProxy.clearBreakPoint(this._gdbProxy.sourceFile, this.convertClientLineToDebugger(parseInt(matches[1])));
							if (mbp) {
								const bp = <DebugProtocol.Breakpoint>new Breakpoint(false);
								bp.id = mbp.id;
								this.sendEvent(new BreakpointEvent('removed', bp));
								reply = `breakpoint deleted`;
							}
						}
					}
				}
		
				response.body = {
					result: reply ? reply : `evaluate(context: '${args.context}', '${args.expression}')`,
					variablesReference: 0
				};*/
		this.sendResponse(response);
	}

	//---- helpers

	private createSource(filePath: string): Source {
		return new Source(basename(filePath), this.convertDebuggerPathToClient(filePath), undefined, undefined, 'mock-adapter-data');
	}
}
