
**NAME**

SyncSBitMap --   Syncronize Super [BitMap](_00A6) with whatever is
in the standard [Layer](_00A1) bounds.

**SYNOPSIS**

```c
    SyncSBitMap( layer )
                  a0

    void SyncSBitMap( struct Layer * );

```
Links: [Layer](_00A1) 

**FUNCTION**

Copy all bits from ClipRects in [Layer](_00A1) into Super [BitMap](_00A6)
[BitMap](_00A6).  This is used for those functions that do not
want to deal with the [ClipRect](_00A1) structures but do want
to be able to work with a SuperBitMap [Layer](_00A1).

**INPUTS**

layer - pointer to a [Layer](_00A1) that has a SuperBitMap
The [Layer](_00A1) should already be locked by the caller.

RESULT
After calling this function, the programmer can manipulate
the bits in the superbitmap associated with the layer.
Afterwards, the programmer should call [CopySBitMap](CopySBitMap) to
copy the bits back into the onscreen layer.

BUGS

**SEE ALSO**

[CopySBitMap](CopySBitMap) [graphics/clip.h](_00A1)
