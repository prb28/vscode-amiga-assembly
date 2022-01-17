
**NAME**


EraseRect -- Fill a defined rectangular area using the current
BackFill hook. (V36)

**SYNOPSIS**

```c
    EraseRect( rp, xmin, ymin, xmax, ymax)
              a1  d0:16 d1:16 d2:16 d3:16

    void EraseRect(struct RastPort *, SHORT, SHORT, SHORT, SHORT);

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Fill the rectangular region specified by the parameters with the
BackFill hook. If non-layered, the rectangular region specified by
the parameters is cleared. If layered the Layer-&#062;BackFill [Hook](_012D.md) is used.

**INPUTS**

rp      - pointer to a [RastPort](_00AF.md) structure
xmin    - x coordinate of the upper left corner of the region to fill.
ymin    - y coordinate of the upper left corner of the region to fill.
xmax    - x coordinate of the lower right corner of the region to fill.
ymax    - y coordinate of the lower right corner of the region to fill.

BUGS

NOTES
The following relation MUST be true:
(xmax &#062;= xmin) and (ymax &#062;= ymin)

**SEE ALSO**

[graphics/rastport.h](_00AF.md) [graphics/clip.h](_00A1.md)
