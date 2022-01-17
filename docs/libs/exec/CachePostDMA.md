
**NAME**

CachePostDMA - Take actions after to hardware DMA  (V37)

**SYNOPSIS**

```c
    CachePostDMA(vaddress,&length,flags)
                 a0       a1      d0

    CachePostDMA(APTR,LONG *,ULONG);

```
**FUNCTION**

Take all appropriate steps after Direct Memory Access (DMA).  This
function is primarily intended for writers of DMA device drivers.  The
action will depend on the CPU type installed, caching modes, and the
state of any Memory Management [Unit](_0087.md) (MMU) activity.

As implemented
68000 - Do nothing
68010 - Do nothing
68020 - Do nothing
68030 - Flush the data cache
68040 - Flush matching areas of the data cache
????? - External cache boards, Virtual Memory Systems, or
future hardware may patch this vector to best emulate
the intended behavior.
With a Bus-Snooping CPU, this function my end up
doing nothing.

**INPUTS**

address - Same as initially passed to [CachePreDMA](CachePreDMA.md)
length  - Same as initially passed to [CachePreDMA](CachePreDMA.md)
flags   - Values:
DMA_NoModify - If the area was not modified (and
thus there is no reason to flush the cache) set
this bit.

**SEE ALSO**

exec/execbase.i, [CachePreDMA](CachePreDMA.md), [CacheClearU](CacheClearU.md), [CacheClearE](CacheClearE.md)
