
**NAME**

TypeOfMem -- determine attributes of a given memory address

**SYNOPSIS**

```c
    attributes = TypeOfMem(address)
    D0                     A1

    ULONG TypeOfMem(void *);

```
**FUNCTION**

Given a RAM memory address, search the system memory lists and
return its memory attributes.  The memory attributes are similar to
those specified when the memory was first allocated: (eg. MEMF_CHIP
and MEMF_FAST).

This function is usually used to determine if a particular block of
memory is within CHIP space.

If the address is not in known-space, a zero will be returned.
(Anything that is not RAM, like the ROM or expansion area, will
return zero.  Also the first few bytes of a memory area are used up
by the MemHeader.)

INPUT
address - a memory address

RESULT
attributes - a long word of memory attribute flags.
If the address is not in known RAM, zero is returned.

**SEE ALSO**

[AllocMem](AllocMem.md)
