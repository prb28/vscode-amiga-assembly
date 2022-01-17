
**NAME**

ClearMenuStrip -- Clear (detach) the menu strip from the window.

**SYNOPSIS**

```c
    ClearMenuStrip( Window )
                    A0

    VOID ClearMenuStrip( struct Window * );

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

Detaches the current menu strip from the window; menu strips
are attached to windows using the [SetMenuStrip](SetMenuStrip.md) function
(or, for V36, [ResetMenuStrip](ResetMenuStrip.md) ).

If the menu is in use (for that matter if any menu is in use)
this function will block (Wait()) until the user has finished.

Call this function before you make any changes to the data
in a [Menu](_00D4.md) or [MenuItem](_00D4.md) structure which is part of a menu
strip linked into a window.

**INPUTS**

[Window](_00D4.md) = pointer to a window structure

RESULT
None

BUGS

**SEE ALSO**

[SetMenuStrip](SetMenuStrip.md), [ResetMenuStrip](ResetMenuStrip.md)
