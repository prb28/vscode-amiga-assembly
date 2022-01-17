
**NAME**

RemVSprite -- Remove a [VSprite](_00C3.md) from the current gel list.

**SYNOPSIS**

```c
    RemVSprite(vs)
               A0

    void RemVSprite(struct VSprite *);

```
Links: [VSprite](_00C3.md) 

**FUNCTION**

Unlinks the [VSprite](_00C3.md) from the current gel list.

**INPUTS**

vs = pointer to the [VSprite](_00C3.md) structure to be removed from the gel list

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels.md)  [RemIBob](RemIBob.md)  [graphics/gels.h](_00C3.md)
