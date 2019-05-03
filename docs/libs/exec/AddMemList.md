
**NAME**

AddMemList - add memory to the system free pool

**SYNOPSIS**

```c
    AddMemList( size, attributes, pri, base, name )
                 D0      D1        D2   A0    A1

    void AddMemList(ULONG, ULONG, LONG, APTR, STRPTR);

```
**FUNCTION**

Add a new region of memory to the system free pool.  The first few
bytes will be used to hold the [MemHeader](_0089) structure.  The remainder
will be made available to the rest of the world.

**INPUTS**

size - the size (in bytes) of the memory area
attributes - the attributes word that the memory pool will have
pri  - the priority for this memory.  CHIP memory has a pri of -10,
16 bit expansion memory has a priority of 0.  The higher the
priority, the closer to the head of the memory list it will
be placed.
base - the base of the new memory area
name - the name that will be used in the memory header, or NULL
if no name is to be provided.  This name is not copied, so it
must remain valid for as long as the memory header is in the
system.

**SEE ALSO**

[AllocMem](AllocMem), [exec/memory.h](_0089)
