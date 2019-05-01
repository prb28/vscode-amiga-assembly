
**NAME**

AddAnimOb  --  Add an [AnimOb](_OOCS) to the linked list of AnimObs.

**SYNOPSIS**

```c
    AddAnimOb(anOb, anKey, rp)
              A0    A1     A2

    void AddAnimOb(struct AnimOb *,struct AnimOb **, struct RastPort *);

```
Links: [AnimOb](_OOCS) [AnimOb](_OOCS) [RastPort](_OOAF) 

**FUNCTION**

Links this [AnimOb](_OOCS) into the current list pointed to by animKey.
Initializes all the Timers of the AnimOb's components.
Calls [AddBob](AddBob) with each component's [Bob](_OOCS).
rp-&#062;GelsInfo must point to an initialized [GelsInfo](_OOAF) structure.

**INPUTS**

anOb  = pointer to the [AnimOb](_OOCS) structure to be added to the list
anKey = address of a pointer to the first [AnimOb](_OOCS) in the list
(anKey = NULL if there are no AnimObs in the list so far)
rp    = pointer to a valid [RastPort](_OOAF)

RESULT

BUGS

**SEE ALSO**

[Animate](Animate) [graphics/rastport.h](_OOAF) [graphics/gels.h](_OOCS)
