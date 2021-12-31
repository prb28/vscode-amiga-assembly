# NREF

## Syntax
```assembly
nref <symbol>[,<symbol>...]
```

## Description
Flag `<symbol>` as externally defined.
Similar to `xref`, but also indicate that references should be optimized to base-relative addressing modes, when possible. This directive is only present in PhxAss-compatibility mode.
