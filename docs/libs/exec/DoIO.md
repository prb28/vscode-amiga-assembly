
**NAME**

DoIO -- perform an I/O command and wait for completion

**SYNOPSIS**

```c
    error = DoIO(iORequest)
    D0           A1

    BYTE DoIO(struct IORequest *);

```
Links: [IORequest](_0094.md) 

**FUNCTION**

This function requests a device driver to perform the I/O command
specified in the I/O request.  This function will always wait until
the I/O request is fully complete.

DoIO() handles all the details, including Quick I/O, waiting for
the request, and removing the reply message, etc..

IMPLEMENTATION
This function first tries to complete the IO via the &#034;Quick I/O&#034;
mechanism.  The io_Flags field is always set to IOF_QUICK (0x01)
before the internal device call.

The LN_TYPE field is used internally to flag completion.  Active
requests have type NT_MESSAGE.  Requests that have been replied
have type NT_REPLYMSG.  It is illegal to start IO using a
still active [IORequest](_0094.md), or a request with type NT_REPLYMSG.

**INPUTS**

iORequest - pointer to an [IORequest](_0094.md) initialized by [OpenDevice](OpenDevice.md)

**RESULTS**

error - a sign-extended copy of the io_Error field of the
[IORequest](_0094.md).  Most device commands require that the error
return be checked.

**SEE ALSO**

[SendIO](SendIO.md), [CheckIO](CheckIO.md), [WaitIO](WaitIO.md), [AbortIO](_04F7.md), [amiga.lib/BeginIO](_04CB.md)
