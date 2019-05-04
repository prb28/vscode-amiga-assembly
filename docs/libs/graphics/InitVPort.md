
**NAME**

InitVPort - Initialize [ViewPort](_00B8) structure.

**SYNOPSIS**

```c
    InitVPort( vp )
               a0

    void InitVPort( struct ViewPort * );

```
Links: [ViewPort](_00B8) 

**FUNCTION**

Initialize [ViewPort](_00B8) structure to default values.

**INPUTS**

vp - pointer to a [ViewPort](_00B8) structure

RESULT
[ViewPort](_00B8) structure set to all 0's. (1.0,1.1)
New field added SpritePriorities, initialized to 0x24 (1.2)

BUGS

**SEE ALSO**

[MakeVPort](MakeVPort) [graphics/view.h](_00B8)
