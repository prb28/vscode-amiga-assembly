
**NAME**

GfxAssociate -- associate a graphics extended node with a given pointer
(V36)

**SYNOPSIS**

```c
   GfxAssociate(pointer, node);
                A0       A1

    void GfxAssociate(VOID *, struct ExtendedNode *);

```
Links: [ExtendedNode](_00BA.md) 

**FUNCTION**

Associate a special graphics extended data structure (each of which
begins with an [ExtendedNode](_00BA.md) structure)  with another structure via
the other structure's pointer. Later, when you call GfxLookUp()
with the other structure's pointer you may retrieve a pointer
to this special graphics extended data structure, if it is
available.

**INPUTS**

pointer = a pointer to a data structure.
node = an [ExtendedNode](_00BA.md) structure to associate with the pointer

RESULT
an association is created between the pointer and the node such
that given the pointer the node can be retrieved via GfxLookUp().

BUGS

**SEE ALSO**

[graphics/gfxnodes.h](_00BA.md) [GfxNew](GfxNew.md) [GfxFree](GfxFree.md) GfxLookUp()
