
**NAME**

TextLength -- Determine raster length of text data.

**SYNOPSIS**

```c
    length = TextLength(rp, string, count)
    D0                  A1  A0      D0:16

    WORD TextLength(struct RastPort *, STRPTR, WORD);

```
Links: [RastPort](_00AF) 

**FUNCTION**

This graphics function determines the length that text data
would occupy if output to the specified [RastPort](_00AF) with the
current attributes.  The length is specified as the number of
raster dots: to determine what the current position would be
after a [Write](../dos/Write) using this string, add the length to cp_x
(cp_y is unchanged by [Write](../dos/Write)).  Use the newer [TextExtent](TextExtent) to
get more information.

**INPUTS**

rp     - a pointer to the [RastPort](_00AF) which describes where the
text attributes reside.
string - the address of string to determine the length of
count  - the string length.  If zero, there are no characters
in the string.

**RESULTS**

length - the number of pixels in x this text would occupy, not
including any negative kerning that may take place at
the beginning of the text string, nor taking into
account the effects of any clipping that may take
place.

NOTES
Prior to V36, the result length occupied only the low word of
d0 and was not sign extended into the high word.

BUGS
A length that would overflow single word arithmatic is not
calculated correctly.

**SEE ALSO**

[TextExtent](TextExtent)  [Text](Text)  [TextFit](TextFit)
[graphics/text.h](_00A8)  [graphics/rastport.h](_00AF)
