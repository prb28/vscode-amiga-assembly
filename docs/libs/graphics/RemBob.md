
**NAME**

RemBob -- Macro to remove a [Bob](_00C3.md) from the gel list.

**SYNOPSIS**

```c
    RemBob(bob)

    RemBob(struct Bob *);

```
Links: [Bob](_00C3.md) 

**FUNCTION**

Marks a [Bob](_00C3.md) as no-longer-required.  The gels internal code then
removes the [Bob](_00C3.md) from the list of active gels the next time
[DrawGList](DrawGList.md) is executed. This is implemented as a macro.
If the user is double-buffering the [Bob](_00C3.md), it could take two
calls to [DrawGList](DrawGList.md) before the [Bob](_00C3.md) actually disappears from
the [RastPort](_00AF.md).

**INPUTS**

[Bob](_00C3.md) = pointer to the [Bob](_00C3.md) to be removed

RESULT

BUGS

**SEE ALSO**

[RemIBob](RemIBob.md)  [DrawGList](DrawGList.md)  [graphics/gels.h](_00C3.md)  [graphics/gfxmacros.h](_00B6.md)
