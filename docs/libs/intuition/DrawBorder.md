
**NAME**

DrawBorder -- Draw the specified [Border](_00D4.md) structure into a [RastPort](_00AF.md).

**SYNOPSIS**

```c
    DrawBorder( RastPort, Border, LeftOffset, TopOffset )
                A0        A1      D0          D1

    VOID DrawBorder( struct RastPort *, struct Border *, WORD, WORD );

```
Links: [RastPort](_00AF.md) [Border](_00D4.md) [RastPort](_00AF.md) [Border](_00D4.md) 

**FUNCTION**

First, sets up the draw mode and pens in the [RastPort](_00AF.md) according to the
arguments of the [Border](_00D4.md) structure.  Then, draws the vectors of
the border argument into the [RastPort](_00AF.md), offset by the left and top
offsets.

As with all graphics rendering routines, the border will be clipped to
to the boundaries of the RastPort's layer, if it exists.  This is
the case with window RastPorts.

This routine will draw all borders in the NULL-terminated list linked
by the NextBorder field of the border argument.

**INPUTS**

[RastPort](_00AF.md) = pointer to the [RastPort](_00AF.md) to receive the border rendering
[Border](_00D4.md) = pointer to a [Border](_00D4.md) structure
LeftOffset = the offset to be added to each vector's x coordinate
TopOffset = the offset to be added to each vector's y coordinate

RESULT
None

BUGS

**SEE ALSO**

