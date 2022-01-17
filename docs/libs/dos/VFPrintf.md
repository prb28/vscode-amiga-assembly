
**NAME**

VFPrintf -- format and print a string to a file (buffered) (V36)

**SYNOPSIS**

```c
    count = VFPrintf(fh, fmt, argv)
    D0               D1  D2    D3

    LONG VFPrintf(BPTR, STRPTR, LONG *)

    count = FPrintf(fh, fmt, ...)

    LONG FPrintf(BPTR, STRPTR, ...)

```
**FUNCTION**

Writes the formatted string and values to the given file.  This
routine is assumed to handle all internal buffering so that the
formatting string and resultant formatted values can be arbitrarily
long.  Any secondary error code is returned in [IoErr](IoErr.md).  This routine
is buffered.

**INPUTS**

fh    - Filehandle to write to
fmt   - [RawDoFmt](../exec/RawDoFmt.md) style formatting string
argv  - Pointer to array of formatting values

RESULT
count - Number of bytes written or -1 (EOF) for an error

BUGS
The prototype for FPrintf() currently forces you to cast the first
varargs parameter to LONG due to a deficiency in the program
that generates fds, prototypes, and amiga.lib stubs.

**SEE ALSO**

[VPrintf](VPrintf.md), [VFWritef](VFWritef.md), [RawDoFmt](../exec/RawDoFmt.md), [FPutC](FPutC.md)
