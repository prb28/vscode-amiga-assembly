
**NAME**

FreeEntry -- free many regions of memory

**SYNOPSIS**

```
    FreeEntry(memList)
              A0
```
void FreeEntry(struct [MemList](MemList) *);

**FUNCTION**

This function takes a memList structure (as returned by AllocEntry)
and frees all the entries.

**INPUTS**

memList -- pointer to structure filled in with [MemEntry](MemEntry)
structures

**SEE ALSO**

[AllocEntry](AllocEntry)
