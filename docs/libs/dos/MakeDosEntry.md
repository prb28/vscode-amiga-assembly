
**NAME**

MakeDosEntry -- Creates a [DosList](_0078) structure (V36)

**SYNOPSIS**

```c
    newdlist = MakeDosEntry(name, type)
    D0                       D1    D2

    struct DosList *MakeDosEntry(STRPTR, LONG)

```
Links: [DosList](_0078) 

**FUNCTION**

Create a [DosList](_0078) structure, including allocating a name and correctly
null-terminating the BSTR.  It also sets the dol_Type field, and sets
all other fields to 0.  This routine should be eliminated and replaced
by a value passed to AllocDosObject()!

**INPUTS**

name - name for the device/volume/assign node.
type - type of node.

RESULT
newdlist - The new device entry or NULL.

**SEE ALSO**

[AddDosEntry](AddDosEntry), [RemDosEntry](RemDosEntry), [FindDosEntry](FindDosEntry), [LockDosList](LockDosList),
[NextDosEntry](NextDosEntry), [FreeDosEntry](FreeDosEntry)
