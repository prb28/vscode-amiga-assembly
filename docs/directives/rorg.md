# RORG

## Syntax
```assembly
rorg <expression>[,<fill>]
```

## Description
Sets the program counter `<expression>` bytes behind the start of the current section.
The new program counter must not be smaller than the current one. The space will be padded by the optional `<fill>` value, or zero.
