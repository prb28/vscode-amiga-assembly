
**NAME**

ClearMenuStrip -- Clear (detach) the menu strip from the window.

**SYNOPSIS**

```c
    ClearMenuStrip( Window )
                    A0

    VOID ClearMenuStrip( struct Window * );

```
Links: [Window](_00D4) [Window](_00D4) 

**FUNCTION**

Detaches the current menu strip from the window; menu strips
are attached to windows using the [SetMenuStrip](SetMenuStrip) function
(or, for V36, [ResetMenuStrip](ResetMenuStrip) ).

If the menu is in use (for that matter if any menu is in use)
this function will block (Wait()) until the user has finished.

Call this function before you make any changes to the data
in a [Menu](_00D4) or [MenuItem](_00D4) structure which is part of a menu
strip linked into a window.

**INPUTS**

[Window](_00D4) = pointer to a window structure

RESULT
None

BUGS

**SEE ALSO**

[SetMenuStrip](SetMenuStrip), [ResetMenuStrip](ResetMenuStrip)
