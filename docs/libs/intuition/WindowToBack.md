
**NAME**

WindowToBack -- Ask Intuition to send a window behind others.

**SYNOPSIS**

```c
    WindowToBack( Window )
                  A0

    VOID WindowToBack( struct Window * );

```
Links: [Window](_00D4) [Window](_00D4) 

**FUNCTION**

This routine sends a request to Intuition asking to send the window
in back of all other windows in the screen.

Note that the window will not be depth-arranged immediately, but rather
will be arranged the next time Intuition receives an input event,
which happens currently at a minimum rate of ten times per second,
and a maximum of sixty times a second.

[Remember](_00D4) that WFLG_BACKDROP windows cannot be depth-arranged.

**INPUTS**

[Window](_00D4) = pointer to the structure of the window to be sent to the back

RESULT
None

BUGS

**SEE ALSO**

[MoveWindow](MoveWindow), [SizeWindow](SizeWindow), [WindowToFront](WindowToFront), [MoveWindowInFrontOf](MoveWindowInFrontOf)
