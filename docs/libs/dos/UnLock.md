
**NAME**

UnLock -- Unlock a directory or file

**SYNOPSIS**

```c
    UnLock( lock )
            D1

    void UnLock(BPTR)

```
**FUNCTION**

The filing system lock (obtained from [Lock](Lock.md), [DupLock](DupLock.md), or
[CreateDir](CreateDir.md)) is removed and deallocated.

**INPUTS**

lock - BCPL pointer to a lock

NOTE
passing zero to UnLock() is harmless

**SEE ALSO**

[Lock](Lock.md), [DupLock](DupLock.md), [ParentOfFH](ParentOfFH.md), [DupLockFromFH](DupLockFromFH.md)
