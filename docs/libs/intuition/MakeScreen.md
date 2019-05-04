
**NAME**

MakeScreen -- Do an Intuition-integrated [MakeVPort](../graphics/MakeVPort) of a screen.

**SYNOPSIS**

```c
    MakeScreen( Screen )
                A0

    VOID MakeScreen( struct Screen * );

```
Links: [Screen](_00DD) [Screen](_00DD) 

**FUNCTION**

This procedure allows you to do a [MakeVPort](../graphics/MakeVPort) for the viewport of your
custom screen in an Intuition-integrated way.  This way you can
do your own screen manipulations without worrying about interference
with Intuition's usage of the same viewport.

The operation of this function is as follows:
- Block until the Intuition [View](_00B8) structure is not in being changed.
- Set the view modes correctly to reflect if there is a (visible)
interlaced screen.
- call [MakeVPort](../graphics/MakeVPort), passing the Intuition [View](_00B8) and your screen's
[ViewPort](_00B8).
- Unlocks the Intuition [View](_00B8).

After calling this routine, you should call [RethinkDisplay](RethinkDisplay) to
incorporate the new viewport of your custom screen into the
Intuition display.

NOTE: Intuition may determine that because of a change in global
interlace needs that all viewports need to be remade, so
it may effectively call [RemakeDisplay](RemakeDisplay).

**INPUTS**

[Screen](_00DD) = address of the custom screen structure

RESULT
None

BUGS

**SEE ALSO**

[RethinkDisplay](RethinkDisplay), [RemakeDisplay](RemakeDisplay), [graphics.library/MakeVPort](../graphics/MakeVPort)
