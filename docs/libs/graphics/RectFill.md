
**NAME**

RectFill -- Fill a rectangular region in a [RastPort](_00AF.md).

**SYNOPSIS**

```c

    RectFill( rp, xmin, ymin, xmax, ymax)
             a1  d0:16 d1:16 d2:16 d3:16

    void RectFill( struct RastPort *, SHORT, SHORT, SHORT, SHORT );

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Fills  the  rectangular  region  specified  by  the
parameters  with the chosen pen  colors,  areafill
pattern, and drawing mode. If no areafill pattern is
specified, fill the rectangular region with the FgPen
color, taking into account the drawing mode.

**INPUTS**

rp - pointer to a [RastPort](_00AF.md) structure
(xmin,ymin) (xmax,ymax) are the coordinates of the upper
left corner and the lower right corner, respectively, of the
rectangle.
NOTE

The following relation MUST be true:
(xmax &#062;= xmin) and (ymax &#062;= ymin)

BUGS
Complement mode with FgPen complements all bitplanes.

**SEE ALSO**

[AreaEnd](AreaEnd.md) [graphics/rastport.h](_00AF.md)
