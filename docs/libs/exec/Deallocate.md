
**NAME**

Deallocate -- deallocate a block of memory

**SYNOPSIS**

```c
    Deallocate(memHeader, memoryBlock, byteSize)
               A0         A1           D0

    void Deallocate(struct MemHeader *,APTR,ULONG);

```
Links: [MemHeader](_0089.md) 

**FUNCTION**

This function deallocates memory by returning it to the appropriate
private free memory pool.  This function can be used to free an
entire block allocated with the above function, or it can be used
to free a sub-block of a previously allocated block.  Sub-blocks
must be an even multiple of the memory chunk size (currently 8
bytes).

This function can even be used to add a new free region to an
existing [MemHeader](_0089.md), however the extent pointers in the [MemHeader](_0089.md)
will no longer be valid.

If memoryBlock is not on a block boundary (MEM_BLOCKSIZE) then it
will be rounded down in a manner compatible with [Allocate](Allocate.md).  Note
that this will work correctly with all the memory allocation
functions, but may cause surprises if one is freeing only part of a
region.  The size of the block will be rounded up, so the freed
block will fill to an even memory block boundary.

**INPUTS**

memHeader - points to the memory header this block is part of.
memoryBlock - address of memory block to free.
byteSize - the size of the block in bytes. If NULL, nothing
happens.

**SEE ALSO**

Allocate, [exec/memory.h](_0089.md)
