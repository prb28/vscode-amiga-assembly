
**NAME**

FreeGBuffers -- Deallocate memory obtained by GetGBufers.

**SYNOPSIS**

```c
    FreeGBuffers(anOb, rp, db)
                 A0    A1  D0

    void FreeGBuffers(struct AnimOb *, struct RastPort *, BOOL);

```
Links: [AnimOb](_OOCS) [RastPort](_OOAF) 

**FUNCTION**

For each sequence of each component of the [AnimOb](_OOCS),
deallocate memory for:
SaveBuffer
BorderLine
CollMask and ImageShadow (point to same buffer)
if db is set (user had used double-buffering) deallocate:
[DBufPacket](_OOCS)
BufBuffer

**INPUTS**

anOb = pointer to the [AnimOb](_OOCS) structure
rp   = pointer to the current [RastPort](_OOAF)
db   = double-buffer indicator (set TRUE for double-buffering)

RESULT

BUGS

**SEE ALSO**

[GetGBuffers](GetGBuffers)  [graphics/gels.h](_OOCS)  [graphics/rastport.h](_OOAF)
