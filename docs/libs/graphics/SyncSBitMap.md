
**NAME**

SyncSBitMap --   Syncronize Super [BitMap](_00A6.md) with whatever is
in the standard [Layer](_00A1.md) bounds.

**SYNOPSIS**

```c
    SyncSBitMap( layer )
                  a0

    void SyncSBitMap( struct Layer * );

```
Links: [Layer](_00A1.md) 

**FUNCTION**

Copy all bits from ClipRects in [Layer](_00A1.md) into Super [BitMap](_00A6.md)
[BitMap](_00A6.md).  This is used for those functions that do not
want to deal with the [ClipRect](_00A1.md) structures but do want
to be able to work with a SuperBitMap [Layer](_00A1.md).

**INPUTS**

layer - pointer to a [Layer](_00A1.md) that has a SuperBitMap
The [Layer](_00A1.md) should already be locked by the caller.

RESULT
After calling this function, the programmer can manipulate
the bits in the superbitmap associated with the layer.
Afterwards, the programmer should call [CopySBitMap](CopySBitMap.md) to
copy the bits back into the onscreen layer.

BUGS

**SEE ALSO**

[CopySBitMap](CopySBitMap.md) [graphics/clip.h](_00A1.md)
