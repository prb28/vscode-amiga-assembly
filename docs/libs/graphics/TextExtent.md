
**NAME**

[TextExtent](_00A8.md) -- Determine raster extent of text data. (V36)

**SYNOPSIS**

```c
    TextExtent(rp, string, count, textExtent)
               A1  A0      D0:16  A2

    void TextExtent(struct RastPort *, STRPTR, WORD,
         struct TextExtent *);

```
Links: [RastPort](_00AF.md) [TextExtent](_00A8.md) 

**FUNCTION**

This function determines a more complete metric of the space
that a text string would render into than the [TextLength](TextLength.md)
function.

**INPUTS**

rp     - a pointer to the [RastPort](_00AF.md) which describes where the
text attributes reside.
string - the address of the string to determine the length of.
count  - the number of characters in the string.
If zero, there are no characters in the string.
textExtent - a structure to hold the result.

**RESULTS**

textExtent is filled in as follows:
te_Width  - same as [TextLength](TextLength.md) result: the rp_cp_x
advance that rendering this text would cause.
te_Height - same as tf_YSize.  The height of the
font.
te_Extent.MinX - the offset to the left side of the
rectangle this would render into.  Often zero.
te_Extent.MinY - same as -tf_Baseline.  The offset
from the baseline to the top of the rectangle
this would render into.
te_Extent.MaxX - the offset of the left side of the
rectangle this would render into.  Often the
same as te_Width-1.
te_Extent.MaxY - same as tf_YSize-tf_Baseline-1.
The offset from the baseline to the bottom of
the rectanangle this would render into.

**SEE ALSO**

[TextLength](TextLength.md)  [Text](Text.md)  [TextFit](TextFit.md)
[graphics/text.h](_00A8.md)  [graphics/rastport.h](_00AF.md)
