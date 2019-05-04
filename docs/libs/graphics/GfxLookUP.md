
**NAME**

GfxLookUp -- find a graphics extended node associated with a
given pointer (V36)

**SYNOPSIS**

```c
    result = GfxLookUp( pointer );
      d0                   a0

    struct ExtendedNode *GfxLookUp( void *);

```
Links: [ExtendedNode](_00BA) 

**FUNCTION**

Finds a special graphics extended data structure (if any) associated
with the pointer to a data structure (eg: [ViewExtra](_00B8) associated with
a [View](_00B8) structure).

**INPUTS**

pointer = a pointer to a data structure which may have an
[ExtendedNode](_00BA) associated with it (typically a [View](_00B8) ).

RESULT
result = a pointer to the [ExtendedNode](_00BA) that has previously been
associated with the pointer.

BUGS

**SEE ALSO**

[graphics/gfxnodes.h](_00BA) [GfxNew](GfxNew) [GfxFree](GfxFree) [GfxAssociate](GfxAssociate)
