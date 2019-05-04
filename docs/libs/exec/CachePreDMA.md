
**NAME**

CachePreDMA - Take actions prior to hardware DMA  (V37)

**SYNOPSIS**

```c
    paddress = CachePreDMA(vaddress,&length,flags)
    d0                     a0       a1      d0

    APTR CachePreDMA(APTR,LONG *,ULONG);

```
**FUNCTION**

Take all appropriate steps before Direct Memory Access (DMA).  This
function is primarily intended for writers of DMA device drivers.  The
action will depend on the CPU type installed, caching modes, and the
state of any Memory Management [Unit](_0087) (MMU) activity.

This function supports advanced cache architectures that have
&#034;copyback&#034; modes.  With copyback, write data may be cached, but not
actually flushed out to memory.  If the CPU has unflushed data at the
time of DMA, data may be lost.

As implemented
68000 - Do nothing
68010 - Do nothing
68020 - Do nothing
68030 - Do nothing
68040 - Write any matching dirty cache lines back to memory.
As a side effect of the 68040's design, matching data
cache lines are also invalidated -- future CPUs may
be different.
????? - External cache boards, Virtual Memory Systems, or
future hardware may patch this vector to best emulate
the intended behavior.
With a Bus-Snooping CPU, this function my end up
doing nothing.

**INPUTS**

address - Base address to start the action.
length  - Pointer to a longword with a length.
flags   - Values:
DMA_Continue - Indicates this call is to complete
a prior request that was broken up.

**RESULTS**

paddress- Physical address that coresponds to the input virtual
address.
&#038;length - This length value will be updated to reflect the contiguous
length of physical memory present at paddress.  This may
be smaller than the requested length.  To get the mapping
for the next chunk of memory, call the function again with
a new address, length, and the DMA_Continue flag.

NOTE
Due to processor granularity, areas outside of the address range
may be affected by the cache flushing actions.  Care has been taken
to ensure that no harm is done outside the range, and that activities
on overlapping cache lines won't harm data.

**SEE ALSO**

exec/execbase.i, [CachePostDMA](CachePostDMA), [CacheClearU](CacheClearU), [CacheClearE](CacheClearE)
