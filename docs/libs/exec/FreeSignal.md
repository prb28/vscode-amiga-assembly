
**NAME**

FreeSignal -- free a signal bit

**SYNOPSIS**

```c
    FreeSignal(signalNum)
               D0

    void FreeSignal(BYTE);

```
**FUNCTION**

This function frees a previously allocated signal bit for reuse.
This call must be performed while running in the same task in which
the signal was allocated.

**WARNING**

Signals may not be allocated or freed from exception handling code.

NOTE
Starting with V37, an attempt to free signal -1 is harmless.

**INPUTS**

signalNum - the signal number to free {0..31}.
