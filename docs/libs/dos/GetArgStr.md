
**NAME**

GetArgStr -- Returns the arguments for the process (V36)

**SYNOPSIS**

```c
    ptr = GetArgStr()
    D0

    STRPTR GetArgStr(void)

```
**FUNCTION**

Returns a pointer to the (null-terminated) arguments for the program
(process).  This is the same string passed in a0 on startup from CLI.

RESULT
ptr - pointer to arguments

**SEE ALSO**

[SetArgStr](SetArgStr.md), [RunCommand](RunCommand.md)
