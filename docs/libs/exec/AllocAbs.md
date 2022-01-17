
**NAME**

AllocAbs -- allocate at a given location

**SYNOPSIS**

```c
    memoryBlock = AllocAbs(byteSize, location)
    D0                     D0        A1

    void *AllocAbs(ULONG, APTR);

```
**FUNCTION**

This function attempts to allocate memory at a given absolute
memory location.  Often this is used by boot-surviving entities
such as recoverable ram-disks.  If the memory is already being
used, or if there is not enough memory to satisfy the request,
AllocAbs will return NULL.

This block may not be exactly the same as the requested block
because of rounding, but if the return value is non-zero, the block
is guaranteed to contain the requested range.

**INPUTS**

byteSize - the size of the desired block in bytes
This number is rounded up to the next larger
block size for the actual allocation.
location - the address where the memory MUST be.


RESULT
memoryBlock - a pointer to the newly allocated memory block, or
NULL if failed.

NOTE
If the free list is corrupt, the system will panic with alert
AN_MemCorrupt, $01000005.

The 8 bytes past the end of an AllocAbs will be changed by Exec
relinking the next block of memory.  Generally you can't trust
the first 8 bytes of anything you AllocAbs.

**SEE ALSO**

[AllocMem](AllocMem.md), [FreeMem](FreeMem.md)
