
**NAME**

ParentDir -- Obtain the parent of a directory or file

**SYNOPSIS**

```c
    newlock = ParentDir( lock )
    D0                   D1

    BPTR ParentDir(BPTR)

```
**FUNCTION**

The argument 'lock' is associated with a given file or directory.
ParentDir() returns 'newlock' which is associated the parent
directory of 'lock'.

Taking the ParentDir() of the root of the current filing system
returns a NULL (0) lock.  Note this 0 lock represents the root of
file system that you booted from (which is, in effect, the parent
of all other file system roots.)

**INPUTS**

lock - BCPL pointer to a lock

**RESULTS**

newlock - BCPL pointer to a lock

**SEE ALSO**

[Lock](Lock), [DupLock](DupLock), [UnLock](UnLock), [ParentOfFH](ParentOfFH), [DupLockFromFH](DupLockFromFH)
