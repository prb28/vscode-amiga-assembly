
**NAME**

ClearEOL -- Clear from current position to end of line.

**SYNOPSIS**

```c
    ClearEOL(rp)
             A1

    void ClearEOL(struct RastPort *);

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Clear a rectangular swath from the current position to the
right edge of the rastPort.  The height of the swath is taken
from that of the current text font, and the vertical
positioning of the swath is adjusted by the text baseline,
such that text output at this position would lie wholly on
this newly cleared area.
Clearing consists of setting the color of the swath to zero,
or, if the DrawMode is 2, to the BgPen.

**INPUTS**

rp - pointer to [RastPort](_00AF.md) structure

RESULT

NOTES
o   This function may use the blitter.

**SEE ALSO**

[Text](Text.md)  [ClearScreen](ClearScreen.md)  [SetRast](SetRast.md)
[graphics/text.h](_00A8.md)  [graphics/rastport.h](_00AF.md)
