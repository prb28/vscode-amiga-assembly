
**NAME**

FRead -- Reads a number of blocks from an input (buffered) (V36)

**SYNOPSIS**

```c
    count = FRead(fh, buf, blocklen, blocks)
    D0            D1  D2     D3        D4

    LONG FRead(BPTR, STRPTR, ULONG, ULONG)

```
**FUNCTION**

Attempts to read a number of blocks, each blocklen long, into the
specified buffer from the input stream.  May return less than
the number of blocks requested, either due to EOF or read errors.
This call is buffered.

**INPUTS**

fh       - filehandle to use for buffered I/O
buf      - Area to read bytes into.
blocklen - number of bytes per block.  Must be &#062; 0.
blocks   - number of blocks to read.  Must be &#062; 0.

RESULT
count - Number of _blocks_ read, or 0 for EOF.  On an error, the
number of blocks actually read is returned.

BUGS
Doesn't clear [IoErr](IoErr.md) before starting.  If you want to find out
about errors, use SetIoErr(0L) before calling.

**SEE ALSO**

[FGetC](FGetC.md), [FWrite](FWrite.md), [FGets](FGets.md)
