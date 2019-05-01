
**NAME**

DisposeRegion -- Return all space for this region to free
memory pool.

**SYNOPSIS**

```c
    DisposeRegion(region)
                  a0

    void DisposeRegion( struct Region * );

```
Links: [Region](_OOBW) 

**FUNCTION**

Free all RegionRectangles for this [Region](_OOBW) then
free the [Region](_OOBW) itself.

**INPUTS**

region - pointer to [Region](_OOBW) structure

BUGS

**SEE ALSO**

[NewRegion](NewRegion) [graphics/regions.h](_OOBW)
