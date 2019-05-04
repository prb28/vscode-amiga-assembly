
**NAME**

NextDosEntry -- Get the next Dos [List](_007D) entry (V36)

**SYNOPSIS**

```c
    newdlist = NextDosEntry(dlist,flags)
    D0                       D1    D2

    struct DosList *NextDosEntry(struct DosList *,ULONG)

```
Links: [DosList](_0078) [DosList](_0078) 

**FUNCTION**

Find the next Dos [List](_007D) entry of the right type.  You MUST have locked
the types you're looking for.  Returns NULL if there are no more of
that type in the list.

**INPUTS**

dlist    - The current device entry.
flags    - What type of entries to look for.

RESULT
newdlist - The next device entry of the right type or NULL.

**SEE ALSO**

[AddDosEntry](AddDosEntry), [RemDosEntry](RemDosEntry), [FindDosEntry](FindDosEntry), [LockDosList](LockDosList),
[MakeDosEntry](MakeDosEntry), [FreeDosEntry](FreeDosEntry)
