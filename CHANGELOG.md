# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

### [0.15.0] - 2019-04-18
- [Feat #58](https://github.com/prb28/vscode-amiga-assembly/issues/58) Name of generated ADF
- [Feat #57](https://github.com/prb28/vscode-amiga-assembly/issues/57) Feature: Sinus data generator

### [0.14.0] - 2019-04-07
- [Issue #59](https://github.com/prb28/vscode-amiga-assembly/issues/59) Missing vasm Link Error
- [Issue #56](https://github.com/prb28/vscode-amiga-assembly/issues/56) Wrong tool tip formating of values
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
### Fixed
- [Issue #3](https://github.com/prb28/vscode-amiga-assembly/issues/3) Language Packs category is for display language extensions

### [0.6.0] - 2018-06-01
### Added
- Integration of VASM : build and diagnostics in the editor
- Integration of VLINK : linking the executable
### Updated
- m68k instruction set documentation (contribution from [Stephen Moody](https://github.com/SteveMoody73))
### Fixed
- [Issue #1](https://github.com/prb28/vscode-amiga-assembly/issues/1) Parsing error in calculator

### [0.5.0] - 2018-05-20
### Added
- Color provider
- Added documentation for CIAA and CIAB
- Shows the values set to the registers
- Show values in decimal / hexadecimal and binary
- Calculator

## [0.4.0] - 2018-05-15
### Added
- Format selection of document
- Format on typing
- Configurable default spacings

## [0.3.0] - 2018-05-14
### Added
- Documentation hover keywords (instructions and register)

## [0.2.0] - 2018-05-11
### Added
- Initial release of Amiga Assembly
- Editor Highlights
- Document Formatting
