
**NAME**

SyncSBitMap --   Syncronize Super [BitMap](_OOAV) with whatever is
in the standard [Layer](_OOAQ) bounds.

**SYNOPSIS**

```c
    SyncSBitMap( layer )
                  a0

    void SyncSBitMap( struct Layer * );

```
Links: [Layer](_OOAQ) 

**FUNCTION**

Copy all bits from ClipRects in [Layer](_OOAQ) into Super [BitMap](_OOAV)
[BitMap](_OOAV).  This is used for those functions that do not
want to deal with the [ClipRect](_OOAQ) structures but do want
to be able to work with a SuperBitMap [Layer](_OOAQ).

**INPUTS**

layer - pointer to a [Layer](_OOAQ) that has a SuperBitMap
The [Layer](_OOAQ) should already be locked by the caller.

RESULT
After calling this function, the programmer can manipulate
the bits in the superbitmap associated with the layer.
Afterwards, the programmer should call [CopySBitMap](CopySBitMap) to
copy the bits back into the onscreen layer.

BUGS

**SEE ALSO**

[CopySBitMap](CopySBitMap) [graphics/clip.h](_OOAQ)
