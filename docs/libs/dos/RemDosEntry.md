
**NAME**

RemDosEntry -- Removes a Dos [List](_007D) entry from it's list (V36)

**SYNOPSIS**

```c
    success = RemDosEntry(dlist)
    D0                     D1

    BOOL RemDosEntry(struct DosList *)

```
Links: [DosList](_0078) 

**FUNCTION**

This removes an entry from the Dos [Device](_0087) list.  The memory associated
with the entry is NOT freed.  NOTE: you must have locked the Dos [List](_007D)
with the appropriate flags before calling this routine.  Handler
writers should see the [AddDosEntry](AddDosEntry) caveats about locking and use
a similar workaround to avoid deadlocks.

**INPUTS**

dlist   - [Device](_0087) list entry to be removed.

RESULT
success - Success/failure indicator

**SEE ALSO**

[AddDosEntry](AddDosEntry), [FindDosEntry](FindDosEntry), [NextDosEntry](NextDosEntry), [LockDosList](LockDosList),
[MakeDosEntry](MakeDosEntry), [FreeDosEntry](FreeDosEntry)
