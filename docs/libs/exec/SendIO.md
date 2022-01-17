
**NAME**

SendIO -- initiate an I/O command

**SYNOPSIS**

```c
    SendIO(iORequest)
           A1

    void SendIO(struct IORequest *);

```
Links: [IORequest](_0094.md) 

**FUNCTION**

This function requests the device driver start processing the given
I/O request.  The device will return control without waiting for
the I/O to complete.

The io_Flags field of the [IORequest](_0094.md) will be set to zero before the
request is sent.  See [BeginIO](_04CB.md) for more details.

**INPUTS**

iORequest - pointer to an I/O request, or a device specific
extended [IORequest](_0094.md).

**SEE ALSO**

[DoIO](DoIO.md), [CheckIO](CheckIO.md), [WaitIO](WaitIO.md), [AbortIO](_04F7.md)
