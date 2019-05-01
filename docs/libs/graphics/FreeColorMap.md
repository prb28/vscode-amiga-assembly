
**NAME**

FreeColorMap -- Free the [ColorMap](_OOBX) structure and return memory
to free memory pool.

**SYNOPSIS**

```c
    FreeColorMap( colormap )
                   a0

    void FreeColorMap(struct ColorMap *);

```
Links: [ColorMap](_OOBX) 

**FUNCTION**

Return the memory to the free memory pool that was allocated
with [GetColorMap](GetColorMap).

**INPUTS**

colormap - pointer to [ColorMap](_OOBX) allocated with [GetColorMap](GetColorMap)

RESULT
The space is made available for others to use.

BUGS

**SEE ALSO**

[SetRGB4](SetRGB4) [GetColorMap](GetColorMap) [graphics/view.h](_OOBX)
