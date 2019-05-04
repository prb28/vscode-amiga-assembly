
**NAME**

Animate  --  Processes every [AnimOb](_00C3) in the current animation list.

**SYNOPSIS**

```c
    Animate(anKey, rp)
            A0     A1

    void Animate(struct AnimOb **, struct RastPort *);

```
Links: [AnimOb](_00C3) [RastPort](_00AF) 

**FUNCTION**

For every [AnimOb](_00C3) in the list
- update its location and velocities
- call the AnimOb's special routine if one is supplied
- for each component of the [AnimOb](_00C3)
- if this sequence times out, switch to the new one
- call this component's special routine if one is supplied
- set the sequence's VSprite's y,x coordinates based
on whatever these routines cause

**INPUTS**

ankey = address of the variable that points to the head [AnimOb](_00C3)
rp    = pointer to the [RastPort](_00AF) structure

RESULT

BUGS

**SEE ALSO**

[AddAnimOb](AddAnimOb) [graphics/gels.h](_00C3) [graphics/rastport.h](_00AF)
