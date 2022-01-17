
**NAME**

ActivateGadget -- Activate a (string or custom) gadget.

**SYNOPSIS**

```c
    Success = ActivateGadget( Gadget, Window, Request )
    D0                        A0      A1      A2

    BOOL ActivateGadget( struct Gadget *, struct Window *,
            struct Requester * );

```
Links: [Gadget](_00D4.md) [Window](_00D4.md) [Gadget](_00D4.md) [Window](_00D4.md) [Requester](_00D4.md) 

**FUNCTION**

Activates a string or custom gadget.  If successful, this means
that the user does not need to click in the gadget before typing.

The window parameter must point to the window which contains the
gadget.  If the gadget is actually in a requester, the window must
contain the requester, and a pointer to the requester must also be
passed. The requester parameter must only be valid if the gadget
has the GTYP_REQGADGET flag set, a requirement for all requester
gadgets.

The success of this function depends on a rather complex set
of conditions.  The intent is that the user is never interrupted from
what interactions he may have underway.

The current set of conditions includes:
-   The window must be active.  If you are opening a new window
and want an active gadget in it, it is not sufficient to
assume that the WFLG_ACTIVATE flag has taken effect by the time
[OpenWindow](OpenWindow.md) returns, even if you insert a delay of some
finite amount of time.  Use the IDCMP_ACTIVEWINDOW [IntuiMessage](_00D4.md)
to tell when your window really becomes active.  Many
programs use an event loop that calls ActivateGadget()
whenever they receive the IDCMP_ACTIVEWINDOW message, and also
the IDCMP_MOUSEBUTTONS messages, and so on, to keep the
gadget active until it is used (or the user selects some
other &#034;Cancel&#034; gadget).

-   No other gadgets may be in use.  This includes system gadgets,
such as those for window sizing, dragging, etc.
-   If the gadget is in a requester, that requester must
be active. (Use IDCMP_REQSET and IDCMP_REQCLEAR).
-   The right mouse button cannot be held down (e.g. menus)

NOTE: Don't try to activate a gadget which is disabled or
not attached to a window or requester.

**INPUTS**

[Gadget](_00D4.md) = pointer to the gadget that you want activated.
[Window](_00D4.md) = pointer to a window structure containing the gadget.
[Requester](_00D4.md) = pointer to a requester (may by NULL if this isn't
a requester gadget (i.e. GTYP_REQGADGET is not set)).

RESULT
If the conditions above are met, and the gadget is in fact a string
gadget, then this function will return TRUE, else FALSE.

BUGS
At present, this function will not return FALSE if a custom
gadget declines to be activated.

**SEE ALSO**

