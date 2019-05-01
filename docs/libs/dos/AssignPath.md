
**NAME**

AssignPath -- Creates an assignment to a specified path (V36)

**SYNOPSIS**

```c
    success = AssignPath(name,path)
    D0                    D1   D2

    BOOL AssignPath(STRPTR,STRPTR)

```
**FUNCTION**

Sets up a assignment that is expanded upon EACH reference to the name.
This is implemented through a new device list type (DLT_ASSIGNPATH, or
some such).  The path (a string) would be attached to the node.  When
the name is referenced (Open(&#034;FOO:xyzzy&#034;...), the string will be used
to determine where to do the open.  No permanent lock will be part of
it.  For example, you could AssignPath() c2: to df2:c, and references
to c2: would go to df2:c, even if you change disks.

The other major advantage is assigning things to unmounted volumes,
which will be requested upon access (useful in startup sequences).

**INPUTS**

name - Name of device to be assigned (without trailing ':')
path - Name of late assignment to be resolved at each reference

RESULT
success - Success/failure indicator of the operation

**SEE ALSO**

[AssignAdd](AssignAdd), [AssignLock](AssignLock), [AssignLate](AssignLate), [Open](Open)
