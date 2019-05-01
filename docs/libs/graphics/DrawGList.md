
**NAME**

DrawGList -- [Process](_OOWX) the gel list, queueing VSprites, drawing Bobs.

**SYNOPSIS**

```c
    DrawGList(rp, vp)
              A1  A0

    void DrawGList(struct RastPort *, struct ViewPort *);

```
Links: [RastPort](_OOAF) [ViewPort](_OOBX) 

**FUNCTION**

Performs one pass of the current gel list.
- If nextLine and lastColor are defined, these are
initialized for each gel.
- If it's a [VSprite](_OOCS), build it into the copper list.
- If it's a [Bob](_OOCS), draw it into the current raster.
- Copy the save values into the &#034;old&#034; variables,
double-buffering if required.

**INPUTS**

rp = pointer to the [RastPort](_OOAF) where Bobs will be drawn
vp = pointer to the [ViewPort](_OOBX) for which VSprites will be created

RESULT

BUGS
MUSTDRAW isn't implemented yet.

**SEE ALSO**

[InitGels](InitGels)  [graphics/gels.h](_OOCS) [graphics/rastport.h](_OOAF)  [graphics/view.h](_OOBX)
