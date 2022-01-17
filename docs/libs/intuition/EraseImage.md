
**NAME**

EraseImage -- Erases an [Image](_00D4.md). (V36)

**SYNOPSIS**

```c
    EraseImage( RPort, Image, LeftOffset, TopOffset )
                A0     A1     D0          D1

    VOID EraseImage( struct RastPort *, struct Image *, WORD, WORD );

```
Links: [Image](_00D4.md) [RastPort](_00AF.md) [Image](_00D4.md) 

**FUNCTION**

Erases an [Image](_00D4.md).  For a normal [Image](_00D4.md) structure, this will
call the graphics function [EraseRect](../graphics/EraseRect.md) (clear using layer
backfill, if any) for the [Image](_00D4.md) box (LeftEdge/TopEdge/Width/Height).

For custom image, the exact behavior is determined by the
custom image class.

**INPUTS**

RPort   - [RastPort](_00AF.md) to erase a part of
[Image](_00D4.md)   - custom or standard image
LeftOffset,RightOffset - pixel offsets of [Image](_00D4.md) position

RESULT
None.

EXAMPLE

NOTES

BUGS

**SEE ALSO**

[graphics.library/EraseRect](../graphics/EraseRect.md).
