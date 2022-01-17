
**NAME**

NextDosEntry -- Get the next Dos [List](_007D.md) entry (V36)

**SYNOPSIS**

```c
    newdlist = NextDosEntry(dlist,flags)
    D0                       D1    D2

    struct DosList *NextDosEntry(struct DosList *,ULONG)

```
Links: [DosList](_0078.md) [DosList](_0078.md) 

**FUNCTION**

Find the next Dos [List](_007D.md) entry of the right type.  You MUST have locked
the types you're looking for.  Returns NULL if there are no more of
that type in the list.

**INPUTS**

dlist    - The current device entry.
flags    - What type of entries to look for.

RESULT
newdlist - The next device entry of the right type or NULL.

**SEE ALSO**

[AddDosEntry](AddDosEntry.md), [RemDosEntry](RemDosEntry.md), [FindDosEntry](FindDosEntry.md), [LockDosList](LockDosList.md),
[MakeDosEntry](MakeDosEntry.md), [FreeDosEntry](FreeDosEntry.md)
