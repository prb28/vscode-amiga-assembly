
**NAME**

GfxNew -- allocate a graphics extended data structure (V36)

**SYNOPSIS**

```c
    result = GfxNew( node_type );
    d0               d0

    struct ExtendedNode *GfxNew( ULONG);

```
Links: [ExtendedNode](_00BA) 

**FUNCTION**

Allocate a special graphics extended data structure (each of which
begins with an [ExtendedNode](_00BA) structure).  The type of structure to
be allocated is specified by the node_type identifier.

**INPUTS**

node_type = which type of graphics extended data structure to allocate.
(see gfxnodes.h for identifier definitions.)

RESULT
result = a pointer to the allocated graphics node or NULL if the
allocation failed.

BUGS

**SEE ALSO**

[graphics/gfxnodes.h](_00BA) [GfxFree](GfxFree) [GfxAssociate](GfxAssociate) GfxLookUp()
