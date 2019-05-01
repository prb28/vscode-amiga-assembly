
**NAME**

InitTmpRas -- Initialize area of local memory for usage by
areafill, floodfill, text.

**SYNOPSIS**

```c
    InitTmpRas(tmpras, buffer, size)
                a0       a1     d0

    void InitTmpRas( struct TmpRas *, void *, ULONG );

```
Links: [TmpRas](_OOAF) 

**FUNCTION**

The area of memory pointed to by buffer is set up to be used
by [RastPort](_OOAF) routines that may need to get some memory for
intermediate operations in preparation to putting the graphics
into the final [BitMap](_OOAV).
Tmpras is used to control the usage of buffer.

**INPUTS**

tmpras - pointer to a [TmpRas](_OOAF) structure to be linked into
a [RastPort](_OOAF)
buffer - pointer to a contguous piece of chip memory.
size - size in bytes of buffer

RESULT
makes buffer available for users of [RastPort](_OOAF)

BUGS
Would be nice if RastPorts could share one [TmpRas](_OOAF).

**SEE ALSO**

[AreaEnd](AreaEnd) [Flood](Flood) [Text](Text) [graphics/rastport.h](_OOAF)
