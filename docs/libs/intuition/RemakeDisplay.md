
**NAME**

RemakeDisplay -- Remake the entire Intuition display.

**SYNOPSIS**

```c
    RemakeDisplay()

    VOID RemakeDisplay( VOID );

```
**FUNCTION**

This is the big one.

This procedure remakes the entire [View](_00B8.md) structure for the
Intuition display.  It does the equivalent of [MakeScreen](MakeScreen.md) for
every screen in the system, and then it calls the internal
equivalent of [RethinkDisplay](RethinkDisplay.md).

WARNING:  This routine can take many milliseconds to run, so
do not use it lightly.

Calling [MakeScreen](MakeScreen.md) followed by [RethinkDisplay](RethinkDisplay.md) is typically
a more efficient method for affecting changes to a single
screen's [ViewPort](_00B8.md).

**INPUTS**

None

RESULT
None

BUGS

**SEE ALSO**

[MakeScreen](MakeScreen.md), [RethinkDisplay](RethinkDisplay.md), [graphics.library/MakeVPort](../graphics/MakeVPort.md)
[graphics.library/MrgCop](../graphics/MrgCop.md), [graphics.library/LoadView](../graphics/LoadView.md)
