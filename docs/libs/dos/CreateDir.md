
**NAME**

CreateDir -- Create a new directory

**SYNOPSIS**

```c
    lock = CreateDir( name )
    D0                D1

    BPTR CreateDir(STRPTR)

```
**FUNCTION**

CreateDir creates a new directory with the specified name. An error
is returned if it fails.  Directories can only be created on
devices which support them, e.g. disks.  CreateDir returns an
exclusive lock on the new directory if it succeeds.

**INPUTS**

name - pointer to a null-terminated string

**RESULTS**

lock - BCPL pointer to a lock or NULL for failure.

**SEE ALSO**

[Lock](Lock.md), [UnLock](UnLock.md)
