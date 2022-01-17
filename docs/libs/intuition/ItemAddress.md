
**NAME**

ItemAddress -- Returns the address of the specified [MenuItem](_00D4.md).

**SYNOPSIS**

```c
    Item = ItemAddress( MenuStrip, MenuNumber )
    D0                  A0         D0

    struct MenuItem *ItemAddress( struct Menu *, UWORD );

```
Links: [MenuItem](_00D4.md) [Menu](_00D4.md) 

**FUNCTION**

This routine feels through the specified menu strip and returns the
address of the item specified by the menu number.  Typically,
you will use this routine to get the address of a menu item from
a menu number sent to you by Intuition after user has chosen from
a window's menus.

This routine requires that the arguments are well-defined.
MenuNumber may be equal to MENUNULL, in which case this routine returns
NULL.  If MenuNumber doesn't equal MENUNULL, it's presumed to be a
valid item number selector for your menu strip, which includes:
- a valid menu number
- a valid item number
- if the item specified by the above two components has a
sub-item, the menu number may have a sub-item component, too.

Note that there must be BOTH a menu number and an item number.
Because a sub-item specifier is optional, the address returned by
this routine may point to either an item or a sub-item.

**INPUTS**

MenuStrip = a pointer to the first menu in your menu strip
MenuNumber = the value which contains the packed data that selects
the menu and item (and sub-item).  See the Intuition Reference
Manual for information on menu numbers.

RESULT
If MenuNumber == MENUNULL, this routine returns NULL,
else this routine returns the address of the menu item specified
by MenuNumber.

BUGS

**SEE ALSO**

The &#034;Menus&#034; chapter of the Intuition Reference Manual,
or the Amiga Rom Kernel Manual
