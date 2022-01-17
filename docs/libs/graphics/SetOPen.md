
**NAME**

SetOPen -- Change the Area OutLine pen and turn on Outline
mode for areafills.

**SYNOPSIS**

```c
    SetOPen(rp, pen)

    void SetOPen( struct RastPort *, UBYTE );

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

This is implemented as a c-macro.
Pen is the pen number that will be used to draw a border
around an areafill during [AreaEnd](AreaEnd.md).

**INPUTS**

rp = pointer to [RastPort](_00AF.md) structure
pen = number  between 0-255

BUGS

**SEE ALSO**

[AreaEnd](AreaEnd.md) [graphics/gfxmacros.h](_00B6.md) [graphics/rastport.h](_00AF.md)
