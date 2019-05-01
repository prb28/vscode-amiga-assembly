
**NAME**

ClearRegion -- Remove all rectangles from region.

**SYNOPSIS**

```c
    ClearRegion(region)
                 a0

    void ClearRegion( struct Region * );

```
Links: [Region](_OOBW) 

**FUNCTION**

Clip away all rectangles in the region leaving nothing.

**INPUTS**

region - pointer to [Region](_OOBW) structure

BUGS

**SEE ALSO**

[NewRegion](NewRegion) [graphics/regions.h](_OOBW)
