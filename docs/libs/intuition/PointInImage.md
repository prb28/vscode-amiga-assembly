
**NAME**

PointInImage -- Tests whether an image &#034;contains&#034; a point. (V36)

**SYNOPSIS**

```c
    DoesContain = PointInImage( Point, Image )
    D0                          D0     A0

    BOOL PointInImage( struct Point, struct Image * );

```
Links: [Image](_00D4) [Image](_00D4) 

**FUNCTION**

Tests whether a point is properly contained in an image.
The intention of this is to provide custom gadgets a means
to delegate &#034;image mask&#034; processing to the [Image](_00D4), where
it belongs (superceding things like BOOLMASK).  After all,
a rounded rect image with a drop shadow knows more about
what points are inside it than anybody else should.

For traditional Intuition Images, this routine checks if
the point is in the [Image](_00D4) box (LeftEdge/RightEdge/Width/Height).

**INPUTS**

Point   - Two words, X/Y packed into a LONG, with high word
containing 'X'.  This is what you get if you pass
a Point structure (not a pointer!) using common
C language parameter conventions.
[Image](_00D4) - a pointer to a standard or custom [Image](_00D4) data object.
NOTE: If 'Image' is NULL, this function returns TRUE.

RESULT
DoesContain - Boolean result of the test.

EXAMPLE


NOTES


BUGS
Only applies to the first image, does not follow NextImage
linked list.  This might be preferred.

**SEE ALSO**

