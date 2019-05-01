
**NAME**

XorRectRegion -- Perform 2d XOR operation of rectangle
with region, leaving result in region

**SYNOPSIS**

```c
    status = XorRectRegion(region,rectangle)
    d0                     a0      a1

    BOOL XorRectRegion( struct Region *, struct Rectangle * );

```
Links: [Region](_OOBW) [Rectangle](_OOAV) 

**FUNCTION**

Add portions of rectangle to region if they are not in
the region.
Remove portions of rectangle from region if they are
in the region.

**INPUTS**

region - pointer to [Region](_OOBW) structure
rectangle - pointer to [Rectangle](_OOAV) structure

**RESULTS**

status - return TRUE if successful operation
return FALSE if ran out of memory

BUGS

**SEE ALSO**

[OrRegionRegion](OrRegionRegion) [AndRegionRegion](AndRegionRegion) [graphics/regions.h](_OOBW)
