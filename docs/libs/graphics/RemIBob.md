
**NAME**

RemIBob -- Immediately remove a [Bob](_00C3.md) from the gel list and the [RastPort](_00AF.md).

**SYNOPSIS**

```c
    RemIBob(bob, rp, vp)
            A0   A1  A2

    void RemIBob(struct Bob *, struct RastPort *, struct ViewPort *);

```
Links: [Bob](_00C3.md) [RastPort](_00AF.md) [ViewPort](_00B8.md) 

**FUNCTION**

Removes a [Bob](_00C3.md) immediately by uncoupling it from the gel list and
erases it from the [RastPort](_00AF.md).

**INPUTS**

bob = pointer to the [Bob](_00C3.md) to be removed
rp  = pointer to the [RastPort](_00AF.md) if the [Bob](_00C3.md) is to be erased
vp  = pointer to the [ViewPort](_00B8.md) for beam-synchronizing

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels.md)  [RemVSprite](RemVSprite.md)  [graphics/gels.h](_00C3.md)
