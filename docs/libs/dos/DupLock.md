
**NAME**

DupLock -- Duplicate a lock

**SYNOPSIS**

```c
    lock = DupLock( lock )
    D0              D1

    BPTR DupLock(BPTR)

```
**FUNCTION**

DupLock() is passed a shared filing system lock.  This is the ONLY
way to obtain a duplicate of a lock... simply copying is not
allowed.

Another lock to the same object is then returned.  It is not
possible to create a copy of a exclusive lock.

A zero return indicates failure.

**INPUTS**

lock - BCPL pointer to a lock

**RESULTS**

newLock - BCPL pointer to a lock

**SEE ALSO**

[Lock](Lock), [UnLock](UnLock), [DupLockFromFH](DupLockFromFH), [ParentOfFH](ParentOfFH)
