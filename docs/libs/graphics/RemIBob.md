
**NAME**

RemIBob -- Immediately remove a [Bob](_00C3) from the gel list and the [RastPort](_00AF).

**SYNOPSIS**

```c
    RemIBob(bob, rp, vp)
            A0   A1  A2

    void RemIBob(struct Bob *, struct RastPort *, struct ViewPort *);

```
Links: [Bob](_00C3) [RastPort](_00AF) [ViewPort](_00B8) 

**FUNCTION**

Removes a [Bob](_00C3) immediately by uncoupling it from the gel list and
erases it from the [RastPort](_00AF).

**INPUTS**

bob = pointer to the [Bob](_00C3) to be removed
rp  = pointer to the [RastPort](_00AF) if the [Bob](_00C3) is to be erased
vp  = pointer to the [ViewPort](_00B8) for beam-synchronizing

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [RemVSprite](RemVSprite)  [graphics/gels.h](_00C3)
