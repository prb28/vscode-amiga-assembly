
**NAME**

ViewAddress -- Return the address of the Intuition [View](_00B8) structure.

**SYNOPSIS**

```c
    view = ViewAddress()
    D0

    struct View *ViewAddress( VOID );

```
Links: [View](_00B8) 

**FUNCTION**

Returns the address of the Intuition [View](_00B8) structure.  If you
want to use any of the graphics, text, or animation primitives
in your window and that primitive requires a pointer to a view,
this routine will return the address of the view for you.

**INPUTS**

None

RESULT
Returns the address of the Intuition [View](_00B8) structure

BUGS

**SEE ALSO**

graphics.library
