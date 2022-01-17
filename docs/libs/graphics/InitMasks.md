
**NAME**

InitMasks -- Initialize the BorderLine and CollMask masks of a [VSprite](_00C3.md).

**SYNOPSIS**

```c
    InitMasks(vs)
              A0

    void InitMasks(struct VSprite *);

```
Links: [VSprite](_00C3.md) 

**FUNCTION**

Creates the appropriate BorderLine and CollMask masks of the [VSprite](_00C3.md).
Correctly detects if the [VSprite](_00C3.md) is actually a [Bob](_00C3.md) definition, handles
the image data accordingly.

**INPUTS**

vs = pointer to the [VSprite](_00C3.md) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels.md)  [graphics/gels.h](_00C3.md)
