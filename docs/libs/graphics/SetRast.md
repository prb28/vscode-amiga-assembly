
**NAME**

SetRast - Set an entire drawing area to a specified color.

**SYNOPSIS**

```c
    SetRast( rp, pen )
             a1  d0

    void SetRast( struct RastPort *, UBYTE );

```
Links: [RastPort](_00AF) 

**FUNCTION**

Set the entire contents of the specified [RastPort](_00AF) to the
specified pen.

**INPUTS**

rp - pointer to [RastPort](_00AF) structure
pen - the pen number (0-255) to jam into bitmap

RESULT
All pixels within the drawing area are set to the
selected pen number.

BUGS

**SEE ALSO**

[RectFill](RectFill) [graphics/rastport.h](_00AF)
