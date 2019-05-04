
**NAME**

SetMenuStrip -- Attach a menu strip to a window.

**SYNOPSIS**

```c
    Success = SetMenuStrip( Window, Menu )
    D0                      A0      A1

    BOOL SetMenuStrip( struct Window *, struct Menu * );

```
Links: [Window](_00D4) [Menu](_00D4) [Window](_00D4) [Menu](_00D4) 

**FUNCTION**

Attaches the menu strip to the window.  After calling this routine,
if the user presses the menu button, this specified menu strip
will be displayed and accessible by the user.

Menus with zero menu items are not allowed.

NOTE:  You should always design your menu strip changes to be a
two-way operation, where for every menu strip you add to your
window you should always plan to clear that strip sometime.  Even
in the simplest case, where you will have just one menu strip for
the lifetime of your window, you should always clear the menu strip
before closing the window.  If you already have a menu strip attached
to this window, the correct procedure for changing to a new menu
strip involves calling [ClearMenuStrip](ClearMenuStrip) to clear the old first.

The sequence of events should be:
- [OpenWindow](OpenWindow)
- zero or more iterations of:
- SetMenuStrip()
- [ClearMenuStrip](ClearMenuStrip)
- [CloseWindow](CloseWindow)

**INPUTS**

[Window](_00D4) = pointer to a [Window](_00D4) structure
[Menu](_00D4) = pointer to the first menu in the menu strip

RESULT
TRUE if there were no problems.  TRUE always, since this routine
will wait until it is OK to proceed.

BUGS

**SEE ALSO**

[ClearMenuStrip](ClearMenuStrip), [ResetMenuStrip](ResetMenuStrip)
