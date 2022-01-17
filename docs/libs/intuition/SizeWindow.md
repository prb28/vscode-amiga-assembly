
**NAME**

SizeWindow -- Ask Intuition to size a window.

**SYNOPSIS**

```c
    SizeWindow( Window, DeltaX, DeltaY )
                A0      D0      D1

    VOID SizeWindow( struct Window *, WORD, WORD );

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

This routine sends a request to Intuition asking to size the window
the specified amounts.  The delta arguments describe how much to
size the window along the respective axes.

Note that the window will not be sized immediately, but rather
will be sized the next time Intuition receives an input event,
which happens currently at a minimum rate of ten times per second,
and a maximum of sixty times a second.  You can discover when
you window has finally been sized by setting the IDCMP_NEWSIZE flag
of the IDCMP of your window.  See the &#034;Input and Output Methods&#034;
chapter of The Intuition Reference Manual for description of the IDCMP.

New for V36: Intuition now will do validity checking on the final
dimensions.  To change to new absolute dimensions, or to move and
size a window in one step, use [ChangeWindowBox](ChangeWindowBox.md).

However, limit checking against window MinWidth, MinHeight,
MaxWidth, and MaxHeight was not done prior to V36, and
these fields are still ignored (as documented) if you have
no sizing gadget (WFLG_SIZEGADGET is not set).  The *are*
respected now (V36) if WFLG_SIZEGADGET is set.

New for V36: you can determine when the change in size has
taken effect by receiving the IDCMP_CHANGEWINDOW IDCMP message.

**INPUTS**

[Window](_00D4.md) = pointer to the structure of the window to be sized
DeltaX = signed value describing how much to size the window
on the x-axis
DeltaY = signed value describing how much to size the window
on the y-axis

RESULT
None

BUGS

**SEE ALSO**

[ChangeWindowBox](ChangeWindowBox.md), [MoveWindow](MoveWindow.md), [WindowToFront](WindowToFront.md), [WindowToBack](WindowToBack.md)
