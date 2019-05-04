
**NAME**

ReadPixelLine8 -- read the pen number value of a horizontal line
of pixels starting at a specified x,y location and continuing
right for count pixels. (V36)

**SYNOPSIS**

```c
    count = ReadPixelLine8(rp,xstart,ystart,width,array,temprp)
    D0                     A0 D0:16  D1:16  D2    A2    A1

    LONG ReadPixelLine8(struct RastPort *, UWORD, UWORD, UWORD,
         UBYTE *, struct RastPort * );

```
Links: [RastPort](_00AF) [RastPort](_00AF) 

**FUNCTION**

For each pixel in a rectangular region, combine the bits from each
of the bit-planes used to describe a particular [RastPort](_00AF) into the pen
number selector which that bit combination normally forms for the
system hardware selection of pixel color.

**INPUTS**

rp     - pointer to a [RastPort](_00AF) structure
(x,y)  - a point in the [RastPort](_00AF)
width  - count of horizontal pixels to read
array -  pointer to an array of UBYTEs from which to fetch the pixel
data allocate at least (((width+15)&#062;&#062;4)&#060;&#060;4) bytes.
temprp - temporary rastport (copy of rp with [Layer](_00A1) set == NULL,
temporary memory allocated for
temprp-&#062;BitMap with Rows set == 1,
temprp-&#062;BytesPerRow == (((width+15)&#062;&#062;4)&#060;&#060;1),
and temporary memory allocated for
temprp-&#062;BitMap-&#062;Planes[])

RESULT
For each pixel in the array:
Pen - (0..255) number at that position is returned
count   - the number of pixels read.

NOTE
width must be non negative

BUGS

**SEE ALSO**

[ReadPixel](ReadPixel)  [graphics/rastport.h](_00AF)
