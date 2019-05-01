
**NAME**

FreeCopList -- deallocate intermediate copper list

**SYNOPSIS**

```c
    FreeCopList(coplist)
                  a0

    void FreeCopList( struct CopList *);

```
Links: [CopList](_OOAD) 

**FUNCTION**

Deallocate all memory associated with this copper list.

**INPUTS**

coplist  - pointer to structure [CopList](_OOAD)

**RESULTS**

memory returned to memory manager

BUGS

**SEE ALSO**

[graphics/copper.h](_OOAD)
