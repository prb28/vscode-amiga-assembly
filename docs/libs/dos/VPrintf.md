
**NAME**

VPrintf -- format and print string (buffered) (V36)

**SYNOPSIS**

```c
    count = VPrintf(fmt, argv)
      D0            D1   D2

    LONG VPrintf(STRPTR, LONG *)

    count = Printf(fmt, ...)

    LONG Printf(STRPTR, ...)

```
**FUNCTION**

Writes the formatted string and values to [Output](Output).  This routine is
assumed to handle all internal buffering so that the formatting string
and resultant formatted values can be arbitrarily long.  Any secondary
error code is returned in [IoErr](IoErr).  This routine is buffered.

Note: [RawDoFmt](../exec/RawDoFmt) assumes 16 bit ints, so you will usually need 'l's in
your formats (ex: %ld versus %d).

**INPUTS**

fmt   - exec.library [RawDoFmt](../exec/RawDoFmt) style formatting string
argv  - Pointer to array of formatting values

RESULT
count - Number of bytes written or -1 (EOF) for an error

BUGS
The prototype for Printf() currently forces you to cast the first
varargs parameter to LONG due to a deficiency in the program
that generates fds, prototypes, and amiga.lib stubs.

**SEE ALSO**

[VFPrintf](VFPrintf), [VFWritef](VFWritef), [RawDoFmt](../exec/RawDoFmt), [FPutC](FPutC)
