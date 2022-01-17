
**NAME**

SetRGB4 -- Set one color register for this viewport.

**SYNOPSIS**

```c
    SetRGB4(  vp, n,   r,    g,    b)
              a0  d0  d1:4  d2:4  d3:4

    void SetRGB4( struct ViewPort *, SHORT, UBYTE, UBYTE, UBYTE );

```
Links: [ViewPort](_00B8.md) 

**FUNCTION**

Change the color look up table so that this viewport displays
the color (r,g,b) for pen number n.

**INPUTS**

vp - pointer to  viewport structure
n - the color number (range from 0 to 31)
r - red level (0-15)
g - green level (0-15)
b - blue level (0-15)

RESULT
If there is a [ColorMap](_00B8.md) for this viewport, then the value will
be stored in the [ColorMap](_00B8.md).
The selected color register is changed to match your specs.
If the color value is unused then nothing will happen.

BUGS
NOTE: Under V36 and up, it is not safe to call this function
from an interrupt, due to semaphore protection of graphics
copper lists.

**SEE ALSO**

[LoadRGB4](LoadRGB4.md) [GetRGB4](GetRGB4.md) [graphics/view.h](_00B8.md)
