
**NAME**

CloseFont -- Release a pointer to a system font.

**SYNOPSIS**

```c
    CloseFont(font)
              A1

    void CloseFont(struct TextFont *);

```
Links: [TextFont](_OOAX) 

**FUNCTION**

This function indicates that the font specified is no longer
in use.  It is used to close a font opened by [OpenFont](OpenFont), so
that fonts that are no longer in use do not consume system
resources.

**INPUTS**

font -  a font pointer as returned by [OpenFont](OpenFont) or [OpenDiskFont](_OQFW)

RESULT

BUGS

**SEE ALSO**

[OpenFont](OpenFont)  [diskfont.library/OpenDiskFont](../diskfont/OpenDiskFont)  [graphics/text.h](_OOAX)
