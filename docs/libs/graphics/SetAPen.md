
**NAME**

SetAPen -- Set the primary pen for a [RastPort](_OOAF).

**SYNOPSIS**

```c
    SetAPen( rp, pen )
             a1  d0

    void SetAPen( struct RastPort *, UBYTE );

```
Links: [RastPort](_OOAF) 

**FUNCTION**

Set the primary drawing pen for lines, fills, and text.

**INPUTS**

rp - pointer to [RastPort](_OOAF) structure.
pen - (0-255)

RESULT
Changes the minterms in the [RastPort](_OOAF) to reflect new primary pen.
Sets line drawer to restart pattern.

BUGS

**SEE ALSO**

[SetBPen](SetBPen) [graphics/rastport.h](_OOAF)
