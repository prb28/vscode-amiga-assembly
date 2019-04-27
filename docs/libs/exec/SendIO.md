
**NAME**

SendIO -- initiate an I/O command

**SYNOPSIS**

```
    SendIO(iORequest)
           A1

```
void SendIO(struct [IORequest](IORequest) *);

**FUNCTION**

This function requests the device driver start processing the given
I/O request.  The device will return control without waiting for
the I/O to complete.

The io_Flags field of the [IORequest](IORequest) will be set to zero before the
request is sent.  See [BeginIO](BeginIO) for more details.

**INPUTS**

iORequest - pointer to an I/O request, or a device specific
extended [IORequest](IORequest).

**SEE ALSO**

[DoIO](DoIO), [CheckIO](CheckIO), [WaitIO](WaitIO), [AbortIO](AbortIO)
