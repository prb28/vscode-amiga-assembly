
**NAME**

BltBitMap -- Move a rectangular region of bits in a [BitMap](_00A6.md).

**SYNOPSIS**

```c
    planecnt = BltBitMap(SrcBitMap, SrcX, SrcY, DstBitMap,
    D0                   A0         D0:16 D1:16 A1
        DstX, DstY, SizeX, SizeY, Minterm, Mask [, TempA])
        D2:16 D3:16 D4:16  D5:16  D6:8     D7:8   [A2]

    ULONG BltBitMap(struct BitMap *, WORD, WORD, struct BitMap *,
        WORD, WORD, WORD, WORD, UBYTE, UBYTE, UWORD *);

```
Links: [BitMap](_00A6.md) [BitMap](_00A6.md) 

**FUNCTION**

Perform non-destructive blits to move a rectangle from one
area in a [BitMap](_00A6.md) to another area, which can be on a different
[BitMap](_00A6.md).
This blit is assumed to be friendly: no error conditions (e.g.
a rectangle outside the [BitMap](_00A6.md) bounds) are tested or reported.

**INPUTS**

SrcBitMap, DstBitMap - the BitMap(s) containing the
rectangles
- the planes copied from the source to the destination are
only those whose plane numbers are identical and less
than the minimum Depth of either [BitMap](_00A6.md) and whose Mask
bit for that plane is non-zero.
- as a special case, if a plane pointer in the SrcBitMap
is zero, it acts as a pointer to a plane of all zeros, and
if the plane pointer is 0xffffffff, it acts as a pointer
to a plane of all ones.  (Note: new for V36)
- SrcBitMap and DstBitMap can be identical if they point
to actual planes.
SrcX, SrcY - the x and y coordinates of the upper left corner
of the source rectangle.  Valid range is positive
signed integer such that the raster word's offset
0..(32767-Size)
DstX, DstY - the x and y coordinates of the upper left
corner of the destination for the rectangle.  Valid
range is as for Src.
SizeX, SizeY - the size of the rectangle to be moved.  Valid
range is (X: 1..976; Y: 1..1023 such that final raster
word's offset is 0..32767)
Minterm - the logic function to apply to the rectangle when
A is non-zero (i.e. within the rectangle).  B is the
source rectangle and C, D is the destination for the
rectangle.
- $0C0 is a vanilla copy
- $030 inverts the source before the copy
- $050 ignores the source and inverts the destination
- see the hardware reference manual for other combinations
Mask - the write mask to apply to this operation.  Bits set
indicate the corresponding planes (if not greater than
the minimum plane count) are to participate in the
operation.  Typically this is set to 0xff.
TempA - If the copy overlaps exactly to the left or right
(i.e. the scan line addresses overlap), and TempA is
non-zero, it points to enough chip accessable memory
to hold a line of A source for the blit (ie CHIP RAM).
BitBitMap will allocate (and free) the needed TempA if
none is provided and one is needed.  Blit overlap is
determined from the relation of the first non-masked
planes in the source and destination bit maps.

**RESULTS**

planecnt - the number of planes actually involved in the blit.

NOTES
o   This function may use the blitter.

**SEE ALSO**

[ClipBlit](ClipBlit.md)  [graphics/gfx.h](_00A6.md)  [hardware/blit.h](_00CC.md)
