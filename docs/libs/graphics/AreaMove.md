
**NAME**

AreaMove -- Define a new starting point for a new
shape in the vector list.


**SYNOPSIS**

```c
    error =  AreaMove( rp,   x,     y)
     d0                a1  d0:16  d1:16

    LONG AreaMove( struct RastPort *, SHORT, SHORT );

```
Links: [RastPort](_00AF) 

**FUNCTION**

Close  the last polygon and start another polygon
at  (x,y). Add the necessary  points  to  vector
buffer. Closing a polygon may result in the generation
of another [AreaDraw](AreaDraw) to close previous polygon.
[Remember](_00D4) to have an initialized [AreaInfo](_00AF) structure attached
to the [RastPort](_00AF).

**INPUTS**

rp  - points to a [RastPort](_00AF) structure
x,y - positions in the raster

RETURNS
error - zero for success, or -1 if there is no space left in the
vector list

BUGS

**SEE ALSO**

[InitArea](InitArea) [AreaDraw](AreaDraw) [AreaEllipse](AreaEllipse) [AreaEnd](AreaEnd) [graphics/rastport.h](_00AF)
