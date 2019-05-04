
**NAME**

SortGList -- Sort the current gel list, ordering its y,x coordinates.

**SYNOPSIS**

```c
    SortGList(rp)
              A1

    void SortGList(struct RastPort *);

```
Links: [RastPort](_00AF) 

**FUNCTION**

Sorts the current gel list according to the gels' y,x coordinates.
This sorting is essential before calls to [DrawGList](DrawGList) or [DoCollision](DoCollision).

**INPUTS**

rp = pointer to the [RastPort](_00AF) structure containing the [GelsInfo](_00AF)

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels)  [DoCollision](DoCollision)  [DrawGList](DrawGList)  [graphics/rastport.h](_00AF)
