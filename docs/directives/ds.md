# DS

## Syntax
```assembly
ds.[bdlqswx] <exp>
```

## Description
Reserves memory (Define Storage): allocates `<exp>` bytes/words/longs in the current section.
Equivalent to `dcb.[bdlqswx] <exp>,0`.
