
**NAME**

FreeDeviceProc -- Releases port returned by [GetDeviceProc](GetDeviceProc.md) (V36)

**SYNOPSIS**

```c
    FreeDeviceProc(devproc)
                     D1

    void FreeDeviceProc(struct DevProc *)

```
Links: [DevProc](_0078.md) 

**FUNCTION**

Frees up the structure created by [GetDeviceProc](GetDeviceProc.md), and any associated
temporary locks.

Decrements the counter incremented by [GetDeviceProc](GetDeviceProc.md).  The counter
is in an extension to the 1.3 process structure.  After calling
FreeDeviceProc(), do not use the port or lock again!  It is safe to
call FreeDeviceProc(NULL).

**INPUTS**

devproc - A value returned by [GetDeviceProc](GetDeviceProc.md)

BUGS
Counter not currently active in 2.0.

**SEE ALSO**

[GetDeviceProc](GetDeviceProc.md), [DeviceProc](DeviceProc.md), [AssignLock](AssignLock.md), [AssignLate](AssignLate.md),
[AssignPath](AssignPath.md)
