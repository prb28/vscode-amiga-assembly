
**NAME**

Animate  --  Processes every [AnimOb](_OOCS) in the current animation list.

**SYNOPSIS**

```c
    Animate(anKey, rp)
            A0     A1

    void Animate(struct AnimOb **, struct RastPort *);

```
Links: [AnimOb](_OOCS) [RastPort](_OOAF) 

**FUNCTION**

For every [AnimOb](_OOCS) in the list
- update its location and velocities
- call the AnimOb's special routine if one is supplied
- for each component of the [AnimOb](_OOCS)
- if this sequence times out, switch to the new one
- call this component's special routine if one is supplied
- set the sequence's VSprite's y,x coordinates based
on whatever these routines cause

**INPUTS**

ankey = address of the variable that points to the head [AnimOb](_OOCS)
rp    = pointer to the [RastPort](_OOAF) structure

RESULT

BUGS

**SEE ALSO**

[AddAnimOb](AddAnimOb) [graphics/gels.h](_OOCS) [graphics/rastport.h](_OOAF)
