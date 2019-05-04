
**NAME**

NewModifyProp -- [ModifyProp](ModifyProp), but with selective refresh.

**SYNOPSIS**

```c
    NewModifyProp( Gadget, Window, Requester, Flags,
                   A0      A1      A2         D0
            HorizPot, VertPot, HorizBody, VertBody, NumGad )
            D1        D2       D3         D4        D5

    VOID NewModifyProp( struct Gadget *, struct Window *,
            struct Requester *, UWORD, UWORD, UWORD, UWORD, UWORD, WORD );

```
Links: [Gadget](_00D4) [Window](_00D4) [Requester](_00D4) [Gadget](_00D4) [Window](_00D4) [Requester](_00D4) 

**FUNCTION**

Performs the function of [ModifyProp](ModifyProp), but refreshes
gadgets in the list as specified by the NumGad parameter.
With NumGad = -1, this function is identical to [ModifyProp](ModifyProp).

New for V36: When NumGad = 1, this function will now perform
an incremental update of the proportional gadget knob image,
rather than refreshing the entire gadget.  This means much
less flashing when programmatically scrolling a proportional
gadget.

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
NumGad = number of gadgets to be refreshed after propgadget internals
have been adjusted.  -1 means &#034;to end of list.&#034;

RESULT
None

BUGS

**SEE ALSO**

[ModifyProp](ModifyProp)
The Intuition Reference Manual contains more information on
Proportional Gadgets.
