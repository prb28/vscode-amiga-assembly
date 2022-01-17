
**NAME**

PrintIText -- Print text described by the [IntuiText](_00D4.md) argument.

**SYNOPSIS**

```c
    PrintIText( RastPort, IText, LeftOffset, TopOffset )
                A0        A1     D0          D1

    VOID PrintIText( struct RastPort *, struct IntuiText *, WORD, WORD );

```
Links: [RastPort](_00AF.md) [RastPort](_00AF.md) [IntuiText](_00D4.md) 

**FUNCTION**

Prints the [IntuiText](_00D4.md) into the specified [RastPort](_00AF.md).  Sets up the
[RastPort](_00AF.md) as specified by the [IntuiText](_00D4.md) values, then prints the text
into the [RastPort](_00AF.md) at the [IntuiText](_00D4.md) x/y coordinates offset by the
left/top arguments.  Note, though, that the [IntuiText](_00D4.md) structure
itself may contain further text position coordinates: those
coordinates and the Left/TopOffsets are added to obtain the true
position of the text to be rendered.

This routine does window layer clipping as appropriate -- if you
print text outside of your window, your characters will be
clipped at the window's edge, providing you pass your window's
(layered) [RastPort](_00AF.md).

If the NextText field of the [IntuiText](_00D4.md) argument is non-NULL,
the next [IntuiText](_00D4.md) is rendered as well, and so on until some
NextText field is NULL.

[IntuiText](_00D4.md) with the ITextFont field NULL are displayed in the
font of the [RastPort](_00AF.md).  If the [RastPort](_00AF.md) font is also NULL, the
system default font, as set via the [Preferences](_00D5.md) tool, will be used.

**INPUTS**

[RastPort](_00AF.md) = the [RastPort](_00AF.md) destination of the text
IText = pointer to an instance of the structure [IntuiText](_00D4.md)
LeftOffset = left offset of the [IntuiText](_00D4.md) into the [RastPort](_00AF.md)
TopOffset = top offset of the [IntuiText](_00D4.md) into the [RastPort](_00AF.md)

RESULT
None

BUGS

**SEE ALSO**

