
**NAME**

AddAnimOb  --  Add an [AnimOb](_00C3.md) to the linked list of AnimObs.

**SYNOPSIS**

```c
    AddAnimOb(anOb, anKey, rp)
              A0    A1     A2

    void AddAnimOb(struct AnimOb *,struct AnimOb **, struct RastPort *);

```
Links: [AnimOb](_00C3.md) [AnimOb](_00C3.md) [RastPort](_00AF.md) 

**FUNCTION**

Links this [AnimOb](_00C3.md) into the current list pointed to by animKey.
Initializes all the Timers of the AnimOb's components.
Calls [AddBob](AddBob.md) with each component's [Bob](_00C3.md).
rp-&#062;GelsInfo must point to an initialized [GelsInfo](_00AF.md) structure.

**INPUTS**

anOb  = pointer to the [AnimOb](_00C3.md) structure to be added to the list
anKey = address of a pointer to the first [AnimOb](_00C3.md) in the list
(anKey = NULL if there are no AnimObs in the list so far)
rp    = pointer to a valid [RastPort](_00AF.md)

RESULT

BUGS

**SEE ALSO**

[Animate](Animate.md) [graphics/rastport.h](_00AF.md) [graphics/gels.h](_00C3.md)
