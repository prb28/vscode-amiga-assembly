
**NAME**

XorRegionRegion -- Perform 2d XOR operation of one region
with second region, leaving result in second region

**SYNOPSIS**

```c
    status = XorRegionRegion(region1,region2)
    d0                        a0      a1

    BOOL XorRegionRegion( struct Region *, struct Region * );

```
Links: [Region](_00B7.md) [Region](_00B7.md) 

**FUNCTION**

Join the regions together. If any part of region1 overlaps
region2 then remove that from the new region.

**INPUTS**

region1      = pointer to [Region](_00B7.md) structure
region2      = pointer to [Region](_00B7.md) structure

**RESULTS**

status - return TRUE if successful operation
return FALSE if ran out of memory

BUGS
