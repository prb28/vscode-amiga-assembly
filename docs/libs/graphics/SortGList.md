
**NAME**

SortGList -- Sort the current gel list, ordering its y,x coordinates.

**SYNOPSIS**

```c
    SortGList(rp)
              A1

    void SortGList(struct RastPort *);

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

Sorts the current gel list according to the gels' y,x coordinates.
This sorting is essential before calls to [DrawGList](DrawGList.md) or [DoCollision](DoCollision.md).

**INPUTS**

rp = pointer to the [RastPort](_00AF.md) structure containing the [GelsInfo](_00AF.md)

RESULT

BUGS

**SEE ALSO**

[InitGels](InitGels.md)  [DoCollision](DoCollision.md)  [DrawGList](DrawGList.md)  [graphics/rastport.h](_00AF.md)
