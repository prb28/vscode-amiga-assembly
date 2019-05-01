
**NAME**

ParentOfFH -- returns a lock on the parent directory of a file (V36)

**SYNOPSIS**

```c
    lock = ParentOfFH(fh)
    D0               D1

    BPTR ParentOfFH(BPTR)

```
**FUNCTION**

Returns a shared lock on the parent directory of the filehandle.

**INPUTS**

fh   - Filehandle you want the parent of.

RESULT
lock - Lock on parent directory of the filehandle or NULL for failure.

**SEE ALSO**

Parent(), [Lock](Lock), [UnLock](UnLock) [DupLockFromFH](DupLockFromFH)
