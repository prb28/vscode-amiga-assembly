
**NAME**

InitBitMap -- Initialize bit map structure with input values.

**SYNOPSIS**

```c
    InitBitMap( bm, depth, width, height )
                a0   d0     d1      d2

    void InitBitMap( struct BitMap *, BYTE, UWORD, UWORD );

```
Links: [BitMap](_00A6.md) 

**FUNCTION**

Initialize various elements in the [BitMap](_00A6.md) structure to
correctly reflect depth, width, and height.
Must be used before use of [BitMap](_00A6.md) in other graphics calls.
The Planes[8] are not initialized and need to be set up
by the caller.  The Planes table was put at the end of the
structure so that it may be truncated to conserve space,
as well as extended. All routines that use [BitMap](_00A6.md) should
only depend on existence of depth number of bitplanes.
The Flagsh and pad fields are reserved for future use and
should not be used by application programs.

**INPUTS**

bm - pointer to a [BitMap](_00A6.md) structure (gfx.h)
depth - number of bitplanes that this bitmap will have
width - number of bits (columns) wide for this [BitMap](_00A6.md)
height- number of bits (rows) tall for this [BitMap](_00A6.md)

BUGS

**SEE ALSO**

[graphics/gfx.h](_00A6.md)
