
**NAME**

Enable -- permit system interrupts to resume.

**SYNOPSIS**

```c
    Enable();

    void Enable(void);

```
**FUNCTION**

Allow system interrupts to again occur normally, after a matching
[Disable](Disable) has been executed.

**RESULTS**

[Interrupt](_008C) processing is restored to normal operation. The
programmer must execute exactly one call to Enable() for every call
to [Disable](Disable).

NOTE
This call is guaranteed to preserve all registers.

**SEE ALSO**

Forbid, Permit, Disable
