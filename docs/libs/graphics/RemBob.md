
**NAME**

RemBob -- Macro to remove a [Bob](_00C3) from the gel list.

**SYNOPSIS**

```c
    RemBob(bob)

    RemBob(struct Bob *);

```
Links: [Bob](_00C3) 

**FUNCTION**

Marks a [Bob](_00C3) as no-longer-required.  The gels internal code then
removes the [Bob](_00C3) from the list of active gels the next time
[DrawGList](DrawGList) is executed. This is implemented as a macro.
If the user is double-buffering the [Bob](_00C3), it could take two
calls to [DrawGList](DrawGList) before the [Bob](_00C3) actually disappears from
the [RastPort](_00AF).

**INPUTS**

[Bob](_00C3) = pointer to the [Bob](_00C3) to be removed

RESULT

BUGS

**SEE ALSO**

[RemIBob](RemIBob)  [DrawGList](DrawGList)  [graphics/gels.h](_00C3)  [graphics/gfxmacros.h](_00B6)
