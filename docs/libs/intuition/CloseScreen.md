
**NAME**

CloseScreen -- Close an Intuition screen.

**SYNOPSIS**

```c
    [Success =] CloseScreen( Screen )
    [D0]                     A0

    [BOOL] CloseScreen( struct Screen * );
    /* returns BOOL in V36 and greater */

```
Links: [Screen](_00DD.md) [Screen](_00DD.md) 

**FUNCTION**

Unlinks the screen, unlinks the viewport, deallocates everything that
Intuition allocated when the screen was opened (using [OpenScreen](OpenScreen.md)).
Doesn't care whether or not there are still any windows attached to the
screen.  Doesn't try to close any attached windows; in fact, ignores
them altogether (but see below for changes in V36).

If this is the last screen to go, attempts to reopen Workbench.

New for V36: this function will refuse to close the screen
if there are windows open on the screen when CloseScreen() is
called.  This avoids the almost certain crash when a screen
is closed out from under a window.

**INPUTS**

[Screen](_00DD.md) = pointer to the screen to be closed.

RESULT
New for V36: returns TRUE (1) if screen is closed,
returns FALSE (0) if screen had open windows when
called.

BUGS

**SEE ALSO**

[OpenScreen](OpenScreen.md)
