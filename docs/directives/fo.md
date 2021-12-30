# FO

## Syntax
```assembly
<label> fo.<size> <expression>
```

## Description
Assigns the current value of the stack-frame offset counter to `<label>`.
Afterwards the counter is decremented by the instruction’s `<size>` multiplied by `<expression>`. Any valid M68k size extension is allowed for `<size>`: b, w, l, q, s, d, x, p. The offset counter can also be referenced directly under the name `__FO`.
