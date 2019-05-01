
**NAME**

SetArgStr -- Sets the arguments for the current process (V36)

**SYNOPSIS**

```c
    oldptr = SetArgStr(ptr)
    D0                 D1

    STRPTR SetArgStr(STRPTR)

```
**FUNCTION**

Sets the arguments for the current program.  The ptr MUST be reset
to it's original value before process exit.

**INPUTS**

ptr - pointer to new argument string.

RESULT
oldptr - the previous argument string

**SEE ALSO**

[GetArgStr](GetArgStr), [RunCommand](RunCommand)
