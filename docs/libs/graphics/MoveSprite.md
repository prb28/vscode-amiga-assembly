
**NAME**

MoveSprite -- Move sprite to a point relative to top of viewport.

**SYNOPSIS**

```c
    MoveSprite(vp, sprite, x, y)
               A0  A1      D0 D1

    void MoveSprite(struct ViewPort *,struct SimpleSprite *, WORD, WORD);

```
Links: [ViewPort](_00B8.md) [SimpleSprite](_00C5.md) 

**FUNCTION**

Move sprite image to new place on display.

**INPUTS**

vp - pointer to [ViewPort](_00B8.md) structure
if vp = 0, sprite is positioned relative to [View](_00B8.md).
sprite - pointer to [SimpleSprite](_00C5.md) structure
(x,y)  - new position relative to top of viewport or view.

**RESULTS**

Calculate the hardware information for the sprite and
place it in the posctldata array. During next video display
the sprite will appear in new position.

BUGS
Sprites really appear one pixel to the left of the position you
specify.  This bug affects the apparent display position of the sprite
on the screen, but does not affect the numeric position relative to
the viewport or view.

**SEE ALSO**

[FreeSprite](FreeSprite.md)  [ChangeSprite](ChangeSprite.md)  [GetSprite](GetSprite.md)  [graphics/sprite.h](_00C5.md)
