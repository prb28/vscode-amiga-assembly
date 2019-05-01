
**NAME**

VBeamPos -- Get vertical beam position at this instant.

**SYNOPSIS**

```c
    pos = VBeamPos()
     d0

    LONG VBeamPos( void );

```
**FUNCTION**

Get the vertical beam position from the hardware.

**INPUTS**

none

RESULT
interrogates hardware for beam position and returns value.
valid results in are the range of 0-511.
Because of multitasking, the actual value returned may have
no use. If you are the highest priority task then the value
returned should be close, within 1 line.

BUGS

**SEE ALSO**

