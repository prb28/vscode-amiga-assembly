
**NAME**

WaitBOVP -- Wait till vertical beam reached bottom of
this viewport.

**SYNOPSIS**

```c
    WaitBOVP( vp )
              a0

    void WaitBOVP( struct ViewPort * );

```
Links: [ViewPort](_00B8) 

**FUNCTION**

Returns when the vertical beam has reached the bottom of this viewport

**INPUTS**

vp - pointer to [ViewPort](_00B8) structure

RESULT
This function will return sometime after the beam gets beyond
the bottom of the viewport.  Depending on the multitasking load
of the system, the actual beam position may be different than
what would be expected in a lightly loaded system.

BUGS
Horrors! This function currently busy waits waiting for the
beam to get to the right place.  It should use the copper
interrupt to trigger and send signals like [WaitTOF](WaitTOF) does.

**SEE ALSO**

[WaitTOF](WaitTOF) [VBeamPos](VBeamPos)
