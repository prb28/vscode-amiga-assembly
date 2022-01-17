
**NAME**

FreeGBuffers -- Deallocate memory obtained by GetGBufers.

**SYNOPSIS**

```c
    FreeGBuffers(anOb, rp, db)
                 A0    A1  D0

    void FreeGBuffers(struct AnimOb *, struct RastPort *, BOOL);

```
Links: [AnimOb](_00C3.md) [RastPort](_00AF.md) 

**FUNCTION**

For each sequence of each component of the [AnimOb](_00C3.md),
deallocate memory for:
SaveBuffer
BorderLine
CollMask and ImageShadow (point to same buffer)
if db is set (user had used double-buffering) deallocate:
[DBufPacket](_00C3.md)
BufBuffer

**INPUTS**

anOb = pointer to the [AnimOb](_00C3.md) structure
rp   = pointer to the current [RastPort](_00AF.md)
db   = double-buffer indicator (set TRUE for double-buffering)

RESULT

BUGS

**SEE ALSO**

[GetGBuffers](GetGBuffers.md)  [graphics/gels.h](_00C3.md)  [graphics/rastport.h](_00AF.md)
