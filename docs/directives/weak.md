# WEAK

## Syntax
```assembly
weak <symbol>[,<symbol>...]
```

## Description
Flag `<symbol>` as a weak symbol, which means that `<symbol>` is visible to all modules in the linking process, but may be replaced by any global symbol with the same name.
When a weak symbol remains undefined its value defaults to 0.
