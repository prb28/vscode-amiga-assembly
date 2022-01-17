
**NAME**

RemoveGList -- Remove a sublist of gadgets from a window.

**SYNOPSIS**

```c
    Position = RemoveGList( Window, Gadget, Numgad )
    D0                      A0      A1      D0

    UWORD RemoveGList( struct Window *, struct Gadget *, WORD );

```
Links: [Window](_00D4.md) [Gadget](_00D4.md) [Window](_00D4.md) [Gadget](_00D4.md) 

**FUNCTION**

Removes 'Numgad' gadgets from the gadget list of the specified
window.  Will remove gadgets from a requester if the first
gadget's GadgetType flag GTYP_REQGADGET is set.

Otherwise identical to [RemoveGadget](RemoveGadget.md).

NOTE
The last gadget in the list does NOT have its link zeroed.
New with V36: OK, last gadget's NextGadget field is set to NULL.

New with V37: If one of the gadgets you wish to remove
is the active gadget, this routine will wait for the user
to release the mouse button before deactivating and removing
the gadget.

**INPUTS**

[Window](_00D4.md) = pointer to the window containing the gadget or the requester
containing the gadget to be removed.
[Gadget](_00D4.md) = pointer to the gadget to be removed.  The gadget itself
describes whether this is a gadget that should be removed
from the window or some requester.
Numgad = number of gadgets to be removed.  If -1, remove all gadgets
to end of window gadget list

RESULT
Returns the ordinal position of the removed gadget.  If the gadget
wasn't found in the appropriate list, or if there are no gadgets in
the list, returns -1.

BUGS

**SEE ALSO**

[RemoveGadget](RemoveGadget.md), [AddGadget](AddGadget.md), [AddGList](AddGList.md)
