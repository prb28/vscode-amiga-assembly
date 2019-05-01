
**NAME**

RemIBob -- Immediately remove a [Bob](_OOCS) from the gel list and the [RastPort](_OOAF).

**SYNOPSIS**

```c
    RemIBob(bob, rp, vp)
            A0   A1  A2

    void RemIBob(struct Bob *, struct RastPort *, struct ViewPort *);

```
Links: [Bob](_OOCS) [RastPort](_OOAF) [ViewPort](_OOBX) 

**FUNCTION**

Removes a [Bob](_OOCS) immediately by uncoupling it from the gel list and
erases it from the [RastPort](_OOAF).

**INPUTS**

bob = pointer to the [Bob](_OOCS) to be removed
rp  = pointer to the [RastPort](_OOAF) if the [Bob](_OOCS) is to be erased
vp  = pointer to the [ViewPort](_OOBX) for beam-synchronizing

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [RemVSprite](RemVSprite)  [graphics/gels.h](_OOCS)
