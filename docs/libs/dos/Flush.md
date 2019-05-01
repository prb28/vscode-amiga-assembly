
**NAME**

Flush -- Flushes buffers for a buffered filehandle (V36)

**SYNOPSIS**

```c
    success = Flush(fh)
    D0              D1

    LONG Flush(BPTR)

```
**FUNCTION**

Flushes any pending buffered writes to the filehandle.  All buffered
writes will also be flushed on [Close](Close).  If the filehandle was being
used for input, it drops the buffer, and tries to [Seek](Seek) back to the
last read position  (so subsequent reads or writes will occur at the
expected position in the file).

**INPUTS**

fh      - Filehandle to flush.

RESULT
success - Success or failure.

BUGS
Before V37 release, Flush() returned a random value.  As of V37,
it always returns success (this will be fixed in some future
release).

**SEE ALSO**

FputC(), [FGetC](FGetC), [UnGetC](UnGetC), [Seek](Seek), [Close](Close)
