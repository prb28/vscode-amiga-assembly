
**NAME**

SameLock -- returns whether two locks are on the same object (V36)

**SYNOPSIS**

```c
    value = SameLock(lock1, lock2)
    D0                D1     D2

    LONG SameLock(BPTR, BPTR)

```
**FUNCTION**

Compares two locks.  Returns LOCK_SAME if they are on the same object,
LOCK_SAME_VOLUME if on different objects on the same volume, and
LOCK_DIFFERENT if they are on different volumes.  Always compare
for equality or non-equality with the results, in case new return
values are added.

**INPUTS**

lock1 - 1st lock for comparison
lock2 - 2nd lock for comparison

RESULT
value - LOCK_SAME, LOCK_SAME_VOLUME, or LOCK_DIFFERENT

BUGS
Should do more extensive checks for NULL against a real lock, checking
to see if the real lock is a lock on the root of the boot volume.

In V36, it would return LOCK_SAME_VOLUME for different volumes on the
same handler.  Also, LOCK_SAME_VOLUME was LOCK_SAME_HANDLER (now
an obsolete define, see [&#060;dos/dos.h&#062;](_0068.md)).

**SEE ALSO**

[&#060;dos/dos.h&#062;](_0068.md)
