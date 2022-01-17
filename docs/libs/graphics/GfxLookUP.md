
**NAME**

GfxLookUp -- find a graphics extended node associated with a
given pointer (V36)

**SYNOPSIS**

```c
    result = GfxLookUp( pointer );
      d0                   a0

    struct ExtendedNode *GfxLookUp( void *);

```
Links: [ExtendedNode](_00BA.md) 

**FUNCTION**

Finds a special graphics extended data structure (if any) associated
with the pointer to a data structure (eg: [ViewExtra](_00B8.md) associated with
a [View](_00B8.md) structure).

**INPUTS**

pointer = a pointer to a data structure which may have an
[ExtendedNode](_00BA.md) associated with it (typically a [View](_00B8.md) ).

RESULT
result = a pointer to the [ExtendedNode](_00BA.md) that has previously been
associated with the pointer.

BUGS

**SEE ALSO**

[graphics/gfxnodes.h](_00BA.md) [GfxNew](GfxNew.md) [GfxFree](GfxFree.md) [GfxAssociate](GfxAssociate.md)
