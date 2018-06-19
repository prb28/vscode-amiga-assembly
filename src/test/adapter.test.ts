import assert = require('assert');
import { expect } from 'chai';
import * as Path from 'path';
import { DebugClient } from 'vscode-debugadapter-testsupport';
import { DebugProtocol } from 'vscode-debugprotocol';
import { LaunchRequestArguments, FsUAEDebugSession } from '../fsUAEDebug';
import * as Net from 'net';
import * as vscode from 'vscode';

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
		emulator: Path.join(FSUAE_ROOT, 'fs-uae'),
		conf: Path.join(FSUAE_ROOT, 'test.fs-uae'),
		drive: Path.join(FSUAE_ROOT, 'hd0'),
		sourceFileMap: {
			"/Users/papa/developpements/amiga/projects/helloworld": DATA_ROOT
		}
	};
	let session: FsUAEDebugSession;
	let dc: DebugClient;
	let server: any;

	before(function () {
		// Opening file to activate the extension
		const newFile = vscode.Uri.parse("untitled://./debug.s");
		return vscode.window.showTextDocument(newFile);
	});

	beforeEach(function () {
		this.timeout(10000);
		// start port listener on launch of first debug session
		if (!server) {
			// start listening on a random port
			server = Net.createServer(socket => {
				session = new FsUAEDebugSession();
				session.setRunAsServer(true);
				session.start(<NodeJS.ReadableStream>socket, socket);
			}).listen(0);
		}

		// make VS Code connect to debug server instead of launching debug adapter
		dc = new DebugClient('node', DEBUG_ADAPTER, 'fs-uae');
		return dc.start(server.address().port);
	});

	afterEach(function () {
		session.terminate();
		return dc.stop();
	});


	describe('basic', function () {

		it('unknown request should produce error', function () {
			dc.send('illegal_request').then(function () {
				Promise.reject("does not report error on unknown request");
			}).catch(function () {
				Promise.resolve();
			});
		});
	});

	describe('initialize', () => {

		it('should return supported features', function () {
			return dc.initializeRequest().then(function (response) {
				response.body = response.body || {};
				assert.equal(response.body.supportsConfigurationDoneRequest, true);
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
			this.timeout(60000);
			return Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgs),
				dc.waitForEvent('terminated')
			]);
		});

		it('should stop on entry', function () {
			this.timeout(60000);
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

		it('should stop on a breakpoint', function () {
			this.timeout(60000);
			let launchArgsCopy = launchArgs;
			launchArgsCopy.program = Path.join(UAE_DRIVE, 'gencop');
			return dc.hitBreakpoint(launchArgsCopy, { path: SOURCE_FILE_NAME, line: 32 });
		});

		it('hitting a lazy breakpoint should send a breakpoint event', function () {
			this.timeout(60000);
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
	describe('evaluateExpression', function () {
		it('should evaluate a memory location', async function () {
			this.timeout(60000);
			let launchArgsCopy = launchArgs;
			launchArgsCopy.program = Path.join(UAE_DRIVE, 'gencop');
			launchArgsCopy.stopOnEntry = true;
			await Promise.all([
				dc.configurationSequence(),
				dc.launch(launchArgsCopy),
				dc.assertStoppedLocation('entry', { line: 32 })
			]);
			const evaluateResponse = await dc.evaluateRequest({
				expression: "m0,10"
			});
			expect(evaluateResponse.body.type).to.equal('string');
			expect(evaluateResponse.body.result).to.equal('00000000 00c00b00 00f80b0e');
		});
	});
	describe('setExceptionBreakpoints', function () {

		it('should stop on an exception', function () {

			const PROGRAM_WITH_EXCEPTION = Path.join(DATA_ROOT, 'testWithException.md');
			const EXCEPTION_LINE = 4;

			return Promise.all([

				dc.waitForEvent('initialized').then(function (event) {
					return dc.setExceptionBreakpointsRequest({
						filters: ['all']
					});
				}).then(function (response) {
					return dc.configurationDoneRequest();
				}),

				dc.launch({ program: PROGRAM_WITH_EXCEPTION }),

				dc.assertStoppedLocation('exception', { line: EXCEPTION_LINE })
			]);
		});
	});
});