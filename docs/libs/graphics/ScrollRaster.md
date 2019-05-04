
**NAME**

ScrollRaster -- Push bits in rectangle in raster around by
dx,dy towards 0,0 inside rectangle.
**SYNOPSIS**

```c
    ScrollRaster(rp, dx, dy, xmin, ymin, xmax, ymax)
                 A1  D0  D1  D2    D3    D4    D5

    void ScrollRaster
         (struct RastPort *, WORD, WORD, WORD, WORD, WORD, WORD);

```
Links: [RastPort](_00AF) 

**FUNCTION**

Move the bits in the raster by (dx,dy) towards (0,0)
The space vacated is RectFilled with BGPen.
Limit the scroll operation to the rectangle defined
by (xmin,ymin)(xmax,ymax). Bits outside will not be
affected. If xmax,ymax is outside the rastport then use
the lower right corner of the rastport.
If you are dealing with a SimpleRefresh layered [RastPort](_00AF) you
should check rp-&#062;Layer-&#062;Flags &#038; LAYER_REFRESH to see if
there is any damage in the damage list.  If there is you should
call the appropriate BeginRefresh(Intuition) or BeginUpdate(graphics)
routine sequence.

**INPUTS**

rp - pointer to a [RastPort](_00AF) structure
dx,dy are integers that may be postive, zero, or negative
xmin,ymin - upper left of bounding rectangle
xmax,ymax - lower right of bounding rectangle

EXAMPLE
ScrollRaster(rp,0,1)    /* shift raster up by one row */
ScrollRaster(rp,-1,-1)  /* shift raster down and to the right */
/* by 1 pixel                         */

BUGS
In 1.2/V1.3 if you ScrollRaster a SUPERBITMAP exactly left or
right, and there is no [TmpRas](_00AF) attached to the [RastPort](_00AF), the system
will allocate one for you, but will never free it or record its
location. This bug has been fixed for V1.4.  The workaround for
1.2/1.3 is to attach a valid [TmpRas](_00AF) of size at least
MAXBYTESPERROW to the [RastPort](_00AF) before the call.

Begining with V1.4 ScrollRaster adds the shifted areas into the
damage list for SIMPLE_REFRESH windows. Due to unacceptable
system overhead, the decision was made NOT to propagate this
shifted area damage for SMART_REFRESH windows.

**SEE ALSO**

[graphics/rastport.h](_00AF)
