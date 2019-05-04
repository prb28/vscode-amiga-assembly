
**NAME**

LockLayerRom -- Lock [Layer](_00A1) structure by rom(gfx lib) code.

**SYNOPSIS**

```c
    LockLayerRom( layer )
                   a5

    void LockLayerRom( struct Layer * );

```
Links: [Layer](_00A1) 

**FUNCTION**

Return when the layer is locked and no other task may
alter the [ClipRect](_00A1) structure in the [Layer](_00A1) structure.
This call does not destroy any registers.
This call nests so that callers in this chain will not lock
themselves out.
Do not have the [Layer](_00A1) locked during a call to intuition.
There is a potential deadlock problem here, if intuition
needs to get other locks as well.
Having the layer locked prevents other tasks from using the
layer library functions, most notably intuition itself. So
be brief.
layers.library's [LockLayer](_039B) is identical to LockLayerRom.

**INPUTS**

layer - pointer to [Layer](_00A1) structure

**RESULTS**

The layer is locked and the task can render assuming the
ClipRects will not change out from underneath it until
an [UnlockLayerRom](UnlockLayerRom) is called.

**SEE ALSO**

[UnlockLayerRom](UnlockLayerRom) [layers.library/LockLayer](../layers/LockLayer) [graphics/clip.h](_00A1)
