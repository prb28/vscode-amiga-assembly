# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

VS Code extension `prb28.amiga-assembly`: Motorola 68000 / Amiga assembly language support (syntax, formatting, hover docs, completion, definitions/references, VASM/VLINK build, ADF disk generation) plus a debugger that drives FS-UAE / WinUAE (via the `uae-dap` npm package) or Copperline.

## Commands

```sh
npm ci                  # install
npm run webpack         # dev bundle: src/extension.ts -> dist/extension.js (what the extension actually loads)
npm run webpack-dev     # same, watch mode
npm run test-compile    # tsc -p ./ (-> out/) AND webpack; required before running tests
npm test                # node ./out/test/runTest.js: downloads VS Code stable and runs all tests inside it
npm run lint            # eslint; output goes to lint-report.json (JSON), not the console
npm run package         # vsce package -> .vsix
```

- Tests are Mocha (bdd) + chai + ts-mockito running **inside a VS Code Extension Host** (`@vscode/test-electron`), so they cannot be run with plain `mocha`. The runner ([src/test/suite/index.ts](src/test/suite/index.ts)) picks up every `out/test/**/*.test.js` and writes `test-results.xml` (xunit) in the repo root.
- No grep/filter option exists in the runner. To run a single test/suite, temporarily use `describe.only`/`it.only` (the ESLint `mocha-no-only` plugin will flag it — remove before committing), then `npm run test-compile && npm test`.
- From a terminal inside VS Code (including Claude Code's), `ELECTRON_RUN_AS_NODE` is inherited and the test VS Code fails to start with `bad option: --extensionTestsPath...`: run `env -u ELECTRON_RUN_AS_NODE npm test`.
- The editor-driven suites ("Global Extension Tests": calc, formula commands) are occasionally flaky; re-run before investigating a failure there.
- On Linux headless, wrap tests with `xvfb-run` (as CI does). Set `DISABLE_COVERAGE=true` to skip coverage; `CI=true` skips some emulator-dependent tests.
- The emulator integration suites ([src/test/integration.test.ts](src/test/integration.test.ts), [src/test/integrationfsuae.test.ts](src/test/integrationfsuae.test.ts)) are `describe.skip` by default.
- `.vscode/launch.json` has "Launch Extension", "Launch Extension (Example Workspace)" (opens `resources/examples/vscode-amiga-wks-example`), and "Extension Tests" configurations.
- CI ([.github/workflows/main.yml](.github/workflows/main.yml)) runs `npm ci && npm run test-compile && npm test` on Linux/macOS/Windows with Node 24.

## Architecture

**Entry point & state.** [src/extension.ts](src/extension.ts) `activate()` registers every provider/command. A singleton `ExtensionState` lazily owns shared services (VASM compiler, disassembler, definition handler, documentation manager, language model, diagnostics, output channel, build/tmp dirs). Other modules reach it via `ExtensionState.getCurrent()`, which fetches it through the extension's exported API (`getState()`); tests use the same path and can override things like `forceBuildDir()` / `setWorkspaceRootDir()`.

**Language model is derived from the grammar.** [src/language.ts](src/language.ts) parses `syntaxes/M68k-Assembly.tmLanguage.json` at runtime to learn instructions and their valid size extensions. Changing the TextMate grammar therefore changes parsing/completion behavior, not just highlighting. `ASMLine.init(language)` must be called before parsing.

**Parser.** [src/parser.ts](src/parser.ts) (`ASMLine`, `ASMDocument`) splits lines into label / instruction / data / comment with positions. It is the shared foundation for the formatter ([src/formatter.ts](src/formatter.ts), configured by [src/formatterConfiguration.ts](src/formatterConfiguration.ts)), hover, completion, and the symbol scanner ([src/symbols.ts](src/symbols.ts)).

**Workspace symbols.** [src/definitionHandler.ts](src/definitionHandler.ts) scans all source files (`SOURCE_FILES_GLOB`), kept up to date by a FileSystemWatcher, and serves definitions, references, document symbols, folding, and label/variable data for completion and hover.

**Documentation.** [src/documentation.ts](src/documentation.ts) loads markdown from `docs/` (`instructions/`, `hardware/`, `directives/`, `libs/`) to feed hover and completion. These docs ship with the extension and are also opened via the `showdoc` commands. `docs/` is a mirror of [m68k-instructions-documentation](https://github.com/prb28/m68k-instructions-documentation): edit the docs there first (it also holds the scripts that fetch them and regenerate `toc.md` from each file's first-line title), then copy them here with `python scripts/build/syncDocs.py` (expects the clone next to this repo, or pass `--source`). Do not edit `docs/` directly. The file name of a `hardware/` doc (`<ADDRESS>_<NAME>.md`) is what makes a register found by name or address, and its first line (`**title**`) is the hover title. The reference for their content is the Amiga Hardware Reference Manual register summary, not the amiga-dev wiki they were first taken from (it has shifted titles and typos).

**Register hover.** When a value is written to a register on the hovered line, [src/hover.ts](src/hover.ts) `markRegisterBits` marks its bits in the markdown tables of the register doc. It relies on the table layout of `docs/hardware`: a header cell ending with `Bit` (or `BIT#`) over cells holding a bit number (`15`) or a range (`14-13`), or a header `Bit | 15 | 14 | ...` with one column per bit. Keep that layout when writing a bits table.

**Build pipeline.** [src/customTaskProvider.ts](src/customTaskProvider.ts) contributes the `amigaassembly` task type, run in a Pseudoterminal. It chains [src/vasm.ts](src/vasm.ts) (assemble each file, parse errors into diagnostics), [src/vlink.ts](src/vlink.ts) (link), and [src/adf.ts](src/adf.ts) (build an ADF disk image). External tools run through [src/execHelper.ts](src/execHelper.ts). Bundled binaries (vasm, vlink, vbcc, adftools, make, FS-UAE) are in `resources/bin/{win32,linux,darwin}`. The `amiga-assembly.binDir` setting defaults to `${extensionResourcesFolder}/bin/${platformName}`, and custom variables like this are expanded by [src/configVariables.ts](src/configVariables.ts). On non-Windows platforms, activation chmods those binaries to 755.

**Debugging.** The main debug type is `amiga-assembly`. `fs-uae`, `winuae`, and `uae-run` are deprecated legacy types that still work. [src/debugSession.ts](src/debugSession.ts) is a thin subclass of `uae-dap`'s `UAEDebugSession`. `prepareLaunchRequestArgs` maps the legacy launch schema (`options`, `emulator`, `type`) onto uae-dap args, and the adapter runs inline (`DebugAdapterInlineImplementation`). When `emulatorType: 'copperline'`, [src/copperlineDebug.ts](src/copperlineDebug.ts) instead flattens `copperlineOptions` and launches the external `copperline-ctl --dap` adapter. Webpack copies `node_modules/uae-dap/{wasm,bin}` into `dist/`. Launch-config schemas live in `package.json` under `contributes.debuggers`.

**File access.** Use [src/fsProxy.ts](src/fsProxy.ts) `FileProxy` (wraps `vscode.workspace.fs` with Uris) instead of Node `fs` directly.

**Webviews.** IFF image viewer ([src/iffImageViewer.ts](src/iffImageViewer.ts)) and BLTCON helper ([src/bltconHelper.ts](src/bltconHelper.ts)) load their front-end assets from `webviews/`.

**Other.** Calculator / expression evaluation ([src/calc.ts](src/calc.ts), [src/calcComponents.ts](src/calcComponents.ts), plain-JS `src/mathcalc.js`). Data-generator code lens ([src/expressionDataGenerator.ts](src/expressionDataGenerator.ts)). Disassembly views ([src/disassemble.ts](src/disassemble.ts), [src/disassemblyContentProvider.ts](src/disassemblyContentProvider.ts) for the `disassembly:` scheme and `.dbgasm` language). Example workspace creation ([src/workspaceManager.ts](src/workspaceManager.ts)).

## Tests

- Test fixtures (sample `.s` sources, expected-format outputs, IFF images, debug binaries) are in `test_files/`.
- [src/test/dummy.ts](src/test/dummy.ts) provides fake `TextDocument` / `WorkspaceConfiguration` / formatting options for unit-testing without real editors.

## Conventions

- Logging goes through `winston`, routed to the "Amiga Assembly" log output channel. Level comes from the `amiga-assembly.logLevel` setting.
- Settings are read through `ConfigurationHelper` (`retrieveStringPropertyInDefaultConf` etc.), not `vscode.workspace.getConfiguration` directly.
- Prettier config uses single quotes.
