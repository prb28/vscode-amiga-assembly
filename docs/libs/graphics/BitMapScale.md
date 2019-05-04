
**NAME**

BitMapScale -- Perform raster scaling on a bit map. (V36)

**SYNOPSIS**

```c
    BitMapScale(bitScaleArgs)
                A0

    void BitMapScale(struct BitScaleArgs *);

```
Links: [BitScaleArgs](_00BF) 

**FUNCTION**

Scale a source bit map to a non-overlapping destination
bit map.

**INPUTS**

bitScaleArgs - structure of parameters describing scale:
bsa_SrcX, bsa_SrcY - origin of the source bits.
bsa_SrcWidth, bsa_SrcHeight - number of bits to scale from in x
and y.
bsa_DestX, bsa_DestY - origin of the destination.
bsa_DestWidth, bsa_DestHeight - resulting number of bits in x
and y.  NOTE: these values are set by this function.
bsa_XSrcFactor:bsa_XDestFactor - equivalant to the ratio
srcWidth:destWidth, but not necessarily the same
numbers.  Each must be in the range 1..16383.
bsa_YSrcFactor:bsa_YDestFactor - equivalant to the ratio
srcHeight:destHeight, but not necessarily the same
numbers.  Each must be in the range 1..16383.
bsa_SrcBitMap - source of the bits to scale.
bsa_DestBitMap - destination for the bits to scale.  This had
better be big enough!
bsa_Flags - future scaling options.  Set it to zero!
bsa_XDDA, bsa_YDDA - for future use.  Need not be set by user.
bsa_Reserved1, bsa_Reserved2 - for future use.  Need not be set.

RESULT
The destWidth, destHeight fields are set by this function as
described above.

NOTES
o   This function may use the blitter.
o   Overlapping source and destination bit maps are not
supported.
o   No check is made to ensure destBitMap is big enough: use
[ScalerDiv](ScalerDiv) to calculate a destination dimension.

BUGS
o   This function does not use the HighRes Agnus 'Big Blit'
facility. You should not use XSrcFactor == XDestFactor,
where SrcWidth or DestWidth &#062; 1024.

o   Also, the blitter is used when expanding in the Y direction.
You should not expand in the Y direction if
((DestX &#038; 0xf) + DestWidth) &#062;= 1024 pixels. (Up to 1008 pixels
is always safe).

**SEE ALSO**

[ScalerDiv](ScalerDiv)  [graphics/scale.h](_00BF)
