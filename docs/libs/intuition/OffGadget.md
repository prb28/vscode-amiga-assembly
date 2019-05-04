
**NAME**

OffGadget -- Disable the specified gadget.

**SYNOPSIS**

```c
    OffGadget( Gadget, Window, Requester )
               A0      A1      A2

    VOID OffGadget( struct Gadget *, struct Window *,
            struct Requester * );

```
Links: [Gadget](_00D4) [Window](_00D4) [Requester](_00D4) [Gadget](_00D4) [Window](_00D4) [Requester](_00D4) 

**FUNCTION**

This command disables the specified gadget.  When a gadget is
disabled, these things happen:
- its imagery is displayed ghosted
- the GFLG_DISABLED flag is set
- the gadget cannot be selected by User

The window parameter must point to the window which contains the
gadget, or which contains the requester that contains the gadget.
The requester parameter must only be valid if the gadget has the
GTYP_REQGADGET flag set, a requirement for all requester gadgets.

NOTE:  it's never safe to tinker with the gadget list yourself.  Don't
supply some gadget that Intuition hasn't already processed in
the usual way.

NOTE: for compatibility reasons, this function will refresh all
gadgets in a requester, and all gadgets from gadget to the
end of the gadget list if gadget is in a window.

If you want to improve on this behavior, you may perform the
equivalent operation yourself: remove a gadget or gadgets,
change the state of their GFLG_DISABLED flag, replace the
gadgets using [AddGList](AddGList), and selectively call [RefreshGList](RefreshGList).

**INPUTS**

[Gadget](_00D4) = pointer to the gadget that you want disabled
[Window](_00D4) = pointer to a window structure containing the gadget or
containing the requester which contains the gadget
[Requester](_00D4) = pointer to a requester (may by NULL if this isn't
a requester gadget (i.e. GTYP_REQGADGET is not set)).

RESULT
None

BUGS

**SEE ALSO**

[AddGadget](AddGadget), [RefreshGadgets](RefreshGadgets)
