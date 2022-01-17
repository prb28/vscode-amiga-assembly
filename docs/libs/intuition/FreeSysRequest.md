
**NAME**

FreeSysRequest -- Free resources gotten by a call to [BuildSysRequest](BuildSysRequest.md).

**SYNOPSIS**

```c
    FreeSysRequest( Window )
                    A0

    VOID FreeSysRequest( struct Window * );

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

This routine frees up all memory allocated by a successful call to
the [BuildSysRequest](BuildSysRequest.md) procedure.  If [BuildSysRequest](BuildSysRequest.md) returned a
pointer to a window, then you are able to wait on the message port
of that window to detect an event which satisfies the requester.
When you want to remove the requester, you call this procedure.  It
ends the requester and deallocates any memory used in the creation
of the requester.  It also closes the special window that was opened
for your system requester.

For V36: It's OK if you pass a NULL or a TRUE (1) value to
this function.  Also, this function properly disposes of
requesters gotten using BuildEasyRequest().

**INPUTS**

[Window](_00D4.md) = value of the window pointer returned by a successful call to
the [BuildSysRequest](BuildSysRequest.md) procedure

RESULT
None

BUGS

**SEE ALSO**

[BuildSysRequest](BuildSysRequest.md), [AutoRequest](AutoRequest.md), [CloseWindow](CloseWindow.md)
