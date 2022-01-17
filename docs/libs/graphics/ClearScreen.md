
**NAME**

ClearScreen -- Clear from current position to end of [RastPort](_00AF.md).

**SYNOPSIS**

```c
    ClearScreen(rp)
                A1

    void ClearScreen(struct RastPort *);

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Clear a rectangular swath from the current position to the
right edge of the rastPort with [ClearEOL](ClearEOL.md), then clear the rest
of the screen from just beneath the swath to the bottom of
the rastPort.
Clearing consists of setting the color of the swath to zero,
or, if the DrawMode is 2, to the BgPen.

**INPUTS**

rp - pointer to [RastPort](_00AF.md) structure

NOTES
o   This function may use the blitter.

**SEE ALSO**

[ClearEOL](ClearEOL.md)  [Text](Text.md)  [SetRast](SetRast.md)
[graphics/text.h](_00A8.md)  [graphics/rastport.h](_00AF.md)
