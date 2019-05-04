
**NAME**

FindCliProc -- returns a pointer to the requested CLI process (V36)

**SYNOPSIS**

```c
    proc = FindCliProc(num)
    D0             D1

    struct Process *FindCliProc(LONG)

```
Links: [Process](_0078) 

**FUNCTION**

This routine returns a pointer to the CLI process associated with the
given CLI number.  If the process isn't an active CLI process, NULL is
returned.  NOTE: should normally be called inside a [Forbid](../exec/Forbid), if you
must use this function at all.

**INPUTS**

num  - [Task](_008E) number of CLI process

RESULT
proc - Pointer to given CLI process

**SEE ALSO**

[Cli](Cli), [Forbid](../exec/Forbid), [MaxCli](MaxCli)
