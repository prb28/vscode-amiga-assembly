
**NAME**

EraseImage -- Erases an [Image](_00D4). (V36)

**SYNOPSIS**

```c
    EraseImage( RPort, Image, LeftOffset, TopOffset )
                A0     A1     D0          D1

    VOID EraseImage( struct RastPort *, struct Image *, WORD, WORD );

```
Links: [Image](_00D4) [RastPort](_00AF) [Image](_00D4) 

**FUNCTION**

Erases an [Image](_00D4).  For a normal [Image](_00D4) structure, this will
call the graphics function [EraseRect](../graphics/EraseRect) (clear using layer
backfill, if any) for the [Image](_00D4) box (LeftEdge/TopEdge/Width/Height).

For custom image, the exact behavior is determined by the
custom image class.

**INPUTS**

RPort   - [RastPort](_00AF) to erase a part of
[Image](_00D4)   - custom or standard image
LeftOffset,RightOffset - pixel offsets of [Image](_00D4) position

RESULT
None.

EXAMPLE

NOTES

BUGS

**SEE ALSO**

[graphics.library/EraseRect](../graphics/EraseRect).
