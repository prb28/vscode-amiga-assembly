
**NAME**

OrRectRegion -- Perform 2d OR operation of rectangle
with region, leaving result in region.

**SYNOPSIS**

```c
    status = OrRectRegion(region,rectangle)
      d0                    a0      a1

    BOOL OrRectRegion( struct Region *, struct Rectangle * );

```
Links: [Region](_00B7) [Rectangle](_00A6) 

**FUNCTION**

If any portion of rectangle is not in the region then add
that portion to the region.

**INPUTS**

region - pointer to [Region](_00B7) structure
rectangle - pointer to [Rectangle](_00A6) structure

**RESULTS**

status - return TRUE if successful operation
return FALSE if ran out of memory

BUGS

**SEE ALSO**

[AndRectRegion](AndRectRegion) [OrRegionRegion](OrRegionRegion) [graphics/regions.h](_00B7)
