# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

### [0.10.0] - 
- [Feat #32](https://github.com/prb28/vscode-amiga-assembly/issues/32) Print memory adresses in custom registries (dffxxx)
- [Issue #31](https://github.com/prb28/vscode-amiga-assembly/issues/31) Bad symbol address if it is in a different segment/sections from code
- [Issue #30](https://github.com/prb28/vscode-amiga-assembly/issues/30) Bad adresses in memory dump
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
