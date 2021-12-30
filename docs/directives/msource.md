# MSOURCE

## Syntax
```assembly
msource on/off
```

## Description
Enable or disable source level debugging within a macro context.
It can be used before one or more macro definitions. When off, the debugger will show the invoking source text line instead. Defaults to on. Also numeric expressions like 0 or 1 are allowed. Note, that this directive currently only has a meaning when using the -linedebug option with the hunk-format output module (-Fhunk).
