# ALIGN

## Syntax
```assembly
align <bitcount>
```

## Description
Insert as much zero bytes as required to reach an address where `<bitcount>` low order bits are zero.
For example `align 2` would make an alignment to the next 32-bit boundary.
