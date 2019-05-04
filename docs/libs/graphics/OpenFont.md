
**NAME**

OpenFont -- Get a pointer to a system font.

**SYNOPSIS**

```c
    font = OpenFont(textAttr)
    D0              A0

    struct TextFont *OpenFont(struct TextAttr *);

```
Links: [TextFont](_00A8) [TextAttr](_00A8) 

**FUNCTION**

This function searches the system font space for the graphics
text font that best matches the attributes specified.  The
pointer to the font returned can be used in subsequent
[SetFont](SetFont) and [CloseFont](CloseFont) calls.  It is important to match this
call with a corresponding [CloseFont](CloseFont) call for effective
management of ram fonts.

**INPUTS**

textAttr - a [TextAttr](_00A8) or [TTextAttr](_00A8) structure that describes the
text font attributes desired.

RESULT
font is zero if the desired font cannot be found.  If the named
font is found, but the size and style specified are not
available, a font with the nearest attributes is returned.

**SEE ALSO**

[CloseFont](CloseFont)  [SetFont](SetFont)
[diskfont.library/OpenDiskFont](../diskfont/OpenDiskFont)  [graphics/text.h](_00A8)
