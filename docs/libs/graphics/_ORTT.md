
**NAME**

RemakeDisplay -- Remake the entire Intuition display.

**SYNOPSIS**

```c
    RemakeDisplay()

    VOID RemakeDisplay( VOID );

```
**FUNCTION**

This is the big one.

This procedure remakes the entire [View](_OOBX) structure for the
Intuition display.  It does the equivalent of [MakeScreen](_ORRX) for
every screen in the system, and then it calls the internal
equivalent of [RethinkDisplay](_ORTB).

WARNING:  This routine can take many milliseconds to run, so
do not use it lightly.

Calling [MakeScreen](_ORRX) followed by [RethinkDisplay](_ORTB) is typically
a more efficient method for affecting changes to a single
screen's [ViewPort](_OOBX).

**INPUTS**

None

RESULT
None

BUGS

**SEE ALSO**

[MakeScreen](_ORRX), [RethinkDisplay](_ORTB), [graphics.library/MakeVPort](MakeVPort)
[graphics.library/MrgCop](MrgCop), [graphics.library/LoadView](LoadView)
