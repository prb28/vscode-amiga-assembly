
**NAME**

AreaEnd -- [Process](_OOWX) table of vectors and ellipses and produce areafill.


**SYNOPSIS**

```c
    error = AreaEnd(rp)
      d0            A1

    LONG AreaEnd( struct RastPort * );

```
Links: [RastPort](_OOAF) 

**FUNCTION**

Trigger the filling operation.
[Process](_OOWX) the vector buffer and generate required
fill into the raster planes. After the fill is complete, reinitialize
for the next [AreaMove](AreaMove) or [AreaEllipse](AreaEllipse). Use the raster set up by
[InitTmpRas](InitTmpRas) when generating an areafill mask.

RESULT
error - zero for success, or -1 if an error occured anywhere.

**INPUTS**

rp - pointer to a [RastPort](_OOAF) structure which specifies where the filled
regions will be rendered to.

BUGS

**SEE ALSO**

[InitArea](InitArea) [AreaMove](AreaMove) [AreaDraw](AreaDraw) [AreaEllipse](AreaEllipse)  [InitTmpRas](InitTmpRas)
[graphics/rastport.h](_OOAF)
