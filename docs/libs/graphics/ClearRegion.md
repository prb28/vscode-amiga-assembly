
**NAME**

ClearRegion -- Remove all rectangles from region.

**SYNOPSIS**

```c
    ClearRegion(region)
                 a0

    void ClearRegion( struct Region * );

```
Links: [Region](_00B7.md) 

**FUNCTION**

Clip away all rectangles in the region leaving nothing.

**INPUTS**

region - pointer to [Region](_00B7.md) structure

BUGS

**SEE ALSO**

[NewRegion](NewRegion.md) [graphics/regions.h](_00B7.md)
