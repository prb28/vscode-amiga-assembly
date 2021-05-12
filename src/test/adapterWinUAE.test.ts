import * as Path from 'path';
import { DebugClient } from 'vscode-debugadapter-testsupport/lib/main';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { LaunchRequestArguments } from '../fsUAEDebug';
import * as Net from 'net';
import * as vscode from 'vscode';
import { GdbProxy } from '../gdbProxy';
import { GdbStackFrame, GdbStackPosition, GdbThread, GdbAmigaSysThreadIdWinUAE } from '../gdbProxyCore';
import { spy, anyString, instance, when, anything, mock, anyNumber, reset, } from 'ts-mockito/lib/ts-mockito';
import { ExecutorHelper } from '../execHelper';
import { Capstone } from '../capstone';
import { ExtensionState } from '../extension';
import { WinUAEDebugSession } from '../winUAEDebug';

describe('Node Debug Adapter for WinUAE', () => {
	const PROJECT_ROOT = Path.join(__dirname, '..', '..').replace(/\\+/g, '/');
	const DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'out', 'debugAdapterWinUAE.js').replace(/\\+/g, '/');
	const DATA_ROOT = Path.join(PROJECT_ROOT, 'test_files', 'debug').replace(/\\+/g, '/');
	const FSUAE_ROOT = Path.join(DATA_ROOT, 'fs-uae').replace(/\\+/g, '/');
	const UAE_DRIVE = Path.join(FSUAE_ROOT, 'hd0').replace(/\\+/g, '/');
	let launchArgs = <LaunchRequestArguments>{
		program: Path.join(UAE_DRIVE, 'hello'),
		stopOnEntry: false,
		serverName: 'localhost',
		serverPort: 2345,
		startEmulator: true,
		emulator: Path.join(FSUAE_ROOT, 'winuae'),
		options: [Path.join(FSUAE_ROOT, 'test.uae')],
		drive: Path.join(FSUAE_ROOT, 'hd0'),
		sourceFileMap: {
			"C:\\Users\\paulr\\workspace\\amiga\\projects\\vscode-amiga-wks-example": DATA_ROOT
		}
	};
	let dc: DebugClient;
	let callbacks = new Map<string, any>();
	let testWithRealEmulator = false;
	let th = new GdbThread(0, GdbAmigaSysThreadIdWinUAE.CPU);

	before(async function () {
		GdbThread.setSupportMultiprocess(false);
		// activate the extension
		let ext = vscode.extensions.getExtension('prb28.amiga-assembly');
		if (ext) {
			await ext.activate();
			await ExtensionState.getCurrent().getLanguage();
		}
	});


	beforeEach(function () {
		this.mockedExecutor = mock(ExecutorHelper);
		this.executor = instance(this.mockedExecutor);
		this.mockedGdbProxy = mock(GdbProxy);
		this.mockedCapstone = mock(Capstone);
		this.capstone = instance(this.mockedCapstone);
		when(this.mockedGdbProxy.on(anyString(), anything())).thenCall(async (event: string, callback: (() => void)) => {
			callbacks.set(event, callback);
		});
		when(this.mockedGdbProxy.waitConnected()).thenResolve();
		when(this.mockedGdbProxy.getCurrentCpuThread()).thenReturn(th);
		this.gdbProxy = instance(this.mockedGdbProxy);
		when(this.mockedExecutor.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenReturn(Promise.resolve([]));
		// start port listener on launch of first debug this.session
		// start listening on a random port
		return new Promise<void>(async (resolve) => {
			this.server = Net.createServer(socket => {
				this.session = new WinUAEDebugSession();
				if (!testWithRealEmulator) {
					this.session.setTestContext(this.gdbProxy, this.executor, this.capstone);
				}
				this.spiedSession = spy(this.session);
				when(this.spiedSession.checkEmulator(anything())).thenReturn(true);
				when(this.spiedSession.updateDisassembledView(anything(), anything())).thenReturn(Promise.resolve());
				this.session.setRunAsServer(true);
				this.session.start(<NodeJS.ReadableStream>socket, socket);
				resolve();
			}).listen(0);
			// make VS Code connect to debug server instead of launching debug adapter
			dc = new DebugClient('node', DEBUG_ADAPTER, 'winuae');
			let address: any = this.server.address();
			let port = 0;
			if (address instanceof Object) {
				port = address.port;
			}
			await dc.start(port);
		});
	});

	afterEach(async function () {
		if (this.spiedSession) {
			reset(this.spiedSession);
		}
		if (this.mockedExecutor) {
			reset(this.mockedExecutor);
		}
		if (this.mockedGdbProxy) {
			reset(this.mockedGdbProxy);
		}
		if (this.dc) {
			await dc.stop();
		}
		if (this.session) {
			this.session.shutdown();
		}
		if (this.server) {
			this.server.close();
		}
	});

	describe('launch', () => {
		beforeEach(function () {
			if (!testWithRealEmulator) {
				when(this.mockedGdbProxy.connect(anyString(), anyNumber())).thenResolve();
			}
		});

		it('should run program to the end', function () {
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

	describe('stepping', function () {
		beforeEach(function () {
			if (!testWithRealEmulator) {
				when(this.mockedGdbProxy.getThread(th.getId())).thenReturn(th);
				when(this.mockedGdbProxy.getThreadIds()).thenReturn(Promise.resolve([th]));
				when(this.mockedGdbProxy.connect(anyString(), anyNumber())).thenReturn(Promise.resolve());
				when(this.spiedSession.startEmulator(anything())).thenReturn(Promise.resolve()); // Do nothing
				when(this.mockedGdbProxy.load(anything(), anything())).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnEntry');
						if (cb) {
							cb(th.getId());
						}
					}, 1);
					return Promise.resolve();
				});
			}
		});
		it('should step next', async function () {
			if (!testWithRealEmulator) {
				when(this.mockedGdbProxy.stack(th)).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 0,
						pc: 0,
						stackFrameIndex: 0
					}],
					count: 1
				})).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 0,
						pc: 0,
						stackFrameIndex: 0
					}],
					count: 1
				})).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 4,
						pc: 4,
						stackFrameIndex: 0
					}],
					count: 1
				})).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 8,
						pc: 8,
						stackFrameIndex: 0
					}],
					count: 1
				}));
				when(this.mockedGdbProxy.stepToRange(th, anything(), anything())).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnBreakpoint');
						if (cb) {
							cb(th.getId());
						}
					}, 1);
					return Promise.resolve();
				});
				when(this.mockedGdbProxy.stepIn(th)).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnEntry');
						if (cb) {
							cb(th.getId());
						}
					}, 1);
					return Promise.resolve();
				}).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnBreakpoint');
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
			await Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgsCopy),
				dc.assertStoppedLocation('entry', { line: 32 })
			]);
			await Promise.all([
				dc.nextRequest(<DebugProtocol.StepInArguments>{ threadId: th.getId() }),
				dc.assertStoppedLocation('breakpoint', { line: 33 }),
			]);
			return Promise.all([
				dc.stepInRequest(<DebugProtocol.StepInArguments>{ threadId: th.getId() }),
				dc.assertStoppedLocation('breakpoint', { line: 37 }),
			]);
		});
		it('should continue and stop', async function () {
			if (!testWithRealEmulator) {
				when(this.mockedGdbProxy.stack(th)).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 0,
						pc: 0,
						stackFrameIndex: 0
					}],
					count: 1
				})).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 4,
						pc: 4,
						stackFrameIndex: 0
					}],
					count: 1
				}));
				when(this.mockedGdbProxy.continueExecution(th)).thenCall(() => {
					return Promise.resolve();
				});
				when(this.mockedGdbProxy.pause(th)).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnBreakpoint');
						if (cb) {
							cb(th.getId());
						}
					}, 1);
					return Promise.resolve();
				});
				when(this.mockedGdbProxy.stepIn(th)).thenCall(() => {
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
			await Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgsCopy),
				dc.assertStoppedLocation('entry', { line: 32 })
			]);
			await Promise.all([
				dc.continueRequest(<DebugProtocol.ContinueArguments>{ threadId: th.getId() }),
				dc.pauseRequest(<DebugProtocol.PauseArguments>{ threadId: th.getId() }),
				dc.assertStoppedLocation('breakpoint', { line: 33 }),
			]);
		});
		it('should step out', async function () {
			if (!testWithRealEmulator) {
				when(this.mockedGdbProxy.stack(th)).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 0,
						pc: 0,
						stackFrameIndex: 0
					}],
					count: 1
				})).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 0,
						segmentId: 0,
						offset: 20,
						pc: 20,
						stackFrameIndex: 0
					}, <GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 4,
						pc: 4,
						stackFrameIndex: 0
					}],
					count: 2
				})).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 0,
						segmentId: 0,
						offset: 20,
						pc: 20,
						stackFrameIndex: 0
					}, <GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 4,
						pc: 4,
						stackFrameIndex: 0
					}],
					count: 2
				})).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 0,
						segmentId: 0,
						offset: 8,
						pc: 8,
						stackFrameIndex: 0
					}],
					count: 1
				}));
				when(this.mockedGdbProxy.continueExecution(anything())).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnBreakpoint');
						if (cb) {
							cb(th.getId());
						}
					}, 1);
					return Promise.resolve();
				});
				when(this.mockedGdbProxy.stepIn(th)).thenCall(() => {
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
			await Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgsCopy),
				dc.assertStoppedLocation('entry', { line: 32 })
			]);
			await Promise.all([
				dc.continueRequest(<DebugProtocol.ContinueArguments>{ threadId: th.getId() }),
				dc.assertStoppedLocation('breakpoint', { line: 39 }),
			]);
			await Promise.all([
				dc.stepOutRequest(<DebugProtocol.StepOutArguments>{ threadId: th.getId() }),
				dc.assertStoppedLocation('breakpoint', { line: 37 }),
			]);
		});
	});
});