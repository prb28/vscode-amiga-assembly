
**NAME**

WriteChars -- Writes bytes to the the default output (buffered) (V36)

**SYNOPSIS**

```c
    count = WriteChars(buf, buflen)
    D0                 D1

    LONG WriteChars(STRPTR, LONG)

```
**FUNCTION**

This routine writes a number of bytes to the default output.  The
length is returned.  This routine is buffered.

**INPUTS**

buf    - buffer of characters to write
buflen - number of characters to write

RESULT
count - Number of bytes written.  -1 (EOF) indicates an error

**SEE ALSO**

[FPuts](FPuts.md), [FPutC](FPutC.md), [FWrite](FWrite.md), [PutStr](PutStr.md)
