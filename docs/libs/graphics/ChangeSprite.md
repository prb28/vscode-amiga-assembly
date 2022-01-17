
**NAME**

ChangeSprite -- Change the sprite image pointer.

**SYNOPSIS**

```c
    ChangeSprite( vp, s, newdata)
                 a0  a1   a2

    void ChangeSprite(struct ViewPort *, struct SimpleSprite *, void * )

```
Links: [ViewPort](_00B8.md) [SimpleSprite](_00C5.md) 

**FUNCTION**

The sprite image is changed to use the data starting at newdata

**INPUTS**

vp - pointer to [ViewPort](_00B8.md) structure that this sprite is
relative to,  or 0 if relative only top of [View](_00B8.md)
s - pointer to [SimpleSprite](_00C5.md) structure
newdata - pointer to data structure of the following form.
struct spriteimage
{
UWORD    posctl[2]; /* used by simple sprite machine*/
UWORD    data[height][2];   /* actual sprite image */
UWORD    reserved[2];       /* initialized to */
/*  0x0,0x0 */
};
The programmer must initialize reserved[2].  Spriteimage must be
in CHIP memory. The height subfield of the [SimpleSprite](_00C5.md) structure
must be set to reflect the height of the new spriteimage BEFORE
calling ChangeSprite(). The programmer may allocate two sprites to
handle a single attached sprite.  After [GetSprite](GetSprite.md), ChangeSprite(),
the programmer can set the SPRITE_ATTACHED bit in posctl[1] of the
odd numbered sprite.
If you need more than 8 sprites, look up VSprites in the
graphics documentation.

**RESULTS**


BUGS

**SEE ALSO**

[FreeSprite](FreeSprite.md) ChangeSprite() [MoveSprite](MoveSprite.md) [AddVSprite](AddVSprite.md) [graphics/sprite.h](_00C5.md)
