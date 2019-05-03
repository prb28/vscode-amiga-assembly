
**NAME**

CheckIO -- get the status of an [IORequest](_0094)

**SYNOPSIS**

```c
    result = CheckIO(iORequest)
    D0               A1

    BOOL CheckIO(struct IORequest *);

```
Links: [IORequest](_0094) 

**FUNCTION**

This function determines the current state of an I/O request and
returns FALSE if the I/O has not yet completed.  This function
effectively hides the internals of the I/O completion mechanism.

CheckIO() will NOT remove the returned [IORequest](_0094) from the reply port.
This is best performed with [WaitIO](WaitIO). If the request has already
completed, [WaitIO](WaitIO) will return quickly. Use of the [Remove](Remove)
function is dangerous, since other tasks may still be adding things
to your message port; a [Disable](Disable) would be required.

This function should NOT be used to busy loop (looping until IO is
complete).  [WaitIO](WaitIO) is provided for that purpose.

**INPUTS**

iORequest - pointer to an I/O request block

**RESULTS**

result - NULL if I/O is still in progress.  Otherwise
D0 points to the [IORequest](_0094) block.

NOTE
CheckIO can hang if called on an [IORequest](_0094) that has never been used.
This occurs if LN_TYPE of the [IORequest](_0094) is set to &#034;NT_MESSAGE&#034;.
Instead simply set LN_TYPE to 0.

**SEE ALSO**

[DoIO](DoIO), [SendIO](SendIO), [WaitIO](WaitIO), [AbortIO](_04F7)
