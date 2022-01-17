
**NAME**

ResetMenuStrip -- Re-attach a menu strip to a window. (V36)

**SYNOPSIS**

```c
    Success = ResetMenuStrip( Window, Menu )
    D0                        A0      A1

    BOOL ResetMenuStrip( struct Window *, struct Menu * );

```
Links: [Window](_00D4.md) [Menu](_00D4.md) [Window](_00D4.md) [Menu](_00D4.md) 

**FUNCTION**

This function is simply a &#034;fast&#034; version of [SetMenuStrip](SetMenuStrip.md) that
doesn't perform the precalculations of menu page sizes that
[SetMenuStrip](SetMenuStrip.md) does.

You may call this function ONLY IF the menu strip and all items
and sub-items have not changed since the menu strip was passed to
[SetMenuStrip](SetMenuStrip.md), with the following exceptions:

- You may change the CHECKED flag to turn a checkmark on or off.
- You may change the ITEMENABLED flag to enable/disable some
[MenuItem](_00D4.md) or [Menu](_00D4.md) structures.

In all other ways, this function performs like [SetMenuStrip](SetMenuStrip.md).

The new sequence of events you can use is:
- [OpenWindow](OpenWindow.md)
- [SetMenuStrip](SetMenuStrip.md)
zero or more iterations of:
- [ClearMenuStrip](ClearMenuStrip.md)
- change CHECKED or ITEMENABLED flags
- ResetMenuStrip()
- [ClearMenuStrip](ClearMenuStrip.md)
- [CloseWindow](CloseWindow.md)

**INPUTS**

[Window](_00D4.md) = pointer to a [Window](_00D4.md) structure
[Menu](_00D4.md) = pointer to the first menu in the menu strip

RESULT
TRUE always.

BUGS

**SEE ALSO**

[SetMenuStrip](SetMenuStrip.md), [ClearMenuStrip](ClearMenuStrip.md)
