
**NAME**

DrawEllipse -- Draw an ellipse centered at cx,cy with vertical
and horizontal radii of a,b respectively.

**SYNOPSIS**

```c
    DrawEllipse( rp, cx, cy, a, b )
                 a1  d0  d1  d2 d3

    void DrawEllipse( struct RastPort *, SHORT, SHORT, SHORT, SHORT);

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Creates an elliptical outline within the rectangular region
specified by the parameters, using the current foreground pen color.

**INPUTS**

rp - pointer to the [RastPort](_00AF.md) into which the ellipse will be drawn.
cx - x coordinate of the centerpoint relative to the rastport.
cy - y coordinate of the centerpoint relative to the rastport.
a - the horizontal radius of the ellipse (note: a must be &#062; 0)
b - the vertical radius of the ellipse (note: b must be &#062; 0)

BUGS

NOTES
this routine does not clip the ellipse to a non-layered rastport.

**SEE ALSO**

DrawCircle(), [graphics/rastport.h](_00AF.md)
