# REPT

## Syntax
```assembly
rept <expression>
```

## Description
Repeats the assembly of the block between rept and [endr](endr.md) `<expression>` number of times.
<expression> has to be positive. The internal symbol `REPTN` always holds the iteration counter of the inner repeat loop, starting with 0. `REPTN` is -1 outside of any repeat block.
