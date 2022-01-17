
**NAME**

ZipWindow -- Change window to &#034;alternate&#034; position and
dimensions. (V36)

**SYNOPSIS**

```c
    ZipWindow( Window )
               A0

    VOID ZipWindow( struct Window * );

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

Changes the position and dimension of a window to the values
at the last occasion of ZipWindow being called (or invoked
via the &#034;zoom&#034; gadget).

Typically this is used to snap between a normal, large, working
dimension of the window to a smaller, more innocuous position
and dimension.

Like [MoveWindow](MoveWindow.md), [SizeWindow](SizeWindow.md), and [ChangeWindowBox](ChangeWindowBox.md), the action of
this function is deferred to the Intuition input handler.

More tuning needs to be done to establish initial values for
the first invocation of this function for a window.  You can
provide initial values using the [OpenWindow](OpenWindow.md) tag item
WA_Zoom.

It could also use a new name, but &#034;ZoomWindow&#034; is misleading,
since &#034;Zoom&#034; normally implies &#034;scale.&#034;

The zoom gadget will appear (in the place of the old &#034;toback&#034;
gadget) when you open your window if you either specify a
sizing gadget or use WA_Zoom.

You can detect that this function has taken effect by receiving
an IDCMP_CHANGEWINDOW IDCMP message.

**INPUTS**

[Window](_00D4.md) -- window to be changed.

RESULT
None

BUGS
[OpenWindow](OpenWindow.md) assumes that the proper default &#034;other&#034; dimensions
are &#034;full size.&#034;

**SEE ALSO**

[ChangeWindowBox](ChangeWindowBox.md), [MoveWindow](MoveWindow.md), [SizeWindow](SizeWindow.md)
