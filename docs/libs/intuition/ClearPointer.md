
**NAME**

ClearPointer -- Clear the mouse pointer definition from a window.

**SYNOPSIS**

```c
    ClearPointer( Window )
                  A0

    VOID ClearPointer( struct Window * );

```
Links: [Window](_00D4) [Window](_00D4) 

**FUNCTION**

Clears the window of its own definition of the Intuition mouse pointer.
After calling ClearPointer(), every time this window is the active
one the default Intuition pointer will be the pointer displayed
to the user.  If your window is the active one when this routine
is called, the change will take place immediately.

[Custom](_00CD) definitions of the mouse pointer which this function clears
are installed by a call to [SetPointer](SetPointer).

**INPUTS**

[Window](_00D4) = pointer to the window to be cleared of its pointer definition

RESULT
None

BUGS

**SEE ALSO**

[SetPointer](SetPointer)
