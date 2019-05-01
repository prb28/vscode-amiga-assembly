
**NAME**

SetProgramDir -- Sets the directory returned by [GetProgramDir](GetProgramDir) (V36)

**SYNOPSIS**

```c
    oldlock = SetProgramDir(lock)
    D0                       D1

    BPTR SetProgramDir(BPTR)

```
**FUNCTION**

Sets a shared lock on the directory the program was loaded from.
This can be used for a program to find data files, etc, that are
stored with the program, or to find the program file itself.  NULL
is a valid input.  This can be accessed via [GetProgramDir](GetProgramDir) or
by using paths relative to PROGDIR:.

**INPUTS**

lock - A lock on the directory the current program was loaded from

RESULT
oldlock - The previous ProgramDir.

**SEE ALSO**

[GetProgramDir](GetProgramDir), [Open](Open)
