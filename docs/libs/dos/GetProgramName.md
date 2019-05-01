
**NAME**

GetProgramName -- Returns the current program name (V36)

**SYNOPSIS**

```c
    success = GetProgramName(buf, len)
    D0                       D1   D2

    BOOL GetProgramName(STRPTR, LONG)

```
**FUNCTION**

Extracts the program name from the CLI structure and puts it
into the buffer.  If the buffer is too small, the name is truncated
present, a null string is returned in the buffer, and failure from
the call (with [IoErr](IoErr) == ERROR_OBJECT_WRONG_TYPE);

**INPUTS**

buf     - Buffer to hold extracted name
len     - Number of bytes of space in buffer

RESULT
success - Success/failure indicator

**SEE ALSO**

[SetProgramName](SetProgramName)
