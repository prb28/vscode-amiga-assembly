
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
Links: [Gadget](_00D4.md) [Window](_00D4.md) [Requester](_00D4.md) [Gadget](_00D4.md) [Window](_00D4.md) [Requester](_00D4.md) 

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
For more refined display updating, use [NewModifyProp](NewModifyProp.md).

New for V36: ModifyProp() refreshing consists of redrawing gadgets
completely.  [NewModifyProp](NewModifyProp.md) has changed this behavior (see
[NewModifyProp](NewModifyProp.md)).

**INPUTS**

PropGadget = pointer to a proportional gadget
[Window](_00D4.md) = pointer to the window containing the gadget or the window
containing the requester containing the gadget.
[Requester](_00D4.md) = pointer to a requester (may be NULL if this isn't
a requester gadget)
Flags = value to be stored in the Flags field of the [PropInfo](_00D4.md)
HorizPot = value to be stored in the HorizPot field of the [PropInfo](_00D4.md)
VertPot = value to be stored in the VertPot field of the [PropInfo](_00D4.md)
HorizBody = value to be stored in the HorizBody field of the [PropInfo](_00D4.md)
VertBody = value to be stored in the VertBody field of the [PropInfo](_00D4.md)

RESULT
None

BUGS

**SEE ALSO**

[NewModifyProp](NewModifyProp.md)
The Intuition Reference Manual and Amiga Rom Kernel Manual contain
more information on Proportional Gadgets.
