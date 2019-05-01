
**NAME**

AssignLate -- Creates an assignment to a specified path later (V36)

**SYNOPSIS**

```c
    success = AssignLate(name,path)
    D0                    D1   D2

    BOOL AssignLate(STRPTR,STRPTR)

```
**FUNCTION**

Sets up a assignment that is expanded upon the FIRST reference to the
name.  The path (a string) would be attached to the node.  When
the name is referenced (Open(&#034;FOO:xyzzy&#034;...), the string will be used
to determine where to set the assign to, and if the directory can be
locked, the assign will act from that point on as if it had been
created by [AssignLock](AssignLock).

A major advantage is assigning things to unmounted volumes, which
will be requested upon access (useful in startup sequences).

**INPUTS**

name - Name of device to be assigned (without trailing ':')
path - Name of late assignment to be resolved on the first reference.

RESULT
success - Success/failure indicator of the operation

**SEE ALSO**

[Lock](Lock), [AssignAdd](AssignAdd), [AssignPath](AssignPath), [AssignLock](AssignLock),
