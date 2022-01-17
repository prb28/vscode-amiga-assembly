
**NAME**

OffMenu -- Disable the given menu or menu item.

**SYNOPSIS**

```c
    OffMenu( Window, MenuNumber )
             A0      D0

    VOID OffMenu( struct Window *, UWORD );

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

This command disables a sub-item, an item, or a whole menu.
This depends on the contents of the data packed into MenuNumber,
which is described in the Intuition Reference Manual.

**INPUTS**

[Window](_00D4.md) = pointer to the window
MenuNumber = the menu piece to be disabled

RESULT
None

BUGS

**SEE ALSO**

[OnMenu](OnMenu.md), [ResetMenuStrip](ResetMenuStrip.md)
