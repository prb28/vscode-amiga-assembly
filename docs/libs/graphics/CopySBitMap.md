
**NAME**

CopySBitMap --   Syncronize [Layer](_00A1) window with contents of
Super [BitMap](_00A6)

**SYNOPSIS**

```c
    CopySBitMap( layer )
                 a0

    void CopySBitMap(struct Layer *);

```
Links: [Layer](_00A1) 

**FUNCTION**

This is the inverse of [SyncSBitMap](SyncSBitMap).
Copy all bits from SuperBitMap to [Layer](_00A1) bounds.
This is used for those functions that do not
want to deal with the [ClipRect](_00A1) structures but do want
to be able to work with a SuperBitMap [Layer](_00A1).

**INPUTS**

layer - pointer to a SuperBitMap [Layer](_00A1)
The [Layer](_00A1) must already be locked by the caller.

BUGS

**SEE ALSO**

[LockLayerRom](LockLayerRom) [SyncSBitMap](SyncSBitMap)
