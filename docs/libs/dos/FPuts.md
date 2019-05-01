
**NAME**

FPuts -- Writes a string the the specified output (buffered) (V36)

**SYNOPSIS**

```c
    error = FPuts(fh, str)
    D0            D1  D2

    LONG FPuts(BPTR, STRPTR)

```
**FUNCTION**

This routine writes an unformatted string to the filehandle.  No
newline is appended to the string and the length actually written is
returned.  This routine is buffered.

**INPUTS**

fh    - filehandle to use for buffered I/O
str   - Null-terminated string to be written to default output

RESULT
error - 0 normally, otherwise -1.  Note that this is opposite of
most other Dos functions, which return success.

**SEE ALSO**

[FGets](FGets), [FPutC](FPutC), [FWrite](FWrite), [PutStr](PutStr)
