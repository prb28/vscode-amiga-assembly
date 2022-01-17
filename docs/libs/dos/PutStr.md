
**NAME**

PutStr -- Writes a string the the default output (buffered) (V36)

**SYNOPSIS**

```c
    error = PutStr(str)
    D0             D1

    LONG PutStr(STRPTR)

```
**FUNCTION**

This routine writes an unformatted string to the default output.  No
newline is appended to the string and any error is returned.  This
routine is buffered.

**INPUTS**

str   - Null-terminated string to be written to default output

RESULT
error - 0 for success, -1 for any error.  NOTE: this is opposite
most Dos function returns!

**SEE ALSO**

[FPuts](FPuts.md), [FPutC](FPutC.md), [FWrite](FWrite.md), [WriteChars](WriteChars.md)
