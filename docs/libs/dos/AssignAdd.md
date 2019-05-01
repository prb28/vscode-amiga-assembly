
**NAME**

AssignAdd -- Adds a lock to an assign for multi-directory assigns (V36)

**SYNOPSIS**

```c
    success = AssignAdd(name,lock)
    D0                   D1   D2

    BOOL AssignAdd(STRPTR,BPTR)

```
**FUNCTION**

Adds a lock to an assign, making or adding to a multi-directory
assign.  Note that this only will succeed on an assign created with
[AssignLock](AssignLock), or an assign created with [AssignLate](AssignLate) which has been
resolved (converted into a AssignLock()-assign).

NOTE: you should not use the lock in any way after making this call
successfully.  It becomes the part of the assign, and will be unlocked
by the system when the assign is removed.  If you need to keep the
lock, pass a lock from [DupLock](DupLock) to [AssignLock](AssignLock).

**INPUTS**

name - Name of device to assign lock to (without trailing ':')
lock - Lock associated with the assigned name

RESULT
success - Success/failure indicator.  On failure, the lock is not
unlocked.

**SEE ALSO**

[Lock](Lock), [AssignLock](AssignLock), [AssignPath](AssignPath), [AssignLate](AssignLate), [DupLock](DupLock),
[RemAssignList](RemAssignList)
