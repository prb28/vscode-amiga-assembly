
**NAME**

DupLockFromFH -- Gets a lock on an open file (V36)

**SYNOPSIS**

```c
    lock = DupLockFromFH(fh)
    D0                   D1

    BPTR DupLockFromFH(BPTR)

```
**FUNCTION**

Obtain a lock on the object associated with fh.  Only works if the
file was opened using a non-exclusive mode.  Other restrictions may be
placed on success by the filesystem.

**INPUTS**

fh   - Opened file for which to obtain the lock

RESULT
lock - Obtained lock or NULL for failure

**SEE ALSO**

[DupLock](DupLock.md), [Lock](Lock.md), [UnLock](UnLock.md)
