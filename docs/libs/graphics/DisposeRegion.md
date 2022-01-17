
**NAME**

DisposeRegion -- Return all space for this region to free
memory pool.

**SYNOPSIS**

```c
    DisposeRegion(region)
                  a0

    void DisposeRegion( struct Region * );

```
Links: [Region](_00B7.md) 

**FUNCTION**

Free all RegionRectangles for this [Region](_00B7.md) then
free the [Region](_00B7.md) itself.

**INPUTS**

region - pointer to [Region](_00B7.md) structure

BUGS

**SEE ALSO**

[NewRegion](NewRegion.md) [graphics/regions.h](_00B7.md)
