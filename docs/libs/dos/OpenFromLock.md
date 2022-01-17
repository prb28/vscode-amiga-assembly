
**NAME**

OpenFromLock -- Opens a file you have a lock on (V36)

**SYNOPSIS**

```c
    fh = OpenFromLock(lock)
    D0                 D1

    BPTR OpenFromLock(BPTR)

```
**FUNCTION**

Given a lock, this routine performs an open on that lock.  If the open
succeeds, the lock is (effectively) relinquished, and should not be
UnLock()ed or used.  If the open fails, the lock is still usable.
The lock associated with the file internally is of the same access
mode as the lock you gave up - shared is similar to MODE_OLDFILE,
exclusive is similar to MODE_NEWFILE.

**INPUTS**

lock - Lock on object to be opened.

RESULT
fh   - Newly opened file handle or NULL for failure

BUGS
In the original V36 autodocs, this was shown (incorrectly) as
taking a Mode parameter as well.  The prototypes and pragmas were
also wrong.

**SEE ALSO**

[Open](Open.md), [Close](Close.md), [Lock](Lock.md), [UnLock](UnLock.md)
