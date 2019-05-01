
**NAME**

Inhibit -- Inhibits access to a filesystem (V36)

**SYNOPSIS**

```c
    success = Inhibit(filesystem, flag)
    D0                    D1       D2

    BOOL Inhibit(STRPTR,LONG)

```
**FUNCTION**

Sends an ACTION_INHIBIT packet to the indicated handler.  This stops
all activity by the handler until uninhibited.  When uninhibited,
anything may have happened to the disk in the drive, or there may no
longer be one.

**INPUTS**

filesystem - Name of device to inhibit (with ':')
flag       - New status.  DOSTRUE = inhibited, FALSE = uninhibited

RESULT
success    - Success/failure indicator

**SEE ALSO**

