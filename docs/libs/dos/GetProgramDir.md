
**NAME**

GetProgramDir -- Returns a lock on the directory the program was loaded
from (V36)

**SYNOPSIS**

```c
    lock = GetProgramDir()
    D0

    BPTR GetProgramDir(void)

```
**FUNCTION**

Returns a shared lock on the directory the program was loaded from.
This can be used for a program to find data files, etc, that are stored
with the program, or to find the program file itself.  NULL returns are
valid, and may occur, for example, when running a program from the
resident list.  You should NOT unlock the lock.

RESULT
lock - A lock on the directory the current program was loaded from,
or NULL if loaded from resident list, etc.

BUGS
Should return a lock for things loaded via resident.  Perhaps should
return currentdir if NULL.

**SEE ALSO**

[SetProgramDir](SetProgramDir.md), [Open](Open.md)
