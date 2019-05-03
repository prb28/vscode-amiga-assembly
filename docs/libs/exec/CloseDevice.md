
**NAME**

CloseDevice -- conclude access to a device

**SYNOPSIS**

```c
    CloseDevice(iORequest)
                A1

    void CloseDevice(struct IORequest *);

```
Links: [IORequest](_0094) 

**FUNCTION**

This function informs the device that access to a device/unit
previously opened has been concluded.  The device may perform
certain house-cleaning operations.

The user must ensure that all outstanding IORequests have been
returned before closing the device.  The [AbortIO](_04F7) function can kill
any stragglers.

After a close, the I/O request structure is free to be reused.
Starting with V36 exec it is safe to CloseDevice() with an
[IORequest](_0094) that is either cleared to zeros, or failed to
open.

**INPUTS**

iORequest - pointer to an I/O request structure

**SEE ALSO**

[OpenDevice](OpenDevice)
