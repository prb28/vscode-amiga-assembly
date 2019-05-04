
**NAME**

ObtainGIRPort -- Set up a [RastPort](_00AF) for a custom gadget. (V36)

**SYNOPSIS**

```c
    RPort = ObtainGIRPort( GInfo )
    D0                     A0

    struct RastPort *ObtainGIRPort( struct GadgetInfo * );

```
Links: [RastPort](_00AF) [GadgetInfo](_00D2) 

**FUNCTION**

Sets up a [RastPort](_00AF) for use (only) by custom gadget hook routines.
This function must be called EACH time a hook routine needing
to perform gadget rendering is called, and must be accompanied
by a corresponding call to [ReleaseGIRPort](ReleaseGIRPort).

Note that if a hook function passes you a [RastPort](_00AF) pointer,
e.g., GM_RENDER, you needn't call ObtainGIRPort() in that case.

**INPUTS**

A pointer to a [GadgetInfo](_00D2) structure, as passed to each custom
gadget hook function.

RESULT
A pointer to a [RastPort](_00AF) that may be used for gadget rendering.
This pointer may be NULL, in which case you should do no rendering.
You may (optionally) pass a null return value to [ReleaseGIRPort](ReleaseGIRPort).

BUGS

**SEE ALSO**

[ReleaseGIRPort](ReleaseGIRPort), [Custom](_00CD) [Gadget](_00D4) documentation
