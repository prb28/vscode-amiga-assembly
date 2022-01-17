
**NAME**

BltTemplate -- Cookie cut a shape in a rectangle to the [RastPort](_00AF.md).

**SYNOPSIS**

```c
    BltTemplate(SrcTemplate, SrcX, SrcMod, rp,
                A0           D0:16  D1:16  A1
        DstX,  DstY, SizeX, SizeY)
        D2:16  D3:16 D4:16  D5:16

    void BltTemplate(UWORD *, WORD, WORD, struct RastPort *,
         WORD, WORD, WORD, WORD);

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

This function draws the image in the template into the
[RastPort](_00AF.md) in the current color and drawing mode at the
specified position.  The template is assumed not to overlap
the destination.
If the template falls outside the [RastPort](_00AF.md) boundary, it is
truncated to that boundary.

Note: the SrcTemplate pointer should point to the &#034;nearest&#034; word
(rounded down) of the template mask. Fine alignment of the mask
is acheived by setting the SrcX bit offseet within the range
of 0 to 15 decimal.

**INPUTS**

SrcTemplate  - pointer to the first (nearest) word of the template
mask.
SrcX         - x bit offset into the template mask (range 0..15).
SrcMod       - number of bytes per row in template mask.
rp           - pointer to destination [RastPort](_00AF.md).
DstX, DstY   - x and y coordinates of the upper left
corner of the destination for the blit.
SizeX, SizeY - size of the rectangle to be used as the
template.

NOTES
o   This function may use the blitter.

**SEE ALSO**

[BltBitMap](BltBitMap.md)  [graphics/rastport.h](_00AF.md)
