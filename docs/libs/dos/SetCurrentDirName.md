
**NAME**

SetCurrentDirName -- Sets the directory name for the process (V36)

**SYNOPSIS**

```c
    success = SetCurrentDirName(name)
    D0                        D1

    BOOL SetCurrentDirName(STRPTR)

```
**FUNCTION**

Sets the name for the current dir in the cli structure.  If the name
is too long to fit, a failure is returned, and the old value is left
intact.  It is advised that you inform the user of this condition.
This routine is safe to call even if there is no CLI structure.

**INPUTS**

name    - Name of directory to be set.

RESULT
success - Success/failure indicator

BUGS
This clips to a fixed (1.3 compatible) size.

**SEE ALSO**

[GetCurrentDirName](GetCurrentDirName)
