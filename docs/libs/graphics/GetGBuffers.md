
**NAME**

GetGBuffers -- Attempt to allocate ALL buffers of an entire [AnimOb](_00C3.md).

**SYNOPSIS**

```c
    status = GetGBuffers(anOb, rp, db)
    D0                   A0    A1  D0

    BOOL GetGBuffers(struct AnimOb *, struct RastPort *, BOOL);

```
Links: [AnimOb](_00C3.md) [RastPort](_00AF.md) 

**FUNCTION**

For each sequence of each component of the [AnimOb](_00C3.md), allocate memory for:
SaveBuffer
BorderLine
CollMask and ImageShadow (point to same buffer)
if db is set TRUE (user wants double-buffering) allocate:
[DBufPacket](_00C3.md)
BufBuffer

**INPUTS**

anOb = pointer to the [AnimOb](_00C3.md) structure
rp   = pointer to the current [RastPort](_00AF.md)
db   = double-buffer indicator (set TRUE for double-buffering)

RESULT
status = TRUE if the memory allocations were all successful, else FALSE

BUGS
If any of the memory allocations fail it does not free the partial
allocations that did succeed.

**SEE ALSO**

[FreeGBuffers](FreeGBuffers.md) [graphics/gels.h](_00C3.md)
