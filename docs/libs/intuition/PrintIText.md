
**NAME**

PrintIText -- Print text described by the [IntuiText](_00D4) argument.

**SYNOPSIS**

```c
    PrintIText( RastPort, IText, LeftOffset, TopOffset )
                A0        A1     D0          D1

    VOID PrintIText( struct RastPort *, struct IntuiText *, WORD, WORD );

```
Links: [RastPort](_00AF) [RastPort](_00AF) [IntuiText](_00D4) 

**FUNCTION**

Prints the [IntuiText](_00D4) into the specified [RastPort](_00AF).  Sets up the
[RastPort](_00AF) as specified by the [IntuiText](_00D4) values, then prints the text
into the [RastPort](_00AF) at the [IntuiText](_00D4) x/y coordinates offset by the
left/top arguments.  Note, though, that the [IntuiText](_00D4) structure
itself may contain further text position coordinates: those
coordinates and the Left/TopOffsets are added to obtain the true
position of the text to be rendered.

This routine does window layer clipping as appropriate -- if you
print text outside of your window, your characters will be
clipped at the window's edge, providing you pass your window's
(layered) [RastPort](_00AF).

If the NextText field of the [IntuiText](_00D4) argument is non-NULL,
the next [IntuiText](_00D4) is rendered as well, and so on until some
NextText field is NULL.

[IntuiText](_00D4) with the ITextFont field NULL are displayed in the
font of the [RastPort](_00AF).  If the [RastPort](_00AF) font is also NULL, the
system default font, as set via the [Preferences](_00D5) tool, will be used.

**INPUTS**

[RastPort](_00AF) = the [RastPort](_00AF) destination of the text
IText = pointer to an instance of the structure [IntuiText](_00D4)
LeftOffset = left offset of the [IntuiText](_00D4) into the [RastPort](_00AF)
TopOffset = top offset of the [IntuiText](_00D4) into the [RastPort](_00AF)

RESULT
None

BUGS

**SEE ALSO**

