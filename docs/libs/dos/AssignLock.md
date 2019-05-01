
**NAME**

AssignLock -- Creates an assignment to a locked object (V36)

**SYNOPSIS**

```c
    success = AssignLock(name,lock)
    D0                    D1   D2

    BOOL AssignLock(STRPTR,BPTR)

```
**FUNCTION**

Sets up an assign of a name to a given lock.  Passing NULL for a lock
cancels any outstanding assign to that name.  If an assign entry of
that name is already on the list, this routine replaces that entry.  If
an entry is on the list that conflicts with the new assign, then a
failure code is returned.

NOTE: you should not use the lock in any way after making this call
successfully.  It becomes the assign, and will be unlocked by the
system when the assign is removed.  If you need to keep the lock,
pass a lock from [DupLock](DupLock) to AssignLock().

**INPUTS**

name - Name of device to assign lock to (without trailing ':')
lock - Lock associated with the assigned name

RESULT
success - Success/failure indicator.  On failure, the lock is not
unlocked.

**SEE ALSO**

[Lock](Lock), [AssignAdd](AssignAdd), [AssignPath](AssignPath), [AssignLate](AssignLate), [DupLock](DupLock),
[RemAssignList](RemAssignList)
