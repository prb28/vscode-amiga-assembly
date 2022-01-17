
**NAME**

CheckIO -- get the status of an [IORequest](_0094.md)

**SYNOPSIS**

```c
    result = CheckIO(iORequest)
    D0               A1

    BOOL CheckIO(struct IORequest *);

```
Links: [IORequest](_0094.md) 

**FUNCTION**

This function determines the current state of an I/O request and
returns FALSE if the I/O has not yet completed.  This function
effectively hides the internals of the I/O completion mechanism.

CheckIO() will NOT remove the returned [IORequest](_0094.md) from the reply port.
This is best performed with [WaitIO](WaitIO.md). If the request has already
completed, [WaitIO](WaitIO.md) will return quickly. Use of the [Remove](Remove.md)
function is dangerous, since other tasks may still be adding things
to your message port; a [Disable](Disable.md) would be required.

This function should NOT be used to busy loop (looping until IO is
complete).  [WaitIO](WaitIO.md) is provided for that purpose.

**INPUTS**

iORequest - pointer to an I/O request block

**RESULTS**

result - NULL if I/O is still in progress.  Otherwise
D0 points to the [IORequest](_0094.md) block.

NOTE
CheckIO can hang if called on an [IORequest](_0094.md) that has never been used.
This occurs if LN_TYPE of the [IORequest](_0094.md) is set to &#034;NT_MESSAGE&#034;.
Instead simply set LN_TYPE to 0.

**SEE ALSO**

[DoIO](DoIO.md), [SendIO](SendIO.md), [WaitIO](WaitIO.md), [AbortIO](_04F7.md)
