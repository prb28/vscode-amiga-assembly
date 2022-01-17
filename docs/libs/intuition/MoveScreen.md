
**NAME**

MoveScreen -- Attempt to move the screen by the increments provided.

**SYNOPSIS**

```c
    MoveScreen( Screen, DeltaX, DeltaY )
                A0      D0      D1

    VOID MoveScreen( struct Screen *, WORD, WORD );

```
Links: [Screen](_00DD.md) [Screen](_00DD.md) 

**FUNCTION**

Moves the screen the specified increment, specified in screen
pixel resolution coordinates.

New for V36: [Screen](_00DD.md) movement limits have been greatly relaxed,
to support screen scrolling.  In particular, negative values
for screen LeftEdge and TopEdge may now be valid.

If the DeltaX and DeltaY variables you specify would move the screen
in a way that violates any restrictions, the screen will be moved
as far as possible.  You may examine the LeftEdge and TopEdge fields
of the [Screen](_00DD.md) structure after this function returns to see where
the screen really ended up.

In operation, this function determines what the resulting position
values that are actually to be used, sets these up, and calls
[MakeScreen](MakeScreen.md) and [RethinkDisplay](RethinkDisplay.md).

**INPUTS**

[Screen](_00DD.md) = pointer to a [Screen](_00DD.md) structure
DeltaX = amount to move the screen on the x-axis
Note that DeltaX no longer (V36) need be set to zero
DeltaY = amount to move the screen on the y-axis
Note that these coordinates are in the same resolution
as the screen (such as HIRES or INTERLACE)

RESULT
None

BUGS

**SEE ALSO**

[RethinkDisplay](RethinkDisplay.md)
