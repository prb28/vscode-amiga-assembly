
**NAME**

RemAssignList -- Remove an entry from a multi-dir assign (V36)

**SYNOPSIS**

```c
    success = RemAssignList(name,lock)
    D0                       D1   D2

    BOOL RemAssignList(STRPTR,BPTR)

```
**FUNCTION**

Removes an entry from a multi-directory assign.  The entry removed is
the first one for which [SameLock](SameLock) with 'lock' returns that they are on
the same object.  The lock for the entry in the list is unlocked (not
the entry passed in).

**INPUTS**

name - Name of device to remove lock from (without trailing ':')
lock - Lock associated with the object to remove from the list

RESULT
success - Success/failure indicator.

**SEE ALSO**

[Lock](Lock), [AssignLock](AssignLock), [AssignPath](AssignPath), [AssignLate](AssignLate), [DupLock](DupLock),
[AssignAdd](AssignAdd), [UnLock](UnLock)
