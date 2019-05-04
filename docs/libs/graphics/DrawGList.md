
**NAME**

DrawGList -- [Process](_0078) the gel list, queueing VSprites, drawing Bobs.

**SYNOPSIS**

```c
    DrawGList(rp, vp)
              A1  A0

    void DrawGList(struct RastPort *, struct ViewPort *);

```
Links: [RastPort](_00AF) [ViewPort](_00B8) 

**FUNCTION**

Performs one pass of the current gel list.
- If nextLine and lastColor are defined, these are
initialized for each gel.
- If it's a [VSprite](_00C3), build it into the copper list.
- If it's a [Bob](_00C3), draw it into the current raster.
- Copy the save values into the &#034;old&#034; variables,
double-buffering if required.

**INPUTS**

rp = pointer to the [RastPort](_00AF) where Bobs will be drawn
vp = pointer to the [ViewPort](_00B8) for which VSprites will be created

RESULT

BUGS
MUSTDRAW isn't implemented yet.

**SEE ALSO**

[InitGels](InitGels)  [graphics/gels.h](_00C3) [graphics/rastport.h](_00AF)  [graphics/view.h](_00B8)
