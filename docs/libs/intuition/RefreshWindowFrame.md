
**NAME**

RefreshWindowFrame -- Ask Intuition to redraw your window border.

**SYNOPSIS**

```c
    RefreshWindowFrame( Window )
                        A0

    VOID RefreshWindowFrame( struct Window * );

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

Refreshes the border of a window, including title region and all
of the window's gadgets.

You may use this call if you wish to update the display of your
borders.  The expected use of this is to correct unavoidable
corruption.

**INPUTS**

[Window](_00D4.md) = a pointer to a [Window](_00D4.md) structure

RESULT
None

BUGS

**SEE ALSO**

