
**NAME**

FreeCopList -- deallocate intermediate copper list

**SYNOPSIS**

```c
    FreeCopList(coplist)
                  a0

    void FreeCopList( struct CopList *);

```
Links: [CopList](_00AD.md) 

**FUNCTION**

Deallocate all memory associated with this copper list.

**INPUTS**

coplist  - pointer to structure [CopList](_00AD.md)

**RESULTS**

memory returned to memory manager

BUGS

**SEE ALSO**

[graphics/copper.h](_00AD.md)
