
**NAME**

SetBPen -- Set secondary pen for a [RastPort](_00AF.md)

**SYNOPSIS**

```c
    SetBPen( rp, pen )
             a1  d0

    void SetBPen( struct RastPort *, UBYTE );

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Set the secondary drawing pen for lines, fills, and text.

**INPUTS**

rp - pointer to [RastPort](_00AF.md) structure.
pen - (0-255)

RESULT
Changes the minterms in the [RastPort](_00AF.md) to reflect new secondary pen.
Sets line drawer to restart pattern.

BUGS

**SEE ALSO**

[SetAPen](SetAPen.md) [graphics/rastport.h](_00AF.md)
