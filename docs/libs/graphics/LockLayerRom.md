
**NAME**

LockLayerRom -- Lock [Layer](_OOAQ) structure by rom(gfx lib) code.

**SYNOPSIS**

```c
    LockLayerRom( layer )
                   a5

    void LockLayerRom( struct Layer * );

```
Links: [Layer](_OOAQ) 

**FUNCTION**

Return when the layer is locked and no other task may
alter the [ClipRect](_OOAQ) structure in the [Layer](_OOAQ) structure.
This call does not destroy any registers.
This call nests so that callers in this chain will not lock
themselves out.
Do not have the [Layer](_OOAQ) locked during a call to intuition.
There is a potential deadlock problem here, if intuition
needs to get other locks as well.
Having the layer locked prevents other tasks from using the
layer library functions, most notably intuition itself. So
be brief.
layers.library's [LockLayer](_OSYB) is identical to LockLayerRom.

**INPUTS**

layer - pointer to [Layer](_OOAQ) structure

**RESULTS**

The layer is locked and the task can render assuming the
ClipRects will not change out from underneath it until
an [UnlockLayerRom](UnlockLayerRom) is called.

**SEE ALSO**

[UnlockLayerRom](UnlockLayerRom) [layers.library/LockLayer](../layers/LockLayer) [graphics/clip.h](_OOAQ)
