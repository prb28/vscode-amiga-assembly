
**NAME**

UnlockLayerRom -- Unlock [Layer](_OOAQ) structure by rom(gfx lib) code.

**SYNOPSIS**

```c
    UnlockLayerRom( layer )
                     a5

    void UnlockLayerRom( struct Layer * );

```
Links: [Layer](_OOAQ) 

**FUNCTION**

Release the lock on this layer. If the same task has called
[LockLayerRom](LockLayerRom) more than once than the same number of calls to
UnlockLayerRom must happen before the layer is actually freed
so that other tasks may use it.
This call does destroy scratch registers.
This call is identical to [UnlockLayer](_OSAV) (layers.library).

**INPUTS**

layer - pointer to [Layer](_OOAQ) structure

BUGS

**SEE ALSO**

[LockLayerRom](LockLayerRom) [layers.library/UnlockLayer](../layers/UnlockLayer) [graphics/clip.h](_OOAQ)
