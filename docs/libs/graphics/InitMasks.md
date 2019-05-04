
**NAME**

InitMasks -- Initialize the BorderLine and CollMask masks of a [VSprite](_00C3).

**SYNOPSIS**

```c
    InitMasks(vs)
              A0

    void InitMasks(struct VSprite *);

```
Links: [VSprite](_00C3) 

**FUNCTION**

Creates the appropriate BorderLine and CollMask masks of the [VSprite](_00C3).
Correctly detects if the [VSprite](_00C3) is actually a [Bob](_00C3) definition, handles
the image data accordingly.

**INPUTS**

vs = pointer to the [VSprite](_00C3) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [graphics/gels.h](_00C3)
