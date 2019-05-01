
**NAME**

AddBob -- Adds a [Bob](_OOCS) to current gel list.

**SYNOPSIS**

```c
    AddBob(Bob, rp)
           A0   A1

    void AddBob(struct Bob *, struct RastPort *);

```
Links: [Bob](_OOCS) [RastPort](_OOAF) 

**FUNCTION**

Sets up the system [Bob](_OOCS) flags, then links this gel into the list
via [AddVSprite](AddVSprite).

**INPUTS**

[Bob](_OOCS) = pointer to the [Bob](_OOCS) structure to be added to the gel list
rp  = pointer to a [RastPort](_OOAF) structure

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [AddVSprite](AddVSprite)  [graphics/gels.h](_OOCS)  [graphics/rastport.h](_OOAF)
