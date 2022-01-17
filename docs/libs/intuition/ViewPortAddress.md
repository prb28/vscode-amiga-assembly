
**NAME**

ViewPortAddress -- Return the address of a window's viewport.

**SYNOPSIS**

```c
    ViewPort = ViewPortAddress( Window )
    D0                          A0

    struct ViewPort *ViewPortAddress( struct Window * );

```
Links: [ViewPort](_00B8.md) [Window](_00D4.md) [ViewPort](_00B8.md) [Window](_00D4.md) 

**FUNCTION**

Returns the address of the viewport associated with the specified
window.  The viewport is actually the viewport of the screen within
which the window is displayed.  If you want to use any of the graphics,
text, or animation primitives in your window and that primitive
requires a pointer to a viewport, you can use this call.

This pointer is only valid as long as your window's screen remains
open, which is ensured by keeping your window open.

**INPUTS**

[Window](_00D4.md) = pointer to the window for which you want the viewport address

RESULT
Returns the address of the Intuition [ViewPort](_00B8.md) structure for
your window's screen .

BUGS
This routine is unnecessary: you can just use the expression
&#038;Window-&#062;WScreen-&#062;ViewPort.

**SEE ALSO**

graphics.library
