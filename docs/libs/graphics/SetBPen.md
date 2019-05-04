
**NAME**

SetBPen -- Set secondary pen for a [RastPort](_00AF)

**SYNOPSIS**

```c
    SetBPen( rp, pen )
             a1  d0

    void SetBPen( struct RastPort *, UBYTE );

```
Links: [RastPort](_00AF) 

**FUNCTION**

Set the secondary drawing pen for lines, fills, and text.

**INPUTS**

rp - pointer to [RastPort](_00AF) structure.
pen - (0-255)

RESULT
Changes the minterms in the [RastPort](_00AF) to reflect new secondary pen.
Sets line drawer to restart pattern.

BUGS

**SEE ALSO**

[SetAPen](SetAPen) [graphics/rastport.h](_00AF)
