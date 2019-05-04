
**NAME**

SetFont -- Set the text font and attributes in a [RastPort](_00AF).

**SYNOPSIS**

```c
    SetFont(rp, font)
            A1   A0

    void SetFont(struct RastPort *, struct TextFont *);

```
Links: [RastPort](_00AF) [TextFont](_00A8) 

**FUNCTION**

This function sets the font in the [RastPort](_00AF) to that described
by font, and updates the text attributes to reflect that
change.  This function clears the effect of any previous
soft styles.

**INPUTS**

rp   - the [RastPort](_00AF) in which the text attributes are to be changed
font - pointer to a [TextFont](_00A8) structure returned from [OpenFont](OpenFont)
or [OpenDiskFont](../diskfont/OpenDiskFont)

RESULT

NOTES
This function had previously been documented that it would
accept a null font.  This practice is discouraged.
o   Use of a [RastPort](_00AF) with a null font with text routines has
always been incorrect and risked the guru.
o   Keeping an obsolete font pointer in the [RastPort](_00AF) is no more
dangerous than keeping a zero one there.
o   SetFont(rp, 0) causes spurious low memory accesses under
some system software releases.

As of V36, the following Amiga font variants are no longer
directly supported:
fonts with NULL tf_CharSpace and non-NULL tf_CharKern.
fonts with non-NULL tf_CharSpace and NULL tf_CharKern.
fonts with NULL tf_CharSpace and NULL tf_CharKern with
a tf_CharLoc size component greater than tf_XSize.
Attempts to SetFont these one of these font variants will
cause the system to modify your font to make it acceptable.

BUGS
Calling SetFont() on in-code TextFonts (ie fonts not
OpenFont()ed) will result in a loss of 24 bytes from
the system as of V36.
This can be resolved by calling [StripFont](StripFont).

**SEE ALSO**

[OpenFont](OpenFont)  [StripFont](StripFont)
[diskfont.library/OpenDiskFont](../diskfont/OpenDiskFont)  [graphics/text.h](_00A8)
