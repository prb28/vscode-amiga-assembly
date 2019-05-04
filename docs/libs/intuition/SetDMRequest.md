
**NAME**

SetDMRequest -- Set the DMRequest of a window.

**SYNOPSIS**

```c
    success = SetDMRequest( Window, DMRequest )
    D0                      A0      A1

    BOOL SetDMRequest( struct Window *, struct Requester * );

```
Links: [Window](_00D4) [Window](_00D4) [Requester](_00D4) 

**FUNCTION**

Attempts to set the DMRequest into the specified window.
The DMRequest is the special requester that you attach to
the double-click of the menu button which the user can then
bring up on demand.  This routine WILL NOT change the DMRequest
if it's already set and is currently active (in use by the user).
After having called SetDMRequest(), if you want to change the
DMRequest, the correct way to start is by calling [ClearDMRequest](ClearDMRequest)
until it returns a value of TRUE; then you can call SetDMRequest()
with the new DMRequest.

If the POINTREL flag is set in the DMRequest, the DMR will open as
close to the pointer as possible.  The RelLeft/Top fields are
for fine-tuning the position.

**INPUTS**

[Window](_00D4) = pointer to the window from which the DMRequest is to be set
DMRequest = a pointer to a requester

RESULT
If the current DMRequest was not in use, sets the DMRequest
pointer into the window and returns TRUE.
If the DMRequest was currently in use, doesn't change the pointer
and returns FALSE

BUGS

**SEE ALSO**

[ClearDMRequest](ClearDMRequest), [Request](Request)
