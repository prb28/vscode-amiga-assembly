
**NAME**

AddVSprite -- Add a [VSprite](_00C3) to the current gel list.

**SYNOPSIS**

```c
    AddVSprite(vs, rp)
               A0  A1

    void AddVSprite(struct VSprite *, struct RastPort *);

```
Links: [VSprite](_00C3) [RastPort](_00AF) 

**FUNCTION**

Sets up the system [VSprite](_00C3) flags
Links this [VSprite](_00C3) into the current gel list using its Y,X

**INPUTS**

vs = pointer to the [VSprite](_00C3) structure to be added to the gel list
rp = pointer to a [RastPort](_00AF) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [graphics/rastport.h](_00AF)  [graphics/gels.h](_00C3)
