
**NAME**

ModifyIDCMP -- Modify the state of a window's IDCMPFlags.

**SYNOPSIS**

```c
    [Success =] ModifyIDCMP( Window, IDCMPFlags )
    [D0]                     A0      D0

    [BOOL] ModifyIDCMP( struct Window *, ULONG );
    /* returns BOOL in V37 and greater */

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

This routine modifies the state of your window's IDCMP (Intuition
Direct Communication [Message](_0099.md) Port).  The state is modified to reflect
your desires as described by the flag bits in the value IDCMPFlags.

The four actions that might be taken are:

- if there is currently no IDCMP in the given window, and IDCMPFlags
is zero, nothing happens
- if there is currently no IDCMP in the given window, and any of the
IDCMPFlags is selected (set), then the IDCMP of the window is
created, including allocating and initializing the message ports
and allocating a signal bit for your port.  See the &#034;Input and
Output Methods&#034; chapter of the Intuition Reference Manual for full
details
- if the IDCMP for the given window exists, and the
IDCMPFlags argument is zero, this says that you want
Intuition to close the ports, free the buffers and free
your signal bit.  You MUST be the same task that was active
when this signal bit was allocated (either by ModifyIDCMP()
or [OpenWindow](OpenWindow.md) ).
- if the IDCMP for the given window is opened, and the IDCMPFlags
argument is not zero, this means that you want to change the
state of which events will be broadcast to you through the IDCMP

NOTE:  You can set up the Window-&#062;UserPort to any port of your own
before you call ModifyIDCMP().  If IDCMPFlags is non-null but
your UserPort is already initialized, Intuition will assume that
it's a valid port with task and signal data preset and Intuition
won't disturb your set-up at all, Intuition will just allocate
the Intuition message port half of it.  The converse is true
as well:  if UserPort is NULL when you call here with
IDCMPFlags == NULL, Intuition will deallocate only the Intuition
side of the port.

This allows you to use a port that you already have allocated:
- [OpenWindow](OpenWindow.md) with IDCMPFlags equal to NULL (open no ports)
- set the UserPort variable of your window to any valid port of your
own choosing
- call ModifyIDCMP with IDCMPFlags set to what you want
- then, to clean up later, set UserPort equal to NULL before calling
[CloseWindow](CloseWindow.md) (leave IDCMPFlags alone)  BUT FIRST: you must make
sure that no messages sent your window are queued at the port,
since they will be returned to the memory free pool.

For an example of how to close a window with a shared IDCMP,
see the description for [CloseWindow](CloseWindow.md).


**INPUTS**

[Window](_00D4.md) = pointer to the [Window](_00D4.md) structure containing the IDCMP ports
IDCMPFlags = the flag bits describing the new desired state of the
IDCMP

RESULT
Starting in V37, this function returns NULL if it was unable
to create the necessary message ports.  (The possibility of
failure exists in earlier releases, but no return code was offered).
Do not check the return code under V36 or earlier.

BUGS

**SEE ALSO**

[OpenWindow](OpenWindow.md), [CloseWindow](CloseWindow.md)
