
**NAME**

Lock -- Lock a directory or file

**SYNOPSIS**

```c
    lock  = Lock( name, accessMode )
    D0            D1        D2

    BPTR Lock(STRPTR, LONG)

```
**FUNCTION**

A filing system lock on the file or directory 'name' is returned if
possible.

If the accessMode is ACCESS_READ, the lock is a shared read lock;
if the accessMode is ACCESS_WRITE then it is an exclusive write
lock.  Do not use random values for mode.

If Lock() fails (that is, if it cannot obtain a filing system lock
on the file or directory) it returns a zero.

Tricky assumptions about the internal format of a lock are unwise,
as are any attempts to use the fl_Link or fl_Access fields.

**INPUTS**

name       - pointer to a null-terminated string
accessMode - integer

**RESULTS**

lock - BCPL pointer to a lock

**SEE ALSO**

[UnLock](UnLock.md), [DupLock](DupLock.md), [ChangeMode](ChangeMode.md), [NameFromLock](NameFromLock.md), [DupLockFromFH](DupLockFromFH.md)
