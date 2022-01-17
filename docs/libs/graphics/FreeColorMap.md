
**NAME**

FreeColorMap -- Free the [ColorMap](_00B8.md) structure and return memory
to free memory pool.

**SYNOPSIS**

```c
    FreeColorMap( colormap )
                   a0

    void FreeColorMap(struct ColorMap *);

```
Links: [ColorMap](_00B8.md) 

**FUNCTION**

Return the memory to the free memory pool that was allocated
with [GetColorMap](GetColorMap.md).

**INPUTS**

colormap - pointer to [ColorMap](_00B8.md) allocated with [GetColorMap](GetColorMap.md)

RESULT
The space is made available for others to use.

BUGS

**SEE ALSO**

[SetRGB4](SetRGB4.md) [GetColorMap](GetColorMap.md) [graphics/view.h](_00B8.md)
