
**NAME**

IntuiTextLength -- Return the length (pixel-width) of an [IntuiText](_00D4.md).

**SYNOPSIS**

```c
    Length = IntuiTextLength( IText )
    D0                        A0

    LONG IntuiTextLength( struct IntuiText * );

```
Links: [IntuiText](_00D4.md) 

**FUNCTION**

This routine accepts a pointer to an instance of an [IntuiText](_00D4.md)
structure, and returns the length (the pixel-width) of the string
which that instance of the structure represents.

NOTE: if the Font pointer of your [IntuiText](_00D4.md) structure is set to NULL,
you'll get the pixel-width of your text in terms of the current system
default font.  You may wish to be sure that the field IText-&#062;ITextFont
for 'default font' text is equal to the Font field of the screen it is
being measured for.

**INPUTS**

IText = pointer to an instance of an [IntuiText](_00D4.md) structure

RESULT
Returns the pixel-width of the text specified by the [IntuiText](_00D4.md) data

BUGS
Would do better to take a [RastPort](_00AF.md) as argument, so that a NULL in
the Font pointer would lead automatically to the font for the
intended target [RastPort](_00AF.md), rather than the system default font.

**SEE ALSO**

[OpenScreen](OpenScreen.md)
