
**NAME**

AddVSprite -- Add a [VSprite](_00C3.md) to the current gel list.

**SYNOPSIS**

```c
    AddVSprite(vs, rp)
               A0  A1

    void AddVSprite(struct VSprite *, struct RastPort *);

```
Links: [VSprite](_00C3.md) [RastPort](_00AF.md) 

**FUNCTION**

Sets up the system [VSprite](_00C3.md) flags
Links this [VSprite](_00C3.md) into the current gel list using its Y,X

**INPUTS**

vs = pointer to the [VSprite](_00C3.md) structure to be added to the gel list
rp = pointer to a [RastPort](_00AF.md) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels.md)  [graphics/rastport.h](_00AF.md)  [graphics/gels.h](_00C3.md)
