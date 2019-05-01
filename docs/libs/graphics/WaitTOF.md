
**NAME**

WaitTOF -- Wait for the top of the next video frame.

**SYNOPSIS**

```c
    WaitTOF()

    void WaitTOF( void );

```
**FUNCTION**

Wait  for vertical blank to occur and all vertical blank
interrupt routines to complete before returning to caller.

**INPUTS**

none

RESULT
Places this task on the TOF wait queue. When the vertical blank
interupt comes around, the interrupt service routine will fire off
signals to all the tasks doing WaitTOF. The highest priority task
ready will get to run then.

BUGS

**SEE ALSO**

[exec.library/Wait](../exec/Wait) [exec.library/Signal](../exec/Signal)
