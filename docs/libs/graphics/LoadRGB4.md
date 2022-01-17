
**NAME**

LoadRGB4 -- Load RGB color values from table.

**SYNOPSIS**

```c
    LoadRGB4( vp, colors , count )
             a0     a1     d0:16

    void LoadRGB4( struct ViewPort *, UWORD *, WORD);

```
Links: [ViewPort](_00B8.md) 

**FUNCTION**

load the count words of the colormap from table starting at
entry 0.

**INPUTS**

vp - pointer to [ViewPort](_00B8.md), whose colors you wish to change
colors - pointer to table of RGB values set up as an array
of USHORTS
background--  0x0RGB
color1    --  0x0RGB
color2    --  0x0RGB
etc.         UWORD per value.
The colors are interpreted as 15 = maximum intensity.
0 = minimum intensity.
count   = number of UWORDs in the table to load into the
colormap starting at color 0(background) and proceeding
to the next higher color number

**RESULTS**

The [ViewPort](_00B8.md) should have a pointer to a valid [ColorMap](_00B8.md) to store
the colors in.
Updates the hardware copperlist to reflect the new colors.
Updates the intermediate copperlist with the new colors.

BUGS

NOTE: With V36 and up, it is not safe to call this function
from an interrupt, because of the semaphore locking on graphics
copper lists.

**SEE ALSO**

[SetRGB4](SetRGB4.md) [GetRGB4](GetRGB4.md) [GetColorMap](GetColorMap.md) [graphics/view.h](_00B8.md)
