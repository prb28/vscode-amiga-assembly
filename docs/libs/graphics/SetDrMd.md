
**NAME**

SetDrMd -- Set drawing mode for a [RastPort](_00AF)

**SYNOPSIS**

```c
    SetDrMd( rp, mode )
             a1  d0:8

    void SetDrMd( struct RastPort *, UBYTE );

```
Links: [RastPort](_00AF) 

**FUNCTION**

Set the drawing mode for lines, fills and text.
Get the bit definitions from rastport.h

**INPUTS**

rp - pointer to [RastPort](_00AF) structure.
mode - 0-255, some combinations may not make much sense.

RESULT
The mode set is dependant on the bits selected.
Changes minterms to reflect new drawing mode.
Sets line drawer to restart pattern.

BUGS

**SEE ALSO**

[SetAPen](SetAPen) [SetBPen](SetBPen) [graphics/rastport.h](_00AF)
