
**NAME**

CopySBitMap --   Syncronize [Layer](_00A1.md) window with contents of
Super [BitMap](_00A6.md)

**SYNOPSIS**

```c
    CopySBitMap( layer )
                 a0

    void CopySBitMap(struct Layer *);

```
Links: [Layer](_00A1.md) 

**FUNCTION**

This is the inverse of [SyncSBitMap](SyncSBitMap.md).
Copy all bits from SuperBitMap to [Layer](_00A1.md) bounds.
This is used for those functions that do not
want to deal with the [ClipRect](_00A1.md) structures but do want
to be able to work with a SuperBitMap [Layer](_00A1.md).

**INPUTS**

layer - pointer to a SuperBitMap [Layer](_00A1.md)
The [Layer](_00A1.md) must already be locked by the caller.

BUGS

**SEE ALSO**

[LockLayerRom](LockLayerRom.md) [SyncSBitMap](SyncSBitMap.md)
