
**NAME**

ObtainGIRPort -- Set up a [RastPort](_00AF.md) for a custom gadget. (V36)

**SYNOPSIS**

```c
    RPort = ObtainGIRPort( GInfo )
    D0                     A0

    struct RastPort *ObtainGIRPort( struct GadgetInfo * );

```
Links: [RastPort](_00AF.md) [GadgetInfo](_00D2.md) 

**FUNCTION**

Sets up a [RastPort](_00AF.md) for use (only) by custom gadget hook routines.
This function must be called EACH time a hook routine needing
to perform gadget rendering is called, and must be accompanied
by a corresponding call to [ReleaseGIRPort](ReleaseGIRPort.md).

Note that if a hook function passes you a [RastPort](_00AF.md) pointer,
e.g., GM_RENDER, you needn't call ObtainGIRPort() in that case.

**INPUTS**

A pointer to a [GadgetInfo](_00D2.md) structure, as passed to each custom
gadget hook function.

RESULT
A pointer to a [RastPort](_00AF.md) that may be used for gadget rendering.
This pointer may be NULL, in which case you should do no rendering.
You may (optionally) pass a null return value to [ReleaseGIRPort](ReleaseGIRPort.md).

BUGS

**SEE ALSO**

[ReleaseGIRPort](ReleaseGIRPort.md), [Custom](_00CD.md) [Gadget](_00D4.md) documentation
