
**NAME**

SetProgramName -- Sets the name of the program being run (V36)

**SYNOPSIS**

```c
    success = SetProgramName(name)
    D0                        D1

    BOOL SetProgramName(STRPTR)

```
**FUNCTION**

Sets the name for the program in the cli structure.  If the name is
too long to fit, a failure is returned, and the old value is left
intact.  It is advised that you inform the user if possible of this
condition, and/or set the program name to an empty string.
This routine is safe to call even if there is no CLI structure.

**INPUTS**

name    - Name of program to use.

RESULT
success - Success/failure indicator.

BUGS
This clips to a fixed (1.3 compatible) size.

**SEE ALSO**

[GetProgramName](GetProgramName.md)
