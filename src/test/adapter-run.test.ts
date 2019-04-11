import assert = require('assert');
import * as Path from 'path';
import { DebugClient } from 'vscode-debugadapter-testsupport/lib/main';
import { LaunchRequestArguments, RunFsUAENoDebugSession } from '../runFsUAENoDebug';
import * as Net from 'net';
import * as vscode from 'vscode';
import { spy, instance, when, anything, mock, reset } from 'ts-mockito/lib/ts-mockito';
import { ExecutorHelper } from '../execHelper';

describe('Node Debug Adapter Run', () => {
	const PROJECT_ROOT = Path.join(__dirname, '..', '..');
	const DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'out', 'debugAdapter.js');
	const DATA_ROOT = Path.join(PROJECT_ROOT, 'test_files', 'debug');
	const FSUAE_ROOT = Path.join(DATA_ROOT, 'fs-uae');
	const UAE_DRIVE = Path.join(FSUAE_ROOT, 'hd0');
	let launchArgs = <LaunchRequestArguments>{
		program: Path.join(UAE_DRIVE, 'hello'),
		emulator: Path.join(FSUAE_ROOT, 'fs-uae'),
		options: [Path.join(FSUAE_ROOT, 'test.fs-uae')],
		drive: Path.join(FSUAE_ROOT, 'hd0'),
	};
	let dc: DebugClient;
	let testWithRealEmulator = false;
	let defaultTimeout = 10000;

	before(function () {
		if (testWithRealEmulator) {
			defaultTimeout = 60000;
		}
		this.timeout(this.defaultTimeout);
		// Opening file to activate the extension
		const newFile = vscode.Uri.parse("untitled://./debug.s");
		return vscode.window.showTextDocument(newFile);
	});

	beforeEach(function () {
		this.mockedExecutor = mock(ExecutorHelper);
		this.executor = instance(this.mockedExecutor);
		when(this.mockedExecutor.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenReturn(Promise.resolve([]));
		this.timeout(this.defaultTimeout);
		// start port listener on launch of first debug this.session
		if (!this.server) {
			// start listening on a random port
			this.server = Net.createServer(socket => {
				this.session = new RunFsUAENoDebugSession();
				if (!testWithRealEmulator) {
					this.session.setTestContext(this.executor);
				}
				this.session.setRunAsServer(true);
				this.session.start(<NodeJS.ReadableStream>socket, socket);
				this.spiedSession = spy(this.session);
				when(this.spiedSession.checkEmulator(anything())).thenReturn(true);
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
		reset(this.mockedExecutor);
		reset(this.spiedSession);
		return dc.stop();
	});

	after(function () {
		this.session.removeAllListeners();
		this.session.shutdown();
		this.server.close();
	});

	describe('basic', function () {
		it('unknown request should produce error', function () {
			return dc.send('illegal_request').then(function () {
				return Promise.reject(new Error("does not report error on unknown request"));
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
				assert.equal(response.body.supportsEvaluateForHovers, false);
				assert.equal(response.body.supportsStepBack, false);
				assert.equal(response.body.supportsRestartFrame, false);
				assert.equal(response.body.supportsConditionalBreakpoints, false);
				assert.equal(response.body.supportsSetVariable, false);
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
		it('should run program to the end', function () {
			this.timeout(defaultTimeout);
			return Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgs),
				dc.waitForEvent('terminated')
			]);
		});
	});
});