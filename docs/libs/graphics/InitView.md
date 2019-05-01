
**NAME**

InitView - Initialize [View](_OOBX) structure.

**SYNOPSIS**

```c
    InitView( view )
               a1

    void InitView( struct View * );

```
Links: [View](_OOBX) 

**FUNCTION**

Initialize [View](_OOBX) structure to default values.

**INPUTS**

view - pointer to a [View](_OOBX) structure

RESULT
[View](_OOBX) structure set to all 0's. (1.0,1.1.1.2)
Then values are put in DxOffset,DyOffset to properly position
default display about .5 inches from top and left on monitor.
InitView pays no attention to previous contents of view.

BUGS

**SEE ALSO**

[MakeVPort](MakeVPort) [graphics/view.h](_OOBX)
