
**NAME**

ChangeWindowBox -- Change window position and dimensions. (V36)

**SYNOPSIS**

```c
    ChangeWindowBox( Window, Left, Top, Width, Height )
                     A0      D0    D1   D2     D3

    VOID ChangeWindowBox( struct Window *, WORD, WORD, WORD, WORD );

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

Makes simultaneous changes in window position and dimensions,
in absolute (not relative) coordinates.

Like [MoveWindow](MoveWindow.md) and [SizeWindow](SizeWindow.md), the effect of this function
is deferred until the next input comes along.  Unlike these
functions, ChangeWindowBox() specifies absolute window position
and dimensions, not relative.  This makes for more reliable
results considering that the action is deferred, so this
function is typically preferable to [MoveWindow](MoveWindow.md) and [SizeWindow](SizeWindow.md)
paired.

You can detect that this operation has completed by receiving
the IDCMP_CHANGEWINDOW IDCMP message

The dimensions are limited to legal range, but you should still
take care to specify sensible inputs based on the window's dimension
limits and the size of its screen.

This function limits the position and dimensions to legal
values.

**INPUTS**

[Window](_00D4.md) = the window to change position/dimension
Left, Top, Width, Height = new position and dimensions

RESULT
Position and dimension are changed to your specification,
or as close as possible.
Returns nothing.

BUGS

**SEE ALSO**

[MoveWindow](MoveWindow.md), [SizeWindow](SizeWindow.md), [ZipWindow](ZipWindow.md),
[layers.library/MoveSizeLayer](../layers/MoveSizeLayer.md)
