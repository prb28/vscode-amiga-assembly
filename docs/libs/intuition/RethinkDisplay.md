
**NAME**

RethinkDisplay -- Grand manipulation of the entire Intuition display.

**SYNOPSIS**

```c
    RethinkDisplay()

    VOID RethinkDisplay( VOID );

```
**FUNCTION**

This function performs the Intuition global display reconstruction.
This includes rethinking about all of the  ViewPorts and their
relationship to one another and reconstructing the entire display
based on the results of this rethinking.

Specifically, and omitting many internal details, the operation
consists of this:

Determine which ViewPorts are invisible and set their VP_HIDE
[ViewPort](_00B8.md) Mode flag. VP_HIDE flags are also set for screens that
may not be simultaneously displayed with the frontmost (V36).

If a change to a viewport height, or changing interlace or
monitor scan rates require, [MakeVPort](../graphics/MakeVPort.md) is called for specific
screen viewports.  After this phase, the intermediate Copper lists
for each screen's viewport are correctly set up.

[MrgCop](../graphics/MrgCop.md) and [LoadView](../graphics/LoadView.md) are then called to get these Copper lists
in action, thus establishing the new state of the Intuition
display.

You may perform a [MakeScreen](MakeScreen.md) on your [Custom](_00CD.md) [Screen](_00DD.md) before calling
this routine.  The results will be incorporated in the new display, but
changing the INTERLACE [ViewPort](_00B8.md) mode for one screens must be reflected
in the Intuition [View](_00B8.md), which is left to Intuition.

WARNING:  This routine can take several milliseconds to run, so
do not use it lightly.

New for V36: This routine is substantially changed to support
new screen modes.  In particular, if screen rearrangement has
caused a change in interlace mode or scan rate, this routine
will remake the copper lists for each screen's viewport.

**INPUTS**

None

RESULT
None

BUGS
In V35 and earlier, an interlaced screen coming to the front
may not trigger a complete remake as required when the global
interlace state is changed.  In some cases, this can be compensated
for by setting the viewport DHeight field to 0 for hidden screens.

**SEE ALSO**

[RemakeDisplay](RemakeDisplay.md), [graphics.library/MakeVPort](../graphics/MakeVPort.md),
[graphics.library/MrgCop](../graphics/MrgCop.md), [graphics.library/LoadView](../graphics/LoadView.md), [MakeScreen](MakeScreen.md)
