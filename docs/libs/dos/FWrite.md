
**NAME**

FWrite -- Writes a number of blocks to an output (buffered) (V36)

**SYNOPSIS**

```c
    count = FWrite(fh, buf, blocklen, blocks)
    D0             D1  D2     D3        D4

    LONG FWrite(BPTR, STRPTR, ULONG, ULONG)

```
**FUNCTION**

Attempts to write a number of blocks, each blocklen long, from the
specified buffer to the output stream.  May return less than the
number of blocks requested, if there is some error such as a full
disk or r/w error.  This call is buffered.

**INPUTS**

fh       - filehandle to use for buffered I/O
buf      - Area to write bytes from.
blocklen - number of bytes per block.  Must be &#062; 0.
blocks   - number of blocks to read.  Must be &#062; 0.

RESULT
count - Number of _blocks_ written.  On an error, the number of
blocks actually written is returned.

BUGS
Doesn't clear [IoErr](IoErr) before starting.  If you want to find out
about errors, use SetIoErr(0L) before calling.

**SEE ALSO**

[FPutC](FPutC), [FRead](FRead), [FPuts](FPuts)
