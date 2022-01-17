
**NAME**

Request -- Activate a requester.

**SYNOPSIS**

```c
    Success = Request( Requester, Window )
    D0                 A0         A1

    BOOL Request( struct Requester *, struct Window * );

```
Links: [Requester](_00D4.md) [Window](_00D4.md) [Requester](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

Links in and displays a requester into the specified window.

This routine ignores the window's IDCMP_REQVERIFY flag.

**INPUTS**

[Requester](_00D4.md) = pointer to the requester to be displayed
[Window](_00D4.md) = pointer to the window into which this requester goes

New for V36: the POINTREL flag now has meaning if the requester
is not a DMR (Double-Menu Requester):
If POINTREL is set this requester should be placed in the center
of the window, offset by Requester.RelLeft and Requester.RelTop.
If the requester doesn't fit in the window, its position will be
adjusted to show the upper-left corner.

RESULT
If the requester is successfully opened, TRUE is returned.  Otherwise,
if the requester could not be opened, FALSE is returned.

BUGS
There is a maximum of 8 requesters that are supported in
a window that can be changed in size, position, or depth.

**SEE ALSO**

The Requesters section of the Intuition Reference Manual
