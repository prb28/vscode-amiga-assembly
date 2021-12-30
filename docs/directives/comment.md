# COMMENT

## Syntax
```assembly
comment
```

## Description
Everything in the operand field is ignored and seen as a comment.
There is only one exception, when the operand contains `HEAD=`. Then the following expression is passed to the TOS output module via the symbol `TOSFLAGS`, to define the Atari specific TOS flags.
