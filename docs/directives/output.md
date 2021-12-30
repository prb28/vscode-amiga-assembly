# OUTPUT

## Syntax
```assembly
output <name>
```

## Description
Sets the output file name to `<name>` when no output name was given on the command line.
A special case for Devpac-compatibility is when `<name>` starts with a ’.’ and an output name was already given. Then the current output name gets <name> appended as an extension. When an extension already exists, then it is replaced.
