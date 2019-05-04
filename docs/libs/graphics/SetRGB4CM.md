
**NAME**

SetRGB4CM -- Set one color register for this [ColorMap](_00B8).

**SYNOPSIS**

```c
    SetRGB4CM(  cm,  n,   r,    g,    b)
                a0  d0  d1:4  d2:4  d3:4

    void SetRGB4CM( struct ColorMap *, SHORT, UBYTE, UBYTE, UBYTE );

```
Links: [ColorMap](_00B8) 

**INPUTS**

cm = colormap
n = the number of the color register to set. Ranges from 0 to 31
on current amiga displays.
r = red level (0-15)
g = green level (0-15)
b = blue level (0-15)

RESULT
Store the (r,g,b) triplet at index n of the [ColorMap](_00B8) structure.
This function can be used to set up a [ColorMap](_00B8) before before
linking it into a viewport.

BUGS

**SEE ALSO**

[GetColorMap](GetColorMap) [GetRGB4](GetRGB4) [SetRGB4](SetRGB4) [graphics/view.h](_00B8)
