
**NAME**

FreeTrap -- free a processor trap

**SYNOPSIS**

```c
    FreeTrap(trapNum)
             D0

    void FreeTrap(ULONG);

```
**FUNCTION**

This function frees a previously allocated trap number for reuse.
This call must be performed while running in the same task in which
the trap was allocated.

**WARNING**

Traps may not be allocated or freed from exception handling code.

**INPUTS**

trapNum - the trap number to free {of 0..15}
