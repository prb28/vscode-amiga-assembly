
**NAME**

DrawImageState -- Draw an (extended) Intuition [Image](_00D4.md) with
special visual state. (V36)

**SYNOPSIS**

```c
    DrawImageState( RPort, Image, LeftOffset, TopOffset, State, DrawInfo )
                    A0     A1     D0          D1         D2     A2

    VOID DrawImageState( struct RastPort *, struct Image *,
            WORD, WORD, ULONG, struct DrawInfo * );

```
Links: [Image](_00D4.md) [DrawInfo](_00DD.md) [RastPort](_00AF.md) [Image](_00D4.md) [DrawInfo](_00DD.md) 

**FUNCTION**

This function draws an Intuition [Image](_00D4.md) structure in a variety of
&#034;visual states,&#034; which are defined by constants in
[intuition/imageclass.h](_00E3.md).  These include:
IDS_NORMAL              - like [DrawImage](DrawImage.md)
IDS_SELECTED            - represents the &#034;selected state&#034; of a [Gadget](_00D4.md)
IDS_DISABLED            - the &#034;ghosted state&#034; of a gadget
IDS_BUSY                - for future functionality
IDS_INDETERMINATE       - for future functionality
IDS_INACTIVENORMAL      - for gadgets in window border
IDS_INACTIVESELECTED    - for gadgets in window border
IDS_INACTIVEDISABLED    - for gadgets in window border

Only IDS_NORMAL will make sense for traditional [Image](_00D4.md) structures,
this function is more useful when applied to new custom images
or &#034;object-oriented image classes.&#034;

Each class of custom images is responsible for documenting which
visual states it supports, and you typically want to use images
which support the appropriate states with your custom gadgets.

The [DrawInfo](_00DD.md) parameter provides information invaluable to
&#034;rendered&#034; images, such as pen color and resolution.  Each
image class must document whether this parameter is required.

**INPUTS**

RPort   - [RastPort](_00AF.md) for rendering
[Image](_00D4.md)   - pointer to a (preferably custom) image
LeftOffset,RightOffset - positional offsets in pixels
State   - visual state selected from above
[DrawInfo](_00DD.md) - pointer to packed of pen selections and resolution.

RESULT
None.

EXAMPLE
Provided separately in the DevCon '90 disk set.

NOTES


BUGS


**SEE ALSO**

[DrawImage](DrawImage.md), [GetScreenDrawInfo](GetScreenDrawInfo.md), [intuition/imageclass.h](_00E3.md)
