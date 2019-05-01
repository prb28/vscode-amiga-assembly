
**NAME**

RemVSprite -- Remove a [VSprite](_OOCS) from the current gel list.

**SYNOPSIS**

```c
    RemVSprite(vs)
               A0

    void RemVSprite(struct VSprite *);

```
Links: [VSprite](_OOCS) 

**FUNCTION**

Unlinks the [VSprite](_OOCS) from the current gel list.

**INPUTS**

vs = pointer to the [VSprite](_OOCS) structure to be removed from the gel list

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [RemIBob](RemIBob)  [graphics/gels.h](_OOCS)
