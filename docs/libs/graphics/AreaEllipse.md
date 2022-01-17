
**NAME**

AreaEllipse -- add a ellipse to areainfo list for areafill.


**SYNOPSIS**

```c
    error = AreaEllipse( rp, cx,   cy,   a,    b    )
    d0                   a1  d0:16 d1:16 d2:16 d3:16

    LONG AreaEllipse( struct RastPort *, SHORT, SHORT, SHORT, SHORT)

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Add an ellipse to the vector buffer. It will be draw when [AreaEnd](AreaEnd.md) is
called.

**INPUTS**

rp - pointer to a [RastPort](_00AF.md) structure
cx - x coordinate of the centerpoint relative to the rastport.
cy - y coordinate of the centerpoint relative to the rastport.
a  - the horizontal radius of the ellipse (note: a must be &#062; 0)
b  - the vertical radius of the ellipse (note: b must be &#062; 0)

RESULT
error - zero for success, or -1 if there is no space left in the
vector list

**SEE ALSO**

[AreaMove](AreaMove.md) [AreaDraw](AreaDraw.md) [AreaCircle](AreaCircle.md) [InitArea](InitArea.md) [AreaEnd](AreaEnd.md)
[graphics/rastport.h](_00AF.md)
