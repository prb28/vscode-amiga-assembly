/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert = require('assert');
import * as Path from 'path';
import { DebugClient } from 'vscode-debugadapter-testsupport';
import { DebugProtocol } from 'vscode-debugprotocol';

describe('Node Debug Adapter', () => {

	const PROJECT_ROOT = Path.join(__dirname, '../../');
	const DEBUG_ADAPTER = Path.join(PROJECT_ROOT, 'out/debugAdapter.js');
	const DATA_ROOT = Path.join(PROJECT_ROOT, 'test_files/data/');


	let dc: DebugClient;

	beforeEach(function () {
		dc = new DebugClient('node', DEBUG_ADAPTER, 'fs-uae');
		return dc.start();
	});

	afterEach(function () {
		return dc.stop();
	});


	describe('basic', function () {

		it('unknown request should produce error', function () {
			dc.send('illegal_request').then(() => {
				Promise.reject("does not report error on unknown request");
			}).catch(() => {
				Promise.resolve();
			});
		});
	});

	describe('initialize', () => {

		it('should return supported features', function () {
			return dc.initializeRequest().then(response => {
				response.body = response.body || {};
				assert.equal(response.body.supportsConfigurationDoneRequest, true);
			});
		});

		it('should produce error for invalid \'pathFormat\'', done => {
			dc.initializeRequest({
				adapterID: 'mock',
				linesStartAt1: true,
				columnsStartAt1: true,
				pathFormat: 'url'
			}).then(response => {
				done(new Error("does not report error on invalid 'pathFormat' attribute"));
			}).catch(err => {
				// error expected
				done();
			});
		});
	});

	describe('launch', () => {

		it('should run program to the end', () => {

			const PROGRAM = Path.join(DATA_ROOT, 'test.md');

			return Promise.all([
				dc.configurationSequence(),
				dc.launch({ program: PROGRAM }),
				dc.waitForEvent('terminated')
			]);
		});

		it('should stop on entry', () => {

			const PROGRAM = Path.join(DATA_ROOT, 'test.md');
			const ENTRY_LINE = 1;

			return Promise.all([
				dc.configurationSequence(),
				dc.launch({ program: PROGRAM, stopOnEntry: true }),
				dc.assertStoppedLocation('entry', { line: ENTRY_LINE })
			]);
		});
	});

	describe('setBreakpoints', () => {

		it('should stop on a breakpoint', () => {

			const PROGRAM = Path.join(DATA_ROOT, 'test.md');
			const BREAKPOINT_LINE = 2;

			return dc.hitBreakpoint({ program: PROGRAM }, { path: PROGRAM, line: BREAKPOINT_LINE });
		});

		it('hitting a lazy breakpoint should send a breakpoint event', () => {

			const PROGRAM = Path.join(DATA_ROOT, 'testLazyBreakpoint.md');
			const BREAKPOINT_LINE = 3;

			return Promise.all([

				dc.hitBreakpoint({ program: PROGRAM }, { path: PROGRAM, line: BREAKPOINT_LINE, verified: false }),

				dc.waitForEvent('breakpoint').then((event: DebugProtocol.Event) => {
					assert.equal(event.body.breakpoint.verified, true, "event mismatch: verified");
				})
			]);
		});
	});

	describe('setExceptionBreakpoints', () => {

		it('should stop on an exception', () => {

			const PROGRAM_WITH_EXCEPTION = Path.join(DATA_ROOT, 'testWithException.md');
			const EXCEPTION_LINE = 4;

			return Promise.all([

				dc.waitForEvent('initialized').then(event => {
					return dc.setExceptionBreakpointsRequest({
						filters: ['all']
					});
				}).then(response => {
					return dc.configurationDoneRequest();
				}),

				dc.launch({ program: PROGRAM_WITH_EXCEPTION }),

				dc.assertStoppedLocation('exception', { line: EXCEPTION_LINE })
			]);
		});
	});
});