
**NAME**

GetPrompt -- Returns the prompt for the current process (V36)

**SYNOPSIS**

```c
    success = GetPrompt(buf, len)
    D0                  D1   D2

    BOOL GetPrompt(STRPTR, LONG)

```
**FUNCTION**

Extracts the prompt string from the CLI structure and puts it
into the buffer.  If the buffer is too small, the string is truncated
appropriately and a failure code returned.  If no CLI structure is
present, a null string is returned in the buffer, and failure from
the call (with [IoErr](IoErr.md) == ERROR_OBJECT_WRONG_TYPE);

**INPUTS**

buf     - Buffer to hold extracted prompt
len     - Number of bytes of space in buffer

RESULT
success - Success/failure indicator

**SEE ALSO**

[SetPrompt](SetPrompt.md)
