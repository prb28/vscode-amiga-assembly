
**NAME**

GfxFree -- free a graphics extended data structure (V36)

**SYNOPSIS**

```c
    GfxFree( node );
          a0

    void GfxFree(struct ExtendedNode *);

```
Links: [ExtendedNode](_OOBA) 

**FUNCTION**

Free a special graphics extended data structure (each of which
begins with an [ExtendedNode](_OOBA) structure).

**INPUTS**

node = pointer to a graphics extended data structure obtained via
[GfxNew](GfxNew).

RESULT
the node is deallocated from memory. graphics will dissassociate
this special graphics extended node from any associated data
structures, if necessary, before freeing it (see [GfxAssociate](GfxAssociate)).

BUGS
an [Alert](_OSRE) will be called if you attempt to free any structure
other than a graphics extended data strucure obtained via GfxFree().

**SEE ALSO**

[graphics/gfxnodes.h](_OOBA) [GfxNew](GfxNew) [GfxAssociate](GfxAssociate) GfxLookUp()
