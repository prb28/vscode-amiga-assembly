
**NAME**

FreeEntry -- free many regions of memory

**SYNOPSIS**

```c
    FreeEntry(memList)
              A0
    void FreeEntry(struct MemList *);

```
Links: [MemList](_0089.md) 

**FUNCTION**

This function takes a memList structure (as returned by AllocEntry)
and frees all the entries.

**INPUTS**

memList -- pointer to structure filled in with [MemEntry](_0089.md)
structures

**SEE ALSO**

[AllocEntry](AllocEntry.md)
