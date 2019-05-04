
**NAME**

RemVSprite -- Remove a [VSprite](_00C3) from the current gel list.

**SYNOPSIS**

```c
    RemVSprite(vs)
               A0

    void RemVSprite(struct VSprite *);

```
Links: [VSprite](_00C3) 

**FUNCTION**

Unlinks the [VSprite](_00C3) from the current gel list.

**INPUTS**

vs = pointer to the [VSprite](_00C3) structure to be removed from the gel list

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [RemIBob](RemIBob)  [graphics/gels.h](_00C3)
