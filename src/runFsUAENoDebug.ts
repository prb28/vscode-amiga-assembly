/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
	Logger, logger,
	InitializedEvent, Scope, TerminatedEvent, DebugSession
} from 'vscode-debugadapter/lib/main';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { CancellationTokenSource, window, Uri } from 'vscode';
import { ExecutorHelper } from './execHelper';
import { FileProxy } from './fsProxy';

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
	/** Build the workspace before debug */
	buildWorkspace?: boolean;
	/** emulator program */
	emulator?: string;
	/** emulator working directory */
	emulatorWorkingDir?: string;
	/** Emulator options */
	options: Array<string>;
}
export class RunFsUAENoDebugSession extends DebugSession {
	/** Executor to run fs-uae */
	private executor: ExecutorHelper;

	/** Token to cancel the emulator */
	private cancellationTokenSource?: CancellationTokenSource;

	/**
	 * Creates a new debug adapter that is used for one debug session.
	 * We configure the default implementation of a debug adapter here.
	 */
	public constructor() {
		super();
		this.executor = new ExecutorHelper();
		// this debugger uses zero-based lines and columns
		this.setDebuggerLinesStartAt1(false);
		this.setDebuggerColumnsStartAt1(false);
	}

	/**
	 * Setting the context to run the tests.
	 * @param executor mocked executor
	 */
	public setTestContext(executor: ExecutorHelper) {
		this.executor = executor;
	}


	/**
	 * The 'initialize' request is the first request called by the frontend
	 * to interrogate the features the debug adapter provides.
	 */
	protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {

		// build and return the capabilities of this debug adapter:
		response.body = response.body || {};
		response.body.supportsConfigurationDoneRequest = false;
		response.body.supportsEvaluateForHovers = false;
		response.body.supportsStepBack = false;
		response.body.supportsRestartFrame = false;
		response.body.supportsConditionalBreakpoints = false;
		response.body.supportsSetExpression = false;
		response.body.supportsSetVariable = false;
		this.sendResponse(response);

		// since this debug adapter can accept configuration requests like 'setBreakpoint' at any time,
		// we request them early by sending an 'initializeRequest' to the frontend.
		// The frontend will end the configuration sequence by calling 'configurationDone' request.
		this.sendEvent(new InitializedEvent());
	}

	protected async launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments) {
		// make sure to set the buffered logging to warn if 'trace' is not set
		logger.setup(args.trace ? Logger.LogLevel.Verbose : Logger.LogLevel.Log, false);

		// Launch the emulator
		this.startEmulator(args).catch(err => {
			window.showErrorMessage(err.message);
			this.sendEvent(new TerminatedEvent());
			response.success = false;
			response.message = err.message;
			this.sendResponse(response);
			return;
		});

		this.sendResponse(response);
	}

	public checkEmulator(emulatorPath: string): Promise<boolean> {
		// Function useful for testing - mocking
		let fileProxy = new FileProxy(Uri.file(emulatorPath));
		return fileProxy.exists();
	}

	public async startEmulator(args: LaunchRequestArguments): Promise<void> {
		logger.warn("Starting emulator: " + args.emulator);
		const emulatorExe = args.emulator;
		const emulatorWorkingDir = args.emulatorWorkingDir || null;
		if (emulatorExe) {
			// Is the emulator exe present in the filesystem ?
			if (this.checkEmulator(emulatorExe)) {
				this.cancellationTokenSource = new CancellationTokenSource();
				try {
					await this.executor.runTool(args.options, emulatorWorkingDir, "warning", true, emulatorExe, null, true, null, this.cancellationTokenSource.token);
					this.sendEvent(new TerminatedEvent());
				} catch (err) {
					throw new Error(`Error raised by the emulator run: ${err.message}`);
				}
			} else {
				throw new Error(`The emulator executable '${emulatorExe}' cannot be found`);
			}
		} else {
			throw new Error("The emulator executable file path must be defined in the launch settings");
		}
	}

	protected terminateEmulator() {
		if (this.cancellationTokenSource) {
			this.cancellationTokenSource.cancel();
		}
	}

	public terminate() {
		this.terminateEmulator();
	}

	public shutdown() {
		this.terminate();
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
