# CNOP

## Syntax
```assembly
cnop <offset>,<alignment>
```

## Description
Insert as much zero bytes as required to reach an address which can be divided by `<alignment>`.
Then add `<offset>` zero bytes. May fill the padding-bytes with no-operation instructions for certain cpus.
