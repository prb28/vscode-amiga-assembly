
**NAME**

SetAPen -- Set the primary pen for a [RastPort](_00AF.md).

**SYNOPSIS**

```c
    SetAPen( rp, pen )
             a1  d0

    void SetAPen( struct RastPort *, UBYTE );

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Set the primary drawing pen for lines, fills, and text.

**INPUTS**

rp - pointer to [RastPort](_00AF.md) structure.
pen - (0-255)

RESULT
Changes the minterms in the [RastPort](_00AF.md) to reflect new primary pen.
Sets line drawer to restart pattern.

BUGS

**SEE ALSO**

[SetBPen](SetBPen.md) [graphics/rastport.h](_00AF.md)
