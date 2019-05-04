
**NAME**

ModifyProp -- Modify the current parameters of a proportional gadget.

**SYNOPSIS**

```c
    ModifyProp( Gadget, Window, Requester,
                A0      A1      A2
                Flags, HorizPot, VertPot, HorizBody, VertBody )
                D0     D1        D2       D3         D4

    VOID ModifyProp( struct Gadget *, struct Window *,
            struct Requester *, UWORD, UWORD, UWORD, UWORD, UWORD );

```
Links: [Gadget](_00D4) [Window](_00D4) [Requester](_00D4) [Gadget](_00D4) [Window](_00D4) [Requester](_00D4) 

**FUNCTION**

Modifies the parameters of the specified proportional gadget.  The
gadget's internal state is then recalculated and the imagery
is redisplayed in the window or requester that contains the gadget.

The requester variable can point to a requester structure.  If the
gadget has the GTYP_REQGADGET flag set, the gadget is in a requester
and the window pointer must point to the window of the requester.
If this is not the gadget of a requester, the requester argument may
be NULL.

NOTE: this function causes all gadgets from the proportional
gadget to the end of the gadget list to be refreshed, for
reasons of compatibility.
For more refined display updating, use [NewModifyProp](NewModifyProp).

New for V36: ModifyProp() refreshing consists of redrawing gadgets
completely.  [NewModifyProp](NewModifyProp) has changed this behavior (see
[NewModifyProp](NewModifyProp)).

**INPUTS**

PropGadget = pointer to a proportional gadget
[Window](_00D4) = pointer to the window containing the gadget or the window
containing the requester containing the gadget.
[Requester](_00D4) = pointer to a requester (may be NULL if this isn't
a requester gadget)
Flags = value to be stored in the Flags field of the [PropInfo](_00D4)
HorizPot = value to be stored in the HorizPot field of the [PropInfo](_00D4)
VertPot = value to be stored in the VertPot field of the [PropInfo](_00D4)
HorizBody = value to be stored in the HorizBody field of the [PropInfo](_00D4)
VertBody = value to be stored in the VertBody field of the [PropInfo](_00D4)

RESULT
None

BUGS

**SEE ALSO**

[NewModifyProp](NewModifyProp)
The Intuition Reference Manual and Amiga Rom Kernel Manual contain
more information on Proportional Gadgets.
