/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
	Logger, logger,
	LoggingDebugSession,
	InitializedEvent, Scope, TerminatedEvent
} from 'vscode-debugadapter/lib/main';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { CancellationTokenSource } from 'vscode';
import { Executor } from './executor';
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
	/** enable logging the Debug Adapter Protocol */
	trace?: boolean;
	/** emulator program */
	emulator?: string;
	/** configuration file */
	conf: string;
	/** drive */
	drive: string;
	/** Build the workspace before debug */
	buildWorkspace?: boolean;
}
export class RunFsUAENoDebugSession extends LoggingDebugSession {
	private configurationDone = new Subject();

	/** Executor to run fs-uae */
	private executor: Executor;

	/** Token to cancle the emulator */
	private cancellationTokenSource?: CancellationTokenSource;

	/**
	 * Creates a new debug adapter that is used for one debug session.
	 * We configure the default implementation of a debug adapter here.
	 */
	public constructor() {
		super("RunFsUAENoDebugSession.txt");
		this.executor = new Executor();
		// this debugger uses zero-based lines and columns
		this.setDebuggerLinesStartAt1(false);
		this.setDebuggerColumnsStartAt1(false);
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
		response.body.supportsStepBack = true;

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

	protected async launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments) {
		// make sure to set the buffered logging to warn if 'trace' is not set
		logger.setup(args.trace ? Logger.LogLevel.Verbose : Logger.LogLevel.Log, false);

		// Launch the emulator
		this.startEmulator(args);

		// wait until configuration has finished (and configurationDoneRequest has been called)
		await this.configurationDone.wait(1000);
		this.sendResponse(response);
	}

	public startEmulator(args: LaunchRequestArguments) {
		logger.warn("Starting emulator: " + args.emulator);
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
		// send back the actual breakpoint positions
		response.body = {
			breakpoints: []
		};
		this.sendResponse(response);
	}

	protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
		// runtime supports now threads so just return a default thread.
		response.body = {
			threads: []
		};
		this.sendResponse(response);
	}

	protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): void {
		response.body = {
			stackFrames: [],
			totalFrames: 0
		};
		this.sendResponse(response);
	}

	protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
		const scopes = new Array<Scope>();
		response.body = {
			scopes: scopes
		};
		this.sendResponse(response);
	}

	protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): void {
		const variables = new Array<DebugProtocol.Variable>();
		response.body = {
			variables: variables
		};
		this.sendResponse(response);
	}

	protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): void {
		this.sendResponse(response);
	}

	protected reverseContinueRequest(response: DebugProtocol.ReverseContinueResponse, args: DebugProtocol.ReverseContinueArguments): void {
		this.sendResponse(response);
	}

	protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
		this.sendResponse(response);
	}

	protected stepBackRequest(response: DebugProtocol.StepBackResponse, args: DebugProtocol.StepBackArguments): void {
		this.sendResponse(response);
	}

}