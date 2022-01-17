
**NAME**

WaitIO -- wait for completion of an I/O request

**SYNOPSIS**

```c
    error = WaitIO(iORequest)
    D0             A1

    BYTE WaitIO(struct IORequest *);

```
Links: [IORequest](_0094.md) 

**FUNCTION**

This function waits for the specified I/O request to complete, then
removes it from the replyport.  If the I/O has already completed,
this function will return immediately.

This function should be used with care, as it does not return until
the I/O request completes; if the I/O never completes, this
function will never return, and your task will hang.  If this
situation is a possibility, it is safer to use the [Wait](Wait.md) function.
[Wait](Wait.md) will return return when any of a specified set of signal is
received.  This is how I/O timeouts can be properly handled.

**WARNING**

If this [IORequest](_0094.md) was &#034;Quick&#034; or otherwise finished BEFORE this
call, this function drops though immediately, with no call to
[Wait](Wait.md).  A side effect is that the signal bit related the port may
remain set.  Expect this.

When removing a known complete [IORequest](_0094.md) from a port, WaitIO() is the
preferred method.  A simple [Remove](Remove.md) would require a Disable/Enable
pair!

**INPUTS**

iORequest - pointer to an I/O request block

**RESULTS**

error - zero if successful, else an error is returned
(a sign extended copy of io_Error).

**SEE ALSO**

[DoIO](DoIO.md), [SendIO](SendIO.md), [CheckIO](CheckIO.md), [AbortIO](_04F7.md)
