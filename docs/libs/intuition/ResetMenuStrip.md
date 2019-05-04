
**NAME**

ResetMenuStrip -- Re-attach a menu strip to a window. (V36)

**SYNOPSIS**

```c
    Success = ResetMenuStrip( Window, Menu )
    D0                        A0      A1

    BOOL ResetMenuStrip( struct Window *, struct Menu * );

```
Links: [Window](_00D4) [Menu](_00D4) [Window](_00D4) [Menu](_00D4) 

**FUNCTION**

This function is simply a &#034;fast&#034; version of [SetMenuStrip](SetMenuStrip) that
doesn't perform the precalculations of menu page sizes that
[SetMenuStrip](SetMenuStrip) does.

You may call this function ONLY IF the menu strip and all items
and sub-items have not changed since the menu strip was passed to
[SetMenuStrip](SetMenuStrip), with the following exceptions:

- You may change the CHECKED flag to turn a checkmark on or off.
- You may change the ITEMENABLED flag to enable/disable some
[MenuItem](_00D4) or [Menu](_00D4) structures.

In all other ways, this function performs like [SetMenuStrip](SetMenuStrip).

The new sequence of events you can use is:
- [OpenWindow](OpenWindow)
- [SetMenuStrip](SetMenuStrip)
zero or more iterations of:
- [ClearMenuStrip](ClearMenuStrip)
- change CHECKED or ITEMENABLED flags
- ResetMenuStrip()
- [ClearMenuStrip](ClearMenuStrip)
- [CloseWindow](CloseWindow)

**INPUTS**

[Window](_00D4) = pointer to a [Window](_00D4) structure
[Menu](_00D4) = pointer to the first menu in the menu strip

RESULT
TRUE always.

BUGS

**SEE ALSO**

[SetMenuStrip](SetMenuStrip), [ClearMenuStrip](ClearMenuStrip)
