
**NAME**

GadgetMouse -- Calculate gadget-relative mouse position. (V36)

**SYNOPSIS**

```c
    GadgetMouse( Gadget, GInfo, MousePoint )
                 A0      A1     A2

    VOID GadgetMouse( struct GadgetInfo *, WORD * );

```
Links: [Gadget](_00D4.md) [GadgetInfo](_00D2.md) 

**FUNCTION**

Determines the current location of the mouse pointer relative
to the upper-left corner of a custom gadget.  Typically used
only in the GM_HANDLEINPUT and GM_GOACTIVE custom gadget hook
routines.

NEWS FLASH!!: These two hook routines are now passed the mouse
coordinates, so this function has no known usefulness.

We recommend that you don't call it.

Note that this function calculates the mouse position taking
&#034;gadget relativity&#034; (GFLG_RELRIGHT, GFLG_RELBOTTOM) into
consideration.  If your custom gadget intends to ignore these
properties, then you should either enjoin or inhibit your users
from setting those bits, since Intuition won't ask if you respect
them.

**INPUTS**

GInfo = A pointer to a [GadgetInfo](_00D2.md) structure as passed to the
custom gadget hook routine.
MousePoint = address of two WORDS, or a pointer to a structure of
type Point.

RESULT
Returns nothing.  Fills in the two words pointed to by
MousePoint with the gadget-relative mouse position.

BUGS
Useless, since equivalent information is now passed to every
function that might have a use for this.

**SEE ALSO**

