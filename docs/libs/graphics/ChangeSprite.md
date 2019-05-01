
**NAME**

ChangeSprite -- Change the sprite image pointer.

**SYNOPSIS**

```c
    ChangeSprite( vp, s, newdata)
                 a0  a1   a2

    void ChangeSprite(struct ViewPort *, struct SimpleSprite *, void * )

```
Links: [ViewPort](_OOBX) [SimpleSprite](_OOCU) 

**FUNCTION**

The sprite image is changed to use the data starting at newdata

**INPUTS**

vp - pointer to [ViewPort](_OOBX) structure that this sprite is
relative to,  or 0 if relative only top of [View](_OOBX)
s - pointer to [SimpleSprite](_OOCU) structure
newdata - pointer to data structure of the following form.
struct spriteimage
{
UWORD    posctl[2]; /* used by simple sprite machine*/
UWORD    data[height][2];   /* actual sprite image */
UWORD    reserved[2];       /* initialized to */
/*  0x0,0x0 */
};
The programmer must initialize reserved[2].  Spriteimage must be
in CHIP memory. The height subfield of the [SimpleSprite](_OOCU) structure
must be set to reflect the height of the new spriteimage BEFORE
calling ChangeSprite(). The programmer may allocate two sprites to
handle a single attached sprite.  After [GetSprite](GetSprite), ChangeSprite(),
the programmer can set the SPRITE_ATTACHED bit in posctl[1] of the
odd numbered sprite.
If you need more than 8 sprites, look up VSprites in the
graphics documentation.

**RESULTS**


BUGS

**SEE ALSO**

[FreeSprite](FreeSprite) ChangeSprite() [MoveSprite](MoveSprite) [AddVSprite](AddVSprite) [graphics/sprite.h](_OOCU)
