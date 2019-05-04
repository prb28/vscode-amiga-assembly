
**NAME**

ReadPixel -- read the pen number value of the pixel at a
specified x,y location within a certain [RastPort](_00AF).

**SYNOPSIS**

```c
    penno = ReadPixel( rp,    x,    y )
      d0               a1  d0:16 d1:16

    LONG ReadPixel( struct RastPort *, SHORT, SHORT );

```
Links: [RastPort](_00AF) 

**FUNCTION**

Combine the bits from each of the bit-planes used to describe
a particular [RastPort](_00AF) into the pen number selector which that
bit combination normally forms for the system hardware selection
of pixel color.

**INPUTS**

rp -  pointer to a [RastPort](_00AF) structure
(x,y) a point in the [RastPort](_00AF)

RESULT
penno - the pen number of the pixel at (x,y) is returned.
-1 is returned if the pixel cannot be read for some reason.

BUGS

**SEE ALSO**

[WritePixel](WritePixel)    [graphics/rastport.h](_00AF)
