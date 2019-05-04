
**NAME**

ClearRegion -- Remove all rectangles from region.

**SYNOPSIS**

```c
    ClearRegion(region)
                 a0

    void ClearRegion( struct Region * );

```
Links: [Region](_00B7) 

**FUNCTION**

Clip away all rectangles in the region leaving nothing.

**INPUTS**

region - pointer to [Region](_00B7) structure

BUGS

**SEE ALSO**

[NewRegion](NewRegion) [graphics/regions.h](_00B7)
