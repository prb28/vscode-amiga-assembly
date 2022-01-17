
**NAME**

MakeDosEntry -- Creates a [DosList](_0078.md) structure (V36)

**SYNOPSIS**

```c
    newdlist = MakeDosEntry(name, type)
    D0                       D1    D2

    struct DosList *MakeDosEntry(STRPTR, LONG)

```
Links: [DosList](_0078.md) 

**FUNCTION**

Create a [DosList](_0078.md) structure, including allocating a name and correctly
null-terminating the BSTR.  It also sets the dol_Type field, and sets
all other fields to 0.  This routine should be eliminated and replaced
by a value passed to AllocDosObject()!

**INPUTS**

name - name for the device/volume/assign node.
type - type of node.

RESULT
newdlist - The new device entry or NULL.

**SEE ALSO**

[AddDosEntry](AddDosEntry.md), [RemDosEntry](RemDosEntry.md), [FindDosEntry](FindDosEntry.md), [LockDosList](LockDosList.md),
[NextDosEntry](NextDosEntry.md), [FreeDosEntry](FreeDosEntry.md)
