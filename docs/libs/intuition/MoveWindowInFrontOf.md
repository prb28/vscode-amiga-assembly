
**NAME**

MoveWindowInFrontOf -- Arrange the relative depth of a window. (V36)

**SYNOPSIS**

```c
    MoveWindowInFrontOf( Window, BehindWindow )
                         A0      A1

    VOID MoveWindowInFrontOf( struct Window *, struct Window * );

```
Links: [Window](_00D4) [Window](_00D4) [Window](_00D4) 

**FUNCTION**

Depth-arranges a window in front of an another window.
Brings out the layers.library [MoveLayerInFrontOf](_039F) to the
Intuition user.

**INPUTS**

[Window](_00D4) =  window to re-position in front of another window
BehindWindow =  window to re-position in front of

RESULT
Repositions window.

BUGS
Doesn't respect backdrop windows.

**SEE ALSO**

[WindowToFront](WindowToFront), [WindowToBack](WindowToBack), [layers.library/MoveLayerInFrontOf](../layers/MoveLayerInFrontOf)
