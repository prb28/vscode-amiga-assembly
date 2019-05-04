
**NAME**

AttemptLockDosList -- Attempt to lock the Dos Lists for use (V36)

**SYNOPSIS**

```c
    dlist = AttemptLockDosList(flags)
    D0                          D1

    struct DosList *AttemptLockDosList(ULONG)

```
Links: [DosList](_0078) 

**FUNCTION**

Locks the dos device list in preparation to walk the list.  If the
list is 'busy' then this routine will return NULL.  See [LockDosList](LockDosList)
for more information.

**INPUTS**

flags - Flags stating which types of nodes you want to lock.

RESULT
dlist - Pointer to the beginning of the list or NULL.  Not a valid
node!

**SEE ALSO**

[LockDosList](LockDosList), [UnLockDosList](UnLockDosList), [Forbid](../exec/Forbid), [NextDosEntry](NextDosEntry)
