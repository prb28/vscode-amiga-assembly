
**NAME**

MoveWindow -- Ask Intuition to move a window.

**SYNOPSIS**

```c
    MoveWindow( Window, DeltaX, DeltaY )
                A0      D0      D1

    VOID MoveWindow( struct Window *, WORD, WORD );

```
Links: [Window](_00D4) [Window](_00D4) 

**FUNCTION**

This routine sends a request to Intuition asking to move the window
the specified distance.  The delta arguments describe how far to
move the window along the respective axes.

Note that the window will not be moved immediately, but rather
will be moved the next time Intuition receives an input event,
which happens currently at a minimum rate of ten times per second,
and a maximum of sixty times a second.

Interactions with other arbitration of Intuition data structures
may defer this operation longer.  For V36, you can use the new
IDCMP class IDCMP_CHANGEWINDOW to detect when this operation has
completed.

New for V36: Intuition now will do validity checking on the final
position.  To send absolute movements, or to move and size a
window in one step, use [ChangeWindowBox](ChangeWindowBox).

**INPUTS**

[Window](_00D4) = pointer to the structure of the [Window](_00D4) to be moved
DeltaX = how far to move the [Window](_00D4) on the x-axis
DeltaY = how far to move the [Window](_00D4) on the y-axis

RESULT
None

BUGS

**SEE ALSO**

[ChangeWindowBox](ChangeWindowBox), [SizeWindow](SizeWindow), [WindowToFront](WindowToFront), [WindowToBack](WindowToBack)
