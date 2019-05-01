
**NAME**

CopySBitMap --   Syncronize [Layer](_OOAQ) window with contents of
Super [BitMap](_OOAV)

**SYNOPSIS**

```c
    CopySBitMap( layer )
                 a0

    void CopySBitMap(struct Layer *);

```
Links: [Layer](_OOAQ) 

**FUNCTION**

This is the inverse of [SyncSBitMap](SyncSBitMap).
Copy all bits from SuperBitMap to [Layer](_OOAQ) bounds.
This is used for those functions that do not
want to deal with the [ClipRect](_OOAQ) structures but do want
to be able to work with a SuperBitMap [Layer](_OOAQ).

**INPUTS**

layer - pointer to a SuperBitMap [Layer](_OOAQ)
The [Layer](_OOAQ) must already be locked by the caller.

BUGS

**SEE ALSO**

[LockLayerRom](LockLayerRom) [SyncSBitMap](SyncSBitMap)
