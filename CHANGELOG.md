# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

### [1.8.10] - stable-release - 2023-07-01

### [1.8.9] - pre-release
- [Issue #304](https://github.com/prb28/vscode-amiga-assembly/issues/304) strange behavior when debugging
- [Issue #286](https://github.com/prb28/vscode-amiga-assembly/issues/286) vasm output suppressed during build since 1.8.4

### [1.8.7] - pre-release
- [Issue #291](https://github.com/prb28/vscode-amiga-assembly/issues/291) Compatibility issue with vscode 1.86.0

### [1.8.6] - 2023-11-18
- [Issue #263](https://github.com/prb28/vscode-amiga-assembly/issues/263) Traps are not processed properly / regression stop on start

### [1.8.5] - 2023-11-15
- [Issue #263](https://github.com/prb28/vscode-amiga-assembly/issues/263) Traps are not processed properly

### [1.8.4] - 2023-11-14
- [Issue #274](https://github.com/prb28/vscode-amiga-assembly/issues/274) Error message in disassembly view

### [1.8.3] - 2023-03-24
- [Issue #262](https://github.com/prb28/vscode-amiga-assembly/issues/262) Link order cannot be set (Bug partly still present)

### [1.8.2] - 2023-03-23
- [Issue #260](https://github.com/prb28/vscode-amiga-assembly/issues/260) Breakpoint not hit and stepping in function not correct
- [Issue #259](https://github.com/prb28/vscode-amiga-assembly/issues/259) Link order cannot be set

### [1.8.1] - 2023-03-16
- [Issue #257](https://github.com/prb28/vscode-amiga-assembly/issues/257) Binaries not marked as executable on macOS

### [1.8.0] - 2023-03-13
- [Feat #253](https://github.com/prb28/vscode-amiga-assembly/issues/253) *grahambates* New FS-UAE fork
- [Feat #252](https://github.com/prb28/vscode-amiga-assembly/issues/252) Include binaries and example project in the extension
- [Issue #233](https://github.com/prb28/vscode-amiga-assembly/issues/233) Build warnings stop the build
- [Feat #229](https://github.com/prb28/vscode-amiga-assembly/pull/229) *grahambates* BLTCON Helper

### [1.6.0] - 2022-07-06
- [Feat #221](https://github.com/prb28/vscode-amiga-assembly/pull/221) *grahambates* Use of external debugger
    - Conditional breakpoints
    - Log points
    - Custom registers in variables list, including named sub-fields for specific bit ranges
    - Additional formats for variables, including signed and size variants
    - Label offset annotations for address registers

### [1.4.0] - 2022-05-08
- [Feat #215](https://github.com/prb28/vscode-amiga-assembly/pull/215) *grahambates* Substitute variables in config args
- [Feat #213](https://github.com/prb28/vscode-amiga-assembly/issues/213) multi-root workspace integration
- [Issue #211](https://github.com/prb28/vscode-amiga-assembly/issues/211) Unable to Download Binaries
- [Feat #210](https://github.com/prb28/vscode-amiga-assembly/issues/210) Use of the default disassembly view of vscode
- [Issue #205](https://github.com/prb28/vscode-amiga-assembly/issues/205) Debugger not activating
- [Feat #201](https://github.com/prb28/vscode-amiga-assembly/issues/201) Add vscode hex editor for memory editing
### [1.2.0] - 2022-02-06
- Stable release from 1.1.x versions
### [1.1.x] - 2022-02-03
- [Fix #200](https://github.com/prb28/vscode-amiga-assembly/issues/200) Undefined symbols not reported in errors view
- [Fix #197](https://github.com/prb28/vscode-amiga-assembly/issues/197) File resolution of the build errors wrong
- Fix preventing program name for example workspace with ".s"
- Updated documentation
- [Feat #192](https://github.com/prb28/vscode-amiga-assembly/pull/192) *grahambates* Improve outline by setting label ranges
- [Feat #191](https://github.com/prb28/vscode-amiga-assembly/pull/191) *grahambates* Add xref symbols for completion/hover
- [Fix #190](https://github.com/prb28/vscode-amiga-assembly/pull/190) *grahambates* Don't complete prefixed local labels
- [Feat #189](https://github.com/prb28/vscode-amiga-assembly/pull/189) *grahambates* Extract docs from comments
- [Fix #188](https://github.com/prb28/vscode-amiga-assembly/pull/188) amigaassembly: compile current file does not honor vasm settings
- [Feat #187](https://github.com/prb28/vscode-amiga-assembly/pull/187) *grahambates* Improve include path completions
- [Feat #186](https://github.com/prb28/vscode-amiga-assembly/pull/186) *grahambates* Handle local labels correctly
- [Feat #185](https://github.com/prb28/vscode-amiga-assembly/pull/185) *grahambates* Macro and CPU register completions 
- [Feat #184](https://github.com/prb28/vscode-amiga-assembly/pull/184) *grahambates* Completion improvements
- [Feat #183](https://github.com/prb28/vscode-amiga-assembly/pull/183) *grahambates* Preserve case of completions
- [Feat #182](https://github.com/prb28/vscode-amiga-assembly/pull/182) *grahambates* Add documentation for compiler directives
- [Feat #181](https://github.com/prb28/vscode-amiga-assembly/pull/181) *grahambates* Provide completion for labels
- [Issue #179](https://github.com/prb28/vscode-amiga-assembly/issues/179) *grahambates* Labels containing opcodes / control words are formatted incorrect
- [Issue #178](https://github.com/prb28/vscode-amiga-assembly/issues/178) Create ADF with defined Bootblock not work
- [Feat #176](https://github.com/prb28/vscode-amiga-assembly/issues/176) Compress the extension with webpack
- [Pull #173](https://github.com/prb28/vscode-amiga-assembly/pull/173) *dansalvato* Data Generator minor fixes
- [Feat #165](https://github.com/prb28/vscode-amiga-assembly/issues/165) Memory read/write/readwrite watch breakpoint on WinUAE

### [1.0.0] - 2021-11-27
- Configuration *checkErrorOnSave* to disable compile on save to check errors
- [Pull #171](https://github.com/prb28/vscode-amiga-assembly/pull/171) *dansalvato* Fix color picker float <-> hex calculations
- [Feat #170](https://github.com/prb28/vscode-amiga-assembly/issues/170) Add a "Run current file" launch configuration
- [Feat #164](https://github.com/prb28/vscode-amiga-assembly/issues/164) Able to change the filename from GENCOP
- [Feat #153](https://github.com/prb28/vscode-amiga-assembly/issues/153) Add command to download the example project workspace
- [Feat #152](https://github.com/prb28/vscode-amiga-assembly/issues/152) Automatically download binaries
- [Issue #150](https://github.com/prb28/vscode-amiga-assembly/issues/150) Copper disassemble does not work with winuae 
- [Feat #149](https://github.com/prb28/vscode-amiga-assembly/issues/149) Select variable view format during debug
- [Issue #143](https://github.com/prb28/vscode-amiga-assembly/issues/143) spawn vasmm68k_mot ENOENT
- [Issue #142](https://github.com/prb28/vscode-amiga-assembly/issues/142) Consider register aliases in "List used registers in selection"
- [Issue #141](https://github.com/prb28/vscode-amiga-assembly/issues/141) If there are any compile/linker errors stop the emulation from running
- [Feat #140](https://github.com/prb28/vscode-amiga-assembly/issues/140) Right click to add a memory dump in the watch window
- [Issue #139](https://github.com/prb28/vscode-amiga-assembly/issues/139) Memory dump documentation is wrong
- [Feat #128](https://github.com/prb28/vscode-amiga-assembly/issues/128) Include files reference/autocomplete
- [Feat #109](https://github.com/prb28/vscode-amiga-assembly/issues/109) Provide standard vscode tasks 
### [0.21.3] - 2021-05-13
- [Issue #157](https://github.com/prb28/vscode-amiga-assembly/issues/157) Version 0.21.2 : breakpoints in the beginning of the program not hit

### [0.21.2] - 2021-05-11
- [Issue #156](https://github.com/prb28/vscode-amiga-assembly/issues/156) Incompatibility with vscode 1.56

### [0.21.1] - 2021-01-10
- [Issue #135](https://github.com/prb28/vscode-amiga-assembly/issues/135) Regressions with 0.21 (default exceptions mask fix)

### [0.21] - 2021-01-04
- [Issue #130](https://github.com/prb28/vscode-amiga-assembly/issues/130) Builtin ADFGenerator failures
- [Feat #122](https://github.com/prb28/vscode-amiga-assembly/issues/122) Feature: Show CCR (Conditional Code Register) at debugging
- [Feat #114](https://github.com/prb28/vscode-amiga-assembly/issues/114) WinUAE GDB Support

### [0.20] - 2020-07-27
- [Issue #117](https://github.com/prb28/vscode-amiga-assembly/issues/117) _ in variable
- [Issue #116](https://github.com/prb28/vscode-amiga-assembly/issues/116) Support blitter wait in copperDisassembler
- [Issue #112](https://github.com/prb28/vscode-amiga-assembly/issues/112) Current directory wrong when debugging
- [Feat #75](https://github.com/prb28/vscode-amiga-assembly/issues/75) Better documentation with examples for ASM instructions

### [0.19.1] - 2020-01-05
- [Issue #111](https://github.com/prb28/vscode-amiga-assembly/issues/111) Setting an absolute path in amiga-assembly.tmpDir outside the workspace does not work
- [Issue #110](https://github.com/prb28/vscode-amiga-assembly/issues/110) Bug in Add Bitwise operators to calculations

### [0.19.0] - 2019-12-30
- [Feat #107](https://github.com/prb28/vscode-amiga-assembly/issues/107) Don't use hardcoded build as temp path when saving
- [Feat #106](https://github.com/prb28/vscode-amiga-assembly/issues/105) Add "step out" in debug capabilities
- [Issue #105](https://github.com/prb28/vscode-amiga-assembly/issues/105) Debugger hangs when getting back (rts) from a jsr call) 
- [Issue #102](https://github.com/prb28/vscode-amiga-assembly/issues/102) Multiple code SECTIONs cause debug output to be off
- [Feat #101](https://github.com/prb28/vscode-amiga-assembly/issues/101) Do not show the "please configure VASM" message if it is disabled in the settings
- [Feat #100](https://github.com/prb28/vscode-amiga-assembly/issues/100) Add register addresses to hover data
- [Feat #95](https://github.com/prb28/vscode-amiga-assembly/issues/95) Generate Boot Block Code
- [Feat #85](https://github.com/prb28/vscode-amiga-assembly/issues/85) Use vscode.workspace.fs instead of fs in the extension
- [Feat #79](https://github.com/prb28/vscode-amiga-assembly/issues/79) Modify market data with expression or defaults

### [0.18.2] - 2019-10-27
- [Issue #99](https://github.com/prb28/vscode-amiga-assembly/issues/99) List used registers sometimes incorrect
- [Issue #98](https://github.com/prb28/vscode-amiga-assembly/issues/98) A line containing a macro and mnemonic is badly formatted

### [0.18.1] - 2019-10-21
- [Issue #97](https://github.com/prb28/vscode-amiga-assembly/issues/97) Code builded outside the application can't be debugged 
- [Feat #87](https://github.com/prb28/vscode-amiga-assembly/issues/87) Use of Webview.toWebviewResource

### [0.18.0] - 2019-09-21
- [Feat #91](https://github.com/prb28/vscode-amiga-assembly/issues/91) Add ascii representation in popups
- [Feat #89](https://github.com/prb28/vscode-amiga-assembly/issues/89) Gdb remote protocol review
- [Feat #88](https://github.com/prb28/vscode-amiga-assembly/issues/88) Check for GUI settings edit
- [Feat #86](https://github.com/prb28/vscode-amiga-assembly/issues/86) Migrate vscode testing api to vscode-test
- [Issue #83](https://github.com/prb28/vscode-amiga-assembly/issues/83) "Format Document" indent character ; in dc.b "strings"
- [Issue #80](https://github.com/prb28/vscode-amiga-assembly/issues/80) Source file names always upper case on windows when debugging
- [Feat #78](https://github.com/prb28/vscode-amiga-assembly/issues/78) Implement supportsReadMemoryRequest and supportsDisassembleRequest
- [Feat #73](https://github.com/prb28/vscode-amiga-assembly/issues/73) Format ASM files with tabs
- [Feat #72](https://github.com/prb28/vscode-amiga-assembly/issues/72) Enhance formatting for generated data #72

### [0.17.0] - 2019-05-15
- [Issue #74](https://github.com/prb28/vscode-amiga-assembly/issues/74) Contextual documentation: not all mnemonics are recognized
- [Issue #68](https://github.com/prb28/vscode-amiga-assembly/issues/68) Presentation of the value set to a register $102 (BPLCON1) is wrong
- [Feat #66](https://github.com/prb28/vscode-amiga-assembly/issues/66) Debug C source files
- [Feat #63](https://github.com/prb28/vscode-amiga-assembly/issues/63) IntelliSense for commodore libraries
- Documentation table of contents
- Set the entry point for vlink linker
- Completion for variable and library functions in assembly

### [0.16.0] - 2019-04-21
- [Feat #40](https://github.com/prb28/vscode-amiga-assembly/issues/40) View iff/ilbm images

### [0.15.0] - 2019-04-18
- [Feat #58](https://github.com/prb28/vscode-amiga-assembly/issues/58) Name of generated ADF
- [Feat #57](https://github.com/prb28/vscode-amiga-assembly/issues/57) Feature: Sinus data generator

### [0.14.0] - 2019-04-07
- [Issue #59](https://github.com/prb28/vscode-amiga-assembly/issues/59) Missing vasm Link Error
- [Issue #56](https://github.com/prb28/vscode-amiga-assembly/issues/56) Wrong tool tip formatting of values
- [Feat #55](https://github.com/prb28/vscode-amiga-assembly/issues/55) Copper debugging

### [0.13.0] - 2019-02-09
- [Feat #54](https://github.com/prb28/vscode-amiga-assembly/issues/54) Hierarchical Outline
- [Feat #48](https://github.com/prb28/vscode-amiga-assembly/issues/48) Display used/free registers in selected codeblock

### [0.12.0] - 2019-01-15
- [Feat #46](https://github.com/prb28/vscode-amiga-assembly/issues/46) Evaluate variables values
- [Feat #45](https://github.com/prb28/vscode-amiga-assembly/issues/45) Set a preferred comment and/or instruction position while formatting a source
- [Feat #44](https://github.com/prb28/vscode-amiga-assembly/issues/44) Provide outline information

### [0.11.0] - 2019-01-02
- [Feat #37](https://github.com/prb28/vscode-amiga-assembly/issues/39) Generate adf file with the output
- [Issue #43](https://github.com/prb28/vscode-amiga-assembly/issues/43) Bad assignment formatting
- [Issue #41](https://github.com/prb28/vscode-amiga-assembly/issues/41) When running the program, the stop button should kill FS-UAE

### [0.10.2] - 2018-12-23
- [Feat #37](https://github.com/prb28/vscode-amiga-assembly/issues/37) Text format should align = or equ statements
- [Issue #38](https://github.com/prb28/vscode-amiga-assembly/issues/38) Breakpoint set before debugging session start is not sent to fs-uae 

### [0.10.1] - 2018-11-13
- Formatter fixes (macros)
- Vasm error parsing fixes

### [0.10.0] - 2018-10-28
- [Feat #32](https://github.com/prb28/vscode-amiga-assembly/issues/32) Print memory addresses in custom registries (dffxxx)
- [Issue #31](https://github.com/prb28/vscode-amiga-assembly/issues/31) Bad symbol address if it is in a different segment/sections from code
- [Issue #30](https://github.com/prb28/vscode-amiga-assembly/issues/30) Bad addresses in memory dump
- [Issue #28](https://github.com/prb28/vscode-amiga-assembly/issues/28) Working directory for emulator is invalid
- [Feat #26](https://github.com/prb28/vscode-amiga-assembly/issues/26) Copper disassembly 
- [Issue #25](https://github.com/prb28/vscode-amiga-assembly/issues/25) command 'amiga-assembly.disassemble-file' not found after update

### [0.9.0] - 2018-10-14
- [Feat #21](https://github.com/prb28/vscode-amiga-assembly/issues/21) Show disassembled code in editor for stack trace selection without source, breakpoints on disassembled code
- [Issue #24](https://github.com/prb28/vscode-amiga-assembly/issues/24) Better error messages on bad settings and launch parameters

### [0.8.0] - 2018-09-20
- [Issue #23](https://github.com/prb28/vscode-amiga-assembly/issues/23) Add a reference provider
- [Issue #22](https://github.com/prb28/vscode-amiga-assembly/issues/22) Add a definition provider
- [Issue #19](https://github.com/prb28/vscode-amiga-assembly/issues/19) * may represents the current pc in a operand symbol
- [Feat #18](https://github.com/prb28/vscode-amiga-assembly/issues/18) Accept octal numbers 
- [Feat #16](https://github.com/prb28/vscode-amiga-assembly/issues/16) Add VASM directives to documentation

### [0.7.0] - 2018-09-03
- Run and Debug with FS-UAE
- Disassemble a file

### [0.6.2] - 2018-06-28
- [Issue #3](https://github.com/prb28/vscode-amiga-assembly/issues/3) Language Packs category is for display language extensions

### [0.6.0] - 2018-06-01
- Integration of VASM : build and diagnostics in the editor
- Integration of VLINK : linking the executable
- m68k instruction set documentation (contribution from [Stephen Moody](https://github.com/SteveMoody73))
- [Issue #1](https://github.com/prb28/vscode-amiga-assembly/issues/1) Parsing error in calculator

### [0.5.0] - 2018-05-20
- Color provider
- Added documentation for CIAA and CIAB
- Shows the values set to the registers
- Show values in decimal / hexadecimal and binary
- Calculator

### [0.4.0] - 2018-05-15
- Format selection of document
- Format on typing
- Configurable default spacings

### [0.3.0] - 2018-05-14
- Documentation hover keywords (instructions and register)

### [0.2.0] - 2018-05-11
- Initial release of Amiga Assembly
- Editor Highlights
- Document Formatting
