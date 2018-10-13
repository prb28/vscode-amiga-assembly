[![Build Status Travis](https://travis-ci.org/prb28/vscode-amiga-assembly.svg?branch=master)](https://travis-ci.org/prb28/vscode-amiga-assembly) [![Build Status AppVeyor](https://ci.appveyor.com/api/projects/status/github/prb28/vscode-amiga-assembly?branch=master)](https://ci.appveyor.com/project/prb28/vscode-amiga-assembly)
[![Coverage Status](https://coveralls.io/repos/github/prb28/vscode-amiga-assembly/badge.png?branch=master)](https://coveralls.io/github/prb28/vscode-amiga-assembly?branch=master)

# Amiga Assembly for Visual Studio Code
Amiga Assembly for Visual Studio Code is a extension to support assembly language for the Amiga Motorolla 68000 machines and emulators.

Visit the [WIKI](https://github.com/prb28/vscode-amiga-assembly/wiki) pages to discover all the features and get the documentation.

**For an easy startup try the** [example workspace](https://github.com/prb28/vscode-amiga-wks-example). 

## New in 0.9
- Show disassembled code in editor for stack trace selection without source, breakpoints on disassembled code
- Better error messages on bad settings and launch parameters

### Other features
### Run and Debug with FS-UAE
![Debug](images/debug.gif)

- Run a program in [FS-UAE](https://fs-uae.net/)
- Disassemble a file with capstone

## Features
### VASM and VLINK integration
You can compile your program with [VASM](http://sun.hasenbraten.de/vasm/) and [VLINK](http://sun.hasenbraten.de/vlink/).

![Output window screenshot](images/buildworkspace.gif)

### Motorola 68K Assembly Language Support
This feature is based on the work of Steve Saunders for Sublime Text m68k extension, it's available at https://github.com/stevenjs/M68k-Assembly. Some keywords have been added to be more accurate with the Amiga assembly.

### Document Formatting
#### Format a document
The assembly language will be formatted with the standard shortcuts :
- On Windows Shift + Alt + F
- On Mac Shift + Option + F
- On Ubuntu Ctrl + Shift + I
- or Ctrl + Shift + P (or Command + Shift + P on Mac), and then search for "Format Document".

![Formatting screenshot](images/formatting.gif)

#### Format a selection
- The format sizes are calculated only for the selection 

![Formatting screenshot](images/formattingrange.gif)

### Contextual documentation 
- On passing over an assembly command a short documentation will apear.
- On passing over a register address or name a short documentation will apear.

![Tooltip for instruction screenshot](images/hover.gif)

### Presentation of the value set to a register

![Presentation of a register value](images/hoverregisterv.gif)

### Shows a number in decimal / hexadecimal and binary

![Presentation of a value](images/hovervalue.gif)

### Calculator
- Simple calculator command

![Simple calculator command](images/calculator.gif)

### Color editor
- Visualisation of the color set to a register and visual edition

![Evaluation in realtime](images/coloredit.gif)


## Release Notes
### 0.9.0
- Show disassembled code in editor for stack trace selection without source, breakpoints on disassembled code
- Better error messages on bad settings and launch parameters
- Bug fixes

### 0.8.0
- Find the definition of a symbol and references
- Accepts octal numbers
- Bug fixes 

### 0.7.0
- Run and Debug with FS-UAE
- Disassemble a file

### 0.6.2
- Bug fixes (see changelog)

### 0.6.0
- Integration of VASM : build and diagnostics in the editor
- Integration of VLINK : linking the executable
- Updated m68k instruction set documentation (contribution from [Stephen Moody](https://github.com/SteveMoody73))
- Bug fixes (see changelog)

### 0.5.0
- Color provider
- Added documentation for CIAA and CIAB
- Shows the values set to the registers
- Show values in decimal / hexadecimal and binary
- Calculator

### 0.4.0
- Format selection of document
- Format on typing
- Configurable default spacings

### 0.3.0
- Short documentation as hover over the commands and registers

### 0.2.0
- Initial release of Amiga Assembly
- Editor Highlights
- Document Formatting

## Misc credits
See the [WIKI](https://github.com/prb28/vscode-amiga-assembly/wiki) for detailed credits.
