
**NAME**

AllocMem -- allocate memory given certain requirements

**SYNOPSIS**

```c
    memoryBlock = AllocMem(byteSize, attributes)
    D0                     D0        D1

    void *AllocMem(ULONG, ULONG);

```
**FUNCTION**

This is the memory allocator to be used by system code and
applications.  It provides a means of specifying that the allocation
should be made in a memory area accessible to the chips, or
accessible to shared system code.

Memory is allocated based on requirements and options.  Any
&#034;requirement&#034; must be met by a memory allocation, any &#034;option&#034; will
be applied to the block regardless.  AllocMem will try all memory
spaces until one is found with the proper requirements and room for
the memory request.

**INPUTS**

byteSize - the size of the desired block in bytes.  (The operating
system will automatically round this number to a multiple of
the system memory chunk size)

attributes -
requirements

If no flags are set, the system will return the best
available memory block.  For expanded systems, the fast
memory pool is searched first.

MEMF_CHIP:      If the requested memory will be used by
the Amiga custom chips, this flag *must*
be set.

Only certain parts of memory are reachable
by the special chip sets' DMA circuitry.
Chip DMA includes screen memory, images that
are blitted, audio data, copper lists, sprites
and Pre-V36 trackdisk.device buffers.


MEMF_FAST:      This is non-chip memory.  If no flag is set
MEMF_FAST is taken as the default.

DO NOT SPECIFY MEMF_FAST unless you know
exactly what you are doing!  If MEMF_FAST is
set, AllocMem() will fail on machines that
only have chip memory!  This flag may not
be set when MEMF_CHIP is set.


MEMF_PUBLIC:    Memory that must not be mapped, swapped,
or otherwise made non-addressable. ALL
MEMORY THAT IS REFERENCED VIA INTERRUPTS
AND/OR BY OTHER TASKS MUST BE EITHER PUBLIC
OR LOCKED INTO MEMORY! This includes both
code and data.


MEMF_LOCAL:     This is memory that will not go away
after the CPU RESET instruction.  Normally,
autoconfig memory boards become unavailable
after RESET while motherboard memory
may still be available.  This memory type
is now automatically set in V36.  Pre-V36
systems may not have this memory type
and AllocMem() will then fail.


MEMF_24BITDMA:  This is memory that is within the address
range of 24-bit DMA devices.  (Zorro-II)
This is required if you run a Zorro-II
DMA device on a machine that has memory
beyond the 24-bit addressing limit of
Zorro-II.  This memory type
is now automatically set in V36.  Pre-V36
systems may not have this memory type
and AllocMem() will then fail.


options

MEMF_CLEAR:     The memory will be initialized to all
zeros.


MEMF_REVERSE:   This allocates memory from the top of
the memory pool.  It searches the pools
in the same order, such that FAST memory
will be found first.  However, the
memory will be allocated from the highest
address available in the pool.  This
option is new as of V36.


RESULT
memoryBlock - a pointer to the newly allocated memory block.
If there are no free memory regions large enough to satisfy
the request, zero will be returned.  The pointer must be
checked for zero before the memory block may be used!

**WARNING**

The result of any memory allocation MUST be checked, and a viable
error handling path taken.  ANY allocation may fail if memory has
been filled.

EXAMPLES
AllocMem(64,0L)         - Allocate the best available memory
AllocMem(25,MEMF_CLEAR) - Allocate the best available memory, and
clear it before returning.
AllocMem(128,MEMF_CHIP) - Allocate chip memory
AllocMem(128,MEMF_CHIP|MEMF_CLEAR) - Allocate cleared chip memory
AllocMem(821,MEMF_CHIP|MEMF_PUBLIC|MEMF_CLEAR) - Allocate cleared,
public, chip memory.

NOTE
If the free list is corrupt, the system will panic with alert
AN_MemCorrupt, $01000005.

This function may not be called from interrupts.

A DOS process will have its pr_Result2 field set to
ERROR_NO_FREE_STORE if the memory allocation fails.

**SEE ALSO**

[FreeMem](FreeMem)
