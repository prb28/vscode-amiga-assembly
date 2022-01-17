
**NAME**

InitTmpRas -- Initialize area of local memory for usage by
areafill, floodfill, text.

**SYNOPSIS**

```c
    InitTmpRas(tmpras, buffer, size)
                a0       a1     d0

    void InitTmpRas( struct TmpRas *, void *, ULONG );

```
Links: [TmpRas](_00AF.md) 

**FUNCTION**

The area of memory pointed to by buffer is set up to be used
by [RastPort](_00AF.md) routines that may need to get some memory for
intermediate operations in preparation to putting the graphics
into the final [BitMap](_00A6.md).
Tmpras is used to control the usage of buffer.

**INPUTS**

tmpras - pointer to a [TmpRas](_00AF.md) structure to be linked into
a [RastPort](_00AF.md)
buffer - pointer to a contguous piece of chip memory.
size - size in bytes of buffer

RESULT
makes buffer available for users of [RastPort](_00AF.md)

BUGS
Would be nice if RastPorts could share one [TmpRas](_00AF.md).

**SEE ALSO**

[AreaEnd](AreaEnd.md) [Flood](Flood.md) [Text](Text.md) [graphics/rastport.h](_00AF.md)
