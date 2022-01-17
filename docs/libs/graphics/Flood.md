
**NAME**

Flood -- Flood rastport like areafill.

**SYNOPSIS**

```c
    error = Flood( rp, mode, x, y)
    d0            a1   d2  d0  d1

    BOOL Flood(struct RastPort *, ULONG, SHORT, SHORT);

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Search the [BitMap](_00A6.md) starting at (x,y).
Fill all adjacent pixels if they are:
Mode 0: not the same color as AOLPen
Mode 1: the same color as the pixel at (x,y)

When actually doing the fill use the modes that apply to
standard areafill routine such as drawmodes and patterns.

**INPUTS**

rp - pointer to [RastPort](_00AF.md)
(x,y) - coordinate in [BitMap](_00A6.md) to start the flood fill at.
mode -  0 fill all adjacent pixels searching for border.
1 fill all adjacent pixels that have same pen number
as the one at (x,y).

NOTES
In order to use Flood, the destination [RastPort](_00AF.md) must
have a valid [TmpRas](_00AF.md) raster whose size is as large as
that of the [RastPort](_00AF.md).

**SEE ALSO**

[AreaEnd](AreaEnd.md) [InitTmpRas](InitTmpRas.md) [graphics/rastport.h](_00AF.md)
