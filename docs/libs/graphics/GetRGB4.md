
**NAME**

GetRGB4 -- Inquire value of entry in [ColorMap](_OOBX).

**SYNOPSIS**

```c
    value = GetRGB4( colormap, entry )
      d0              a0       d0

    ULONG GetRGB4(struct ColorMap *, LONG);

```
Links: [ColorMap](_OOBX) 

**FUNCTION**

Read and format a value from the [ColorMap](_OOBX).

**INPUTS**

colormap - pointer to [ColorMap](_OOBX) structure
entry - index into colormap

RESULT
returns -1 if no valid entry
return UWORD RGB value 4 bits per gun right justified

NOTE
Intuition's [DisplayBeep](_OROC) changes color 0. Reading Color 0 during a
[DisplayBeep](_OROC) will lead to incorrect results.

BUGS

**SEE ALSO**

[SetRGB4](SetRGB4) [LoadRGB4](LoadRGB4) [GetColorMap](GetColorMap) [FreeColorMap](FreeColorMap) [graphics/view.h](_OOBX)
