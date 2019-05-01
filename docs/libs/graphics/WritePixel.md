
**NAME**

WritePixel -- Change the pen num of one specific pixel in a
specified [RastPort](_OOAF).

**SYNOPSIS**

```c
    error = WritePixel(  rp, x,  y)
     d0                 a1 D0  D1

    LONG WritePixel( struct RastPort *, SHORT, SHORT );

```
Links: [RastPort](_OOAF) 

**FUNCTION**

Changes the pen number of the selected pixel in the specified
[RastPort](_OOAF) to that currently specified by PenA, the primary
drawing pen. Obeys minterms in [RastPort](_OOAF).

**INPUTS**

rp    - a pointer to the [RastPort](_OOAF) structure
(x,y) - point within the [RastPort](_OOAF) at which the selected
pixel is located.

RESULT
error = 0 if pixel succesfully changed
= -1 if (x,y) is outside the [RastPort](_OOAF)

BUGS

**SEE ALSO**

[ReadPixel](ReadPixel) [graphics/rastport.h](_OOAF)
