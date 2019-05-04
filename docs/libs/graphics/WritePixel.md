
**NAME**

WritePixel -- Change the pen num of one specific pixel in a
specified [RastPort](_00AF).

**SYNOPSIS**

```c
    error = WritePixel(  rp, x,  y)
     d0                 a1 D0  D1

    LONG WritePixel( struct RastPort *, SHORT, SHORT );

```
Links: [RastPort](_00AF) 

**FUNCTION**

Changes the pen number of the selected pixel in the specified
[RastPort](_00AF) to that currently specified by PenA, the primary
drawing pen. Obeys minterms in [RastPort](_00AF).

**INPUTS**

rp    - a pointer to the [RastPort](_00AF) structure
(x,y) - point within the [RastPort](_00AF) at which the selected
pixel is located.

RESULT
error = 0 if pixel succesfully changed
= -1 if (x,y) is outside the [RastPort](_00AF)

BUGS

**SEE ALSO**

[ReadPixel](ReadPixel) [graphics/rastport.h](_00AF)
