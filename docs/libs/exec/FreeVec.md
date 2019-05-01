
**NAME**

FreeVec -- return [AllocVec](AllocVec) memory to the system  (V36)

**SYNOPSIS**

```c
    FreeVec(memoryBlock)
            A1

    void FreeVec(void *);

```
**FUNCTION**

Free an allocation made by the [AllocVec](AllocVec) call.  The memory will
be returned to the system pool from which it came.

NOTE
If a block of memory is freed twice, the system will Guru. The
Alert is AN_FreeTwice ($01000009).   If you pass the wrong pointer,
you will probably see AN_MemCorrupt $01000005.  Future versions may
add more sanity checks to the memory lists.

**INPUTS**

memoryBlock - pointer to the memory block to free, or NULL.

**SEE ALSO**

[AllocVec](AllocVec)
