
**NAME**

AddVSprite -- Add a [VSprite](_OOCS) to the current gel list.

**SYNOPSIS**

```c
    AddVSprite(vs, rp)
               A0  A1

    void AddVSprite(struct VSprite *, struct RastPort *);

```
Links: [VSprite](_OOCS) [RastPort](_OOAF) 

**FUNCTION**

Sets up the system [VSprite](_OOCS) flags
Links this [VSprite](_OOCS) into the current gel list using its Y,X

**INPUTS**

vs = pointer to the [VSprite](_OOCS) structure to be added to the gel list
rp = pointer to a [RastPort](_OOAF) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [graphics/rastport.h](_OOAF)  [graphics/gels.h](_OOCS)
