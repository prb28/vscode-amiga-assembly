
**NAME**

ClearRectRegion -- Perform 2d CLEAR operation of rectangle
with region, leaving result in region.

**SYNOPSIS**

```c
    status = ClearRectRegion(region,rectangle)
     d0                       a0      a1

    BOOL ClearRectRegion(struct Region *, struct Rectangle * );

```
Links: [Region](_00B7) [Rectangle](_00A6) 

**FUNCTION**

Clip away any portion of the region that exists inside
of the rectangle. Leave the result in region.

**INPUTS**

region - pointer to [Region](_00B7) structure
rectangle - pointer to [Rectangle](_00A6) structure

**RESULTS**

status - return TRUE if successful operation
return FALSE if ran out of memory

BUGS

**SEE ALSO**

[AndRectRegion](AndRectRegion) [graphics/regions.h](_00B7)
