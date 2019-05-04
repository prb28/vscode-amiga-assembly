
**NAME**

DoCollision -- Test every gel in gel list for collisions.

**SYNOPSIS**

```c
    DoCollision(rp)
                A1

    void DoCollision(struct RastPort *);

```
Links: [RastPort](_00AF) 

**FUNCTION**

Tests each gel in gel list for boundary and gel-to-gel collisions.
On detecting one of these collisions, the appropriate collision-
handling routine is called. See the documentation for a thorough
description of which collision routine is called. This routine
expects to find the gel list correctly sorted in Y,X order.
The system routine [SortGList](SortGList) performs this function for the user.

**INPUTS**

rp = pointer to a [RastPort](_00AF)

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [SortGList](SortGList)  [graphics/gels.h](_00C3)  [graphics/gels.h](_00C3)
