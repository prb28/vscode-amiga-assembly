*
**NAME**

AttemptLockLayerRom -- Attempt to Lock [Layer](_00A1) structure
by rom(gfx lib) code

**SYNOPSIS**

```c
    gotit = AttemptLockLayerRom( layer )
     d0                           a5

    BOOL AttempLockLayerRom( struct Layer * );

```
Links: [Layer](_00A1) 

**FUNCTION**

Query the current state of the lock on this [Layer](_00A1). If it is
already locked then return FALSE, could not lock. If the
[Layer](_00A1) was not locked then lock it and return TRUE.
This call does not destroy any registers.
This call nests so that callers in this chain will not lock
themselves out.

**INPUTS**

layer - pointer to [Layer](_00A1) structure

RESULT
gotit - TRUE or FALSE depending on whether the [Layer](_00A1) was
successfully locked by the caller.

**SEE ALSO**

[LockLayerRom](LockLayerRom) [UnlockLayerRom](UnlockLayerRom)
