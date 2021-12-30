# ODD

## Syntax
```assembly
odd
```

## Description
Aligns to an odd address.
Equivalent to `cnop 1,2`. Bugs: Note that this is not a real odd directive, as it wastes two bytes when the address is already odd.
