
**NAME**

RefreshGList -- Refresh (redraw) a chosen number of gadgets.

**SYNOPSIS**

```c
    RefreshGList( Gadgets, Window, Requester, NumGad )
                  A0       A1      A2         D0

    VOID RefreshGList( struct Gadget *, struct Window *,
            struct Requester *, WORD );

```
Links: [Window](_00D4) [Requester](_00D4) [Gadget](_00D4) [Window](_00D4) [Requester](_00D4) 

**FUNCTION**

Refreshes (redraws) gadgets in the gadget list starting
from the specified gadget.  At most NumGad gadgets are redrawn.
If NumGad is -1, all gadgets until a terminating NULL value
in the NextGadget field is found will be refreshed, making this
routine a superset of [RefreshGadgets](RefreshGadgets).

The [Requester](_00D4) parameter can point to a [Requester](_00D4) structure.  If
the first gadget in the list has the GTYP_REQGADGET flag set, the
gadget list refers to gadgets in a requester and the pointer
must necessarily point to a window.  If these are not the gadgets
of a requester, the requester argument may be NULL.

Be sure to see the [RefreshGadgets](RefreshGadgets) function description, as this
function is simply an extension of that.

**INPUTS**

Gadgets = pointer to the first in the list of gadgets wanting
refreshment
[Window](_00D4) = pointer to the window containing the gadget or its requester
[Requester](_00D4) = pointer to a requester (ignored if [Gadget](_00D4) is not attached
to a Requester).
NumGad  = maximum number of gadgets to be refreshed.  A value of -1
will cause all gadgets to be refreshed from gadget to the
end of the list.  A value of -2 will also do this, but if 'Gadgets'
points to a [Requester](_00D4) [Gadget](_00D4) (GTYP_REQGADGET) ALL gadgets in the
requester will be refreshed (this is a mode compatible with v1.1
RefreshGadgets().)

RESULT
None

BUGS

**SEE ALSO**

[RefreshGadgets](RefreshGadgets)
