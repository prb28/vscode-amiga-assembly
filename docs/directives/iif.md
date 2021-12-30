# IIF

## Syntax
```assembly
iif <expression> <statement>
```

## Description
Conditionally assemble the `<statement>` following `<expression>`.
`IIF` stands for Immediate IF. If the value of `<expression>` is non-zero then `<statement>` is assembled. No `ENDC` should be used in conjunction with this directive. The `<statement>` can not include a label, but a label may precede the `IIF` directive. For example: `foo IIF bar equ 42` The foo label will be assigned with 42 if bar evaluates to true, otherwise foo will be assigned with the current program counter. The case when assigning a value in the `IIF <statement>` using the equal (`=`) operator and the option `-spaces` is used can’t work as the equal operator will be evaluated as part of the expression. I.e. `foo IIF 1+1 = 42` will work, but `foo IIF 1 + 1 = 42` when the option `-spaces` is specified won’t work as `= 42` will be evaluated as part of the expression.
