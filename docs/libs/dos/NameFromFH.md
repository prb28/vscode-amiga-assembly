
**NAME**

NameFromFH -- Get the name of an open filehandle (V36)

**SYNOPSIS**

```c
    success = NameFromFH(fh, buffer, len)
    D0                   D1    D2    D3

    BOOL NameFromFH(BPTR, STRPTR, LONG)

```
**FUNCTION**

Returns a fully qualified path for the filehandle.  This routine is
guaranteed not to write more than len characters into the buffer.  The
name will be null-terminated.  See [NameFromLock](NameFromLock.md) for more information.

**INPUTS**

fh     - Lock of object to be examined.
buffer - Buffer to store name.
len    - Length of buffer.

RESULT
success - Success/failure indicator.

**SEE ALSO**

[NameFromLock](NameFromLock.md)
