
**NAME**

ActivateWindow -- Activate an Intuition window.

**SYNOPSIS**

```c
    [success =] ActivateWindow( Window )
    [D0]                        A0

    [LONG] ActivateWindow( struct Window * );
    /* returns LONG in V36 and higher */

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

Activates an Intuition window.

Note that this call may have its action deferred: you cannot assume
that when this call is made the selected window has become active.
This action will be postponed while the user plays with gadgets and
menus, or sizes and drags windows.  You may detect when the window
actually has become active by the IDCMP_ACTIVEWINDOW IDCMP message.

This call is intended to provide flexibility but not to confuse the
user.  Please call this function synchronously with some action
by the user.

**INPUTS**

[Window](_00D4.md) = a pointer to a [Window](_00D4.md) structure

RESULT
V35 and before: None.
V36 and later: returns zero if no problem queuing up
the request for deferred action

BUGS
Calling this function in a tight loop can blow out Intuition's deferred
action queue.

**SEE ALSO**

[OpenWindow](OpenWindow.md), and the WFLG_ACTIVATE window flag
