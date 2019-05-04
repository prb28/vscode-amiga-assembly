
**NAME**

AskFont -- get the text attributes of the current font

**SYNOPSIS**

```c
    AskFont(rp, textAttr)
            A1  A0

    void AskFont(struct RastPort *, struct TextAttr *);

```
Links: [RastPort](_00AF) [TextAttr](_00A8) 

**FUNCTION**

This function fills the text attributes structure with the
attributes of the current font in the [RastPort](_00AF).

**INPUTS**

rp       - the [RastPort](_00AF) from which the text attributes are
extracted
textAttr - the [TextAttr](_00A8) structure to be filled.  Note that
there is no support for a [TTextAttr](_00A8).

RESULT
The textAttr structure is filled with the RastPort's text
attributes.

BUGS

**SEE ALSO**

[graphics/text.h](_00A8)
