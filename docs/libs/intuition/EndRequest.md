
**NAME**

EndRequest -- Remove a currently active requester.

**SYNOPSIS**

```c
    EndRequest( Requester, Window )
                A0         A1

    VOID EndRequest( struct Requester *, struct Window * );

```
Links: [Requester](_00D4) [Window](_00D4) [Requester](_00D4) [Window](_00D4) 

**FUNCTION**

Ends the request by erasing the requester and decoupling it from
the window.

Note that this doesn't necessarily clear all requesters from the
window, only the specified one.  If the window labors under other
requesters, they will remain in the window.

**INPUTS**

[Requester](_00D4) = pointer to the requester to be removed
[Window](_00D4) = pointer to the [Window](_00D4) structure with which this requester
is associated

RESULT
None

BUGS

**SEE ALSO**

[Request](Request)
