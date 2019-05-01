
**NAME**

LockLayer -- Lock layer to make changes to ClipRects.

**SYNOPSIS**

```c
    LockLayer( dummy, l )
               a0     a1

    void LockLayer( LONG, struct Layer *);

```
Links: [Layer](_OOAQ) 

**FUNCTION**

Make this layer unavailable for other tasks to use.
If another task is already using this layer then wait for
it to complete and then reserve the layer for your own use.
(this function does the same thing as graphics.library/LockLayerRom)

Note: if you wish to lock MORE THAN ONE layer at a time, you
must call [LockLayerInfo](_OSYC) before locking those layers and
then call [UnlockLayerInfo](_OSAW) when you have finished. This
is to prevent system &#034;deadlocks&#034;.

Further Note: while you hold the lock on a layer, Intuition will block
on operations such as windowsizing, dragging, menus, and depth
arranging windows in this layer's screen.  It is recommended that
YOU do not make Intuition function calls while the layer is locked.

**INPUTS**

dummy - unused
l - pointer to a layer

BUGS

**SEE ALSO**

[UnlockLayer](_OSAV), [LockLayerInfo](_OSYC), [UnlockLayerInfo](_OSAW),
[graphics.library/LockLayerRom](LockLayerRom), [graphics/layers.h](_OOCT), [graphics/clip.h](_OOAQ)
