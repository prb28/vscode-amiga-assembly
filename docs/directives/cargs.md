# CARGS

## Syntax
```assembly
cargs [#<offset>,]<symbol1>[.<size1>][,<symbol2>[.<size2>]]...
```

## Description
Defines `<symbol1>` with the value of `<offset>`.
Further symbols on the line, separated by comma, will be assigned the <offset> plus the size of the previous symbol.
The size defaults to 2. Valid optional size extensions are: `.b`, `.w`, `.l`, where `.l` results in a size of 4, the others 2. The `<offset>` argument defaults to 4, when not given.
