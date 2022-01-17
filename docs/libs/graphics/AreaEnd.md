
**NAME**

AreaEnd -- [Process](_0078.md) table of vectors and ellipses and produce areafill.


**SYNOPSIS**

```c
    error = AreaEnd(rp)
      d0            A1

    LONG AreaEnd( struct RastPort * );

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Trigger the filling operation.
[Process](_0078.md) the vector buffer and generate required
fill into the raster planes. After the fill is complete, reinitialize
for the next [AreaMove](AreaMove.md) or [AreaEllipse](AreaEllipse.md). Use the raster set up by
[InitTmpRas](InitTmpRas.md) when generating an areafill mask.

RESULT
error - zero for success, or -1 if an error occured anywhere.

**INPUTS**

rp - pointer to a [RastPort](_00AF.md) structure which specifies where the filled
regions will be rendered to.

BUGS

**SEE ALSO**

[InitArea](InitArea.md) [AreaMove](AreaMove.md) [AreaDraw](AreaDraw.md) [AreaEllipse](AreaEllipse.md)  [InitTmpRas](InitTmpRas.md)
[graphics/rastport.h](_00AF.md)
