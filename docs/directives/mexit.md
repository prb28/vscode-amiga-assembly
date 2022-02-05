# MEXIT

## Syntax
```assembly
mexit
```

## Description
Leave the current [macro](macro.md) and continue with assembling the parent context.
Note that this directive also resets the level of conditional assembly to a state before the macro was invoked; which means that it also works as a ’break’ command on all new if directives.
