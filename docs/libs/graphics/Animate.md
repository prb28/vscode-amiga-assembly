
**NAME**

Animate  --  Processes every [AnimOb](_00C3.md) in the current animation list.

**SYNOPSIS**

```c
    Animate(anKey, rp)
            A0     A1

    void Animate(struct AnimOb **, struct RastPort *);

```
Links: [AnimOb](_00C3.md) [RastPort](_00AF.md) 

**FUNCTION**

For every [AnimOb](_00C3.md) in the list
- update its location and velocities
- call the AnimOb's special routine if one is supplied
- for each component of the [AnimOb](_00C3.md)
- if this sequence times out, switch to the new one
- call this component's special routine if one is supplied
- set the sequence's VSprite's y,x coordinates based
on whatever these routines cause

**INPUTS**

ankey = address of the variable that points to the head [AnimOb](_00C3.md)
rp    = pointer to the [RastPort](_00AF.md) structure

RESULT

BUGS

**SEE ALSO**

[AddAnimOb](AddAnimOb.md) [graphics/gels.h](_00C3.md) [graphics/rastport.h](_00AF.md)
