
**NAME**

IsInteractive -- Discover whether a file is &#034;interactive&#034;

**SYNOPSIS**

```c
    status = IsInteractive( file )
    D0                      D1

    BOOL IsInteractive(BPTR)

```
**FUNCTION**

The return value 'status' indicates whether the file associated
with the file handle 'file' is connected to a virtual terminal.

**INPUTS**

file - BCPL pointer to a file handle

**RESULTS**

status - boolean

**SEE ALSO**

