
**NAME**

AllocSignal -- allocate a signal bit

**SYNOPSIS**

```c
    signalNum = AllocSignal(signalNum)
    D0                      D0

    BYTE AllocSignal(BYTE);

```
**FUNCTION**

Allocate a signal bit from the current tasks' pool.  Either a
particular bit, or the next free bit may be allocated.  The signal
associated with the bit will be properly initialized (cleared).  At
least 16 user signals are available per task.  Signals should be
deallocated before the task exits.

If the signal is already in use (or no free signals are available)
a -1 is returned.

Allocated signals are only valid for use with the task that
allocated them.


**WARNING**

Signals may not be allocated or freed from exception handling code.

**INPUTS**

signalNum - the desired signal number {of 0..31} or -1 for no
preference.

**RESULTS**

signalNum - the signal bit number allocated {0..31}. If no signals
are available, this function returns -1.

**SEE ALSO**

[FreeSignal](FreeSignal.md)
