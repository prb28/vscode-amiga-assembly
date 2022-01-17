
**NAME**

FindDisplayInfo -- search for a record identified by a specific key
(V36)

**SYNOPSIS**

```c
    handle = FindDisplayInfo(ID)
    D0                       D0

    DisplayInfoHandle FindDisplayInfo(ULONG);

```
**FUNCTION**

Given a 32-bit Mode Key, return a handle to a valid DisplayInfoRecord
found in the graphics database.  Using this handle, you can obtain
information about this Mode, including its default dimensions,
properties, and whether it is currently available for use.

**INPUTS**

ID     - unsigned long identifier

RESULT
handle - handle to a displayinfo Record with that key
or NULL if no match.

BUGS

**SEE ALSO**

[graphics/displayinfo.h](_00BD.md)
