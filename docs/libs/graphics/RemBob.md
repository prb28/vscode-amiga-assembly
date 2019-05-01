
**NAME**

RemBob -- Macro to remove a [Bob](_OOCS) from the gel list.

**SYNOPSIS**

```c
    RemBob(bob)

    RemBob(struct Bob *);

```
Links: [Bob](_OOCS) 

**FUNCTION**

Marks a [Bob](_OOCS) as no-longer-required.  The gels internal code then
removes the [Bob](_OOCS) from the list of active gels the next time
[DrawGList](DrawGList) is executed. This is implemented as a macro.
If the user is double-buffering the [Bob](_OOCS), it could take two
calls to [DrawGList](DrawGList) before the [Bob](_OOCS) actually disappears from
the [RastPort](_OOAF).

**INPUTS**

[Bob](_OOCS) = pointer to the [Bob](_OOCS) to be removed

RESULT

BUGS

**SEE ALSO**

[RemIBob](RemIBob)  [DrawGList](DrawGList)  [graphics/gels.h](_OOCS)  [graphics/gfxmacros.h](_OOBV)
