
**NAME**

AndRectRegion -- Perform 2d AND operation of rectangle
with region, leaving result in region.

**SYNOPSIS**

```c
    AndRectRegion(region,rectangle)
                    a0      a1

    void AndRectRegion( struct Region *, struct Rectangle * );

```
Links: [Region](_OOBW) [Rectangle](_OOAV) 

**FUNCTION**

Clip away any portion of the region that exists outside
of the rectangle. Leave the result in region.

**INPUTS**

region - pointer to [Region](_OOBW) structure
rectangle - pointer to [Rectangle](_OOAV) structure

NOTES
Unlike the other rect-region primitives, AndRectRegion() cannot
fail.

BUGS

**SEE ALSO**

[AndRegionRegion](AndRegionRegion) [OrRectRegion](OrRectRegion) [graphics/regions.h](_OOBW)
