
**NAME**

FreeVPortCopLists -- deallocate all intermediate copper lists and
their headers from a viewport

**SYNOPSIS**

```c
    FreeVPortCopLists(vp)
                     a0

    void FreeVPortCopLists(struct ViewPort *);

```
Links: [ViewPort](_00B8) 

**FUNCTION**

Search display, color, sprite, and user copper
lists and call [FreeMem](../exec/FreeMem) to deallocate them from memory

**INPUTS**

vp - pointer to [ViewPort](_00B8) structure

**RESULTS**

The memory allocated to the various copper lists will be returned
to the system's free memory pool, and the following fields in
the viewport structure will be set to NULL:

DspIns, Sprins, ClrIns, UCopIns

BUGS
none known

**SEE ALSO**

[graphics/view.h](_00B8)
