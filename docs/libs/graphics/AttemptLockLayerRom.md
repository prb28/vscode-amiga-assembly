*
**NAME**

AttemptLockLayerRom -- Attempt to Lock [Layer](_00A1.md) structure
by rom(gfx lib) code

**SYNOPSIS**

```c
    gotit = AttemptLockLayerRom( layer )
     d0                           a5

    BOOL AttempLockLayerRom( struct Layer * );

```
Links: [Layer](_00A1.md) 

**FUNCTION**

Query the current state of the lock on this [Layer](_00A1.md). If it is
already locked then return FALSE, could not lock. If the
[Layer](_00A1.md) was not locked then lock it and return TRUE.
This call does not destroy any registers.
This call nests so that callers in this chain will not lock
themselves out.

**INPUTS**

layer - pointer to [Layer](_00A1.md) structure

RESULT
gotit - TRUE or FALSE depending on whether the [Layer](_00A1.md) was
successfully locked by the caller.

**SEE ALSO**

[LockLayerRom](LockLayerRom.md) [UnlockLayerRom](UnlockLayerRom.md)
