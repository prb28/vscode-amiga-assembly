
**NAME**

AddBob -- Adds a [Bob](_00C3) to current gel list.

**SYNOPSIS**

```c
    AddBob(Bob, rp)
           A0   A1

    void AddBob(struct Bob *, struct RastPort *);

```
Links: [Bob](_00C3) [RastPort](_00AF) 

**FUNCTION**

Sets up the system [Bob](_00C3) flags, then links this gel into the list
via [AddVSprite](AddVSprite).

**INPUTS**

[Bob](_00C3) = pointer to the [Bob](_00C3) structure to be added to the gel list
rp  = pointer to a [RastPort](_00AF) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [AddVSprite](AddVSprite)  [graphics/gels.h](_00C3)  [graphics/rastport.h](_00AF)
