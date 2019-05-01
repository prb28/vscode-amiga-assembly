
**NAME**

InitMasks -- Initialize the BorderLine and CollMask masks of a [VSprite](_OOCS).

**SYNOPSIS**

```c
    InitMasks(vs)
              A0

    void InitMasks(struct VSprite *);

```
Links: [VSprite](_OOCS) 

**FUNCTION**

Creates the appropriate BorderLine and CollMask masks of the [VSprite](_OOCS).
Correctly detects if the [VSprite](_OOCS) is actually a [Bob](_OOCS) definition, handles
the image data accordingly.

**INPUTS**

vs = pointer to the [VSprite](_OOCS) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [graphics/gels.h](_OOCS)
