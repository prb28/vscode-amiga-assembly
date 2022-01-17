
**NAME**

MoveWindowInFrontOf -- Arrange the relative depth of a window. (V36)

**SYNOPSIS**

```c
    MoveWindowInFrontOf( Window, BehindWindow )
                         A0      A1

    VOID MoveWindowInFrontOf( struct Window *, struct Window * );

```
Links: [Window](_00D4.md) [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

Depth-arranges a window in front of an another window.
Brings out the layers.library [MoveLayerInFrontOf](_039F.md) to the
Intuition user.

**INPUTS**

[Window](_00D4.md) =  window to re-position in front of another window
BehindWindow =  window to re-position in front of

RESULT
Repositions window.

BUGS
Doesn't respect backdrop windows.

**SEE ALSO**

[WindowToFront](WindowToFront.md), [WindowToBack](WindowToBack.md), [layers.library/MoveLayerInFrontOf](../layers/MoveLayerInFrontOf.md)
