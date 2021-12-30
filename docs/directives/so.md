# SO

## Syntax
```assembly
<label> so.<size> <expression>
```

## Description
Assigns the current value of the structure offset counter to `<label>`.
Afterwards the counter is incremented by the instruction’s `<size>` multiplied by `<expression>`.
Any valid M68k size extension is allowed for `<size>`: b, w, l, q, s, d, x, p. The offset counter can also be referenced directly under the name `__SO`.
