
**NAME**

BltPattern --  Using standard drawing rules for areafill,
blit through a mask.

**SYNOPSIS**

```c
    BltPattern(rp, mask, xl, yl, maxx, maxy, bytecnt)
              a1,  a0   d0  d1   d2   d3     d4

    void BltPattern
       (struct RastPort *, void *, SHORT, SHORT, SHORT, SHORT, SHORT);

```
Links: [RastPort](_00AF) 

**FUNCTION**

Blit using drawmode,areafill pattern, and mask
at position rectangle (xl,yl) (maxx,maxy).

**INPUTS**

rp    -  points to the destination [RastPort](_00AF) for the blit.
mask  -  points to 2 dimensional mask if needed
if mask == NULL then use a rectangle.
xl,yl -  coordinates of upper left of rectangular region in [RastPort](_00AF)
maxx,maxy - points to lower right of rectangular region in [RastPort](_00AF)
bytecnt - BytesPerRow for mask

RESULT

**SEE ALSO**

[AreaEnd](AreaEnd)
