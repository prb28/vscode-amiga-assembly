
**NAME**

RemakeDisplay -- Remake the entire Intuition display.

**SYNOPSIS**

```c
    RemakeDisplay()

    VOID RemakeDisplay( VOID );

```
**FUNCTION**

This is the big one.

This procedure remakes the entire [View](_00B8) structure for the
Intuition display.  It does the equivalent of [MakeScreen](MakeScreen) for
every screen in the system, and then it calls the internal
equivalent of [RethinkDisplay](RethinkDisplay).

WARNING:  This routine can take many milliseconds to run, so
do not use it lightly.

Calling [MakeScreen](MakeScreen) followed by [RethinkDisplay](RethinkDisplay) is typically
a more efficient method for affecting changes to a single
screen's [ViewPort](_00B8).

**INPUTS**

None

RESULT
None

BUGS

**SEE ALSO**

[MakeScreen](MakeScreen), [RethinkDisplay](RethinkDisplay), [graphics.library/MakeVPort](../graphics/MakeVPort)
[graphics.library/MrgCop](../graphics/MrgCop), [graphics.library/LoadView](../graphics/LoadView)
