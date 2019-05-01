
**NAME**

SetOPen -- Change the Area OutLine pen and turn on Outline
mode for areafills.

**SYNOPSIS**

```c
    SetOPen(rp, pen)

    void SetOPen( struct RastPort *, UBYTE );

```
Links: [RastPort](_OOAF) 

**FUNCTION**

This is implemented as a c-macro.
Pen is the pen number that will be used to draw a border
around an areafill during [AreaEnd](AreaEnd).

**INPUTS**

rp = pointer to [RastPort](_OOAF) structure
pen = number  between 0-255

BUGS

**SEE ALSO**

[AreaEnd](AreaEnd) [graphics/gfxmacros.h](_OOBV) [graphics/rastport.h](_OOAF)
