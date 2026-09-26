# Debugging with Copperline

[Copperline](https://github.com/CopperlineHQ/Copperline) can run and debug your
Amiga executable directly. Install Copperline and put `copperline-ctl` and
`copperline` on your PATH, then select **Amiga-Assembly: Copperline Debug** in
`launch.json`'s **Add Configuration** menu:

```json
{
    "type": "amiga-assembly",
    "request": "launch",
    "name": "Copperline Debug",
    "emulatorType": "copperline",
    "program": "${workspaceFolder}/uae/dh0/myprogram",
    "stopOnEntry": true,
    "copperlineOptions": {
        "factory": true
    },
    "preLaunchTask": "amigaassembly: build"
}
```

F5 builds the program, opens Copperline and stops at its first instruction.
The bundled AROS ROM is enough to get started; you do not need a Kickstart ROM
or a prepared UAE hard drive. `program` is the local hunk executable produced
by your build task. Adjust its path and `preLaunchTask` for your project.
Build assembly with vasm's `-linedebug` option to get source breakpoints and
stepping. The extension's default build task already enables it.

If the executables are elsewhere, set `copperlineAdapter` to the path of
`copperline-ctl` and `emulatorBin` to the path of `copperline`. These are file
paths, without quotes or command-line arguments embedded in the string.
Windows paths can use forward slashes, for example
`C:/Tools/Copperline/copperline-ctl.exe`. The separate Copperline VS Code
extension is not required.

## Launch settings

Keep the usual `type: "amiga-assembly"` and select `emulatorType: "copperline"`.
The extension runs `copperline-ctl --dap` and maps the shared launch settings:

| Setting | Copperline behaviour |
| --- | --- |
| `program` | Local Amiga executable to run. |
| `stopOnEntry` | Stop at entry; defaults to true for launch, false for attach. |
| `emulatorBin` | Emulator executable (`copperline` in the adapter's arguments). |
| `emulatorArgs` | Extra emulator flags (`extraArgs` in the adapter's arguments). |
| `copperlineAdapter` | Adapter executable; defaults to `copperline-ctl`. |
| `copperlineOptions` | Copperline-specific launch or attach arguments. |

For example, to use an A1200 with 8 MB fast RAM, add `"model": "A1200"` and
`"fast": "8M"` inside `copperlineOptions`. You can also select a TOML `config`,
a Kickstart `rom`, or use `headless: true` to debug without an emulator window.
`factory: true` ignores Copperline's saved launcher default, making the example
independent of that setting. A `copperline.toml` in the working directory can
still supply machine settings.

Other useful options include `args` for the guest program's arguments,
`entryPoint` for a symbol such as `main`, `symbolFile` for an ELF containing
DWARF, and `sourceMap` for sources built under another directory.
`copperlineOptions.cwd` sets the working directory for both adapter and emulator;
it defaults to the workspace folder. VS Code variables such as
`${workspaceFolder}` work inside the options, too.

See the [Copperline DAP reference](https://github.com/CopperlineHQ/Copperline/blob/main/docs/debugger/dap.md)
for the meaning of these options and the supported debug information formats.
UAE-specific settings such as `remoteProgram`, `serverPort`, `exceptionMask`
and UAE command-line flags do not configure Copperline. Select exception
breakpoints in VS Code's Breakpoints view instead.

## Attach to a running emulator

Start Copperline with a control-info file:

```sh
copperline --factory --run uae/dh0/myprogram --control-gui :0 --control-info copperline-control.json
```

Then use **Amiga-Assembly: Copperline Attach**:

```json
{
    "type": "amiga-assembly",
    "request": "attach",
    "name": "Copperline Attach",
    "emulatorType": "copperline",
    "program": "${workspaceFolder}/uae/dh0/myprogram",
    "stopOnEntry": true,
    "copperlineOptions": {
        "controlInfo": "${workspaceFolder}/copperline-control.json"
    }
}
```

The example explicitly stops at the program's entry point. If `stopOnEntry`
is omitted from an attach configuration, it defaults to false, so the program
continues when it loads. Set it to true when you want an entry stop.

Alternatively, supply `address` and `token` inside `copperlineOptions`.
Disconnecting an attached session leaves the emulator running; stopping a
launched session closes the emulator.

## Debugger views

Use VS Code's Variables, Watch, Call Stack, Disassembly and memory views.
Copperline provides registers and custom-chip state through its variable scopes,
and supports reverse stepping through its adapter. The extension's UAE-specific
**DISASSEMBLED MEMORY** panel and custom memory-dump expressions are not used
by Copperline; use the standard Disassembly view and Copperline's expressions.

## Testing the integration

The normal extension test suite includes the configuration and adapter-selection
tests. To also run the headless launch and attach tests with an installed
Copperline:

```sh
npm run test-compile
COPPERLINE_INTEGRATION=1 npm test
```

The tests assemble a small program with the extension's bundled vasm, start it
through VS Code, check source breakpoints, stepping, registers, memory and
disassembly, then check both attach methods and disconnect behaviour. Set
`COPPERLINE_CTL`, `COPPERLINE_BIN` or `VASM` to executable paths if needed.
