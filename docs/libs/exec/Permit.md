
**NAME**

Permit -- permit task rescheduling.

**SYNOPSIS**

```c
    Permit()

    void Permit(void);

```
**FUNCTION**

Allow other tasks to be scheduled to run by the dispatcher, after a
matching [Forbid](Forbid) has been executed.

**RESULTS**

Other tasks will be rescheduled as they are ready to run. In order
to restore normal task rescheduling, the programmer must execute
exactly one call to Permit() for every call to [Forbid](Forbid).

NOTE
This call is guaranteed to preserve all registers.

**SEE ALSO**

Forbid, Disable, Enable
