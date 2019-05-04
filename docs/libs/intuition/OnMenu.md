
**NAME**

OnMenu -- Enable the given menu or menu item.

**SYNOPSIS**

```c
    OnMenu( Window, MenuNumber )
            A0      D0

    VOID OnMenu( struct Window *, UWORD );

```
Links: [Window](_00D4) [Window](_00D4) 

**FUNCTION**

This command enables a sub-item, an item, or a whole menu.
This depends on the contents of the data packed into MenuNumber,
which is described in the Intuition Reference Manual.

**INPUTS**

[Window](_00D4) = pointer to the window
MenuNumber = the menu piece to be enables

RESULT
None

BUGS

**SEE ALSO**

[OffMenu](OffMenu), [ResetMenuStrip](ResetMenuStrip)
