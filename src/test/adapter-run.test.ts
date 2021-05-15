import assert = require('assert');
import * as Path from 'path';
import { DebugClient } from 'vscode-debugadapter-testsupport/lib/main';
import { LaunchRequestArguments, RunFsUAENoDebugSession } from '../runFsUAENoDebug';
import * as Net from 'net';
import * as vscode from 'vscode';
import { spy, instance, when, anything, mock, reset } from 'ts-mockito/lib/ts-mockito';
import { ExecutorHelper } from '../execHelper';
import { fail } from 'assert';

describe('Node Debug Adapter Run', () => {
	const PROJECT_ROOT = Path.join(__dirname, '..', '..');
	const DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'out', 'debugAdapter.js');
	const DATA_ROOT = Path.join(PROJECT_ROOT, 'test_files', 'debug');
	const FSUAE_ROOT = Path.join(DATA_ROOT, 'fs-uae');
	const UAE_DRIVE = Path.join(FSUAE_ROOT, 'hd0');
	const launchArgs = <LaunchRequestArguments>{
		program: Path.join(UAE_DRIVE, 'hello'),
		emulator: Path.join(FSUAE_ROOT, 'fs-uae'),
		options: [Path.join(FSUAE_ROOT, 'test.fs-uae')],
		drive: Path.join(FSUAE_ROOT, 'hd0'),
	};
	let dc: DebugClient;
	const testWithRealEmulator = false;

	before(function () {
		// Opening file to activate the extension
		const newFile = vscode.Uri.parse("untitled://./debug.s");
		return vscode.window.showTextDocument(newFile);
	});

	beforeEach(function () {
		this.mockedExecutor = mock(ExecutorHelper);
		this.executor = instance(this.mockedExecutor);
		when(this.mockedExecutor.runTool(anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything(), anything())).thenReturn(Promise.resolve([]));
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
		const address: any = this.server.address();
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

	after(async function () {
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
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
				assert.strictEqual(response.body.supportsConfigurationDoneRequest, false);
				assert.strictEqual(response.body.supportsEvaluateForHovers, false);
				assert.strictEqual(response.body.supportsStepBack, false);
				assert.strictEqual(response.body.supportsRestartFrame, false);
				assert.strictEqual(response.body.supportsConditionalBreakpoints, false);
				assert.strictEqual(response.body.supportsSetVariable, false);
			});
		});

		it('should produce error for invalid \'pathFormat\'', function (done) {
			dc.initializeRequest({
				adapterID: 'mock',
				linesStartAt1: true,
				columnsStartAt1: true,
				pathFormat: 'url'
			}).then(function () {
				fail("does not report error on invalid 'pathFormat' attribute");
			}).catch(function () {
				// error expected
				done();
			});
		});
	});

	describe('launch', () => {
		it('should run program to the end', function () {
			return Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgs),
				dc.waitForEvent('terminated')
			]);
		});
	});
});