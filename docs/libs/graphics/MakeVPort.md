
**NAME**

MakeVPort -- generate display copper list for a viewport.

**SYNOPSIS**

```c
    MakeVPort( view, viewport )
                a0      a1

    void MakeVPort( struct View *, struct ViewPort * );

```
Links: [View](_00B8.md) [ViewPort](_00B8.md) 

**FUNCTION**

Uses information in the [View](_00B8.md), [ViewPort](_00B8.md), ViewPort-&#062;RasInfo to
construct and intermediate copper list for this [ViewPort](_00B8.md).

**INPUTS**

view - pointer to a [View](_00B8.md) structure
viewport - pointer to a [ViewPort](_00B8.md) structure
The viewport must have valid pointer to a RasInfo.

**RESULTS**

constructs intermediate copper list and puts pointers in
viewport.DspIns
If the [ColorMap](_00B8.md) ptr in [ViewPort](_00B8.md) is NULL then it uses colors
from the default color table.
If DUALPF in Modes then there must be a second RasInfo pointed
to by the first RasInfo

BUGS
Narrow Viewports (whose righthand edge is less than 3/4 of the
way across the display) still do not work properly.

**SEE ALSO**

[InitVPort](InitVPort.md) [MrgCop](MrgCop.md) [graphics/view.h](_00B8.md) [intuition.library/MakeScreen](../intuition/MakeScreen.md)
[intuition.library/RemakeDisplay](../intuition/RemakeDisplay.md) [intuition.library/RethinkDisplay](../intuition/RethinkDisplay.md)
