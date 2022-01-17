
**NAME**

NewScaledDiskFont -- Create a DiskFont scaled from another. (V36)

**SYNOPSIS**

```c
     header = NewScaledDiskFont(srcFont, destTextAttr)
     D0                         A0       A1

     struct DiskFontHeader *NewScaledDiskFont( struct TextFont *,
             struct TTextAttr * );

```
Links: [DiskFontHeader](_0102.md) [TextFont](_00A8.md) [TTextAttr](_00A8.md) 

**INPUTS**

srcFont - the font from which the scaled font is to be
constructed.
destTextAttr - the desired attributes for the new scaled
font.  This may be a structure of type [TextAttr](_00A8.md) or
[TTextAttr](_00A8.md).

RESULT
header - a pointer to a [DiskFontHeader](_0102.md) structure.  This is not
being managed by the diskfont.library, however.

NOTES
o   This function may use the blitter.
o   Fonts containing characters that render wholly outside
the character advance cell are currently not scalable.
o   The font, and memory allocated for the scaled font can
can be freed by calling [StripFont](../graphics/StripFont.md) on the font,
and then calling [UnLoadSeg](../dos/UnLoadSeg.md) on the segment created
by this function.

Both the [TextFont](_00A8.md) structure, and segment pointer are contained
within the [DiskFontHeader](_0102.md) struct.  The [DiskFontHeader](_0102.md) structure
will also be freed as part of the [UnLoadSeg](../dos/UnLoadSeg.md) call.
[StripFont](../graphics/StripFont.md) is a new graphics.library call as of V36.
