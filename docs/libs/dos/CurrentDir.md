
**NAME**

CurrentDir -- Make a directory lock the current directory

**SYNOPSIS**

```c
    oldLock = CurrentDir( lock )
    D0                    D1

    BPTR CurrentDir(BPTR)

```
**FUNCTION**

CurrentDir() causes a directory associated with a lock to be made
the current directory.  The old current directory lock is returned.

A value of zero is a valid result here, this 0 lock represents the
root of file system that you booted from.

Any call that has to [Open](Open.md) or [Lock](Lock.md) files (etc) requires that
the current directory be a valid lock or 0.

**INPUTS**

lock - BCPL pointer to a lock

**RESULTS**

oldLock - BCPL pointer to a lock

**SEE ALSO**

[Lock](Lock.md), [UnLock](UnLock.md), [Open](Open.md), [DupLock](DupLock.md)
