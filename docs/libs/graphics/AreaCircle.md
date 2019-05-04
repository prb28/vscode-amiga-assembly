
**NAME**

AreaCircle -- add a circle to areainfo list for areafill.


**SYNOPSIS**

```c
    error = (int) AreaCircle( rp,  cx,  cy, radius)
    D0                        A1   D0   D1  D2

    ULONG AreaCircle(struct RastPort *, WORD, WORD, UWORD);

```
Links: [RastPort](_00AF) 

**FUNCTION**

Add circle to the vector buffer. It will be drawn to the rastport when
[AreaEnd](AreaEnd) is executed.

**INPUTS**

rp       - pointer to a [RastPort](_00AF) structure

cx, cy   - the coordinates of the center of the desired circle.

radius   - is the radius of the circle to draw around the centerpoint.

**RESULTS**

0 if no error
-1 if no space left in vector list

NOTES
This function is actually a macro which calls
AreaEllipse(rp,cx,cy,radius,radius).

**SEE ALSO**

[AreaMove](AreaMove) [AreaDraw](AreaDraw) AreaCircle() [InitArea](InitArea) [AreaEnd](AreaEnd)
[graphics/rastport.h](_00AF) [graphics/gfxmacros.h](_00B6)
