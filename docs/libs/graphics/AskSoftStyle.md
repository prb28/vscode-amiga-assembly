
**NAME**

AskSoftStyle -- Get the soft style bits of the current font.

**SYNOPSIS**

```c
    enable = AskSoftStyle(rp)
    D0                    A1

    ULONG AskSoftStyle(struct RastPort *);

```
Links: [RastPort](_00AF) 

**FUNCTION**

This function returns those style bits of the current font
that are not intrinsic in the font itself, but
algorithmically generated.  These are the bits that are
valid to set in the enable mask for [SetSoftStyle](SetSoftStyle).

**INPUTS**

rp - the [RastPort](_00AF) from which the font and style    are extracted.

**RESULTS**

enable - those bits in the style algorithmically generated.
Style bits that are not defined are also set.

BUGS

**SEE ALSO**

[SetSoftStyle](SetSoftStyle)  [graphics/text.h](_00A8)
