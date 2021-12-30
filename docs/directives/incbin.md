# INCBIN

## Syntax
```assembly
incbin <file>[,<offset>[,<length>]]
```

## Description
Inserts the binary contents of `<file>` into the object code at this position.
When `<offset>` is specified, then the given number of bytes will be skipped at the beginning of the file. The optional `<length>` argument specifies the maximum number of bytes to be read from that file. The file will be searched first in the current directory, then in all paths defined by `-I` or `incdir` in the order of occurrence.
