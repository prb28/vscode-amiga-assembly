
**NAME**

UnlockIBase -- Surrender an Intuition lock gotten by [LockIBase](LockIBase.md).

**SYNOPSIS**

```c
    UnlockIBase( Lock )
                 A0

    VOID UnlockIBase( ULONG );

```
**FUNCTION**


Surrenders lock gotten by [LockIBase](LockIBase.md).

Calling this function when you do not own the specified lock will
immediately crash the system.

**INPUTS**

The value returned by [LockIBase](LockIBase.md) should be passed to this function,
to specify which internal lock is to be freed.

Note that the parameter is passed in A0, not D0, for historical
reasons.

RESULT
None

BUGS

**SEE ALSO**

[LockIBase](LockIBase.md)
