
**NAME**

AllocVec -- allocate memory and keep track of the size  (V36)

**SYNOPSIS**

```c
    memoryBlock = AllocVec(byteSize, attributes)
    D0                     D0        D1

    void *AllocVec(ULONG, ULONG);

```
**FUNCTION**

This function works identically to [AllocMem](AllocMem.md), but tracks the size
of the allocation.

See the [AllocMem](AllocMem.md) documentation for details.

**WARNING**

The result of any memory allocation MUST be checked, and a viable
error handling path taken.  ANY allocation may fail if memory has
been filled.

**SEE ALSO**

[FreeVec](FreeVec.md), [AllocMem](AllocMem.md)
