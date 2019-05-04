
**NAME**

AllocRaster -- Allocate space for a bitplane.

**SYNOPSIS**

```c
    planeptr = AllocRaster( width, height )
       d0                    d0:16  d1:16

    PLANEPTR AllocRaster(UWORD,UWORD);

```
**FUNCTION**

This function calls the memory allocation routines
to allocate memory space for a bitplane width bits
wide and height bits high.

**INPUTS**

width   - number of bits wide for bitplane
height  - number of rows in bitplane

RESULT
planeptr - pointer to first word in bitplane, or NULL if
it was not possible to allocate the desired
amount of memory.
BUGS

**SEE ALSO**

[FreeRaster](FreeRaster) [graphics/gfx.h](_00A6)
