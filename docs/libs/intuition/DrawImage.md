
**NAME**

DrawImage -- Draw the specified [Image](_00D4) structure into a [RastPort](_00AF).

**SYNOPSIS**

```c
    DrawImage( RastPort, Image, LeftOffset, TopOffset )
               A0        A1     D0          D1

    VOID DrawImage( struct RastPort *, struct Image    *, WORD, WORD );

```
Links: [RastPort](_00AF) [Image](_00D4) [RastPort](_00AF) [Image](_00D4) 

**FUNCTION**

First, sets up the draw mode and pens in the [RastPort](_00AF) according to the
arguments of the [Image](_00D4) structure.  Then, moves the image data of
the image argument into the [RastPort](_00AF), offset by the left and top
offsets.

This routine does window layer clipping if you pass your window's
(layered) [RastPort](_00AF) -- if you draw an image outside of your window,
your imagery will be clipped at the window's edge.  If you pass
a (non-layered) screen [RastPort](_00AF), you MUST be sure your image is
wholly contained within the rastport bounds.

If the NextImage field of the image argument is non-NULL,
the next image is rendered as well, and so on until some
NextImage field is found to be NULL.

**INPUTS**

[RastPort](_00AF) = pointer to the [RastPort](_00AF) to receive image rendering
[Image](_00D4) = pointer to an image structure
LeftOffset = the offset which will be added to the image's x coordinate
TopOffset = the offset which will be added to the image's y coordinate

RESULT
None

NOTES
Intuition always has and will continue to assume there are
at least as many planes of data pointed to by ImageData as there
are '1' bits in the PlanePick field.  Please ensure that
this is so.  (See the intuition.h include file for full details
on using PlanePick).

BUGS

**SEE ALSO**

[DrawImageState](DrawImageState), [EraseImage](EraseImage)
