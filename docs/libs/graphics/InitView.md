
**NAME**

InitView - Initialize [View](_00B8.md) structure.

**SYNOPSIS**

```c
    InitView( view )
               a1

    void InitView( struct View * );

```
Links: [View](_00B8.md) 

**FUNCTION**

Initialize [View](_00B8.md) structure to default values.

**INPUTS**

view - pointer to a [View](_00B8.md) structure

RESULT
[View](_00B8.md) structure set to all 0's. (1.0,1.1.1.2)
Then values are put in DxOffset,DyOffset to properly position
default display about .5 inches from top and left on monitor.
InitView pays no attention to previous contents of view.

BUGS

**SEE ALSO**

[MakeVPort](MakeVPort.md) [graphics/view.h](_00B8.md)
