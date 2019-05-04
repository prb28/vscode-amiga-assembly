
**NAME**

GetRGB4 -- Inquire value of entry in [ColorMap](_00B8).

**SYNOPSIS**

```c
    value = GetRGB4( colormap, entry )
      d0              a0       d0

    ULONG GetRGB4(struct ColorMap *, LONG);

```
Links: [ColorMap](_00B8) 

**FUNCTION**

Read and format a value from the [ColorMap](_00B8).

**INPUTS**

colormap - pointer to [ColorMap](_00B8) structure
entry - index into colormap

RESULT
returns -1 if no valid entry
return UWORD RGB value 4 bits per gun right justified

NOTE
Intuition's [DisplayBeep](../intuition/DisplayBeep) changes color 0. Reading Color 0 during a
[DisplayBeep](../intuition/DisplayBeep) will lead to incorrect results.

BUGS

**SEE ALSO**

[SetRGB4](SetRGB4) [LoadRGB4](LoadRGB4) [GetColorMap](GetColorMap) [FreeColorMap](FreeColorMap) [graphics/view.h](_00B8)
