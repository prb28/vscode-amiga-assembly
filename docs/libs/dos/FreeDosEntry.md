
**NAME**

FreeDosEntry -- Frees an entry created by [MakeDosEntry](MakeDosEntry.md) (V36)

**SYNOPSIS**

```c
    FreeDosEntry(dlist)
                   D1

    void FreeDosEntry(struct DosList *)

```
Links: [DosList](_0078.md) 

**FUNCTION**

Frees an entry created by [MakeDosEntry](MakeDosEntry.md).  This routine should be
eliminated and replaced by a value passed to FreeDosObject()!

**INPUTS**

dlist - [DosList](_0078.md) to free.

**SEE ALSO**

[AddDosEntry](AddDosEntry.md), [RemDosEntry](RemDosEntry.md), [FindDosEntry](FindDosEntry.md), [LockDosList](LockDosList.md),
[NextDosEntry](NextDosEntry.md), [MakeDosEntry](MakeDosEntry.md)
