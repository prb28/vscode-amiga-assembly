
**NAME**

RemoveGadget -- Remove a gadget from a window.

**SYNOPSIS**

```c
    Position = RemoveGadget( Window, Gadget )
    D0                       A0      A1

    UWORD RemoveGadget( struct Window *, struct Gadget * );

```
Links: [Window](_00D4.md) [Gadget](_00D4.md) [Window](_00D4.md) [Gadget](_00D4.md) 

**FUNCTION**

Removes the given gadget from the gadget list of the specified
window.  Returns the ordinal position of the removed gadget.

If the gadget is in a requester attached the the window, this
routine will look for it and remove it if it is found.

If the gadget pointer points to a gadget that isn't in the
appropriate list, -1 is returned.  If there aren't any gadgets in the
list, -1 is returned.  If you remove the 65535th gadget from the list
-1 is returned.

NOTES
New with V37: If one of the gadgets you wish to remove
is the active gadget, this routine will wait for the user
to release the mouse button before deactivating and removing
the gadget.

**INPUTS**

[Window](_00D4.md) = pointer to the window containing the gadget or the requester
containing the gadget to be removed.
[Gadget](_00D4.md) = pointer to the gadget to be removed.  The gadget itself
describes whether this is a gadget that should be removed from the
window or some requester.

RESULT
Returns the ordinal position of the removed gadget.  If the gadget
wasn't found in the appropriate list, or if there are no gadgets in
the list, returns -1.

BUGS

**SEE ALSO**

[AddGadget](AddGadget.md), [AddGList](AddGList.md), [RemoveGList](RemoveGList.md)
