
**NAME**

UnLock -- Unlock a directory or file

**SYNOPSIS**

```c
    UnLock( lock )
            D1

    void UnLock(BPTR)

```
**FUNCTION**

The filing system lock (obtained from [Lock](Lock), [DupLock](DupLock), or
[CreateDir](CreateDir)) is removed and deallocated.

**INPUTS**

lock - BCPL pointer to a lock

NOTE
passing zero to UnLock() is harmless

**SEE ALSO**

[Lock](Lock), [DupLock](DupLock), [ParentOfFH](ParentOfFH), [DupLockFromFH](DupLockFromFH)
