
**NAME**

SetAPen -- Set the primary pen for a [RastPort](_00AF).

**SYNOPSIS**

```c
    SetAPen( rp, pen )
             a1  d0

    void SetAPen( struct RastPort *, UBYTE );

```
Links: [RastPort](_00AF) 

**FUNCTION**

Set the primary drawing pen for lines, fills, and text.

**INPUTS**

rp - pointer to [RastPort](_00AF) structure.
pen - (0-255)

RESULT
Changes the minterms in the [RastPort](_00AF) to reflect new primary pen.
Sets line drawer to restart pattern.

BUGS

**SEE ALSO**

[SetBPen](SetBPen) [graphics/rastport.h](_00AF)
