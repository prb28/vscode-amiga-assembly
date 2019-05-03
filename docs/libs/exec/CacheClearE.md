
**NAME**

CacheClearE - Cache clearing with extended control (V37)

**SYNOPSIS**

```c
    CacheClearE(address,length,caches)
                a0      d0     d1

    void CacheClearE(APTR,ULONG,ULONG);

```
**FUNCTION**

Flush out the contents of the CPU instruction and/or data caches.
If dirty data cache lines are present, push them to memory first.

Motorola CPUs have separate instruction and data caches.  A data
write does not update the instruction cache.  If an instruction is
written to memory or modified, the old instruction may still exist
in the cache.  Before attempting to execute the code, a flush of
the instruction cache is required.

For most systems, the data cache is not updated by Direct Memory
Access (DMA), or if some external factor changes shared memory.

Caches must be cleared after *any* operation that could cause
invalid or stale data.  The most common cases are DMA and modifying
instructions using the processor.

Some examples:
Self modifying code
Building Jump tables
Run-time code patches
Relocating code for use at different addresses.
Loading code from disk

**INPUTS**

address - Address to start the operation.  This may be rounded
due to hardware granularity.
length  - Length of area to be cleared, or $FFFFFFFF to indicate all
addresses should be cleared.
caches  - Bit flags to indicate what caches to affect.  The current
supported flags are:
CACRF_ClearI    ;Clear instruction cache
CACRF_ClearD    ;Clear data cache
All other bits are reserved for future definition.

NOTES
On systems with a copyback mode cache, any dirty data is pushed
to memory as a part of this operation.

Regardless of the length given, the function will determine the most
efficient way to implement the operation.  For some cache systems,
including the 68030, the overhead partially clearing a cache is often
too great.  The entire cache may be cleared.

For all current Amiga models, Chip memory is set with Instruction
caching enabled, data caching disabled.  This prevents coherency
conflicts with the blitter or other custom chip DMA.  [Custom](_00CD) chip
registers are marked as non-cacheable by the hardware.

The system takes care of appropriately flushing the caches for normal
operations.  The instruction cache is cleared by all calls that
modify instructions, including [LoadSeg](../dos/LoadSeg), [MakeLibrary](MakeLibrary) and
[SetFunction](SetFunction).

**SEE ALSO**

exec/execbase.i, [CacheControl](CacheControl), [CacheClearU](CacheClearU)
