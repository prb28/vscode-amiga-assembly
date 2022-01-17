
**NAME**

CloseFont -- Release a pointer to a system font.

**SYNOPSIS**

```c
    CloseFont(font)
              A1

    void CloseFont(struct TextFont *);

```
Links: [TextFont](_00A8.md) 

**FUNCTION**

This function indicates that the font specified is no longer
in use.  It is used to close a font opened by [OpenFont](OpenFont.md), so
that fonts that are no longer in use do not consume system
resources.

**INPUTS**

font -  a font pointer as returned by [OpenFont](OpenFont.md) or [OpenDiskFont](../diskfont/OpenDiskFont.md)

RESULT

BUGS

**SEE ALSO**

[OpenFont](OpenFont.md)  [diskfont.library/OpenDiskFont](../diskfont/OpenDiskFont.md)  [graphics/text.h](_00A8.md)
