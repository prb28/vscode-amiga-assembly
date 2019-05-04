
**NAME**

AndRectRegion -- Perform 2d AND operation of rectangle
with region, leaving result in region.

**SYNOPSIS**

```c
    AndRectRegion(region,rectangle)
                    a0      a1

    void AndRectRegion( struct Region *, struct Rectangle * );

```
Links: [Region](_00B7) [Rectangle](_00A6) 

**FUNCTION**

Clip away any portion of the region that exists outside
of the rectangle. Leave the result in region.

**INPUTS**

region - pointer to [Region](_00B7) structure
rectangle - pointer to [Rectangle](_00A6) structure

NOTES
Unlike the other rect-region primitives, AndRectRegion() cannot
fail.

BUGS

**SEE ALSO**

[AndRegionRegion](AndRegionRegion) [OrRectRegion](OrRectRegion) [graphics/regions.h](_00B7)
