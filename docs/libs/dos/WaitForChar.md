
**NAME**

WaitForChar -- Determine if chars arrive within a time limit

**SYNOPSIS**

```c
    status = WaitForChar( file, timeout )
    D0                    D1    D2

    BOOL WaitForChar(BPTR, LONG)

```
**FUNCTION**

If a character is available to be read from 'file' within a the
time (in microseconds) indicated by 'timeout', WaitForChar()
returns -1 (TRUE). If a character is available, you can use [Read](Read.md)
to read it.  Note that WaitForChar() is only valid when the I/O
stream is connected to a virtual terminal device. If a character is
not available within 'timeout', a 0 (FALSE) is returned.

BUGS
Due to a bug in the timer.device in V1.2/V1.3, specifying a timeout
of zero for WaitForChar() can cause the unreliable timer &#038; floppy
disk operation.

**INPUTS**

file - BCPL pointer to a file handle
timeout - integer

**RESULTS**

status - boolean

**SEE ALSO**

[Read](Read.md), [FGetC](FGetC.md)
