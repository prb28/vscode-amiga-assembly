
**NAME**

InitVPort - Initialize [ViewPort](_OOBX) structure.

**SYNOPSIS**

```c
    InitVPort( vp )
               a0

    void InitVPort( struct ViewPort * );

```
Links: [ViewPort](_OOBX) 

**FUNCTION**

Initialize [ViewPort](_OOBX) structure to default values.

**INPUTS**

vp - pointer to a [ViewPort](_OOBX) structure

RESULT
[ViewPort](_OOBX) structure set to all 0's. (1.0,1.1)
New field added SpritePriorities, initialized to 0x24 (1.2)

BUGS

**SEE ALSO**

[MakeVPort](MakeVPort) [graphics/view.h](_OOBX)
