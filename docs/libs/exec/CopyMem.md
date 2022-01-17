
**NAME**

CopyMem - general purpose memory copy function

**SYNOPSIS**

```c
    CopyMem( source, dest, size )
             A0      A1    D0

    void CopyMem(APTR,APTR,ULONG);

```
**FUNCTION**

CopyMem is a general purpose, fast memory copy function.  It can
deal with arbitrary lengths, with its pointers on arbitrary
alignments.  It attempts to optimize larger copies with more
efficient copies, it uses byte copies for small moves, parts of
larger copies, or the entire copy if the source and destination are
misaligned with respect to each other.

Arbitrary overlapping copies are not supported.

The internal implementation of this function will change from
system to system, and may be implemented via hardware DMA.

**INPUTS**

source - a pointer to the source data region
dest  - a pointer to the destination data region
size  - the size (in bytes) of the memory area.  Zero copies
zero bytes

**SEE ALSO**

[CopyMemQuick](CopyMemQuick.md)
