
**NAME**

ReleaseGIRPort -- Release a custom gadget [RastPort](_00AF). (V36)

**SYNOPSIS**

```c
    ReleaseGIRPort( RPort )
                    A0

    VOID ReleaseGIRPort( struct RastPort * );

```
Links: [RastPort](_00AF) 

**FUNCTION**

The corresponding function to [ObtainGIRPort](ObtainGIRPort), it releases
arbitration used by Intuition for gadget RastPorts.

**INPUTS**

Pointer to the [RastPort](_00AF) returned by [ObtainGIRPort](ObtainGIRPort).
This pointer can be NULL, in which case nothing happens.

RESULT
None

BUGS

**SEE ALSO**

[ObtainGIRPort](ObtainGIRPort), [Custom](_00CD) [Gadget](_00D4) documentation
