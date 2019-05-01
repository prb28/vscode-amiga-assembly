
**NAME**

UnlockLayer -- Unlock layer and allow graphics routines to use it.

**SYNOPSIS**

```c
    UnlockLayer( l )
                 a0

    void UnlockLayer( struct Layer *);

```
Links: [Layer](_OOAQ) 

**FUNCTION**

When finished changing the ClipRects or whatever you were
doing with this layer you must call UnlockLayer() to allow
other tasks to proceed with graphic output to the layer.

**INPUTS**

l - pointer to a layer

BUGS

**SEE ALSO**

[graphics/layers.h](_OOCT), [graphics/clip.h](_OOAQ)
