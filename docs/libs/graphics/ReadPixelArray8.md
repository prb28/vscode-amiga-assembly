
**NAME**

ReadPixelArray8 -- read the pen number value of a rectangular array
of pixels starting at a specified x,y location and continuing
through to another x,y location within a certain [RastPort](_OOAF). (V36)

**SYNOPSIS**

```c
    count = ReadPixelArray8(rp,xstart,ystart,xstop,ystop,array,temprp)
    D0                      A0 D0:16  D1:16  D2:16 D3:16 A2    A1

 LONG ReadPixelArray8(struct  RastPort *, UWORD, UWORD, UWORD, UWORD,
       UBYTE *, struct RastPort *);

```
Links: [RastPort](_OOAF) [RastPort](_OOAF) 

**FUNCTION**

For each pixel in a rectangular region, combine the bits from each
of the bit-planes used to describe a particular [RastPort](_OOAF) into the pen
number selector which that bit combination normally forms for the
system hardware selection of pixel color.

**INPUTS**

rp    -  pointer to a [RastPort](_OOAF) structure
(xstart,ystart) - starting point in the [RastPort](_OOAF)
(xstop,ystop)   - stopping point in the [RastPort](_OOAF)
array -  pointer to an array of ubytes from which to fetch the pixel
data allocate at least ((((width+15)&#062;&#062;4)&#060;&#060;4)*(ystop-ystart+1))
bytes.
temprp - temporary rastport (copy of rp with [Layer](_OOAQ) set == NULL,
temporary memory allocated for
temprp-&#062;BitMap with Rows set == 1,
temprp-&#062;BytesPerRow == (((width+15)&#062;&#062;4)&#060;&#060;1),
and temporary memory allocated for
temprp-&#062;BitMap-&#062;Planes[])

RESULT
For each pixel in the array:
Pen - (0..255) number at that position is returned
count - the number of pixels read.

NOTE
xstop must be &#062;= xstart
ystop must be &#062;= ystart

BUGS

**SEE ALSO**

[ReadPixel](ReadPixel)  [ReadPixelLine8](ReadPixelLine8)  [graphics/rastport.h](_OOAF)
