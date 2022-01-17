
**NAME**

GetRGB4 -- Inquire value of entry in [ColorMap](_00B8.md).

**SYNOPSIS**

```c
    value = GetRGB4( colormap, entry )
      d0              a0       d0

    ULONG GetRGB4(struct ColorMap *, LONG);

```
Links: [ColorMap](_00B8.md) 

**FUNCTION**

Read and format a value from the [ColorMap](_00B8.md).

**INPUTS**

colormap - pointer to [ColorMap](_00B8.md) structure
entry - index into colormap

RESULT
returns -1 if no valid entry
return UWORD RGB value 4 bits per gun right justified

NOTE
Intuition's [DisplayBeep](../intuition/DisplayBeep.md) changes color 0. Reading Color 0 during a
[DisplayBeep](../intuition/DisplayBeep.md) will lead to incorrect results.

BUGS

**SEE ALSO**

[SetRGB4](SetRGB4.md) [LoadRGB4](LoadRGB4.md) [GetColorMap](GetColorMap.md) [FreeColorMap](FreeColorMap.md) [graphics/view.h](_00B8.md)
