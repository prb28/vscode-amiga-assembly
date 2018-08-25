import assert = require('assert');
import { expect } from 'chai';
import * as Path from 'path';
import { DebugClient } from 'vscode-debugadapter-testsupport/lib/main';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { LaunchRequestArguments, FsUAEDebugSession } from '../fsUAEDebug';
import * as Net from 'net';
import * as vscode from 'vscode';
import { GdbProxy, GdbStackFrame, GdbStackPosition, GdbBreakpoint, GdbRegister, Segment, GdbHaltStatus } from '../gdbProxy';
import { spy, anyString, instance, when, anything, mock, anyNumber, reset, verify, resetCalls } from 'ts-mockito/lib/ts-mockito';
import { Executor } from '../executor';

process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
	// Will print "unhandledRejection err is not defined"
	console.log('unhandledRejection', reason.message);
	console.log('unhandledRejection', reason.stack);
});


describe('Node Debug Adapter', () => {
	const PROJECT_ROOT = Path.join(__dirname, '..', '..');
	const DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'out', 'debugAdapter.js');
	const DATA_ROOT = Path.join(PROJECT_ROOT, 'test_files', 'debug');
	const FSUAE_ROOT = Path.join(DATA_ROOT, 'fs-uae');
	const UAE_DRIVE = Path.join(FSUAE_ROOT, 'hd0');
	const SOURCE_FILE_NAME = Path.join(DATA_ROOT, 'gencop.s');
	let launchArgs = <LaunchRequestArguments>{
		program: Path.join(UAE_DRIVE, 'hello'),
		stopOnEntry: false,
		serverName: 'localhost',
		serverPort: 6860,
		startEmulator: true,
		emulator: Path.join(FSUAE_ROOT, 'fs-uae'),
		options: [Path.join(FSUAE_ROOT, 'test.fs-uae')],
		drive: Path.join(FSUAE_ROOT, 'hd0'),
		sourceFileMap: {
			"/Users/papa/developpements/amiga/projects/helloworld": DATA_ROOT
		}
	};
	let session: FsUAEDebugSession;
	let spiedSession: FsUAEDebugSession;
	let dc: DebugClient;
	let server: Net.Server;
	let mockedGdbProxy: GdbProxy;
	let gdbProxy: GdbProxy;
	let mockedExecutor: Executor;
	let executor: Executor;
	let callbacks = new Map<String, any>();
	let testWithRealEmulator = false;
	let defaultTimeout = 10000;

	before(function () {
		if (testWithRealEmulator) {
			defaultTimeout = 60000;
		}
		// Opening file to activate the extension
		const newFile = vscode.Uri.parse("untitled://./debug.s");
		return vscode.window.showTextDocument(newFile);
	});

	beforeEach(function () {
		mockedExecutor = mock(Executor);
		executor = instance(mockedExecutor);
		mockedGdbProxy = mock(GdbProxy);
		when(mockedGdbProxy.on(anyString(), anything())).thenCall(async (event: string, callback: (() => void)) => {
			callbacks.set(event, callback);
		});
		gdbProxy = instance(mockedGdbProxy);
		when(mockedExecutor.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenReturn(Promise.resolve([]));
		this.timeout(defaultTimeout);
		// start port listener on launch of first debug session
		if (!server) {
			// start listening on a random port
			server = Net.createServer(socket => {
				session = new FsUAEDebugSession();
				if (!testWithRealEmulator) {
					session.setTestContext(gdbProxy, executor);
				}
				session.setRunAsServer(true);
				session.start(<NodeJS.ReadableStream>socket, socket);
				spiedSession = spy(session);
			}).listen(0);
		}
		// make VS Code connect to debug server instead of launching debug adapter
		dc = new DebugClient('node', DEBUG_ADAPTER, 'fs-uae');
		return dc.start(server.address().port);
	});

	afterEach(function () {
		session.terminate();
		reset(mockedExecutor);
		reset(mockedGdbProxy);
		reset(spiedSession);
		return dc.stop();
	});

	after(function () {
		session.removeAllListeners();
		session.shutdown();
		server.close();
	});



	describe('basic', function () {
		it('unknown request should produce error', function () {
			return dc.send('illegal_request').then(function () {
				return Promise.reject("does not report error on unknown request");
			}).catch(function () {
				return Promise.resolve();
			});
		});
	});

	describe('initialize', () => {
		it('should return supported features', function () {
			return dc.initializeRequest().then(function (response) {
				response.body = response.body || {};
				assert.equal(response.body.supportsConfigurationDoneRequest, true);
				assert.equal(response.body.supportsEvaluateForHovers, true);
				assert.equal(response.body.supportsStepBack, false);
				assert.equal(response.body.supportsRestartFrame, false);
				assert.equal(response.body.supportsConditionalBreakpoints, false);
				assert.equal(response.body.supportsSetVariable, true);
			});
		});

		it('should produce error for invalid \'pathFormat\'', function (done) {
			dc.initializeRequest({
				adapterID: 'mock',
				linesStartAt1: true,
				columnsStartAt1: true,
				pathFormat: 'url'
			}).then(function (response) {
				done(new Error("does not report error on invalid 'pathFormat' attribute"));
			}).catch(function (err) {
				// error expected
				done();
			});
		});
	});

	describe('launch', () => {
		beforeEach(function () {
			when(mockedGdbProxy.connect(anyString(), anyNumber())).thenReturn(Promise.resolve());
		});

		it('should run program to the end', function () {
			when(mockedGdbProxy.load(anything(), anything())).thenCall(() => {
				let cb = callbacks.get('end');
				if (cb) {
					cb();
				}
				return Promise.resolve();
			});
			this.timeout(defaultTimeout);
			return Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgs),
				dc.waitForEvent('terminated')
			]);
		});

		it('should stop on entry', function () {
			this.timeout(defaultTimeout);
			if (!testWithRealEmulator) {
				when(spiedSession.startEmulator(anything())).thenCall(() => { }); // Do nothing
				when(mockedGdbProxy.load(anything(), anything())).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnEntry');
						if (cb) {
							cb();
						}
					}, 1);
					return Promise.resolve();
				});
				when(mockedGdbProxy.stack()).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 0,
						pc: 0,
						stackFrameIndex: 0
					}],
					count: 1
				}));
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


		it('should stop on entry', function () {
			this.timeout(defaultTimeout);
			if (!testWithRealEmulator) {
				when(spiedSession.startEmulator(anything())).thenCall(() => { }); // Do nothing
				when(mockedGdbProxy.load(anything(), anything())).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnEntry');
						if (cb) {
							cb();
						}
					}, 1);
					return Promise.resolve();
				});
				when(mockedGdbProxy.stack()).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 0,
						pc: 0,
						stackFrameIndex: 0
					}],
					count: 1
				}));
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

	describe('setBreakpoints', function () {
		beforeEach(function () {
			if (!testWithRealEmulator) {
				when(mockedGdbProxy.connect(anyString(), anyNumber())).thenReturn(Promise.resolve());
				when(spiedSession.startEmulator(anything())).thenCall(() => { }); // Do nothing
			}
		});
		it('should stop on a breakpoint', function () {
			this.timeout(20000);
			when(mockedGdbProxy.load(anything(), anything())).thenCall(() => {
				setTimeout(function () {
					let cb = callbacks.get('stopOnBreakpoint');
					if (cb) {
						cb();
					}
				}, 1);
				return Promise.resolve();
			});
			when(mockedGdbProxy.setBreakPoint(anyNumber(), anyNumber())).thenCall((segmentId: number, offset: number) => {
				return Promise.resolve(<GdbBreakpoint>{
					id: 0,
					segmentId: 0,
					offset: 4,
					verified: false,
				});
			});
			when(mockedGdbProxy.stack()).thenReturn(Promise.resolve(<GdbStackFrame>{
				frames: [<GdbStackPosition>{
					index: 1,
					segmentId: 0,
					offset: 4,
					pc: 10,
					stackFrameIndex: 0
				}],
				count: 1
			}));
			when(mockedGdbProxy.registers(anything())).thenReturn(Promise.resolve([<GdbRegister>{
				name: "d0",
				value: 1
			}]));
			let launchArgsCopy = launchArgs;
			launchArgsCopy.program = Path.join(UAE_DRIVE, 'gencop');
			return dc.hitBreakpoint(launchArgsCopy, { path: SOURCE_FILE_NAME, line: 33 });
		});

		it('hitting a lazy breakpoint should send a breakpoint event', function () {
			this.timeout(defaultTimeout);
			when(mockedGdbProxy.load(anything(), anything())).thenCall(() => {
				setTimeout(function () {
					let cb = callbacks.get('stopOnBreakpoint');
					if (cb) {
						cb();
					}
				}, 1);
				setTimeout(function () {
					let cb = callbacks.get('breakpointValidated');
					if (cb) {
						cb(<GdbBreakpoint>{
							id: 0,
							segmentId: 0,
							offset: 0,
							verified: true,
						});
					}
				}, 2);
				return Promise.resolve();
			});
			when(mockedGdbProxy.setBreakPoint(anyNumber(), anyNumber())).thenCall((segmentId: number, offset: number) => {
				return Promise.resolve(<GdbBreakpoint>{
					id: 0,
					segmentId: 0,
					offset: 4,
					verified: false,
				});
			});
			when(mockedGdbProxy.stack()).thenReturn(Promise.resolve(<GdbStackFrame>{
				frames: [<GdbStackPosition>{
					index: 1,
					segmentId: 0,
					offset: 4,
					pc: 10,
					stackFrameIndex: 0
				}],
				count: 1
			}));
			let launchArgsCopy = launchArgs;
			launchArgsCopy.program = Path.join(UAE_DRIVE, 'gencop');
			return Promise.all([
				dc.hitBreakpoint(launchArgsCopy, { path: SOURCE_FILE_NAME, line: 33 }),
				dc.waitForEvent('breakpoint').then(function (event: DebugProtocol.Event) {
					assert.equal(event.body.breakpoint.verified, true, "event mismatch: verified");
				})
			]);
		});
	});

	describe('stepping', function () {
		beforeEach(function () {
			if (!testWithRealEmulator) {
				when(mockedGdbProxy.connect(anyString(), anyNumber())).thenReturn(Promise.resolve());
				when(spiedSession.startEmulator(anything())).thenCall(() => { }); // Do nothing
				when(mockedGdbProxy.load(anything(), anything())).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnEntry');
						if (cb) {
							cb();
						}
					}, 1);
					return Promise.resolve();
				});
			}
		});
		it('should step', async function () {
			this.timeout(defaultTimeout);
			if (!testWithRealEmulator) {
				when(mockedGdbProxy.stack()).thenReturn(Promise.resolve(<GdbStackFrame>{
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
				when(mockedGdbProxy.step()).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnBreakpoint');
						if (cb) {
							cb();
						}
					}, 1);
					return Promise.resolve();
				});
				when(mockedGdbProxy.stepIn()).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnBreakpoint');
						if (cb) {
							cb();
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
				dc.nextRequest(<DebugProtocol.StepInArguments>{}),
				dc.assertStoppedLocation('breakpoint', { line: 33 }),
			]);
			return Promise.all([
				dc.stepInRequest(<DebugProtocol.StepInArguments>{}),
				dc.assertStoppedLocation('breakpoint', { line: 37 }),
			]);
		});
	});
	describe('evaluateExpression', function () {
		beforeEach(async function () {
			if (!testWithRealEmulator) {
				when(mockedGdbProxy.connect(anyString(), anyNumber())).thenReturn(Promise.resolve());
				when(spiedSession.startEmulator(anything())).thenCall(() => { }); // Do nothing
				when(mockedGdbProxy.load(anything(), anything())).thenCall(() => {
					setTimeout(function () {
						let cb = callbacks.get('stopOnEntry');
						if (cb) {
							cb();
						}
					}, 1);
					session.updateSegments([<Segment>{
						address: 10,
						size: 20
					}]);
					return Promise.resolve();
				});
				when(mockedGdbProxy.setBreakPoint(anyNumber(), anyNumber())).thenCall((segmentId: number, offset: number) => {
					return Promise.resolve(<GdbBreakpoint>{
						id: 0,
						segmentId: 0,
						offset: 0,
						verified: false,
					});
				});
				when(mockedGdbProxy.stack()).thenReturn(Promise.resolve(<GdbStackFrame>{
					frames: [<GdbStackPosition>{
						index: 1,
						segmentId: 0,
						offset: 4,
						pc: 10,
						stackFrameIndex: 0
					}],
					count: 1
				}));
				when(mockedGdbProxy.getRegister(anyString(), anything())).thenReturn(new Promise((resolve, reject) => { resolve(["a", -1]); }));
				when(mockedGdbProxy.registers(anything())).thenReturn(Promise.resolve([<GdbRegister>{
					name: "d0",
					value: 1
				}, <GdbRegister>{
					name: "a0",
					value: 10
				}]));
				when(mockedGdbProxy.setMemory(0, anyString())).thenReturn(Promise.resolve());
				when(mockedGdbProxy.setMemory(10, anyString())).thenReturn(Promise.resolve());
				when(mockedGdbProxy.setMemory(11, anyString())).thenReturn(Promise.resolve());
				when(mockedGdbProxy.getMemory(0, anyNumber())).thenReturn(Promise.resolve("0000000000c00b0000f8"));
				when(mockedGdbProxy.getMemory(10, anyNumber())).thenReturn(Promise.resolve("aa00000000c00b0000f8"));
				when(mockedGdbProxy.getMemory(422, anyNumber())).thenReturn(Promise.resolve("0000000b")); // 422 = 19c + 10
				when(mockedGdbProxy.getMemory(11, anyNumber())).thenReturn(Promise.resolve("bb00000000c00b0000f8"));
			}
			let launchArgsCopy = launchArgs;
			launchArgsCopy.program = Path.join(UAE_DRIVE, 'gencop');
			launchArgsCopy.stopOnEntry = true;
			await Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgsCopy),
				dc.assertStoppedLocation('entry', { line: 33 })
			]);
		});
		it('should evaluate a memory location', async function () {
			this.timeout(defaultTimeout);
			let evaluateResponse = await dc.evaluateRequest({
				expression: "m0,10"
			});
			expect(evaluateResponse.body.type).to.equal('array');
			expect(evaluateResponse.body.result).to.equal('00000000 00c00b00 00f8          | ..........');
			// Test variable replacement
			evaluateResponse = await dc.evaluateRequest({
				expression: "m ${a0},10"
			});
			expect(evaluateResponse.body.result).to.equal('aa000000 00c00b00 00f8          | ª.........');
			evaluateResponse = await dc.evaluateRequest({
				expression: "m ${copperlist},10"
			});
			expect(evaluateResponse.body.result).to.equal('bb000000 00c00b00 00f8          | ..........');
		});
		it('should evaluate a set memory command', async function () {
			this.timeout(defaultTimeout);
			let evaluateResponse = await dc.evaluateRequest({
				expression: "M0=10"
			});
			verify(mockedGdbProxy.setMemory(0, anyString())).once();
			resetCalls(mockedGdbProxy);
			expect(evaluateResponse.body.type).to.equal('array');
			expect(evaluateResponse.body.result).to.equal('00000000 00c00b00 00f8          | ..........');
			// Test variable replacement
			evaluateResponse = await dc.evaluateRequest({
				expression: "M${a0}=10"
			});
			verify(mockedGdbProxy.setMemory(10, anyString())).once();
			resetCalls(mockedGdbProxy);
			expect(evaluateResponse.body.result).to.equal('aa000000 00c00b00 00f8          | ª.........');
			evaluateResponse = await dc.evaluateRequest({
				expression: "M ${copperlist}=10"
			});
			verify(mockedGdbProxy.setMemory(11, anyString())).once();
			resetCalls(mockedGdbProxy);
			expect(evaluateResponse.body.result).to.equal('bb000000 00c00b00 00f8          | ..........');
		});
	});
	describe('setExceptionBreakpoints', function () {
		beforeEach(function () {
			if (!testWithRealEmulator) {
				when(mockedGdbProxy.connect(anyString(), anyNumber())).thenReturn(Promise.resolve());
				when(spiedSession.startEmulator(anything())).thenCall(() => { }); // Do nothing
			}
		});
		it('should stop on an exception', function () {
			this.timeout(defaultTimeout);
			when(mockedGdbProxy.load(anything(), anything())).thenCall(() => {
				setTimeout(function () {
					let cb = callbacks.get('stopOnException');
					if (cb) {
						cb(<GdbHaltStatus>{
							code: 8,
							details: "details"
						});
					}
				}, 1);
				return Promise.resolve();
			});
			when(mockedGdbProxy.setBreakPoint(anyNumber(), anyNumber(), anyNumber())).thenCall((segmentId: number, offset: number, mask: number) => {
				return Promise.resolve(<GdbBreakpoint>{
					id: 0,
					segmentId: 0,
					offset: 4,
					verified: false,
					exceptionMask: mask
				});
			});
			when(mockedGdbProxy.stack()).thenReturn(Promise.resolve(<GdbStackFrame>{
				frames: [<GdbStackPosition>{
					index: 1,
					segmentId: 0,
					offset: 4,
					pc: 10,
					stackFrameIndex: 0
				}],
				count: 1
			}));
			when(mockedGdbProxy.registers(anything())).thenReturn(Promise.resolve([<GdbRegister>{
				name: "d0",
				value: 1
			}]));
			when(mockedGdbProxy.getHaltStatus()).thenReturn(Promise.resolve(<GdbHaltStatus>{
				code: 8,
				details: "details"
			}));
			let launchArgsCopy = launchArgs;
			launchArgsCopy.program = Path.join(UAE_DRIVE, 'gencop');
			return Promise.all([
				dc.waitForEvent('initialized').then(function (event) {
					return dc.setExceptionBreakpointsRequest({
						filters: ['all']
					});
				}).then(function (response) {
					return dc.configurationDoneRequest();
				}),

				dc.launch(launchArgsCopy),

				dc.assertStoppedLocation('exception', { line: 33 })
			]);
		});
	});
});