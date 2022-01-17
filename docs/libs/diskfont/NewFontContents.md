
**NAME**

NewFontContents -- Create a [FontContents](_0102.md) image for a font. (V34)

**SYNOPSIS**

```c
     fontContentsHeader = NewFontContents(fontsLock,fontName)
    D0                                   A0        A1

     struct FontContentsHeader *NewFontContents( BPTR, char * );

```
Links: [FontContentsHeader](_0102.md) 

**FUNCTION**

This function creates a new array of [FontContents](_0102.md) entries
that describe all the fonts associated with the fontName,
specifically, all those in the font directory whose name
is that of the font sans the &#034;.font&#034; suffix.

**INPUTS**

fontsLock - a DOS lock on the FONTS: directory (or other
directory where the font contents file and associated
font directory resides).
fontName - the font name, with the &#034;.font&#034; suffix, which
is also the name of the font contents file.

RESULT
fontContentsHeader - a struct [FontContentsHeader](_0102.md) pointer.

EXCEPTIONS
This command was first made available as of version 34.

D0 is zero if the fontName is does not have a &#034;.font&#034; suffix,
if the fontName is too long, if a DOS error occurred, or if
memory could not be allocated for the fontContentsHeader.

**SEE ALSO**

[DisposeFontContents](DisposeFontContents.md) to free the structure acquired here.
