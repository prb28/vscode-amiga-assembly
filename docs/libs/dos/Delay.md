
**NAME**

Delay -- Delay a process for a specified time

**SYNOPSIS**

```c
    Delay( ticks )
           D1

    void Delay(ULONG)

```
**FUNCTION**

The argument 'ticks' specifies how many ticks (50 per second) to
wait before returning control.

**INPUTS**

ticks - integer

BUGS
Due to a bug in the timer.device in V1.2/V1.3, specifying a timeout
of zero for Delay() can cause the unreliable timer &#038; floppy disk
operation.  This is fixed in V36 and later.

**SEE ALSO**

