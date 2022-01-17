
**NAME**

ReleaseGIRPort -- Release a custom gadget [RastPort](_00AF.md). (V36)

**SYNOPSIS**

```c
    ReleaseGIRPort( RPort )
                    A0

    VOID ReleaseGIRPort( struct RastPort * );

```
Links: [RastPort](_00AF.md) 

**FUNCTION**

The corresponding function to [ObtainGIRPort](ObtainGIRPort.md), it releases
arbitration used by Intuition for gadget RastPorts.

**INPUTS**

Pointer to the [RastPort](_00AF.md) returned by [ObtainGIRPort](ObtainGIRPort.md).
This pointer can be NULL, in which case nothing happens.

RESULT
None

BUGS

**SEE ALSO**

[ObtainGIRPort](ObtainGIRPort.md), [Custom](_00CD.md) [Gadget](_00D4.md) documentation
