
**NAME**

GfxLookUp -- find a graphics extended node associated with a
given pointer (V36)

**SYNOPSIS**

```c
    result = GfxLookUp( pointer );
      d0                   a0

    struct ExtendedNode *GfxLookUp( void *);

```
Links: [ExtendedNode](_OOBA) 

**FUNCTION**

Finds a special graphics extended data structure (if any) associated
with the pointer to a data structure (eg: [ViewExtra](_OOBX) associated with
a [View](_OOBX) structure).

**INPUTS**

pointer = a pointer to a data structure which may have an
[ExtendedNode](_OOBA) associated with it (typically a [View](_OOBX) ).

RESULT
result = a pointer to the [ExtendedNode](_OOBA) that has previously been
associated with the pointer.

BUGS

**SEE ALSO**

[graphics/gfxnodes.h](_OOBA) [GfxNew](GfxNew) [GfxFree](GfxFree) [GfxAssociate](GfxAssociate)
