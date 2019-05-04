
**NAME**

AreaDraw -- Add a point to a list of end points for areafill.


**SYNOPSIS**

```c
    error = AreaDraw( rp,  x,     y)
      d0              A1 D0:16 D1:16

    ULONG AreaDraw( struct RastPort *, SHORT, SHORT);

```
Links: [RastPort](_00AF) 

**FUNCTION**

Add point to the vector buffer.


**INPUTS**

rp      - points to a [RastPort](_00AF) structure.
x,y     - are coordinates of a point in the raster.

RESULT
error   - zero for success, else -1 if no there was no space
left in the vector list.

BUGS

**SEE ALSO**

[AreaMove](AreaMove) [InitArea](InitArea) [AreaEnd](AreaEnd) [graphics/rastport.h](_00AF)
