import assert = require('assert');
import { expect } from 'chai';
import * as Path from 'path';
import { DebugClient } from 'vscode-debugadapter-testsupport/lib/main';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { LaunchRequestArguments } from '../fsUAEDebug';
import * as Net from 'net';
import * as vscode from 'vscode';
import { GdbProxy } from '../gdbProxy';
import { GdbStackFrame, GdbStackPosition, GdbRegister, Segment, GdbHaltStatus, GdbThread, GdbAmigaSysThreadIdWinUAE } from '../gdbProxyCore';
import { spy, anyString, instance, when, anything, mock, anyNumber, reset, verify, resetCalls, capture } from 'ts-mockito/lib/ts-mockito';
import { ExecutorHelper } from '../execHelper';
import { Capstone } from '../capstone';
import { BreakpointManager, GdbBreakpoint } from '../breakpointManager';
import { DebugDisassembledFile } from '../debugDisassembled';
import { ExtensionState } from '../extension';
import { WinUAEDebugSession } from '../winUAEDebug';

describe('Node Debug Adapter for WinUAE', () => {
	const PROJECT_ROOT = Path.join(__dirname, '..', '..').replace(/\\+/g, '/');
	const DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'out', 'debugAdapter.js').replace(/\\+/g, '/');
	const DATA_ROOT = Path.join(PROJECT_ROOT, 'test_files', 'debug').replace(/\\+/g, '/');
	const FSUAE_ROOT = Path.join(DATA_ROOT, 'fs-uae').replace(/\\+/g, '/');
	const UAE_DRIVE = Path.join(FSUAE_ROOT, 'hd0').replace(/\\+/g, '/');
	const SOURCE_FILE_NAME = Path.join(DATA_ROOT, 'gencop.s').replace(/\\+/g, '/');
	let launchArgs = <LaunchRequestArguments>{
		program: Path.join(UAE_DRIVE, 'hello'),
		stopOnEntry: false,
		serverName: 'localhost',
		serverPort: 2345,
		startEmulator: true,
		emulator: Path.join(FSUAE_ROOT, 'fs-uae'),
		options: [Path.join(FSUAE_ROOT, 'test.fs-uae')],
		drive: Path.join(FSUAE_ROOT, 'hd0'),
		sourceFileMap: {
			"C:\\Users\\paulr\\workspace\\amiga\\projects\\vscode-amiga-wks-example": DATA_ROOT
		}
	};
	let dc: DebugClient;
	let callbacks = new Map<string, any>();
	let testWithRealEmulator = false;
	let defaultTimeout = 10000;
	let th = new GdbThread(0, GdbAmigaSysThreadIdWinUAE.CPU);
	let thCop = new GdbThread(1, GdbAmigaSysThreadIdWinUAE.COP);

	before(async function () {
		this.timeout(defaultTimeout);
		GdbThread.setSupportMultiprocess(false);
		// activate the extension
		let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
		if (ext) {
			await ext.activate();
			await ExtensionState.getCurrent().getLanguage();
		}
		if (testWithRealEmulator) {
			defaultTimeout = 60000;
		}
		// start listening on a random port
		this.server = Net.createServer(socket => {
			this.session = new WinUAEDebugSession();
			if (!testWithRealEmulator) {
				this.session.setTestContext(this.gdbProxy, this.executor, this.capstone);
			}
			this.session.setRunAsServer(true);
			this.session.start(<NodeJS.ReadableStream>socket, socket);
			this.spiedSession = spy(this.session);
			when(this.spiedSession.checkEmulator(anything())).thenReturn(true);
			when(this.spiedSession.updateDisassembledView(anything(), anything())).thenReturn(Promise.resolve());
		}).listen(0);
	});


	beforeEach(function () {
		this.timeout(defaultTimeout);
		this.mockedExecutor = mock(ExecutorHelper);
		this.executor = instance(this.mockedExecutor);
		this.mockedGdbProxy = mock(GdbProxy);
		this.mockedCapstone = mock(Capstone);
		this.capstone = instance(this.mockedCapstone);
		when(this.mockedGdbProxy.on(anyString(), anything())).thenCall(async (event: string, callback: (() => void)) => {
			callbacks.set(event, callback);
		});
		when(this.mockedGdbProxy.getCurrentCpuThread()).thenReturn(th);
		this.gdbProxy = instance(this.mockedGdbProxy);
		when(this.mockedExecutor.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenReturn(Promise.resolve([]));
		this.timeout(this.defaultTimeout);
		// start port listener on launch of first debug this.session
		if (!this.server) {
			// start listening on a random port
			this.server = Net.createServer(socket => {
				this.session = new WinUAEDebugSession();
				if (!testWithRealEmulator) {
					this.session.setTestContext(this.gdbProxy, this.executor, this.capstone);
				}
				this.session.setRunAsServer(true);
				this.session.start(<NodeJS.ReadableStream>socket, socket);
				this.spiedSession = spy(this.session);
			}).listen(0);
		}
		// make VS Code connect to debug server instead of launching debug adapter
		dc = new DebugClient('node', DEBUG_ADAPTER, 'fs-uae');
		let address: any = this.server.address();
		let port = 0;
		if (address instanceof Object) {
			port = address.port;
		}
		return dc.start(port);
	});

	afterEach(function () {
		reset(this.spiedSession);
		reset(this.mockedExecutor);
		reset(this.mockedGdbProxy);
		return dc.stop();
	});

	after(function () {
		this.session.shutdown();
		this.server.close();
	});

	describe('launch', () => {
		beforeEach(function () {
			if (!testWithRealEmulator) {
				when(this.mockedGdbProxy.connect(anyString(), anyNumber())).thenResolve();
			}
		});

		it('should run program to the end', function () {
			this.timeout(this.defaultTimeout);
			if (!testWithRealEmulator) {
				when(this.mockedGdbProxy.load(anything(), anything())).thenCall(() => {
					let cb = callbacks.get('end');
					if (cb) {
						cb();
					}
					return Promise.resolve();
				});
			}
			return Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgs),
				dc.waitForEvent('terminated')
			]);
		});
		it('should stop on entry', function () {
			this.timeout(defaultTimeout);
			if (!testWithRealEmulator) {
				when(this.spiedSession.startEmulator(anything())).thenReturn(Promise.resolve()); // Do nothing
				when(this.mockedGdbProxy.stack(th)).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 0,
						pc: 0,
						stackFrameIndex: 0
					}],
					count: 1
				}));
				when(this.mockedGdbProxy.getThread(th.getId())).thenReturn(th);
				when(this.mockedGdbProxy.stepIn(anything())).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnEntry');
						if (cb) {
							cb(th.getId());
						}
					}, 1);
					return Promise.resolve();
				});
			}
			let launchArgsCopy = launchArgs;
			launchArgsCopy.program = Path.join(UAE_DRIVE, 'gencop');
			launchArgsCopy.stopOnEntry = true;
			return Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgsCopy),
				dc.assertStoppedLocation('entry', { line: 32 })
			]);
		});
	});

	// describe('stepping', function () {
	// 	beforeEach(function () {
	// 		if (!testWithRealEmulator) {
	// 			when(this.mockedGdbProxy.getThread(th.getId())).thenReturn(th);
	// 			when(this.mockedGdbProxy.getThreadIds()).thenReturn(Promise.resolve([th]));
	// 			when(this.mockedGdbProxy.connect(anyString(), anyNumber())).thenReturn(Promise.resolve());
	// 			when(this.spiedSession.startEmulator(anything())).thenReturn(Promise.resolve()); // Do nothing
	// 			when(this.mockedGdbProxy.load(anything(), anything())).thenCall(() => {
	// 				setTimeout(function () {
	// 					let cb = callbacks.get('stopOnEntry');
	// 					if (cb) {
	// 						cb(th.getId());
	// 					}
	// 				}, 1);
	// 				return Promise.resolve();
	// 			});
	// 		}
	// 	});
	// 	it.only('should step out', async function () {
	// 		this.timeout(defaultTimeout);
	// 		if (!testWithRealEmulator) {
	// 			when(this.mockedGdbProxy.stack(th)).thenReturn(Promise.resolve(<GdbStackFrame>{
	// 				frames: [<GdbStackPosition>{
	// 					index: 1,
	// 					segmentId: 0,
	// 					offset: 0,
	// 					pc: 0,
	// 					stackFrameIndex: 0
	// 				}],
	// 				count: 1
	// 			})).thenReturn(Promise.resolve(<GdbStackFrame>{
	// 				frames: [<GdbStackPosition>{
	// 					index: 1,
	// 					segmentId: 0,
	// 					offset: 4,
	// 					pc: 4,
	// 					stackFrameIndex: 0
	// 				}],
	// 				count: 1
	// 			})).thenReturn(Promise.resolve(<GdbStackFrame>{
	// 				frames: [<GdbStackPosition>{
	// 					index: 1,
	// 					segmentId: 0,
	// 					offset: 8,
	// 					pc: 8,
	// 					stackFrameIndex: 0
	// 				}],
	// 				count: 1
	// 			}));
	// 			when(this.mockedGdbProxy.stepToRange(th, 0, 0)).thenCall(() => {
	// 				setTimeout(function () {
	// 					let cb = callbacks.get('stopOnBreakpoint');
	// 					if (cb) {
	// 						cb(th.getId());
	// 					}
	// 				}, 1);
	// 				return Promise.resolve();
	// 			});
	// 			when(this.mockedGdbProxy.stepIn(th)).thenCall(() => {
	// 				setTimeout(function () {
	// 					let cb = callbacks.get('stopOnBreakpoint');
	// 					if (cb) {
	// 						cb(th.getId());
	// 					}
	// 				}, 1);
	// 				return Promise.resolve();
	// 			});
	// 		}
	// 		let launchArgsCopy = launchArgs;
	// 		launchArgsCopy.program = Path.join(UAE_DRIVE, 'gencop');
	// 		launchArgsCopy.stopOnEntry = true;
	// 		await Promise.all([
	// 			dc.configurationSequence(),
	// 			dc.launch(launchArgsCopy),
	// 			dc.assertStoppedLocation('entry', { line: 32 })
	// 		]);
	// 		await Promise.all([
	// 			dc.nextRequest(<DebugProtocol.StepInArguments>{ threadId: th.getId() }),
	// 			dc.assertStoppedLocation('breakpoint', { line: 33 }),
	// 		]);
	// 		return Promise.all([
	// 			dc.stepInRequest(<DebugProtocol.StepInArguments>{ threadId: th.getId() }),
	// 			dc.assertStoppedLocation('breakpoint', { line: 37 }),
	// 		]);
	// 	});
	// 	it('should continue and stop', async function () {
	// 		this.timeout(defaultTimeout);
	// 		if (!testWithRealEmulator) {
	// 			when(this.mockedGdbProxy.stack(th)).thenReturn(Promise.resolve(<GdbStackFrame>{
	// 				frames: [<GdbStackPosition>{
	// 					index: 1,
	// 					segmentId: 0,
	// 					offset: 0,
	// 					pc: 0,
	// 					stackFrameIndex: 0
	// 				}],
	// 				count: 1
	// 			})).thenReturn(Promise.resolve(<GdbStackFrame>{
	// 				frames: [<GdbStackPosition>{
	// 					index: 1,
	// 					segmentId: 0,
	// 					offset: 4,
	// 					pc: 4,
	// 					stackFrameIndex: 0
	// 				}],
	// 				count: 1
	// 			}));
	// 			when(this.mockedGdbProxy.continueExecution(th)).thenCall(() => {
	// 				return Promise.resolve();
	// 			});
	// 			when(this.mockedGdbProxy.pause(th)).thenCall(() => {
	// 				setTimeout(function () {
	// 					let cb = callbacks.get('stopOnBreakpoint');
	// 					if (cb) {
	// 						cb(th.getId());
	// 					}
	// 				}, 1);
	// 				return Promise.resolve();
	// 			});
	// 		}
	// 		let launchArgsCopy = launchArgs;
	// 		launchArgsCopy.program = Path.join(UAE_DRIVE, 'gencop');
	// 		launchArgsCopy.stopOnEntry = true;
	// 		await Promise.all([
	// 			dc.configurationSequence(),
	// 			dc.launch(launchArgsCopy),
	// 			dc.assertStoppedLocation('entry', { line: 32 })
	// 		]);
	// 		await Promise.all([
	// 			dc.continueRequest(<DebugProtocol.ContinueArguments>{ threadId: th.getId() }),
	// 			dc.pauseRequest(<DebugProtocol.PauseArguments>{ threadId: th.getId() }),
	// 			dc.assertStoppedLocation('breakpoint', { line: 33 }),
	// 		]);
	// 	});
	// });
});