
**NAME**

GetGBuffers -- Attempt to allocate ALL buffers of an entire [AnimOb](_OOCS).

**SYNOPSIS**

```c
    status = GetGBuffers(anOb, rp, db)
    D0                   A0    A1  D0

    BOOL GetGBuffers(struct AnimOb *, struct RastPort *, BOOL);

```
Links: [AnimOb](_OOCS) [RastPort](_OOAF) 

**FUNCTION**

For each sequence of each component of the [AnimOb](_OOCS), allocate memory for:
SaveBuffer
BorderLine
CollMask and ImageShadow (point to same buffer)
if db is set TRUE (user wants double-buffering) allocate:
[DBufPacket](_OOCS)
BufBuffer

**INPUTS**

anOb = pointer to the [AnimOb](_OOCS) structure
rp   = pointer to the current [RastPort](_OOAF)
db   = double-buffer indicator (set TRUE for double-buffering)

RESULT
status = TRUE if the memory allocations were all successful, else FALSE

BUGS
If any of the memory allocations fail it does not free the partial
allocations that did succeed.

**SEE ALSO**

[FreeGBuffers](FreeGBuffers) [graphics/gels.h](_OOCS)
