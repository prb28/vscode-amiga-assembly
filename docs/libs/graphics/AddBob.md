
**NAME**

AddBob -- Adds a [Bob](_00C3.md) to current gel list.

**SYNOPSIS**

```c
    AddBob(Bob, rp)
           A0   A1

    void AddBob(struct Bob *, struct RastPort *);

```
Links: [Bob](_00C3.md) [RastPort](_00AF.md) 

**FUNCTION**

Sets up the system [Bob](_00C3.md) flags, then links this gel into the list
via [AddVSprite](AddVSprite.md).

**INPUTS**

[Bob](_00C3.md) = pointer to the [Bob](_00C3.md) structure to be added to the gel list
rp  = pointer to a [RastPort](_00AF.md) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels.md)  [AddVSprite](AddVSprite.md)  [graphics/gels.h](_00C3.md)  [graphics/rastport.h](_00AF.md)
