
**NAME**

FreeRaster -- Release an allocated area to the system free memory pool.


**SYNOPSIS**

```c
    FreeRaster( p, width, height)
               a0   d0:16  d1:16

    void FreeRaster( PLANEPTR, USHORT, USHORT);

```
**FUNCTION**

Return the memory associated with this PLANEPTR of size
width and height to the MEMF_CHIP memory pool.

**INPUTS**

p  =  a pointer to a memory space  returned  as  a
result of a call to [AllocRaster](AllocRaster.md).

width - the width in bits of the bitplane.
height - number of rows in bitplane.

BUGS

NOTES
Width and height should be the same values with which you
called [AllocRaster](AllocRaster.md) in the first place.

**SEE ALSO**

[AllocRaster](AllocRaster.md) [graphics/gfx.h](_00A6.md)
